import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/faces/search
 * Search for photos containing a specific face
 * 
 * Requires REPLICATE_API_TOKEN and SUPABASE_SERVICE_ROLE_KEY
 * Returns error if not configured (face detection is optional add-on)
 */
export async function POST(request: NextRequest) {
  // Check if face detection is configured
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: 'Face detection is not enabled. Contact support to add this feature.' },
      { status: 503 }
    )
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'Service not configured' },
      { status: 503 }
    )
  }

  try {
    // Dynamic imports to avoid build-time errors
    const { createClient } = await import('@supabase/supabase-js')
    const { extractSelfieEmbedding, FACE_MATCH_THRESHOLD } = await import('@/lib/ai/faces')
    const { uploadFile } = await import('@/lib/storage')

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

    // Create admin client for database operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

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
