'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { registerGuest } from '@/lib/actions/guests'
import { uploadPhotos } from '@/lib/actions/photos'
import { FindYourself } from '@/components/faces'

interface Event {
  id: string
  name: string
  slug: string
  event_date: string | null
  description: string | null
  require_registration: boolean
  guest_gallery_access: string
  photo_count: number
  guest_count: number
}

interface Guest {
  id: string
  name: string
  email: string
  access_token: string
}

interface Props {
  event: Event
  initialGuest: Guest | null
}

type Step = 'register' | 'upload' | 'uploading' | 'success' | 'gallery'

export default function GuestUploadFlow({ event, initialGuest }: Props) {
  const [step, setStep] = useState<Step>(initialGuest ? 'upload' : 'register')
  const [guest, setGuest] = useState<Guest | null>(initialGuest)
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedCount, setUploadedCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showFindYourself, setShowFindYourself] = useState(false)

  // Registration form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [agreedToTos, setAgreedToTos] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.heic', '.heif']
    },
    multiple: true,
  })

  // Register guest
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!agreedToTos) {
      setError('Please agree to the Terms of Service')
      return
    }

    setIsRegistering(true)
    setError(null)

    const result = await registerGuest(event.id, name, email, true)

    if (result.error) {
      setError(result.error)
      setIsRegistering(false)
      return
    }

    setGuest(result.guest)
    setStep('upload')
    setIsRegistering(false)
  }

  // Skip registration
  function handleSkip() {
    setStep('upload')
  }

  // Upload photos
  async function handleUpload() {
    if (files.length === 0) return

    setStep('uploading')
    setUploadProgress(0)
    setUploadedCount(0)

    try {
      const result = await uploadPhotos(
        event.id,
        files,
        guest?.id,
        guest?.name || 'Anonymous'
      )

      setUploadedCount(result.uploaded.length)
      setUploadProgress(100)

      setTimeout(() => {
        setStep('success')
      }, 500)
    } catch (err) {
      setError('Upload failed. Please try again.')
      setStep('upload')
    }
  }

  // Clear files
  function clearFiles() {
    setFiles([])
  }

  // Remove single file
  function removeFile(index: number) {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  // View gallery
  function viewGallery() {
    setStep('gallery')
  }

  // Upload more
  function uploadMore() {
    setFiles([])
    setStep('upload')
  }

  return (
    <div className="space-y-6">
      {/* Event Info */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <span className="text-4xl">📸</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{event.name}</h1>
        {event.event_date && (
          <p className="text-gray-500">
            {new Date(event.event_date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        )}
      </div>

      {/* Step: Register */}
      {step === 'register' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">📸 View the Photo Gallery</h2>
            <p className="text-sm text-gray-600">
              Enter your name and email to view{' '}
              <span className="font-medium text-purple-600">{event.name}</span> photo gallery
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              />
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="tos"
                checked={agreedToTos}
                onChange={(e) => setAgreedToTos(e.target.checked)}
                className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="tos" className="text-xs text-gray-600 leading-relaxed">
                I agree to the{' '}
                <a href="/terms" className="text-purple-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a>.
                I consent to receive event updates and promotional emails from PixHive.
              </label>
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
            >
              {isRegistering ? 'Registering...' : 'Get Gallery Access →'}
            </button>
          </form>

          {!event.require_registration && (
            <p className="text-xs text-center text-gray-400 mt-4">
              <button onClick={handleSkip} className="hover:text-gray-600 underline">
                Skip and upload images only
              </button>{' '}
              (no gallery viewing)
            </p>
          )}
        </div>
      )}

      {/* Step: Upload */}
      {step === 'upload' && (
        <div className="space-y-4">
          {guest && (
            <p className="text-sm text-gray-600 text-center">
              Welcome, {guest.name}! 👋
            </p>
          )}

          {files.length === 0 ? (
            <div
              {...getRootProps()}
              className={`bg-white rounded-2xl p-8 border-2 border-dashed cursor-pointer transition ${
                isDragActive
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl mx-auto flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">Tap to select photos</p>
                  <p className="text-sm text-gray-500 mt-1">or drag and drop here</p>
                </div>
                <button
                  type="button"
                  className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition"
                >
                  Choose Photos
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">{files.length} photos selected</h3>
                <button onClick={clearFiles} className="text-sm text-gray-500 hover:text-gray-700">
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {files.slice(0, 6).map((file, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden relative bg-gray-100">
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {files.length > 6 && (
                  <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500 font-medium">+{files.length - 6}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleUpload}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Photos
              </button>
            </div>
          )}

          {guest && (
            <button
              onClick={viewGallery}
              className="w-full py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View Gallery
            </button>
          )}
        </div>
      )}

      {/* Step: Uploading */}
      {step === 'uploading' && (
        <div className="space-y-6 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto flex items-center justify-center">
            <svg className="w-10 h-10 text-purple-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Uploading...</h2>
            <p className="text-gray-500">{uploadedCount} of {files.length} photos</p>
          </div>
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Step: Success */}
      {step === 'success' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Photos Uploaded! 🎉</h2>
            <p className="text-gray-500">{uploadedCount} photos added to the gallery</p>
          </div>

          <div className="space-y-3">
            {guest && (
              <button
                onClick={viewGallery}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                View Live Gallery
              </button>
            )}
            <button
              onClick={uploadMore}
              className="w-full py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Upload More Photos
            </button>
          </div>

          {guest && (
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Check your email!</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    We'll send you a link to view all photos after the event ends.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step: Gallery */}
      {step === 'gallery' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Live Gallery</h2>
              <p className="text-sm text-gray-500">Photos appearing in real-time</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="flex items-center text-xs text-green-600 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                Live
              </span>
              <button
                onClick={() => setStep('upload')}
                className="p-2 bg-purple-600 text-white rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Find Yourself Button */}
          <button
            onClick={() => setShowFindYourself(true)}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-amber-500 text-white font-semibold rounded-xl hover:opacity-90 transition flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Find Yourself in Photos
          </button>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
              <p className="text-2xl font-bold text-purple-600">{event.photo_count}</p>
              <p className="text-xs text-gray-500">Photos</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
              <p className="text-2xl font-bold text-blue-600">{event.guest_count}</p>
              <p className="text-xs text-gray-500">Guests</p>
            </div>
          </div>

          {/* Placeholder for gallery */}
          <div className="bg-gray-100 rounded-xl p-8 text-center">
            <p className="text-gray-500">Gallery loading...</p>
            <p className="text-xs text-gray-400 mt-2">Photos will appear here as guests upload them</p>
          </div>
        </div>
      )}

      {/* Find Yourself Modal */}
      {showFindYourself && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <FindYourself
            eventId={event.id}
            onClose={() => setShowFindYourself(false)}
            onResults={(results) => {
              // Could filter gallery to show only matching photos
              console.log('Found photos:', results.length)
            }}
          />
        </div>
      )}
    </div>
  )
}
