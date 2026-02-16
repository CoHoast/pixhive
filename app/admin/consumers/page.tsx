'use client'

import { useState } from 'react'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Calendar, 
  Image, 
  CreditCard,
  Eye,
  Ban,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

// Mock data
const CONSUMERS = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@email.com', plan: 'Premium', events: 3, photos: 2847, spent: 447, status: 'active', joined: '2026-01-15' },
  { id: '2', name: 'Mike Chen', email: 'mike@email.com', plan: 'Standard', events: 1, photos: 342, spent: 178, status: 'active', joined: '2026-02-01' },
  { id: '3', name: 'Jessica Williams', email: 'jess@email.com', plan: 'Basic', events: 1, photos: 156, spent: 39, status: 'active', joined: '2026-02-10' },
  { id: '4', name: 'David Brown', email: 'david@email.com', plan: 'Premium', events: 5, photos: 4521, spent: 795, status: 'active', joined: '2025-11-20' },
  { id: '5', name: 'Emily Davis', email: 'emily@email.com', plan: 'Standard', events: 2, photos: 892, spent: 258, status: 'active', joined: '2026-01-28' },
  { id: '6', name: 'James Wilson', email: 'james@email.com', plan: 'Free', events: 1, photos: 48, spent: 0, status: 'active', joined: '2026-02-12' },
  { id: '7', name: 'Amanda Taylor', email: 'amanda@email.com', plan: 'Premium', events: 4, photos: 3102, spent: 596, status: 'suspended', joined: '2025-10-05' },
  { id: '8', name: 'Robert Martinez', email: 'robert@email.com', plan: 'Basic', events: 1, photos: 187, spent: 88, status: 'active', joined: '2026-02-08' },
]

export default function AdminConsumersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredConsumers = CONSUMERS.filter(consumer => {
    const matchesSearch = consumer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          consumer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlan = planFilter === 'all' || consumer.plan.toLowerCase() === planFilter
    const matchesStatus = statusFilter === 'all' || consumer.status === statusFilter
    return matchesSearch && matchesPlan && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Consumers</h1>
          <p className="text-gray-400">Manage all consumer accounts</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Consumers', value: '1,247', color: 'blue' },
          { label: 'Active This Month', value: '342', color: 'green' },
          { label: 'Premium Users', value: '189', color: 'purple' },
          { label: 'Total Revenue', value: '$48,920', color: 'amber' },
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
              placeholder="Search consumers..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Plan</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Events</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Photos</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Spent</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Joined</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredConsumers.map((consumer) => (
                <tr key={consumer.id} className="hover:bg-gray-700/20 transition">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-white">{consumer.name}</p>
                      <p className="text-sm text-gray-500">{consumer.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      consumer.plan === 'Premium' ? 'bg-purple-500/20 text-purple-400' :
                      consumer.plan === 'Standard' ? 'bg-blue-500/20 text-blue-400' :
                      consumer.plan === 'Basic' ? 'bg-green-500/20 text-green-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {consumer.plan}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-gray-300">{consumer.events}</td>
                  <td className="px-4 py-4 text-center text-gray-300">{consumer.photos.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right text-gray-300">${consumer.spent}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      consumer.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {consumer.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-400 text-sm">
                    {new Date(consumer.joined).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-white transition" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-amber-400 transition" title="Suspend">
                        <Ban className="w-4 h-4" />
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
            Showing <span className="font-medium text-white">1-8</span> of <span className="font-medium text-white">1,247</span> consumers
          </p>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white transition disabled:opacity-50" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="px-3 py-1 bg-purple-500 text-white rounded">1</button>
            <button className="px-3 py-1 text-gray-400 hover:text-white">2</button>
            <button className="px-3 py-1 text-gray-400 hover:text-white">3</button>
            <span className="text-gray-500">...</span>
            <button className="px-3 py-1 text-gray-400 hover:text-white">156</button>
            <button className="p-2 text-gray-400 hover:text-white transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
