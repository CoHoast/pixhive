import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    // Dynamic imports to avoid build-time errors
    const { createClient } = await import('@supabase/supabase-js')
    const { uploadFile, generatePhotoKey, generateThumbnailKey } = await import('@/lib/storage')
    const sharp = (await import('sharp')).default

    const formData = await request.formData()
    const eventId = formData.get('eventId') as string
    const guestId = formData.get('guestId') as string | null
    const guestName = formData.get('guestName') as string | null
    const files = formData.getAll('files') as File[]

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 })
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    // Create admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Verify event exists and is active
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('id, photo_count, content_moderation_enabled')
      .eq('id', eventId)
      .eq('status', 'active')
      .single()

    const event = eventData as { id: string; photo_count: number; content_moderation_enabled: boolean } | null

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found or inactive' }, { status: 404 })
    }

    const uploaded: { id: string; url: string; thumbnailUrl: string }[] = []
    const errors: string[] = []

    for (const file of files) {
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          errors.push(`${file.name}: Not an image`)
          continue
        }

        // Validate file size (max 20MB)
        if (file.size > 20 * 1024 * 1024) {
          errors.push(`${file.name}: File too large (max 20MB)`)
          continue
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Generate keys
        const photoKey = generatePhotoKey(eventId, file.name)
        const thumbnailKey = generateThumbnailKey(photoKey)

        // Get image metadata
        let metadata
        try {
          metadata = await sharp(buffer).metadata()
        } catch {
          errors.push(`${file.name}: Invalid image`)
          continue
        }

        // Create thumbnail (400px wide)
        const thumbnailBuffer = await sharp(buffer)
          .resize(400, null, { withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer()

        // Upload original to Supabase Storage
        const uploadResult = await uploadFile(buffer, photoKey, file.type)

        // Upload thumbnail to Supabase Storage
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
            moderation_status: moderationStatus as 'approved' | 'pending' | 'flagged' | 'blocked',
          } as any)
          .select('id')
          .single()

        if (insertError || !photo) {
          console.error('Error inserting photo:', insertError)
          errors.push(`${file.name}: Database error`)
          continue
        }

        const photoData = photo as { id: string }
        uploaded.push({
          id: photoData.id,
          url: uploadResult.url,
          thumbnailUrl: thumbnailResult.url,
        })

        // Update guest photo count
        if (guestId) {
          await (supabase as any).rpc('increment_guest_photo_count', { guest_id: guestId })
        }

      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err)
        errors.push(`${file.name}: Upload failed`)
      }
    }

    return NextResponse.json({
      success: true,
      uploaded,
      uploadedCount: uploaded.length,
      errors: errors.length > 0 ? errors : undefined,
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
