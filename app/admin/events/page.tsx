'use client'

import { useState } from 'react'
import { 
  Search, 
  Calendar,
  Image,
  Users,
  Eye,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  Sparkles,
  Filter
} from 'lucide-react'

// Mock data
const EVENTS = [
  { id: '1', name: 'Thompson Wedding', host: 'Sarah Johnson', hostType: 'consumer', photos: 847, guests: 142, aiFeatures: ['core', 'face'], status: 'active', created: '2026-02-10' },
  { id: '2', name: 'TechCorp Summit 2026', host: 'Perfect Day Planning', hostType: 'partner', photos: 1234, guests: 312, aiFeatures: ['core'], status: 'active', created: '2026-02-08' },
  { id: '3', name: 'Emily\'s Sweet 16', host: 'Thompson Family', hostType: 'consumer', photos: 528, guests: 42, aiFeatures: [], status: 'completed', created: '2026-02-01' },
  { id: '4', name: 'Annual Charity Gala', host: 'Elegant Events Co.', hostType: 'partner', photos: 1847, guests: 423, aiFeatures: ['core', 'face'], status: 'completed', created: '2026-01-28' },
  { id: '5', name: 'Johnson Family Reunion', host: 'Mike Johnson', hostType: 'consumer', photos: 234, guests: 67, aiFeatures: ['core'], status: 'active', created: '2026-02-12' },
  { id: '6', name: 'Corporate Team Building', host: 'Wedding Bliss Events', hostType: 'partner', photos: 456, guests: 89, aiFeatures: ['core'], status: 'active', created: '2026-02-11' },
  { id: '7', name: 'Miller-Davis Wedding', host: 'Elegant Events Co.', hostType: 'partner', photos: 2103, guests: 187, aiFeatures: ['core', 'face'], status: 'completed', created: '2026-01-15' },
  { id: '8', name: 'Baby Shower - The Smiths', host: 'Jennifer Smith', hostType: 'consumer', photos: 156, guests: 28, aiFeatures: [], status: 'active', created: '2026-02-14' },
]

export default function AdminEventsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [hostTypeFilter, setHostTypeFilter] = useState('all')

  const filteredEvents = EVENTS.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.host.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    const matchesHostType = hostTypeFilter === 'all' || event.hostType === hostTypeFilter
    return matchesSearch && matchesStatus && matchesHostType
  })

  const totalPhotos = EVENTS.reduce((sum, e) => sum + e.photos, 0)
  const totalGuests = EVENTS.reduce((sum, e) => sum + e.guests, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">All Events</h1>
          <p className="text-gray-400">View and manage all events across consumers and partners</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: '3,892', color: 'purple' },
          { label: 'Active Events', value: '234', color: 'green' },
          { label: 'Total Photos', value: `${(totalPhotos / 1000).toFixed(1)}K`, color: 'blue' },
          { label: 'Total Guests', value: totalGuests.toLocaleString(), color: 'amber' },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events or hosts..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={hostTypeFilter}
            onChange={(e) => setHostTypeFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Hosts</option>
            <option value="consumer">Consumers</option>
            <option value="partner">Partners</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Event</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Host</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Photos</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Guests</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">AI Features</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Created</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-700/20 transition">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="font-medium text-white">{event.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      {event.hostType === 'partner' ? (
                        <Building2 className="w-4 h-4 text-purple-400" />
                      ) : (
                        <User className="w-4 h-4 text-blue-400" />
                      )}
                      <span className="text-gray-300">{event.host}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center text-gray-300">
                      <Image className="w-4 h-4 mr-1 text-gray-500" />
                      {event.photos.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center text-gray-300">
                      <Users className="w-4 h-4 mr-1 text-gray-500" />
                      {event.guests}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center space-x-1">
                      {event.aiFeatures.length === 0 ? (
                        <span className="text-gray-500 text-sm">None</span>
                      ) : (
                        <>
                          {event.aiFeatures.includes('core') && (
                            <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">Core</span>
                          )}
                          {event.aiFeatures.includes('face') && (
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">Face</span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      event.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-400 text-sm">
                    {new Date(event.created).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-white transition" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-400 transition" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-700/50 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">1-8</span> of <span className="font-medium text-white">3,892</span> events
          </p>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white transition disabled:opacity-50" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="px-3 py-1 bg-purple-500 text-white rounded">1</button>
            <button className="px-3 py-1 text-gray-400 hover:text-white">2</button>
            <button className="px-3 py-1 text-gray-400 hover:text-white">3</button>
            <span className="text-gray-500">...</span>
            <button className="px-3 py-1 text-gray-400 hover:text-white">487</button>
            <button className="p-2 text-gray-400 hover:text-white transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
