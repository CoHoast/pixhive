// @ts-nocheck
'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import type { EventGuest } from '@/lib/types/database'

const GUEST_COOKIE_NAME = 'pixhive_guest'

/**
 * Register a guest for an event
 */
export async function registerGuest(
  eventId: string,
  name: string,
  email: string,
  marketingConsent: boolean = true
) {
  const supabase = await createAdminClient()

  // Verify event exists and is active
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id, name')
    .eq('id', eventId)
    .eq('status', 'active')
    .single()

  if (eventError || !event) {
    return { error: 'Event not found or inactive', guest: null }
  }

  // Check if guest already registered
  const { data: existingGuest } = await supabase
    .from('event_guests')
    .select('id, access_token')
    .eq('event_id', eventId)
    .eq('email', email.toLowerCase())
    .single()

  if (existingGuest) {
    // Update last viewed and return existing guest
    await supabase
      .from('event_guests')
      .update({ last_viewed_at: new Date().toISOString() })
      .eq('id', existingGuest.id)

    // Set guest cookie
    await setGuestCookie(existingGuest.id, existingGuest.access_token)

    return { guest: existingGuest, error: null, isExisting: true }
  }

  // Create new guest
  const { data: guest, error: insertError } = await supabase
    .from('event_guests')
    .insert({
      event_id: eventId,
      name,
      email: email.toLowerCase(),
      marketing_consent: marketingConsent,
    })
    .select('id, access_token, name, email')
    .single()

  if (insertError) {
    console.error('Error registering guest:', insertError)
    return { error: 'Failed to register', guest: null }
  }

  // Add to global email subscribers
  await supabase
    .from('email_subscribers')
    .upsert({
      email: email.toLowerCase(),
      name,
      first_event_id: eventId,
      marketing_consent: marketingConsent,
    }, {
      onConflict: 'email',
      ignoreDuplicates: false,
    })
    .select()

  // Update total_events count for existing subscribers
  await (supabase as any).rpc('increment_subscriber_events', { subscriber_email: email.toLowerCase() })

  // Set guest cookie
  await setGuestCookie(guest.id, guest.access_token)

  return { guest, error: null, isExisting: false }
}

/**
 * Get guest by access token
 */
export async function getGuestByToken(accessToken: string) {
  const supabase = await createClient()

  const { data: guest, error } = await supabase
    .from('event_guests')
    .select('*, events(id, name, slug, event_date, guest_gallery_access)')
    .eq('access_token', accessToken)
    .single()

  if (error || !guest) {
    return { guest: null, error: 'Guest not found' }
  }

  // Update last viewed
  await supabase
    .from('event_guests')
    .update({ last_viewed_at: new Date().toISOString() })
    .eq('id', guest.id)

  return { guest, error: null }
}

/**
 * Get current guest from cookie
 */
interface CurrentGuest {
  id: string
  name: string
  email: string
  event_id: string
  access_token: string
}

export async function getCurrentGuest(): Promise<{ guest: CurrentGuest | null }> {
  const cookieStore = await cookies()
  const guestCookie = cookieStore.get(GUEST_COOKIE_NAME)

  if (!guestCookie?.value) {
    return { guest: null }
  }

  try {
    const { id, token } = JSON.parse(guestCookie.value)
    
    const supabase = await createClient()
    const { data } = await supabase
      .from('event_guests')
      .select('id, name, email, event_id, access_token')
      .eq('id', id)
      .eq('access_token', token)
      .single()

    return { guest: (data as CurrentGuest) || null }
  } catch {
    return { guest: null }
  }
}

/**
 * Set guest cookie
 */
async function setGuestCookie(guestId: string, accessToken: string) {
  const cookieStore = await cookies()
  
  cookieStore.set(GUEST_COOKIE_NAME, JSON.stringify({
    id: guestId,
    token: accessToken,
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  })
}

/**
 * Clear guest cookie
 */
export async function clearGuestCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(GUEST_COOKIE_NAME)
}

/**
 * Lookup event by code (slug)
 */
export async function lookupEventByCode(code: string) {
  const supabase = await createClient()
  
  const slug = code.toLowerCase().trim()

  const { data: event, error } = await supabase
    .from('events')
    .select('id, name, slug, event_date, description, photo_count, guest_count')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error || !event) {
    return { event: null, error: 'Event not found' }
  }

  return { event, error: null }
}

/**
 * Get event guests (for host)
 */
export async function getEventGuests(eventId: string): Promise<{ guests: EventGuest[]; error: string | null }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { guests: [], error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('event_guests')
    .select('*')
    .eq('event_id', eventId)
    .order('registered_at', { ascending: false })

  if (error) {
    return { guests: [], error: 'Failed to fetch guests' }
  }

  return { guests: (data || []) as EventGuest[], error: null }
}

/**
 * Unsubscribe guest from marketing
 */
export async function unsubscribeGuest(guestId: string) {
  const supabase = await createAdminClient()

  const { data: guest } = await supabase
    .from('event_guests')
    .select('email')
    .eq('id', guestId)
    .single()

  if (!guest) {
    return { error: 'Guest not found' }
  }

  // Update guest record
  await supabase
    .from('event_guests')
    .update({
      marketing_consent: false,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('id', guestId)

  // Update global subscriber
  await supabase
    .from('email_subscribers')
    .update({
      marketing_consent: false,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('email', guest.email)

  return { success: true }
}
