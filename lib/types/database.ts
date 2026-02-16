export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          plan: 'free' | 'starter' | 'plus' | 'pro'
          stripe_customer_id: string | null
          photo_limit: number
          event_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'starter' | 'plus' | 'pro'
          stripe_customer_id?: string | null
          photo_limit?: number
          event_limit?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'starter' | 'plus' | 'pro'
          stripe_customer_id?: string | null
          photo_limit?: number
          event_limit?: number
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          event_date: string | null
          description: string | null
          cover_image_url: string | null
          settings: Json
          photo_count: number
          guest_count: number
          status: 'active' | 'archived' | 'deleted'
          expires_at: string | null
          require_registration: boolean
          guest_gallery_access: 'all' | 'own_photos' | 'none'
          gallery_public_token: string
          content_moderation_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          event_date?: string | null
          description?: string | null
          cover_image_url?: string | null
          settings?: Json
          photo_count?: number
          guest_count?: number
          status?: 'active' | 'archived' | 'deleted'
          expires_at?: string | null
          require_registration?: boolean
          guest_gallery_access?: 'all' | 'own_photos' | 'none'
          gallery_public_token?: string
          content_moderation_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          slug?: string
          event_date?: string | null
          description?: string | null
          cover_image_url?: string | null
          settings?: Json
          status?: 'active' | 'archived' | 'deleted'
          expires_at?: string | null
          require_registration?: boolean
          guest_gallery_access?: 'all' | 'own_photos' | 'none'
          content_moderation_enabled?: boolean
          updated_at?: string
        }
      }
      event_guests: {
        Row: {
          id: string
          event_id: string
          name: string
          email: string
          access_token: string
          photo_count: number
          marketing_consent: boolean
          unsubscribed_at: string | null
          registered_at: string
          last_viewed_at: string | null
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          email: string
          access_token?: string
          photo_count?: number
          marketing_consent?: boolean
          unsubscribed_at?: string | null
          registered_at?: string
          last_viewed_at?: string | null
        }
        Update: {
          name?: string
          email?: string
          photo_count?: number
          marketing_consent?: boolean
          unsubscribed_at?: string | null
          last_viewed_at?: string | null
        }
      }
      photos: {
        Row: {
          id: string
          event_id: string
          guest_id: string | null
          guest_name: string | null
          file_url: string
          thumbnail_url: string | null
          file_size: number | null
          width: number | null
          height: number | null
          mime_type: string | null
          is_hidden: boolean
          ai_score: number | null
          detected_activity: string | null
          activity_confidence: number | null
          moderation_status: 'approved' | 'pending' | 'flagged' | 'blocked'
          moderation_reason: string | null
          moderation_reviewed_at: string | null
          like_count: number
          metadata: Json
          uploaded_at: string
        }
        Insert: {
          id?: string
          event_id: string
          guest_id?: string | null
          guest_name?: string | null
          file_url: string
          thumbnail_url?: string | null
          file_size?: number | null
          width?: number | null
          height?: number | null
          mime_type?: string | null
          is_hidden?: boolean
          ai_score?: number | null
          detected_activity?: string | null
          activity_confidence?: number | null
          moderation_status?: 'approved' | 'pending' | 'flagged' | 'blocked'
          moderation_reason?: string | null
          like_count?: number
          metadata?: Json
          uploaded_at?: string
        }
        Update: {
          guest_name?: string | null
          thumbnail_url?: string | null
          is_hidden?: boolean
          ai_score?: number | null
          detected_activity?: string | null
          activity_confidence?: number | null
          moderation_status?: 'approved' | 'pending' | 'flagged' | 'blocked'
          moderation_reason?: string | null
          moderation_reviewed_at?: string | null
          metadata?: Json
        }
      }
      photo_likes: {
        Row: {
          id: string
          photo_id: string
          guest_id: string
          created_at: string
        }
        Insert: {
          id?: string
          photo_id: string
          guest_id: string
          created_at?: string
        }
        Update: never
      }
      photo_favorites: {
        Row: {
          id: string
          photo_id: string
          user_id: string | null
          guest_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          photo_id: string
          user_id?: string | null
          guest_id?: string | null
          created_at?: string
        }
        Update: never
      }
      detected_persons: {
        Row: {
          id: string
          event_id: string
          name: string | null
          photo_count: number
          representative_face_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name?: string | null
          photo_count?: number
          representative_face_url?: string | null
          created_at?: string
        }
        Update: {
          name?: string | null
          photo_count?: number
          representative_face_url?: string | null
        }
      }
      detected_faces: {
        Row: {
          id: string
          photo_id: string
          person_id: string | null
          embedding: number[] | null
          bounding_box: Json | null
          confidence: number | null
          created_at: string
        }
        Insert: {
          id?: string
          photo_id: string
          person_id?: string | null
          embedding?: number[] | null
          bounding_box?: Json | null
          confidence?: number | null
          created_at?: string
        }
        Update: {
          person_id?: string | null
          embedding?: number[] | null
          bounding_box?: Json | null
          confidence?: number | null
        }
      }
      email_subscribers: {
        Row: {
          id: string
          email: string
          name: string | null
          first_event_id: string | null
          total_events: number
          marketing_consent: boolean
          unsubscribed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          first_event_id?: string | null
          total_events?: number
          marketing_consent?: boolean
          unsubscribed_at?: string | null
          created_at?: string
        }
        Update: {
          name?: string | null
          total_events?: number
          marketing_consent?: boolean
          unsubscribed_at?: string | null
        }
      }
    }
    Functions: {
      generate_unique_slug: {
        Args: { event_name: string }
        Returns: string
      }
    }
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type EventGuest = Database['public']['Tables']['event_guests']['Row']
export type Photo = Database['public']['Tables']['photos']['Row']
export type PhotoLike = Database['public']['Tables']['photo_likes']['Row']
export type PhotoFavorite = Database['public']['Tables']['photo_favorites']['Row']
export type DetectedPerson = Database['public']['Tables']['detected_persons']['Row']
export type DetectedFace = Database['public']['Tables']['detected_faces']['Row']

// Insert types
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type PhotoInsert = Database['public']['Tables']['photos']['Insert']
export type EventGuestInsert = Database['public']['Tables']['event_guests']['Insert']

// Update types
export type EventUpdate = Database['public']['Tables']['events']['Update']
export type PhotoUpdate = Database['public']['Tables']['photos']['Update']
