// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { extractSelfieEmbedding, FACE_MATCH_THRESHOLD } from '@/lib/ai/faces'
import { uploadFile, generatePhotoKey } from '@/lib/storage'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * POST /api/faces/search
 * Search for photos containing a specific face
 * 
 * Body: FormData with 'selfie' image file and 'eventId'
 * Returns: Array of matching photos with similarity scores
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const selfie = formData.get('selfie') as File
    const eventId = formData.get('eventId') as string

    if (!selfie || !eventId) {
      return NextResponse.json(
        { error: 'Missing selfie or eventId' },
        { status: 400 }
      )
    }

    // Upload selfie temporarily to get URL for processing
    const buffer = Buffer.from(await selfie.arrayBuffer())
    const key = `temp/selfies/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
    const { url: selfieUrl } = await uploadFile(buffer, key, 'image/jpeg')

    // Extract face embedding from selfie
    const embedding = await extractSelfieEmbedding(selfieUrl)

    if (!embedding || embedding.length === 0) {
      return NextResponse.json(
        { error: 'No face detected in selfie. Please try again with a clearer photo.' },
        { status: 400 }
      )
    }

    // Search for matching faces in database
    const supabase = await createAdminClient()

    // Use pgvector similarity search
    const { data: matches, error } = await supabase.rpc('search_similar_faces', {
      target_embedding: `[${embedding.join(',')}]`,
      event_id_filter: eventId,
      similarity_threshold: FACE_MATCH_THRESHOLD,
      max_results: 50,
    })

    if (error) {
      console.error('Face search error:', error)
      return NextResponse.json(
        { error: 'Search failed' },
        { status: 500 }
      )
    }

    // Get photo details for matches
    const photoIds = [...new Set(matches?.map((m: any) => m.photo_id) || [])]
    
    if (photoIds.length === 0) {
      return NextResponse.json({ results: [], message: 'No matching photos found' })
    }

    const { data: photos } = await supabase
      .from('photos')
      .select('id, file_url, thumbnail_url, uploaded_at')
      .in('id', photoIds)
      .order('uploaded_at', { ascending: false })

    // Combine with similarity scores
    const results = photos?.map(photo => {
      const match = matches.find((m: any) => m.photo_id === photo.id)
      return {
        photoId: photo.id,
        photoUrl: photo.file_url,
        thumbnailUrl: photo.thumbnail_url,
        similarity: match?.similarity || 0,
        uploadedAt: photo.uploaded_at,
      }
    }).sort((a, b) => b.similarity - a.similarity) || []

    // Clean up temp selfie (fire and forget)
    // In production, use a scheduled cleanup job
    
    return NextResponse.json({
      results,
      count: results.length,
    })

  } catch (error) {
    console.error('Face search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
