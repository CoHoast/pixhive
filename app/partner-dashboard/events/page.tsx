'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Calendar, Image, Users, QrCode, ExternalLink, MoreVertical, Sparkles, Copy, Check } from 'lucide-react'

// Mock data
const MOCK_EVENTS = [
  { 
    id: '1', 
    name: 'Sarah & Mike Wedding', 
    client: 'Sarah Johnson',
    clientId: '1',
    date: '2026-02-14',
    slug: 'sarah-mike-wedding',
    photoCount: 342,
    guestCount: 87,
    status: 'active',
    aiFeatures: { core: true, faceDetection: true },
  },
  { 
    id: '2', 
    name: 'Corporate Summit 2026', 
    client: 'TechCorp Inc.',
    clientId: '2',
    date: '2026-02-20',
    slug: 'techcorp-summit-2026',
    photoCount: 0,
    guestCount: 0,
    status: 'upcoming',
    aiFeatures: { core: true, faceDetection: false },
  },
  { 
    id: '3', 
    name: 'Emily\'s Sweet 16', 
    client: 'The Thompson Family',
    clientId: '3',
    date: '2026-02-08',
    slug: 'emily-sweet-16',
    photoCount: 528,
    guestCount: 42,
    status: 'completed',
    aiFeatures: { core: false, faceDetection: false },
  },
]

export default function PartnerEventsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.client.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`https://yourcompany.pixhive.co/e/${slug}`)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">Create and manage events for your clients.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            {['all', 'upcoming', 'active', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  statusFilter === status
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
            {/* Event Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.status === 'active' ? 'bg-green-100 text-green-700' :
                  event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{event.name}</h3>
              <p className="text-sm text-gray-600">{event.client}</p>
            </div>

            {/* Event Stats */}
            <div className="px-6 py-4 bg-gray-50 grid grid-cols-3 gap-4">
              <div className="text-center">
                <Calendar className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="text-center">
                <Image className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">Photos</p>
                <p className="text-sm font-semibold text-gray-900">{event.photoCount}</p>
              </div>
              <div className="text-center">
                <Users className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">Guests</p>
                <p className="text-sm font-semibold text-gray-900">{event.guestCount}</p>
              </div>
            </div>

            {/* AI Features */}
            {(event.aiFeatures.core || event.aiFeatures.faceDetection) && (
              <div className="px-6 py-3 border-t border-gray-100 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-gray-600">AI:</span>
                {event.aiFeatures.core && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">Core</span>
                )}
                {event.aiFeatures.faceDetection && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">Face Detection</span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center space-x-3">
              <button
                onClick={() => copyLink(event.slug)}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                {copiedSlug === event.slug ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </>
                )}
              </button>
              <button className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                <QrCode className="w-4 h-4 mr-2" />
                QR Code
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-4">Create your first event to get started.</p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Create Event
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
