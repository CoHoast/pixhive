-- =============================================
-- Face Detection & Clustering Schema
-- Run this AFTER the base schema
-- =============================================

-- Enable pgvector extension for face embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- =============================================
-- Tables
-- =============================================

-- Detected persons (face clusters)
CREATE TABLE IF NOT EXISTS detected_persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  name TEXT, -- Host can name: "Grandma", "Best Man", etc.
  photo_count INT DEFAULT 0,
  representative_face_url TEXT, -- URL to cropped face image
  centroid vector(512), -- Average embedding for the cluster
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Detected faces in photos
CREATE TABLE IF NOT EXISTS detected_faces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE NOT NULL,
  person_id UUID REFERENCES detected_persons(id) ON DELETE SET NULL,
  embedding vector(512) NOT NULL, -- Face embedding from InsightFace
  bounding_box JSONB NOT NULL, -- {x, y, width, height} normalized 0-1
  confidence FLOAT NOT NULL, -- Detection confidence 0-1
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add face processing columns to photos
ALTER TABLE photos ADD COLUMN IF NOT EXISTS faces_processed BOOLEAN DEFAULT FALSE;
ALTER TABLE photos ADD COLUMN IF NOT EXISTS face_count INT DEFAULT 0;

-- =============================================
-- Indexes for fast similarity search
-- =============================================

-- Vector similarity index (IVFFlat for approximate nearest neighbor)
CREATE INDEX IF NOT EXISTS idx_detected_faces_embedding 
  ON detected_faces 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Standard indexes
CREATE INDEX IF NOT EXISTS idx_detected_faces_photo_id ON detected_faces(photo_id);
CREATE INDEX IF NOT EXISTS idx_detected_faces_person_id ON detected_faces(person_id);
CREATE INDEX IF NOT EXISTS idx_detected_persons_event_id ON detected_persons(event_id);
CREATE INDEX IF NOT EXISTS idx_photos_faces_processed ON photos(faces_processed);

-- =============================================
-- Row Level Security
-- =============================================

ALTER TABLE detected_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE detected_faces ENABLE ROW LEVEL SECURITY;

-- Detected persons policies
CREATE POLICY "Event owners can view persons"
  ON detected_persons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = detected_persons.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Guests can view persons of active events"
  ON detected_persons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = detected_persons.event_id
      AND events.status = 'active'
    )
  );

CREATE POLICY "Event owners can update persons"
  ON detected_persons FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = detected_persons.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Service role can manage all (for background jobs)
CREATE POLICY "Service role can manage persons"
  ON detected_persons FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage faces"
  ON detected_faces FOR ALL
  USING (auth.role() = 'service_role');

-- Detected faces policies (mostly read-only for users)
CREATE POLICY "Event owners can view faces"
  ON detected_faces FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM photos
      JOIN events ON events.id = photos.event_id
      WHERE photos.id = detected_faces.photo_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Guests can view faces of active events"
  ON detected_faces FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM photos
      JOIN events ON events.id = photos.event_id
      WHERE photos.id = detected_faces.photo_id
      AND events.status = 'active'
    )
  );

-- =============================================
-- Functions
-- =============================================

-- Function to search for similar faces using vector similarity
CREATE OR REPLACE FUNCTION search_similar_faces(
  target_embedding vector(512),
  event_id_filter UUID,
  similarity_threshold FLOAT DEFAULT 0.6,
  max_results INT DEFAULT 50
)
RETURNS TABLE (
  face_id UUID,
  photo_id UUID,
  person_id UUID,
  similarity FLOAT,
  bounding_box JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    df.id AS face_id,
    df.photo_id,
    df.person_id,
    1 - (df.embedding <=> target_embedding) AS similarity,
    df.bounding_box
  FROM detected_faces df
  JOIN photos p ON p.id = df.photo_id
  WHERE p.event_id = event_id_filter
    AND 1 - (df.embedding <=> target_embedding) >= similarity_threshold
  ORDER BY df.embedding <=> target_embedding
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update person photo count
CREATE OR REPLACE FUNCTION update_person_photo_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update old person if changed
  IF OLD.person_id IS NOT NULL AND OLD.person_id != NEW.person_id THEN
    UPDATE detected_persons
    SET photo_count = (
      SELECT COUNT(DISTINCT photo_id)
      FROM detected_faces
      WHERE person_id = OLD.person_id
    )
    WHERE id = OLD.person_id;
  END IF;
  
  -- Update new person
  IF NEW.person_id IS NOT NULL THEN
    UPDATE detected_persons
    SET photo_count = (
      SELECT COUNT(DISTINCT photo_id)
      FROM detected_faces
      WHERE person_id = NEW.person_id
    )
    WHERE id = NEW.person_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update photo counts
DROP TRIGGER IF EXISTS update_person_photo_count_trigger ON detected_faces;
CREATE TRIGGER update_person_photo_count_trigger
  AFTER INSERT OR UPDATE OF person_id ON detected_faces
  FOR EACH ROW
  EXECUTE FUNCTION update_person_photo_count();

-- Function to increment guest photo count
CREATE OR REPLACE FUNCTION increment_guest_photo_count(p_guest_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE event_guests
  SET photo_count = photo_count + 1
  WHERE id = p_guest_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment subscriber events
CREATE OR REPLACE FUNCTION increment_subscriber_events(subscriber_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE email_subscribers
  SET total_events = total_events + 1
  WHERE email = subscriber_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Done!
-- =============================================
