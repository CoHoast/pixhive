// @ts-nocheck
'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { detectFaces, extractSelfieEmbedding, cosineSimilarity, FACE_MATCH_THRESHOLD } from '@/lib/ai/faces'
import { clusterFaces, mergeSimilarClusters } from '@/lib/ai/clustering'
import { revalidatePath } from 'next/cache'
import type { FaceSearchResult, PersonCluster } from '@/lib/ai/types'

/**
 * Process a photo for face detection
 * Called after photo upload
 */
export async function processPhotoFaces(photoId: string) {
  const supabase = await createAdminClient()

  // Get photo
  const { data: photo, error: photoError } = await supabase
    .from('photos')
    .select('id, event_id, file_url')
    .eq('id', photoId)
    .single()

  if (photoError || !photo) {
    console.error('Photo not found:', photoId)
    return { error: 'Photo not found' }
  }

  try {
    // Detect faces
    const faces = await detectFaces(photo.file_url)

    if (faces.length === 0) {
      // Mark as processed with no faces
      await supabase
        .from('photos')
        .update({ faces_processed: true, face_count: 0 })
        .eq('id', photoId)

      return { facesDetected: 0 }
    }

    // Store each detected face
    for (const face of faces) {
      await supabase
        .from('detected_faces')
        .insert({
          photo_id: photoId,
          embedding: face.embedding,
          bounding_box: face.bbox,
          confidence: face.confidence,
        })
    }

    // Mark photo as processed
    await supabase
      .from('photos')
      .update({ faces_processed: true, face_count: faces.length })
      .eq('id', photoId)

    // Trigger clustering update for the event
    await updateEventClusters(photo.event_id)

    return { facesDetected: faces.length }
  } catch (error) {
    console.error('Error processing faces:', error)
    return { error: 'Failed to process faces' }
  }
}

/**
 * Update face clusters for an event
 * Called after processing new photos
 */
export async function updateEventClusters(eventId: string) {
  const supabase = await createAdminClient()

  // Get all faces for this event
  const { data: faces, error } = await supabase
    .from('detected_faces')
    .select('id, photo_id, embedding')
    .eq('photos.event_id', eventId)

  if (error || !faces || faces.length === 0) {
    return { clustersCreated: 0 }
  }

  // Prepare data for clustering
  const clusterInput = faces.map(face => ({
    faceId: face.id,
    photoId: face.photo_id,
    embedding: face.embedding,
  }))

  // Run clustering algorithm
  let clusters = clusterFaces(clusterInput)
  clusters = mergeSimilarClusters(clusters)

  // Update database with clusters
  for (const cluster of clusters) {
    // Check if cluster exists (by checking if representative face already has a person_id)
    const repFace = faces.find(f => f.id === cluster.representativeFaceId)
    
    if (repFace) {
      const { data: existingFace } = await supabase
        .from('detected_faces')
        .select('person_id')
        .eq('id', cluster.representativeFaceId)
        .single()

      let personId = existingFace?.person_id

      if (!personId) {
        // Create new person record
        const { data: person } = await supabase
          .from('detected_persons')
          .insert({
            event_id: eventId,
            photo_count: cluster.photoIds.length,
          })
          .select('id')
          .single()

        personId = person?.id
      } else {
        // Update existing person
        await supabase
          .from('detected_persons')
          .update({ photo_count: cluster.photoIds.length })
          .eq('id', personId)
      }

      // Assign all faces to this person
      if (personId) {
        await supabase
          .from('detected_faces')
          .update({ person_id: personId })
          .in('id', cluster.faceIds)
      }
    }
  }

  return { clustersCreated: clusters.length }
}

/**
 * Search for photos containing a specific face
 * Used for "Find Yourself" feature
 */
