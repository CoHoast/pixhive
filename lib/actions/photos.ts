// @ts-nocheck
'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { uploadFile, deleteFile, generatePhotoKey, generateThumbnailKey } from '@/lib/storage'
import { revalidatePath } from 'next/cache'
import sharp from 'sharp'

/**
 * Upload photos to an event
 */
export async function uploadPhotos(
  eventId: string,
  files: File[],
  guestId?: string,
  guestName?: string
) {
  const supabase = await createAdminClient()

  // Verify event exists and is active
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id, photo_count, content_moderation_enabled')
    .eq('id', eventId)
    .eq('status', 'active')
    .single()

  if (eventError || !event) {
    return { error: 'Event not found or inactive', uploaded: [] }
  }

  const uploaded: { id: string; url: string; thumbnailUrl: string }[] = []
  const errors: string[] = []

  for (const file of files) {
    try {
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Generate photo key
      const photoKey = generatePhotoKey(eventId, file.name)
      const thumbnailKey = generateThumbnailKey(photoKey)

      // Get image dimensions
      const metadata = await sharp(buffer).metadata()

      // Create thumbnail (400px wide)
      const thumbnailBuffer = await sharp(buffer)
        .resize(400, null, { withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer()

      // Upload original
      const uploadResult = await uploadFile(buffer, photoKey, file.type)

      // Upload thumbnail
      const thumbnailResult = await uploadFile(thumbnailBuffer, thumbnailKey, 'image/jpeg')

      // Determine initial moderation status
      const moderationStatus = event.content_moderation_enabled ? 'pending' : 'approved'

      // Insert photo record
      const { data: photo, error: insertError } = await supabase
        .from('photos')
        .insert({
          event_id: eventId,
          guest_id: guestId || null,
          guest_name: guestName || null,
          file_url: uploadResult.url,
          thumbnail_url: thumbnailResult.url,
          file_size: uploadResult.size,
          width: metadata.width || null,
          height: metadata.height || null,
          mime_type: file.type,
          moderation_status: moderationStatus,
        })
        .select('id')
        .single()

      if (insertError) {
        console.error('Error inserting photo:', insertError)
        errors.push(`Failed to save ${file.name}`)
        continue
      }

      uploaded.push({
        id: photo.id,
        url: uploadResult.url,
        thumbnailUrl: thumbnailResult.url,
      })

      // Update guest photo count if applicable
      if (guestId) {
        // Increment guest photo count using raw SQL
        await (supabase as any).rpc('increment_guest_photo_count', { p_guest_id: guestId })
      }

      // TODO: Queue background job for AI processing
      // await queuePhotoProcessing(photo.id)

    } catch (err) {
      console.error(`Error uploading ${file.name}:`, err)
      errors.push(`Failed to upload ${file.name}`)
    }
  }

  revalidatePath(`/events/${eventId}`)

  return {
    uploaded,
    errors: errors.length > 0 ? errors : null,
  }
}

/**
 * Get photos for an event (owner view)
 */
export async function getEventPhotos(
  eventId: string,
  options: {
    filter?: 'all' | 'favorites' | 'hidden' | 'flagged' | 'ai_picks' | 'most_liked'
    sort?: 'newest' | 'oldest' | 'likes' | 'ai_score'
    limit?: number
    offset?: number
  } = {}
) {
  const supabase = await createClient()

  const { filter = 'all', sort = 'newest', limit = 50, offset = 0 } = options

  let query = supabase
    .from('photos')
    .select('*')
    .eq('event_id', eventId)

  // Apply filters
  switch (filter) {
    case 'hidden':
      query = query.eq('is_hidden', true)
      break
    case 'flagged':
      query = query.in('moderation_status', ['flagged', 'pending'])
      break
    case 'ai_picks':
      query = query.gte('ai_score', 0.7).eq('moderation_status', 'approved')
      break
    case 'most_liked':
      query = query.gt('like_count', 0).eq('moderation_status', 'approved')
      break
    case 'all':
    default:
      query = query.eq('is_hidden', false).eq('moderation_status', 'approved')
  }

  // Apply sorting
  switch (sort) {
    case 'oldest':
      query = query.order('uploaded_at', { ascending: true })
      break
    case 'likes':
      query = query.order('like_count', { ascending: false })
      break
    case 'ai_score':
      query = query.order('ai_score', { ascending: false, nullsFirst: false })
      break
    case 'newest':
    default:
      query = query.order('uploaded_at', { ascending: false })
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data: photos, error } = await query

  if (error) {
    console.error('Error fetching photos:', error)
    return { photos: [], error: 'Failed to fetch photos' }
  }

  return { photos, error: null }
}

/**
 * Get photos for guest gallery view
 */
export async function getGuestGalleryPhotos(
  eventId: string,
  guestId?: string,
  galleryAccess: 'all' | 'own_photos' | 'none' = 'all',
  options: {
    sort?: 'newest' | 'oldest' | 'likes'
    limit?: number
    offset?: number
  } = {}
) {
  const supabase = await createClient()

  const { sort = 'newest', limit = 50, offset = 0 } = options

  let query = supabase
    .from('photos')
    .select('id, thumbnail_url, file_url, like_count, uploaded_at, guest_name')
    .eq('event_id', eventId)
    .eq('moderation_status', 'approved')
    .eq('is_hidden', false)

  // Apply gallery access restrictions
  if (galleryAccess === 'own_photos' && guestId) {
    query = query.eq('guest_id', guestId)
  } else if (galleryAccess === 'none') {
    return { photos: [], error: null }
  }

  // Apply sorting
  switch (sort) {
    case 'oldest':
      query = query.order('uploaded_at', { ascending: true })
      break
    case 'likes':
      query = query.order('like_count', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('uploaded_at', { ascending: false })
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data: photos, error } = await query

  if (error) {
    console.error('Error fetching guest photos:', error)
    return { photos: [], error: 'Failed to fetch photos' }
  }

  return { photos, error: null }
}

/**
 * Toggle photo visibility (hide/show)
 */
export async function togglePhotoHidden(photoId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get current state
  const { data: photo } = await supabase
    .from('photos')
    .select('is_hidden, event_id')
    .eq('id', photoId)
    .single()

  if (!photo) {
    return { error: 'Photo not found' }
  }

  const { error } = await supabase
    .from('photos')
    .update({ is_hidden: !photo.is_hidden })
    .eq('id', photoId)

  if (error) {
    return { error: 'Failed to update photo' }
  }

  revalidatePath(`/events/${photo.event_id}`)
  return { success: true, isHidden: !photo.is_hidden }
}

/**
 * Delete a photo
 */
export async function deletePhoto(photoId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Get photo details
  const { data: photo } = await supabase
    .from('photos')
    .select('file_url, thumbnail_url, event_id')
    .eq('id', photoId)
    .single()

  if (!photo) {
    return { error: 'Photo not found' }
  }

  // Delete from database
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId)

  if (error) {
    return { error: 'Failed to delete photo' }
  }

  // Delete from Supabase Storage (extract key from URL)
  try {
    const fileKey = photo.file_url.split('/').slice(-3).join('/')
    const thumbKey = photo.thumbnail_url?.split('/').slice(-3).join('/')
    
    await deleteFile(fileKey)
    if (thumbKey) await deleteFile(thumbKey)
  } catch (err) {
    console.error('Error deleting from storage:', err)
    // Continue even if storage delete fails
  }

  revalidatePath(`/events/${photo.event_id}`)
  return { success: true }
}

/**
 * Update photo moderation status
 */
export async function updateModerationStatus(
  photoId: string,
  status: 'approved' | 'blocked'
) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data: photo } = await supabase
    .from('photos')
    .select('event_id')
    .eq('id', photoId)
    .single()

  const { error } = await supabase
    .from('photos')
    .update({
      moderation_status: status,
      moderation_reviewed_at: new Date().toISOString(),
    })
    .eq('id', photoId)

  if (error) {
    return { error: 'Failed to update moderation status' }
  }

  if (photo) revalidatePath(`/events/${photo.event_id}`)
  return { success: true }
}

