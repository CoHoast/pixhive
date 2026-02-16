'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Photo } from '@/lib/types/database'
import { togglePhotoHidden, deletePhoto, toggleFavorite } from '@/lib/actions/photos'

interface Props {
  eventId: string
  initialPhotos: Photo[]
  filter: string
  sort: string
}

export default function PhotoGallery({ eventId, initialPhotos, filter, sort }: Props) {
  const router = useRouter()
  const [photos, setPhotos] = useState(initialPhotos)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null)

  function updateFilter(newFilter: string) {
    const params = new URLSearchParams()
    params.set('tab', 'photos')
    params.set('filter', newFilter)
    params.set('sort', sort)
    router.push(`/events/${eventId}?${params.toString()}`)
  }

  function updateSort(newSort: string) {
    const params = new URLSearchParams()
    params.set('tab', 'photos')
    params.set('filter', filter)
    params.set('sort', newSort)
    router.push(`/events/${eventId}?${params.toString()}`)
  }

  function toggleSelection(photoId: string) {
    const newSelected = new Set(selectedPhotos)
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId)
    } else {
      newSelected.add(photoId)
    }
    setSelectedPhotos(newSelected)
  }

  function selectAll() {
    setSelectedPhotos(new Set(photos.map(p => p.id)))
  }

  function clearSelection() {
    setSelectedPhotos(new Set())
    setIsSelectionMode(false)
  }

  async function handleHideSelected() {
    startTransition(async () => {
      for (const photoId of selectedPhotos) {
        await togglePhotoHidden(photoId)
      }
      router.refresh()
      clearSelection()
    })
  }

  async function handleDeleteSelected() {
    if (!confirm(`Delete ${selectedPhotos.size} photos? This cannot be undone.`)) return
    
    startTransition(async () => {
      for (const photoId of selectedPhotos) {
        await deletePhoto(photoId)
      }
      router.refresh()
      clearSelection()
    })
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No photos yet</h3>
        <p className="text-gray-500 mb-4">Share your QR code to start collecting photos from guests</p>
        <Link
          href={`/events/${eventId}?tab=qr`}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
        >
          View QR Code
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white rounded-xl p-3 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Filters */}
          <div className="flex items-center space-x-1 overflow-x-auto">
            <FilterButton active={filter === 'all'} onClick={() => updateFilter('all')}>
              All
            </FilterButton>
            <FilterButton active={filter === 'favorites'} onClick={() => updateFilter('favorites')}>
              <svg className="w-4 h-4 mr-1 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              Favorites
            </FilterButton>
            <FilterButton active={filter === 'most_liked'} onClick={() => updateFilter('most_liked')}>
              <svg className="w-4 h-4 mr-1 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              Most Liked
            </FilterButton>
            <FilterButton active={filter === 'ai_picks'} onClick={() => updateFilter('ai_picks')}>
              AI Picks
            </FilterButton>
            <FilterButton active={filter === 'hidden'} onClick={() => updateFilter('hidden')}>
              Hidden
            </FilterButton>
            <FilterButton active={filter === 'flagged'} onClick={() => updateFilter('flagged')}>
              Flagged
            </FilterButton>
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => updateSort(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="likes">Most Liked</option>
            <option value="ai_score">AI Score</option>
          </select>
        </div>

        {/* Selection Actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
          <button
            onClick={() => setIsSelectionMode(!isSelectionMode)}
            className="flex items-center text-sm text-gray-600 hover:text-purple-600"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            {isSelectionMode ? 'Cancel' : 'Select Photos'}
          </button>

          {isSelectionMode && selectedPhotos.size > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{selectedPhotos.size} selected</span>
              <button
                onClick={selectAll}
                className="text-sm text-purple-600 hover:underline"
              >
                Select All
              </button>
              <button
                onClick={handleHideSelected}
                disabled={isPending}
                className="px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Hide
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={isPending}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            isSelectionMode={isSelectionMode}
            isSelected={selectedPhotos.has(photo.id)}
            onSelect={() => toggleSelection(photo.id)}
            onClick={() => !isSelectionMode && setLightboxPhoto(photo)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightboxPhoto && (
        <PhotoLightbox
          photo={lightboxPhoto}
          onClose={() => setLightboxPhoto(null)}
          onPrev={() => {
            const idx = photos.findIndex(p => p.id === lightboxPhoto.id)
            if (idx > 0) setLightboxPhoto(photos[idx - 1])
          }}
          onNext={() => {
            const idx = photos.findIndex(p => p.id === lightboxPhoto.id)
            if (idx < photos.length - 1) setLightboxPhoto(photos[idx + 1])
          }}
        />
      )}
    </div>
  )
}

function FilterButton({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean
  onClick: () => void
  children: React.ReactNode 
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap flex items-center transition ${
        active
          ? 'bg-purple-600 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}

function PhotoCard({
  photo,
  isSelectionMode,
  isSelected,
  onSelect,
  onClick,
}: {
  photo: Photo
  isSelectionMode: boolean
  isSelected: boolean
  onSelect: () => void
  onClick: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [isFavorited, setIsFavorited] = useState(false) // Would come from API

  async function handleFavorite(e: React.MouseEvent) {
    e.stopPropagation()
    startTransition(async () => {
      const result = await toggleFavorite(photo.id)
      if (result.success) {
        setIsFavorited(result.favorited || false)
      }
    })
  }

  return (
    <div
      className={`aspect-square rounded-xl relative group cursor-pointer overflow-hidden ${
        isSelected ? 'ring-2 ring-purple-600' : ''
      }`}
      onClick={isSelectionMode ? onSelect : onClick}
    >
      <img
        src={photo.thumbnail_url || photo.file_url}
        alt=""
        className="w-full h-full object-cover"
        loading="lazy"
      />
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />

      {/* Selection checkbox */}
      {isSelectionMode && (
        <div className="absolute top-2 left-2">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
            isSelected 
              ? 'bg-purple-600 border-purple-600' 
              : 'bg-white border-2 border-gray-300'
          }`}>
            {isSelected && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      {!isSelectionMode && (
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={handleFavorite}
            disabled={isPending}
            className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition"
          >
            <svg 
              className={`w-4 h-4 ${isFavorited ? 'text-rose-500 fill-current' : 'text-gray-400'}`} 
              fill={isFavorited ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      )}

      {/* Badges */}
      <div className="absolute bottom-2 left-2 flex space-x-1">
        {photo.ai_score && photo.ai_score >= 0.7 && (
          <span className="bg-white/90 backdrop-blur rounded-full px-2 py-0.5 text-xs font-medium flex items-center">
            <svg className="w-3 h-3 text-amber-500 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            AI Pick
          </span>
        )}
        {photo.like_count > 0 && (
          <span className="bg-white/90 backdrop-blur rounded-full px-2 py-0.5 text-xs font-medium flex items-center">
            <svg className="w-3 h-3 text-rose-500 mr-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {photo.like_count}
          </span>
        )}
      </div>

      {/* Moderation badge */}
      {photo.moderation_status === 'flagged' && (
        <div className="absolute top-2 left-2">
          <span className="bg-amber-500 text-white rounded-full px-2 py-0.5 text-xs font-medium">
            Flagged
          </span>
        </div>
      )}
    </div>
  )
}

function PhotoLightbox({
  photo,
  onClose,
  onPrev,
  onNext,
}: {
  photo: Photo
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Nav buttons */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        className="absolute left-4 p-2 text-white/80 hover:text-white"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext() }}
        className="absolute right-4 p-2 text-white/80 hover:text-white"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Image */}
      <img
        src={photo.file_url}
        alt=""
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Info */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 rounded-lg px-4 py-2 text-white text-sm">
        {photo.guest_name && <span>{photo.guest_name} • </span>}
        {new Date(photo.uploaded_at).toLocaleString()}
        {photo.like_count > 0 && <span> • ❤️ {photo.like_count}</span>}
      </div>
    </div>
  )
}
