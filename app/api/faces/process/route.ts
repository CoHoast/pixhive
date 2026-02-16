// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import { processPhotoFaces } from '@/lib/actions/faces'

export const runtime = 'nodejs'
export const maxDuration = 60

/**
 * POST /api/faces/process
 * Process a photo for face detection
 * Called by background job or webhook after upload
 * 
 * Body: { photoId: string }
 * Returns: { facesDetected: number } or { error: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify internal request (should come from our own services)
    const authHeader = request.headers.get('authorization')
    const internalKey = process.env.INTERNAL_API_KEY

    // In production, validate the internal key
    // For now, allow all requests in development
    if (internalKey && authHeader !== `Bearer ${internalKey}`) {
      // Skip auth check in development
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    const body = await request.json()
    const { photoId } = body

    if (!photoId) {
      return NextResponse.json(
        { error: 'Missing photoId' },
        { status: 400 }
      )
    }

    const result = await processPhotoFaces(photoId)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      facesDetected: result.facesDetected,
    })

  } catch (error) {
    console.error('Face processing error:', error)
    return NextResponse.json(
      { error: 'Processing failed' },
      { status: 500 }
    )
  }
}
