import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params
  
  try {
    // Dynamic imports to avoid build-time errors
    const { createServerClient } = await import('@supabase/ssr')
    const { cookies } = await import('next/headers')
    const JSZip = (await import('jszip')).default

    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignore
            }
          },
        },
      }
    )

    // Verify user owns this event
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('id, name, slug, user_id')
      .eq('id', eventId)
      .eq('user_id', user.id)
      .single()

    const event = eventData as { id: string; name: string; slug: string; user_id: string } | null

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Get all approved photos
    const { data: photosData, error: photosError } = await supabase
      .from('photos')
      .select('id, file_url, guest_name, uploaded_at')
      .eq('event_id', eventId)
      .eq('moderation_status', 'approved')
      .eq('is_hidden', false)
      .order('uploaded_at', { ascending: true })

    const photos = (photosData || []) as { id: string; file_url: string; guest_name: string | null; uploaded_at: string }[]

    if (photosError) {
      return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
    }

    if (photos.length === 0) {
      return NextResponse.json({ error: 'No photos to download' }, { status: 404 })
    }

    // Create zip file
    const zip = new JSZip()
    const folder = zip.folder(event.slug) || zip

    // Download and add each photo
    let index = 1
    for (const photo of photos) {
      try {
        const response = await fetch(photo.file_url)
        if (!response.ok) continue

        const buffer = await response.arrayBuffer()
        const extension = photo.file_url.split('.').pop() || 'jpg'
        const guestPrefix = photo.guest_name ? `${photo.guest_name.replace(/[^a-z0-9]/gi, '_')}_` : ''
        const filename = `${guestPrefix}photo_${String(index).padStart(4, '0')}.${extension}`
        
        folder.file(filename, buffer)
        index++
      } catch (err) {
        console.error(`Failed to download photo ${photo.id}:`, err)
      }
    }

    // Generate zip
    const zipBuffer = await zip.generateAsync({ 
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    })

    // Return zip file
    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${event.slug}-photos.zip"`,
        'Content-Length': String(zipBuffer.length),
      },
    })

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    )
  }
}
