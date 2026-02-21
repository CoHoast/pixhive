// @ts-nocheck
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Event, EventInsert, EventUpdate } from '@/lib/types/database'

// Check if we're in build mode (no real Supabase connection)
function isBuildTime(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return !url || url.includes('placeholder') || url === ''
}

/**
 * Create a new event
 */
export async function createEvent(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const name = formData.get('name') as string
  const eventDate = formData.get('event_date') as string | null
  const description = formData.get('description') as string | null
  const requireRegistration = formData.get('require_registration') === 'true'
  const guestGalleryAccess = formData.get('guest_gallery_access') as 'all' | 'own_photos' | 'none' || 'all'
  const contentModerationEnabled = formData.get('content_moderation_enabled') === 'true'

  if (!name) {
    return { error: 'Event name is required' }
  }

  // Generate unique slug
  const { data: slug } = await (supabase as any).rpc('generate_unique_slug', { event_name: name })

  // Check event limit
  const { data: profileData } = await supabase
    .from('profiles')
    .select('event_limit')
    .eq('id', user.id)
    .single()

  const profile = profileData as { event_limit: number } | null

  const { count } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .neq('status', 'deleted')

  if (profile && count !== null && count >= profile.event_limit) {
    return { error: 'Event limit reached. Please upgrade your plan.' }
  }

  // Calculate expiration based on plan
  const expiresAt = calculateExpiration(profile?.event_limit || 1)

  const { data: event, error } = await supabase
    .from('events')
    .insert({
      user_id: user.id,
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      event_date: eventDate || null,
      description: description || null,
      require_registration: requireRegistration,
      guest_gallery_access: guestGalleryAccess,
      content_moderation_enabled: contentModerationEnabled,
      expires_at: expiresAt,
    } as any)
    .select()
    .single()

  if (error || !event) {
    console.error('Error creating event:', error)
    return { error: 'Failed to create event' }
  }

  const createdEvent = event as { id: string }
  revalidatePath('/dashboard')
  redirect(`/events/${createdEvent.id}`)
}

/**
 * Update an event
 */
export async function updateEvent(eventId: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const updates: EventUpdate = {}
  
  const name = formData.get('name')
  if (name) updates.name = name as string

  const eventDate = formData.get('event_date')
  if (eventDate !== null) updates.event_date = eventDate as string || null

  const description = formData.get('description')
  if (description !== null) updates.description = description as string || null

  const requireRegistration = formData.get('require_registration')
  if (requireRegistration !== null) updates.require_registration = requireRegistration === 'true'

  const guestGalleryAccess = formData.get('guest_gallery_access')
  if (guestGalleryAccess) updates.guest_gallery_access = guestGalleryAccess as 'all' | 'own_photos' | 'none'

  const contentModerationEnabled = formData.get('content_moderation_enabled')
  if (contentModerationEnabled !== null) updates.content_moderation_enabled = contentModerationEnabled === 'true'

  const status = formData.get('status')
  if (status) updates.status = status as 'active' | 'archived' | 'deleted'

  const { error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', eventId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error updating event:', error)
    return { error: 'Failed to update event' }
  }

  revalidatePath(`/events/${eventId}`)
  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * Delete an event (soft delete)
 */
export async function deleteEvent(eventId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('events')
    .update({ status: 'deleted' })
    .eq('id', eventId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting event:', error)
    return { error: 'Failed to delete event' }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

/**
 * Get user's events
 */
export async function getMyEvents(): Promise<{ events: Event[]; error: string | null }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { events: [], error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)
    .neq('status', 'deleted')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching events:', error)
    return { events: [], error: 'Failed to fetch events' }
  }

  return { events: (data || []) as Event[], error: null }
}

/**
 * Get single event by ID (for owner)
 */
export async function getEvent(eventId: string): Promise<{ event: Event | null; error: string | null }> {
  // Skip during build time
  if (isBuildTime()) {
    return { event: null, error: 'Build time - skipping' }
  }

  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { event: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching event:', error)
    return { event: null, error: 'Event not found' }
  }

  return { event: data as Event, error: null }
}

/**
 * Get event by slug (for guests)
 */
interface GuestEvent {
  id: string
  name: string
  slug: string
  event_date: string | null
  description: string | null
  cover_image_url: string | null
  require_registration: boolean
  guest_gallery_access: string
  photo_count: number
  guest_count: number
}

export async function getEventBySlug(slug: string): Promise<{ event: GuestEvent | null; error: string | null }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .select('id, name, slug, event_date, description, cover_image_url, require_registration, guest_gallery_access, photo_count, guest_count')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error || !data) {
    return { event: null, error: 'Event not found' }
  }

  return { event: data as GuestEvent, error: null }
}

/**
 * Calculate expiration based on plan
 */
function calculateExpiration(eventLimit: number): string {
  const now = new Date()
  let daysToAdd: number

  if (eventLimit === 1) {
    // Free plan: 48 hours
    daysToAdd = 2
  } else if (eventLimit === 5) {
    // Starter: 3 months
    daysToAdd = 90
  } else if (eventLimit === 20) {
    // Plus: 6 months
    daysToAdd = 180
  } else {
    // Pro: 1 year
    daysToAdd = 365
  }

  now.setDate(now.getDate() + daysToAdd)
  return now.toISOString()
}
