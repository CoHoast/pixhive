-- =============================================
-- PixHive Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'plus', 'pro')),
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INT,
  width INT,
  height INT,
  mime_type TEXT,
  is_hidden BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  ai_score FLOAT,
  metadata JSONB DEFAULT '{}',
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice messages table (optional feature)
CREATE TABLE voice_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT,
  file_url TEXT NOT NULL,
  duration_seconds INT,
  transcription TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guest tracking table (for counting unique guests)
CREATE TABLE event_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, guest_name)
);

-- =============================================
-- Indexes
-- =============================================

CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_photos_event_id ON photos(event_id);
CREATE INDEX idx_photos_uploaded_at ON photos(uploaded_at DESC);
CREATE INDEX idx_photos_is_hidden ON photos(is_hidden);
CREATE INDEX idx_photos_is_favorite ON photos(is_favorite);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_guests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Events policies
CREATE POLICY "Users can view own events" 
  ON events FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active events by slug" 
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

-- Photos policies
CREATE POLICY "Event owners can view all photos" 
  ON photos FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = photos.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view photos of active events" 
  ON photos FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = photos.event_id 
      AND events.status = 'active'
    )
  );

CREATE POLICY "Anyone can upload photos to active events" 
  ON photos FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = photos.event_id 
      AND events.status = 'active'
    )
  );

CREATE POLICY "Event owners can update photos" 
  ON photos FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = photos.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Event owners can delete photos" 
  ON photos FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = photos.event_id 
      AND events.user_id = auth.uid()
    )
  );

-- Voice messages policies (similar to photos)
CREATE POLICY "Event owners can view voice messages" 
  ON voice_messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = voice_messages.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can upload voice messages to active events" 
  ON voice_messages FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = voice_messages.event_id 
      AND events.status = 'active'
    )
  );

-- Event guests policies
CREATE POLICY "Event owners can view guests" 
  ON event_guests FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_guests.event_id 
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can add guests to active events" 
  ON event_guests FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_guests.event_id 
      AND events.status = 'active'
    )
  );

-- =============================================
-- Functions
-- =============================================

-- Function to increment photo count
CREATE OR REPLACE FUNCTION increment_photo_count(event_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE events 
  SET photo_count = photo_count + 1,
      updated_at = NOW()
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment guest count if new guest
CREATE OR REPLACE FUNCTION increment_guest_count_if_new(event_id UUID, guest TEXT)
RETURNS VOID AS $$
BEGIN
  -- Try to insert the guest (will fail if duplicate due to unique constraint)
  INSERT INTO event_guests (event_id, guest_name)
  VALUES (event_id, guest)
  ON CONFLICT (event_id, guest_name) DO NOTHING;
  
  -- If insert was successful, increment the count
  IF FOUND THEN
    UPDATE events 
    SET guest_count = guest_count + 1,
        updated_at = NOW()
    WHERE id = event_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- Done!
-- =============================================
