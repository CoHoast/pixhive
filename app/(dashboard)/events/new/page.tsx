'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createEvent } from '@/lib/actions/events'

export default function NewEventPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    const result = await createEvent(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsSubmitting(false)
    }
    // On success, createEvent redirects to the event page
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 flex items-center mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
        <p className="text-gray-600">Set up your event and get a QR code to share with guests</p>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Event Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Event Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Sarah & Mike's Wedding"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
          />
        </div>

        {/* Event Date */}
        <div>
          <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-2">
            Event Date
          </label>
          <input
            type="date"
            id="event_date"
            name="event_date"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Share the love! Upload your photos from our special day."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition resize-none"
          />
        </div>

        {/* Guest Settings */}
        <div className="bg-gray-50 rounded-xl p-5 space-y-4">
          <h3 className="font-medium text-gray-900">Guest Settings</h3>
          
          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-700">Require registration for gallery access</span>
              <p className="text-xs text-gray-500">Guests enter email to view photos</p>
            </div>
            <input
              type="checkbox"
              name="require_registration"
              value="true"
              defaultChecked
              className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
            />
          </label>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Guests can see:</label>
            <select
              name="guest_gallery_access"
              defaultValue="all"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            >
              <option value="all">All event photos</option>
              <option value="own_photos">Only photos they uploaded</option>
              <option value="none">No photos (upload only)</option>
            </select>
          </div>

          <label className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-700">Enable AI content moderation</span>
              <p className="text-xs text-gray-500">Auto-flag inappropriate images</p>
            </div>
            <input
              type="checkbox"
              name="content_moderation_enabled"
              value="true"
              className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
            />
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 text-gray-700 font-medium hover:text-gray-900 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </>
            ) : (
              'Create Event'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
