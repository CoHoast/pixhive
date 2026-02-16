'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Event } from '@/lib/types/database'
import { updateEvent, deleteEvent } from '@/lib/actions/events'

interface Props {
  event: Event
}

export default function EventSettings({ event }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setMessage(null)
    startTransition(async () => {
      const result = await updateEvent(event.id, formData)
      if (result?.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Settings saved!' })
        router.refresh()
      }
    })
  }

  async function handleDelete() {
    startTransition(async () => {
      await deleteEvent(event.id)
    })
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* General Settings */}
      <form action={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Event Settings</h2>

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Event Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={event.name}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
        </div>

        <div>
          <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-2">
            Event Date
          </label>
          <input
            type="date"
            id="event_date"
            name="event_date"
            defaultValue={event.event_date || ''}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={event.description || ''}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={event.status}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          >
            <option value="active">Active — Accepting uploads</option>
            <option value="archived">Archived — View only</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Guest Access Settings */}
      <form action={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Guest Access</h2>

        <label className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">Require registration</span>
            <p className="text-xs text-gray-500">Guests must enter email to view gallery</p>
          </div>
          <input
            type="checkbox"
            name="require_registration"
            value="true"
            defaultChecked={event.require_registration}
            className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
          />
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gallery visibility
          </label>
          <select
            name="guest_gallery_access"
            defaultValue={event.guest_gallery_access}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          >
            <option value="all">Guests can see all photos</option>
            <option value="own_photos">Guests can only see their own photos</option>
            <option value="none">Guests cannot view gallery (upload only)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Content Moderation */}
      <form action={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Content Moderation</h2>

        <label className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-gray-700">AI content filter</span>
            <p className="text-xs text-gray-500">Automatically flag inappropriate images</p>
          </div>
          <input
            type="checkbox"
            name="content_moderation_enabled"
            value="true"
            defaultChecked={event.content_moderation_enabled}
            className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
          />
        </label>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <p className="text-sm text-gray-700">
            When enabled, AI will automatically scan uploaded photos and flag any that may contain inappropriate content. 
            Flagged photos are hidden from the gallery until you review and approve them.
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
        
        <p className="text-sm text-gray-600">
          Deleting an event will permanently remove all photos and guest data. This action cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition"
          >
            Delete Event
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-600 font-medium">
              Are you sure? This will delete {event.photo_count} photos and {event.guest_count} guest records.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Yes, Delete Event'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-3 text-gray-700 hover:text-gray-900 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