/**
 * Like a photo (guest action)
 */
export async function likePhoto(photoId: string, guestId: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('photo_likes')
    .insert({
      photo_id: photoId,
      guest_id: guestId,
    })

  if (error) {
    // Might be duplicate, try to unlike
    if (error.code === '23505') {
      return unlikePhoto(photoId, guestId)
    }
    return { error: 'Failed to like photo' }
  }

  return { success: true, liked: true }
}

/**
 * Unlike a photo (guest action)
 */
export async function unlikePhoto(photoId: string, guestId: string) {
  const supabase = await createAdminClient()

  const { error } = await supabase
    .from('photo_likes')
    .delete()
    .eq('photo_id', photoId)
    .eq('guest_id', guestId)

  if (error) {
    return { error: 'Failed to unlike photo' }
  }

  return { success: true, liked: false }
}

/**
 * Toggle favorite (owner action)
 */
export async function toggleFavorite(photoId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Check if already favorited
  const { data: existing } = await supabase
    .from('photo_favorites')
    .select('id')
    .eq('photo_id', photoId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    // Remove favorite
    await supabase
      .from('photo_favorites')
      .delete()
      .eq('id', existing.id)
    return { success: true, favorited: false }
  } else {
    // Add favorite
    await supabase
      .from('photo_favorites')
      .insert({
        photo_id: photoId,
        user_id: user.id,
      })
    return { success: true, favorited: true }
  }
}
