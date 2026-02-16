-- =============================================
-- PixHive Partners (White-Label) Schema
-- Run AFTER supabase-schema.sql
-- =============================================

-- Partners table (white-label businesses)
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Company info
  company_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  
  -- Branding
  logo_url TEXT,
  logo_dark_url TEXT,
  primary_color TEXT DEFAULT '#7c3aed',
  secondary_color TEXT DEFAULT '#f59e0b',
  accent_color TEXT DEFAULT '#10b981',
  font_family TEXT DEFAULT 'Inter',
  
  -- Custom domain
  custom_domain TEXT UNIQUE,
  domain_verified BOOLEAN DEFAULT FALSE,
  domain_verification_token TEXT,
  
  -- Subscription
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT DEFAULT 'trial' CHECK (plan IN ('trial', 'starter', 'professional', 'enterprise')),
  plan_started_at TIMESTAMPTZ DEFAULT NOW(),
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  
  -- Settings
  settings JSONB DEFAULT '{}',
  
  -- Stats
  client_count INT DEFAULT 0,
  event_count INT DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner clients (the wedding planners' customers)
CREATE TABLE partner_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  
  -- Client info
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  
  -- Stats
  event_count INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update events table to support partners
ALTER TABLE events 
  ADD COLUMN partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
  ADD COLUMN partner_client_id UUID REFERENCES partner_clients(id) ON DELETE SET NULL,
  ADD COLUMN ai_features JSONB DEFAULT '{"core": false, "face_detection": false}',
  ADD COLUMN ai_processing_status TEXT DEFAULT 'none' CHECK (ai_processing_status IN ('none', 'pending', 'processing', 'completed', 'failed'));

-- Update photos table for AI features
ALTER TABLE photos 
  ADD COLUMN blur_score FLOAT,
  ADD COLUMN quality_score FLOAT,
  ADD COLUMN duplicate_of UUID REFERENCES photos(id),
  ADD COLUMN is_duplicate BOOLEAN DEFAULT FALSE,
  ADD COLUMN detected_scene TEXT,
  ADD COLUMN is_ai_pick BOOLEAN DEFAULT FALSE,
  ADD COLUMN color_enhanced BOOLEAN DEFAULT FALSE;

-- Partner AI usage tracking
CREATE TABLE partner_ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  
  -- AI type
  ai_type TEXT NOT NULL CHECK (ai_type IN ('core', 'face_detection')),
  
  -- Usage
  photo_count INT NOT NULL,
  
  -- Billing
  cost_cents INT NOT NULL,
  billed BOOLEAN DEFAULT FALSE,
  billed_at TIMESTAMPTZ,
  stripe_invoice_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Indexes
-- =============================================

CREATE INDEX idx_partners_user_id ON partners(user_id);
CREATE INDEX idx_partners_slug ON partners(slug);
CREATE INDEX idx_partners_custom_domain ON partners(custom_domain);
CREATE INDEX idx_partners_status ON partners(status);
CREATE INDEX idx_partner_clients_partner_id ON partner_clients(partner_id);
CREATE INDEX idx_events_partner_id ON events(partner_id);
CREATE INDEX idx_events_partner_client_id ON events(partner_client_id);
CREATE INDEX idx_photos_blur_score ON photos(blur_score);
CREATE INDEX idx_photos_quality_score ON photos(quality_score);
CREATE INDEX idx_photos_is_duplicate ON photos(is_duplicate);
CREATE INDEX idx_photos_is_ai_pick ON photos(is_ai_pick);
CREATE INDEX idx_partner_ai_usage_partner_id ON partner_ai_usage(partner_id);
CREATE INDEX idx_partner_ai_usage_billed ON partner_ai_usage(billed);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_ai_usage ENABLE ROW LEVEL SECURITY;

-- Partners policies
CREATE POLICY "Partners can view own record" 
  ON partners FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Partners can update own record" 
  ON partners FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view partner by slug/domain for branding" 
  ON partners FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Users can create partner account" 
  ON partners FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Partner clients policies
CREATE POLICY "Partners can view own clients" 
  ON partner_clients FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = partner_clients.partner_id 
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can create clients" 
  ON partner_clients FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = partner_clients.partner_id 
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can update own clients" 
  ON partner_clients FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = partner_clients.partner_id 
      AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Partners can delete own clients" 
  ON partner_clients FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = partner_clients.partner_id 
      AND partners.user_id = auth.uid()
    )
  );

-- Partner AI usage policies
CREATE POLICY "Partners can view own AI usage" 
  ON partner_ai_usage FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM partners 
      WHERE partners.id = partner_ai_usage.partner_id 
      AND partners.user_id = auth.uid()
    )
  );

-- =============================================
-- Functions
-- =============================================

-- Generate unique partner slug
CREATE OR REPLACE FUNCTION generate_partner_slug(company TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 0;
BEGIN
  -- Create base slug from company name
  base_slug := LOWER(REGEXP_REPLACE(company, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := TRIM(BOTH '-' FROM base_slug);
  
  final_slug := base_slug;
  
  -- Check for uniqueness and add number if needed
  WHILE EXISTS (SELECT 1 FROM partners WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Increment partner client count
CREATE OR REPLACE FUNCTION increment_partner_client_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE partners 
  SET client_count = client_count + 1,
      updated_at = NOW()
  WHERE id = NEW.partner_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_partner_client_created
  AFTER INSERT ON partner_clients
  FOR EACH ROW EXECUTE FUNCTION increment_partner_client_count();

-- Increment partner event count
CREATE OR REPLACE FUNCTION increment_partner_event_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.partner_id IS NOT NULL THEN
    UPDATE partners 
    SET event_count = event_count + 1,
        updated_at = NOW()
    WHERE id = NEW.partner_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_partner_event_created
  AFTER INSERT ON events
  FOR EACH ROW EXECUTE FUNCTION increment_partner_event_count();

-- =============================================
-- Consumer pricing tiers with AI add-ons
-- =============================================

-- Pricing configuration (stored in settings, referenced in code)
COMMENT ON TABLE events IS 'Consumer pricing:
  Basic: $39 (200 photos, 7 days) + Core AI $49 + Face Detection $99
  Standard: $79 (500 photos, 30 days) + Core AI $99 + Face Detection $199  
  Premium: $149 (2000 photos, 90 days) + Core AI $149 + Face Detection $499

Partner pricing:
  Platform: $399/mo
  Core AI: $29 (≤250), $49 (≤500), $99 (≤2000), $149 (2000+)
  Face Detection: $79 (≤250), $149 (≤500), $349 (≤2000), $499 (2000+)
';

-- =============================================
-- Done!
-- =============================================
