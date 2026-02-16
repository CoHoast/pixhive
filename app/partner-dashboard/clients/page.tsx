'use client'

import { useState } from 'react'
import { Plus, Search, MoreVertical, Calendar, Image, Mail, Phone, Edit, Trash2, Eye } from 'lucide-react'

// Mock data
const MOCK_CLIENTS = [
  { 
    id: '1', 
    name: 'Sarah & Mike Johnson', 
    email: 'sarah@email.com', 
    phone: '(555) 123-4567',
    eventCount: 1,
    photoCount: 342,
    createdAt: '2026-01-15',
    notes: 'Wedding couple - ceremony and reception'
  },
  { 
    id: '2', 
    name: 'TechCorp Inc.', 
    email: 'events@techcorp.com', 
    phone: '(555) 987-6543',
    eventCount: 3,
    photoCount: 1247,
    createdAt: '2025-11-20',
    notes: 'Corporate client - quarterly events'
  },
  { 
    id: '3', 
    name: 'The Thompson Family', 
    email: 'thompson@email.com', 
    phone: '(555) 456-7890',
    eventCount: 2,
    photoCount: 856,
    createdAt: '2026-01-28',
    notes: 'Family events - birthday parties'
  },
]

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', notes: '' })

  const filteredClients = MOCK_CLIENTS.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600">Manage your clients and their events.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
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
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option>All Clients</option>
            <option>Active</option>
            <option>With Events</option>
          </select>
        </div>
      </div>

      {/* Client List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Events</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Photos</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Added</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">{client.name}</p>
                    {client.notes && (
                      <p className="text-sm text-gray-500 truncate max-w-xs">{client.notes}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {client.email}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {client.phone}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    <Calendar className="w-4 h-4 mr-1" />
                    {client.eventCount}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                    <Image className="w-4 h-4 mr-1" />
                    {client.photoCount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(client.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="p-2 text-gray-400 hover:text-purple-600 transition">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 transition">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClients.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-500">No clients found</p>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Client</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Sarah & Mike Johnson"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="client@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Wedding couple, corporate client, etc."
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                Cancel
              </button>
              <button
                disabled={!newClient.name}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
