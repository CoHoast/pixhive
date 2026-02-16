'use client'

import { useState } from 'react'
import { 
  Search, 
  Building2,
  MoreVertical, 
  Mail, 
  Globe,
  Calendar, 
  Users,
  CreditCard,
  Eye,
  Ban,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Check,
  X,
  Sparkles
} from 'lucide-react'

// Mock data
const PARTNERS = [
  { 
    id: '1', 
    company: 'Elegant Events Co.', 
    email: 'info@elegantevents.com', 
    plan: 'Professional',
    clients: 47,
    events: 124,
    mrr: 399,
    aiUsage: 847,
    domain: 'photos.elegantevents.com',
    domainVerified: true,
    status: 'active', 
    joined: '2025-09-15' 
  },
  { 
    id: '2', 
    company: 'Perfect Day Planning', 
    email: 'hello@perfectday.com', 
    plan: 'Professional',
    clients: 23,
    events: 67,
    mrr: 399,
    aiUsage: 423,
    domain: 'gallery.perfectday.com',
    domainVerified: true,
    status: 'active', 
    joined: '2025-11-20' 
  },
  { 
    id: '3', 
    company: 'Moments Captured', 
    email: 'contact@momentscaptured.co', 
    plan: 'Professional',
    clients: 12,
    events: 34,
    mrr: 399,
    aiUsage: 156,
    domain: null,
    domainVerified: false,
    status: 'trial', 
    joined: '2026-02-01' 
  },
  { 
    id: '4', 
    company: 'Wedding Bliss Events', 
    email: 'team@weddingbliss.com', 
    plan: 'Professional',
    clients: 89,
    events: 234,
    mrr: 399,
    aiUsage: 1247,
    domain: 'photos.weddingbliss.com',
    domainVerified: true,
    status: 'active', 
    joined: '2025-06-10' 
  },
  { 
    id: '5', 
    company: 'Dream Day Co.', 
    email: 'info@dreamday.co', 
    plan: 'Professional',
    clients: 5,
    events: 8,
    mrr: 0,
    aiUsage: 34,
    domain: null,
    domainVerified: false,
    status: 'trial', 
    joined: '2026-02-10' 
  },
]

export default function AdminPartnersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredPartners = PARTNERS.filter(partner => {
    const matchesSearch = partner.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          partner.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || partner.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalMRR = PARTNERS.filter(p => p.status === 'active').reduce((sum, p) => sum + p.mrr, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Partners</h1>
          <p className="text-gray-400">Manage white-label partner accounts</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Partners', value: '34', color: 'purple' },
          { label: 'Active Subscriptions', value: '28', color: 'green' },
          { label: 'In Trial', value: '6', color: 'amber' },
          { label: 'Monthly Revenue', value: `$${totalMRR.toLocaleString()}`, color: 'blue' },
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
              placeholder="Search partners..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="trial">In Trial</option>
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Partner</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Clients</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Events</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">AI Usage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Domain</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">MRR</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="hover:bg-gray-700/20 transition">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{partner.company}</p>
                        <p className="text-sm text-gray-500">{partner.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center text-gray-300">
                      <Users className="w-4 h-4 mr-1 text-gray-500" />
                      {partner.clients}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center text-gray-300">
                      <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                      {partner.events}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center text-gray-300">
                      <Sparkles className="w-4 h-4 mr-1 text-purple-400" />
                      {partner.aiUsage}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {partner.domain ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-300 text-sm">{partner.domain}</span>
                        {partner.domainVerified ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <X className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Not configured</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-medium text-white">
                      {partner.mrr > 0 ? `$${partner.mrr}` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      partner.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : partner.status === 'trial'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {partner.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-white transition" title="View Dashboard">
                        <Eye className="w-4 h-4" />
                      </button>
                      {partner.domain && partner.domainVerified && (
                        <a 
                          href={`https://${partner.domain}`} 
                          target="_blank" 
                          className="p-2 text-gray-400 hover:text-blue-400 transition" 
                          title="Visit Site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button className="p-2 text-gray-400 hover:text-amber-400 transition" title="Suspend">
                        <Ban className="w-4 h-4" />
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
            Showing <span className="font-medium text-white">1-5</span> of <span className="font-medium text-white">34</span> partners
          </p>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white transition disabled:opacity-50" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="px-3 py-1 bg-purple-500 text-white rounded">1</button>
            <button className="px-3 py-1 text-gray-400 hover:text-white">2</button>
            <button className="px-3 py-1 text-gray-400 hover:text-white">3</button>
            <button className="p-2 text-gray-400 hover:text-white transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
