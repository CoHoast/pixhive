import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getEventBySlug } from '@/lib/actions/events'
import { getCurrentGuest } from '@/lib/actions/guests'
import GuestUploadFlow from './GuestUploadFlow'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const { event } = await getEventBySlug(slug)
  
  if (!event) {
    return { title: 'Event Not Found — PixHive' }
  }

  return {
    title: `${event.name} — PixHive`,
    description: `Upload and view photos from ${event.name}`,
  }
}

export default async function GuestUploadPage({ params }: PageProps) {
  const { slug } = await params
  const { event, error } = await getEventBySlug(slug)

  if (error || !event) {
    notFound()
  }

  // Check if guest is already registered
  const { guest } = await getCurrentGuest()
  const isRegistered = guest && guest.event_id === event.id

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-amber-500 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">PixHive</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <Suspense fallback={
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded-2xl" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
          </div>
        }>
          <GuestUploadFlow 
            event={event}
            initialGuest={isRegistered ? guest : null}
          />
        </Suspense>
      </main>
    </div>
  )
}
