// Database types for PixHive

export type Plan = 'free' | 'starter' | 'plus' | 'pro';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  event_date: string | null;
  description: string | null;
  cover_image_url: string | null;
  settings: EventSettings;
  photo_count: number;
  guest_count: number;
  status: 'active' | 'archived' | 'deleted';
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventSettings {
  allow_voice_messages?: boolean;
  custom_branding?: boolean;
  branding_color?: string;
  welcome_message?: string;
}

export interface Photo {
  id: string;
  event_id: string;
  guest_name: string | null;
  file_url: string;
  thumbnail_url: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  mime_type: string | null;
  is_hidden: boolean;
  is_favorite: boolean;
  ai_score: number | null;
  metadata: Record<string, unknown>;
  uploaded_at: string;
}

export interface VoiceMessage {
  id: string;
  event_id: string;
  guest_name: string | null;
  file_url: string;
  duration_seconds: number | null;
  transcription: string | null;
  uploaded_at: string;
}

// Plan limits
export const PLAN_LIMITS: Record<Plan, {
  photos: number;
  duration_days: number;
  ai_features: boolean;
  custom_branding: boolean;
  watermark: boolean;
}> = {
  free: {
    photos: 50,
    duration_days: 2,
    ai_features: false,
    custom_branding: false,
    watermark: true,
  },
  starter: {
    photos: 500,
    duration_days: 90,
    ai_features: false,
    custom_branding: false,
    watermark: false,
  },
  plus: {
    photos: 2000,
    duration_days: 180,
    ai_features: true,
    custom_branding: false,
    watermark: false,
  },
  pro: {
    photos: Infinity,
    duration_days: 365,
    ai_features: true,
    custom_branding: true,
    watermark: false,
  },
};

export const PLAN_PRICES: Record<Exclude<Plan, 'free'>, number> = {
  starter: 39,
  plus: 69,
  pro: 99,
};