export async function searchByFace(
  eventId: string,
  selfieUrl: string
): Promise<{ results: FaceSearchResult[]; error?: string }> {
  // Extract embedding from selfie
  const embedding = await extractSelfieEmbedding(selfieUrl)

  if (!embedding) {
    return { results: [], error: 'No face detected in selfie' }
  }

  const supabase = await createClient()

  // Get all faces for this event
  const { data: faces, error } = await supabase
    .from('detected_faces')
    .select(`
      id,
      embedding,
      bounding_box,
      photos (
        id,
        file_url,
        thumbnail_url,
        event_id
      )
    `)
    .eq('photos.event_id', eventId)

  if (error || !faces) {
    return { results: [], error: 'Failed to search faces' }
  }

  // Calculate similarity for each face
  const results: FaceSearchResult[] = []

  for (const face of faces) {
    if (!face.embedding || !face.photos) continue

    const similarity = cosineSimilarity(embedding, face.embedding)

    if (similarity >= FACE_MATCH_THRESHOLD) {
      results.push({
        photoId: face.photos.id,
        photoUrl: face.photos.file_url,
        thumbnailUrl: face.photos.thumbnail_url,
        similarity,
        boundingBox: face.bounding_box,
      })
    }
  }

  // Sort by similarity (highest first)
  results.sort((a, b) => b.similarity - a.similarity)

  // Remove duplicates (same photo)
  const uniqueResults = results.filter((result, index, self) =>
    index === self.findIndex(r => r.photoId === result.photoId)
  )

  return { results: uniqueResults }
}

/**
 * Get all person clusters for an event
 */
export async function getEventPersons(
  eventId: string
): Promise<{ persons: PersonCluster[]; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('detected_persons')
    .select('*')
    .eq('event_id', eventId)
    .order('photo_count', { ascending: false })

  if (error) {
    return { persons: [], error: 'Failed to fetch persons' }
  }

  return {
    persons: (data || []).map(p => ({
      id: p.id,
      eventId: p.event_id,
      name: p.name,
      photoCount: p.photo_count,
      representativeFaceUrl: p.representative_face_url,
      createdAt: p.created_at,
    })),
  }
}

/**
 * Get photos containing a specific person
 */
export async function getPersonPhotos(
  personId: string
): Promise<{ photos: any[]; error?: string }> {
  const supabase = await createClient()

  // Get all faces for this person
  const { data: faces, error } = await supabase
    .from('detected_faces')
    .select(`
      photo_id,
      photos (
        id,
        file_url,
        thumbnail_url,
        uploaded_at
      )
    `)
    .eq('person_id', personId)

  if (error) {
    return { photos: [], error: 'Failed to fetch photos' }
  }

  // Extract unique photos
  const photoMap = new Map()
  for (const face of faces || []) {
    if (face.photos && !photoMap.has(face.photos.id)) {
      photoMap.set(face.photos.id, face.photos)
    }
  }

  const photos = Array.from(photoMap.values())
  photos.sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())

  return { photos }
}

/**
 * Name a person cluster
 */
export async function namePerson(
  personId: string,
  name: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Verify user owns the event
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data: person } = await supabase
    .from('detected_persons')
    .select('event_id')
    .eq('id', personId)
    .single()

  if (!person) {
    return { success: false, error: 'Person not found' }
  }

  // Check event ownership
  const { data: event } = await supabase
    .from('events')
    .select('id')
    .eq('id', person.event_id)
    .eq('user_id', user.id)
    .single()

  if (!event) {
    return { success: false, error: 'Not authorized' }
  }

  // Update name
  const { error } = await supabase
    .from('detected_persons')
    .update({ name })
    .eq('id', personId)

  if (error) {
    return { success: false, error: 'Failed to update name' }
  }

  revalidatePath(`/events/${person.event_id}`)
  return { success: true }
}

/**
 * Merge two person clusters
 */
export async function mergePersons(
  personId1: string,
  personId2: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createAdminClient()

  // Get both persons
  const { data: persons } = await supabase
    .from('detected_persons')
    .select('*')
    .in('id', [personId1, personId2])

  if (!persons || persons.length !== 2) {
    return { success: false, error: 'Persons not found' }
  }

  // Keep the first person, merge second into it
  const keepPerson = persons[0]
  const mergePerson = persons[1]

  // Update all faces from mergePerson to keepPerson
  await supabase
    .from('detected_faces')
    .update({ person_id: keepPerson.id })
    .eq('person_id', mergePerson.id)

  // Update photo count
  await supabase
    .from('detected_persons')
    .update({
      photo_count: keepPerson.photo_count + mergePerson.photo_count,
      name: keepPerson.name || mergePerson.name, // Keep existing name
    })
    .eq('id', keepPerson.id)

  // Delete merged person
  await supabase
    .from('detected_persons')
    .delete()
    .eq('id', mergePerson.id)

  revalidatePath(`/events/${keepPerson.event_id}`)
  return { success: true }
}
