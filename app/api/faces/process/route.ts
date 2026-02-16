import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

/**
 * POST /api/faces/process
 * Process all photos in an event for face detection
 * 
 * Requires REPLICATE_API_TOKEN and SUPABASE_SERVICE_ROLE_KEY
 * This is an admin/background operation
 */
export async function POST(request: NextRequest) {
  // Check if face detection is configured
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: 'Face detection is not enabled. Add REPLICATE_API_TOKEN to enable.' },
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
    const { detectFaces, cosineSimilarity, FACE_MATCH_THRESHOLD } = await import('@/lib/ai/faces')
    const { clusterFaces } = await import('@/lib/ai/clustering')

    const { eventId } = await request.json()

    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing eventId' },
        { status: 400 }
      )
    }

    // Create admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get all photos for event
    const { data: photos, error: photosError } = await supabase
      .from('photos')
      .select('id, file_url')
      .eq('event_id', eventId)
      .is('moderation_status', 'approved')

    if (photosError) {
      throw photosError
    }

    if (!photos || photos.length === 0) {
      return NextResponse.json({ message: 'No photos to process' })
    }

    console.log(`[FaceProcess] Processing ${photos.length} photos for event ${eventId}`)

    // Process each photo for face detection
    const allFaces: Array<{
      photoId: string
      embedding: number[]
      bbox: any
      confidence: number
    }> = []

    for (const photo of photos) {
      try {
        const faces = await detectFaces(photo.file_url)
        
        for (const face of faces) {
          if (face.embedding && face.embedding.length > 0) {
            allFaces.push({
              photoId: photo.id,
              embedding: face.embedding,
              bbox: face.bbox,
              confidence: face.confidence,
            })
          }
        }
      } catch (error) {
        console.error(`[FaceProcess] Error processing photo ${photo.id}:`, error)
      }
    }

    console.log(`[FaceProcess] Detected ${allFaces.length} faces`)

    if (allFaces.length === 0) {
      return NextResponse.json({ 
        message: 'No faces detected',
        photosProcessed: photos.length,
        facesDetected: 0,
      })
    }

    // Cluster faces into persons
    const clusterInput = allFaces.map((f, idx) => ({
      faceId: `face_${idx}`,
      photoId: f.photoId,
      embedding: f.embedding,
    }))
    const clusters = clusterFaces(clusterInput, FACE_MATCH_THRESHOLD)

    console.log(`[FaceProcess] Created ${clusters.length} person clusters`)

    // Create person records and face records
    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i]
      
      // Create person record
      const { data: person, error: personError } = await supabase
        .from('detected_persons')
        .insert({
          event_id: eventId,
          photo_count: cluster.faceIds.length,
        })
        .select()
        .single()

      if (personError) {
        console.error('[FaceProcess] Error creating person:', personError)
        continue
      }

      // Create face records for this cluster
      for (const faceId of cluster.faceIds) {
        // Extract index from faceId (format: face_0, face_1, etc)
        const faceIndex = parseInt(faceId.split('_')[1])
        const face = allFaces[faceIndex]
        
        await supabase
          .from('detected_faces')
          .insert({
            photo_id: face.photoId,
            person_id: person.id,
            embedding: `[${face.embedding.join(',')}]`,
            bounding_box: face.bbox,
            confidence: face.confidence,
          })
      }
    }

    // Update event AI status
    await supabase
      .from('events')
      .update({ 
        ai_processing_status: 'completed',
        ai_features: { core: false, face_detection: true }
      })
      .eq('id', eventId)

    return NextResponse.json({
      success: true,
      photosProcessed: photos.length,
      facesDetected: allFaces.length,
      personsCreated: clusters.length,
    })

  } catch (error) {
    console.error('Face process error:', error)
    return NextResponse.json(
      { error: 'Processing failed' },
      { status: 500 }
    )
  }
}
