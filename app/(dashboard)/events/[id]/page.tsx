import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getEvent } from '@/lib/actions/events'
import { getEventPhotos } from '@/lib/actions/photos'
import { getEventGuests } from '@/lib/actions/guests'

export const dynamic = 'force-dynamic'
import QRCodeDisplay from '@/components/events/QRCodeDisplay'
import PhotoGallery from '@/components/events/PhotoGallery'
import EventStats from '@/components/events/EventStats'
import EventSettings from '@/components/events/EventSettings'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string; filter?: string; sort?: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const { event } = await getEvent(id)
  
  if (!event) {
    return { title: 'Event Not Found — PixHive' }
  }

  return {
    title: `${event.name} — PixHive`,
  }
}

export default async function EventDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const { tab = 'photos', filter = 'all', sort = 'newest' } = await searchParams
  
  const { event, error } = await getEvent(id)

  if (error || !event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{event.name}</h1>
                {event.event_date && (
                  <p className="text-sm text-gray-500">
                    {new Date(event.event_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/e/${event.slug}`}
                target="_blank"
                className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Preview
              </Link>
              <DownloadAllButton eventId={event.id} photoCount={event.photo_count} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8 border-b border-gray-200 -mb-px">
            <TabLink href={`/events/${id}?tab=photos`} active={tab === 'photos'}>
              Photos
            </TabLink>
            <TabLink href={`/events/${id}?tab=guests`} active={tab === 'guests'}>
              Guests
            </TabLink>
            <TabLink href={`/events/${id}?tab=qr`} active={tab === 'qr'}>
              QR Code
            </TabLink>
            <TabLink href={`/events/${id}?tab=settings`} active={tab === 'settings'}>
              Settings
            </TabLink>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <Suspense fallback={<div className="h-24 bg-gray-100 rounded-xl animate-pulse mb-6" />}>
          <EventStats event={event} />
        </Suspense>

        {/* Tab Content */}
        {tab === 'photos' && (
          <Suspense fallback={<PhotoGallerySkeleton />}>
            <PhotoGalleryWrapper eventId={id} filter={filter} sort={sort} />
          </Suspense>
        )}

        {tab === 'guests' && (
          <Suspense fallback={<div className="h-64 bg-gray-100 rounded-xl animate-pulse" />}>
            <GuestListWrapper eventId={id} />
          </Suspense>
        )}

        {tab === 'qr' && (
          <div className="max-w-md mx-auto">
            <QRCodeDisplay event={event} />
          </div>
        )}

        {tab === 'settings' && (
          <EventSettings event={event} />
        )}
      </main>
    </div>
  )
}

function TabLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
        active
          ? 'border-purple-600 text-purple-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}
    >
      {children}
    </Link>
  )
}

function DownloadAllButton({ eventId, photoCount }: { eventId: string; photoCount: number }) {
  if (photoCount === 0) return null

  return (
    <a
      href={`/api/download/${eventId}`}
      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download All
    </a>
  )
}

async function PhotoGalleryWrapper({ eventId, filter, sort }: { eventId: string; filter: string; sort: string }) {
  const { photos, error } = await getEventPhotos(eventId, {
    filter: filter as any,
    sort: sort as any,
    limit: 100,
  })

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>
  }

  return <PhotoGallery eventId={eventId} initialPhotos={photos} filter={filter} sort={sort} />
}

async function GuestListWrapper({ eventId }: { eventId: string }) {
  const { guests, error } = await getEventGuests(eventId)

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>
  }

  if (guests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No guests yet</h3>
        <p className="text-gray-500">Share your QR code to start collecting photos</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photos</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marketing</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {guests.map((guest) => (
            <tr key={guest.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <div className="font-medium text-gray-900">{guest.name}</div>
                  <div className="text-sm text-gray-500">{guest.email}</div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{guest.photo_count}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(guest.registered_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  guest.marketing_consent && !guest.unsubscribed_at
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {guest.marketing_consent && !guest.unsubscribed_at ? 'Subscribed' : 'Unsubscribed'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PhotoGallerySkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
