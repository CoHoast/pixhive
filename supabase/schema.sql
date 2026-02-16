-- PixHive Database Schema
-- Run this in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'plus', 'pro')),
  stripe_customer_id TEXT,
  photo_limit INT DEFAULT 50,
  event_limit INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- EVENTS
-- ============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  event_date DATE,
  description TEXT,
  cover_image_url TEXT,
  settings JSONB DEFAULT '{}',
  photo_count INT DEFAULT 0,
  guest_count INT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  expires_at TIMESTAMPTZ,
  -- Guest access settings
  require_registration BOOLEAN DEFAULT TRUE,
  guest_gallery_access TEXT DEFAULT 'all' CHECK (guest_gallery_access IN ('all', 'own_photos', 'none')),
  gallery_public_token TEXT UNIQUE DEFAULT uuid_generate_v4()::text,
  -- Content moderation
  content_moderation_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EVENT GUESTS (registered guests)
-- ============================================
CREATE TABLE event_guests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  access_token TEXT UNIQUE DEFAULT uuid_generate_v4()::text,
  photo_count INT DEFAULT 0,
  marketing_consent BOOLEAN DEFAULT TRUE,
  unsubscribed_at TIMESTAMPTZ,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  last_viewed_at TIMESTAMPTZ,
  UNIQUE(event_id, email)
);

-- ============================================
-- GLOBAL EMAIL SUBSCRIBERS
-- ============================================
CREATE TABLE email_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  first_event_id UUID REFERENCES events(id),
  total_events INT DEFAULT 1,
  marketing_consent BOOLEAN DEFAULT TRUE,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DETECTED PERSONS (face clusters)
-- ============================================
CREATE TABLE detected_persons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT,
  photo_count INT DEFAULT 0,
  representative_face_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PHOTOS
-- ============================================
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES event_guests(id),
  guest_name TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INT,
  width INT,
  height INT,
  mime_type TEXT,
  is_hidden BOOLEAN DEFAULT FALSE,
  -- AI features
  ai_score FLOAT,
  detected_activity TEXT,
  activity_confidence FLOAT,
  -- Content moderation
  moderation_status TEXT DEFAULT 'approved' CHECK (moderation_status IN ('approved', 'pending', 'flagged', 'blocked')),
  moderation_reason TEXT,
  moderation_reviewed_at TIMESTAMPTZ,
  -- Engagement
  like_count INT DEFAULT 0,
  -- Metadata
  metadata JSONB DEFAULT '{}',
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DETECTED FACES
-- ============================================
CREATE TABLE detected_faces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  person_id UUID REFERENCES detected_persons(id),
  embedding VECTOR(512),
  bounding_box JSONB,
  confidence FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PHOTO FAVORITES (host favorites)
-- ============================================
CREATE TABLE photo_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES event_guests(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(photo_id, user_id),
  UNIQUE(photo_id, guest_id),
  CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL)
);

-- ============================================
-- PHOTO LIKES (guest engagement)
-- ============================================
CREATE TABLE photo_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES event_guests(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(photo_id, guest_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_gallery_token ON events(gallery_public_token);

CREATE INDEX idx_photos_event_id ON photos(event_id);
CREATE INDEX idx_photos_guest_id ON photos(guest_id);
CREATE INDEX idx_photos_uploaded_at ON photos(event_id, uploaded_at DESC);
CREATE INDEX idx_photos_like_count ON photos(event_id, like_count DESC);
CREATE INDEX idx_photos_ai_score ON photos(event_id, ai_score DESC);
CREATE INDEX idx_photos_moderation ON photos(event_id, moderation_status);

CREATE INDEX idx_event_guests_event_id ON event_guests(event_id);
CREATE INDEX idx_event_guests_email ON event_guests(email);
CREATE INDEX idx_event_guests_access_token ON event_guests(access_token);

CREATE INDEX idx_detected_faces_photo ON detected_faces(photo_id);
CREATE INDEX idx_detected_faces_person ON detected_faces(person_id);

CREATE INDEX idx_photo_likes_photo ON photo_likes(photo_id);
CREATE INDEX idx_photo_favorites_photo ON photo_favorites(photo_id);

-- Vector similarity index for face search
CREATE INDEX idx_face_embeddings ON detected_faces USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events"
  ON events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view active events by slug"
  ON events FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can create events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON events FOR DELETE
  USING (auth.uid() = user_id);

-- Event Guests
ALTER TABLE event_guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owners can view guests"
  ON event_guests FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM events WHERE events.id = event_guests.event_id AND events.user_id = auth.uid()
  ));

CREATE POLICY "Anyone can register as guest"
  ON event_guests FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM events WHERE events.id = event_guests.event_id AND events.status = 'active'
  ));

-- Photos
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event owners can view all photos"
  ON photos FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM events WHERE events.id = photos.event_id AND events.user_id = auth.uid()
  ));

CREATE POLICY "Guests can view approved photos"
  ON photos FOR SELECT
  USING (
    moderation_status = 'approved' 
    AND EXISTS (
      SELECT 1 FROM events WHERE events.id = photos.event_id AND events.status = 'active'
    )
  );

CREATE POLICY "Anyone can upload to active events"
  ON photos FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM events WHERE events.id = photos.event_id AND events.status = 'active'
  ));

CREATE POLICY "Event owners can update photos"
  ON photos FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM events WHERE events.id = photos.event_id AND events.user_id = auth.uid()
  ));

CREATE POLICY "Event owners can delete photos"
  ON photos FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM events WHERE events.id = photos.event_id AND events.user_id = auth.uid()
  ));

-- Photo Likes
ALTER TABLE photo_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON photo_likes FOR SELECT
  USING (true);

CREATE POLICY "Guests can like photos"
  ON photo_likes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Guests can unlike own likes"
  ON photo_likes FOR DELETE
  USING (guest_id IN (SELECT id FROM event_guests));

-- ============================================
-- FUNCTIONS
-- ============================================

-- Update photo count on event
CREATE OR REPLACE FUNCTION update_event_photo_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events SET photo_count = photo_count + 1, updated_at = NOW() WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events SET photo_count = photo_count - 1, updated_at = NOW() WHERE id = OLD.event_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_photo_change
  AFTER INSERT OR DELETE ON photos
  FOR EACH ROW EXECUTE FUNCTION update_event_photo_count();

-- Update guest count on event
CREATE OR REPLACE FUNCTION update_event_guest_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events SET guest_count = guest_count + 1, updated_at = NOW() WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events SET guest_count = guest_count - 1, updated_at = NOW() WHERE id = OLD.event_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_guest_change
  AFTER INSERT OR DELETE ON event_guests
  FOR EACH ROW EXECUTE FUNCTION update_event_guest_count();

-- Update like count on photo
CREATE OR REPLACE FUNCTION update_photo_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE photos SET like_count = like_count + 1 WHERE id = NEW.photo_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE photos SET like_count = like_count - 1 WHERE id = OLD.photo_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON photo_likes
  FOR EACH ROW EXECUTE FUNCTION update_photo_like_count();

-- Generate unique slug
CREATE OR REPLACE FUNCTION generate_unique_slug(event_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  new_slug TEXT;
  counter INT := 0;
BEGIN
  base_slug := lower(regexp_replace(event_name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  new_slug := base_slug;
  
  WHILE EXISTS (SELECT 1 FROM events WHERE slug = new_slug) LOOP
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INITIAL DATA (Plan limits)
-- ============================================
-- Plan limits are stored in profiles table:
-- free: 50 photos, 1 event
-- starter: 500 photos, 5 events
-- plus: 2000 photos, 20 events
-- pro: unlimited photos, unlimited events
