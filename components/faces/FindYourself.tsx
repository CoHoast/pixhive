'use client'

import { useState, useRef, useCallback } from 'react'
import { Camera, X, Search, Loader2, User, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { searchByFace } from '@/lib/actions/faces'
import type { FaceSearchResult } from '@/lib/ai/types'

interface FindYourselfProps {
  eventId: string
  onResults?: (results: FaceSearchResult[]) => void
  onClose?: () => void
}

type Step = 'intro' | 'camera' | 'preview' | 'searching' | 'results' | 'error'

export function FindYourself({ eventId, onResults, onClose }: FindYourselfProps) {
  const [step, setStep] = useState<Step>('intro')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [results, setResults] = useState<FaceSearchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setStep('camera')
    } catch (err) {
      setError('Could not access camera. Please allow camera permissions.')
      setStep('error')
    }
  }, [])

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }, [])

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Flip horizontally for mirror effect
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageData)
    stopCamera()
    setStep('preview')
  }, [stopCamera])

  // Retake photo
  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    startCamera()
  }, [startCamera])

  // Search for matching photos
  const searchPhotos = useCallback(async () => {
    if (!capturedImage) return

    setStep('searching')
    setError(null)

    try {
      // Upload selfie temporarily and get URL
      // For now, we'll use the base64 data directly
      // In production, upload to Supabase Storage first
      
      const { results: searchResults, error: searchError } = await searchByFace(
        eventId,
        capturedImage
      )

      if (searchError) {
        setError(searchError)
        setStep('error')
        return
      }

      setResults(searchResults)
      setStep('results')
      onResults?.(searchResults)
    } catch (err) {
      setError('Search failed. Please try again.')
      setStep('error')
    }
  }, [capturedImage, eventId, onResults])

  // Reset and start over
  const reset = useCallback(() => {
    setCapturedImage(null)
    setResults([])
    setError(null)
    setStep('intro')
  }, [])

  // Cleanup on unmount
  const handleClose = useCallback(() => {
    stopCamera()
    onClose?.()
  }, [stopCamera, onClose])

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-md mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-amber-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Find Yourself</h3>
              <p className="text-sm text-white/80">Take a selfie to find your photos</p>
            </div>
          </div>
          {onClose && (
            <button onClick={handleClose} className="text-white/80 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Intro */}
        {step === 'intro' && (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto flex items-center justify-center">
              <Camera className="w-12 h-12 text-purple-600" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Find All Your Photos
              </h4>
              <p className="text-gray-600">
                Take a quick selfie and we'll find every photo you appear in using AI face matching.
              </p>
            </div>
            <Button
              onClick={startCamera}
              className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl py-6"
            >
              <Camera className="w-5 h-5 mr-2" />
              Open Camera
            </Button>
          </div>
        )}

        {/* Camera */}
        {step === 'camera' && (
          <div className="space-y-4">
            <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              {/* Face guide overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-4 border-white/50 rounded-full" />
              </div>
            </div>
            <p className="text-center text-sm text-gray-500">
              Position your face in the circle
            </p>
            <Button
              onClick={capturePhoto}
              className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl py-6"
            >
              <Camera className="w-5 h-5 mr-2" />
              Take Selfie
            </Button>
          </div>
        )}

        {/* Preview */}
        {step === 'preview' && capturedImage && (
          <div className="space-y-4">
            <div className="relative aspect-[4/3] bg-black rounded-xl overflow-hidden">
              <img
                src={capturedImage}
                alt="Your selfie"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={retakePhoto}
                variant="outline"
                className="rounded-xl py-5"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button
                onClick={searchPhotos}
                className="bg-purple-600 hover:bg-purple-700 rounded-xl py-5"
              >
                <Search className="w-4 h-4 mr-2" />
                Find Photos
              </Button>
            </div>
          </div>
        )}

        {/* Searching */}
        {step === 'searching' && (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Searching...
              </h4>
              <p className="text-gray-600">
                Looking through all event photos to find you
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {step === 'results' && (
          <div className="space-y-4">
            {results.length > 0 ? (
              <>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <User className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    Found {results.length} Photo{results.length !== 1 ? 's' : ''}!
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    You appear in these photos
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {results.slice(0, 9).map((result, i) => (
                    <div
                      key={result.photoId}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        src={result.thumbnailUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {results.length > 9 && (
                  <p className="text-center text-sm text-gray-500">
                    +{results.length - 9} more photos
                  </p>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  No Photos Found
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  We couldn't find any photos with you in them yet.
                  <br />
                  More photos may be uploaded soon!
                </p>
              </div>
            )}
            <Button
              onClick={reset}
              variant="outline"
              className="w-full rounded-xl"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                Something Went Wrong
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {error || 'Please try again'}
              </p>
            </div>
            <Button
              onClick={reset}
              className="w-full bg-purple-600 hover:bg-purple-700 rounded-xl"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
