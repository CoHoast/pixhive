'use client'

import { useState } from 'react'
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Users,
  Building2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard
} from 'lucide-react'

// Mock data
const MONTHLY_REVENUE = [
  { month: 'Sep 2025', consumers: 8420, partners: 2800, ai: 1240, total: 12460 },
  { month: 'Oct 2025', consumers: 9180, partners: 3200, ai: 1580, total: 13960 },
  { month: 'Nov 2025', consumers: 10250, partners: 4000, ai: 1890, total: 16140 },
  { month: 'Dec 2025', consumers: 14820, partners: 4800, ai: 2340, total: 21960 },
  { month: 'Jan 2026', consumers: 12340, partners: 5600, ai: 2180, total: 20120 },
  { month: 'Feb 2026', consumers: 15420, partners: 6800, ai: 2627, total: 24847 },
]

const RECENT_TRANSACTIONS = [
  { id: '1', customer: 'Sarah Johnson', type: 'consumer', plan: 'Premium + AI', amount: 797, date: '2026-02-14' },
  { id: '2', customer: 'Elegant Events Co.', type: 'partner', plan: 'Professional', amount: 399, date: '2026-02-14' },
  { id: '3', customer: 'Perfect Day Planning', type: 'partner', plan: 'AI Add-on', amount: 149, date: '2026-02-14' },
  { id: '4', customer: 'Mike Chen', type: 'consumer', plan: 'Standard + Core AI', amount: 178, date: '2026-02-13' },
  { id: '5', customer: 'Wedding Bliss Events', type: 'partner', plan: 'Professional', amount: 399, date: '2026-02-13' },
  { id: '6', customer: 'Jennifer Smith', type: 'consumer', plan: 'Basic', amount: 39, date: '2026-02-13' },
  { id: '7', customer: 'Thompson Family', type: 'consumer', plan: 'Standard', amount: 79, date: '2026-02-12' },
  { id: '8', customer: 'Dream Day Co.', type: 'partner', plan: 'AI Add-on', amount: 79, date: '2026-02-12' },
]

const TOP_CUSTOMERS = [
  { name: 'Elegant Events Co.', type: 'partner', revenue: 8947, events: 124 },
  { name: 'Wedding Bliss Events', type: 'partner', revenue: 7234, events: 234 },
  { name: 'David Brown', type: 'consumer', revenue: 2340, events: 5 },
  { name: 'Perfect Day Planning', type: 'partner', revenue: 1847, events: 67 },
  { name: 'Sarah Johnson', type: 'consumer', revenue: 1247, events: 3 },
]

export default function AdminRevenuePage() {
  const currentMonth = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1]
  const lastMonth = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 2]
  const growth = ((currentMonth.total - lastMonth.total) / lastMonth.total * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Revenue</h1>
          <p className="text-gray-400">Track revenue across all channels</p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-400" />
            <div className="flex items-center text-green-400 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +{growth}%
            </div>
          </div>
          <p className="text-3xl font-bold text-white">${currentMonth.total.toLocaleString()}</p>
          <p className="text-green-300/70">Total Revenue (Feb)</p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">${currentMonth.consumers.toLocaleString()}</p>
          <p className="text-gray-400">Consumer Revenue</p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">${currentMonth.partners.toLocaleString()}</p>
          <p className="text-gray-400">Partner Revenue</p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-3xl font-bold text-white">${currentMonth.ai.toLocaleString()}</p>
          <p className="text-gray-400">AI Add-on Revenue</p>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
        <h2 className="font-semibold text-white mb-6">Revenue Trend</h2>
        <div className="grid grid-cols-6 gap-4">
          {MONTHLY_REVENUE.map((month, i) => (
            <div key={month.month} className="text-center">
              <div className="h-40 flex flex-col justify-end space-y-1 mb-2">
                <div 
                  className="bg-amber-500/80 rounded-t"
                  style={{ height: `${(month.ai / 3000) * 100}%` }}
                />
                <div 
                  className="bg-purple-500/80"
                  style={{ height: `${(month.partners / 7000) * 100}%` }}
                />
                <div 
                  className="bg-blue-500/80 rounded-b"
                  style={{ height: `${(month.consumers / 16000) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{month.month.split(' ')[0]}</p>
              <p className="text-sm font-medium text-white">${(month.total / 1000).toFixed(1)}K</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
            <span className="text-gray-400">Consumers</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded mr-2" />
            <span className="text-gray-400">Partners</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-500 rounded mr-2" />
            <span className="text-gray-400">AI Add-ons</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
          <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
            <h2 className="font-semibold text-white">Recent Transactions</h2>
            <a href="#" className="text-sm text-purple-400 hover:text-purple-300">View all →</a>
          </div>
          <div className="divide-y divide-gray-700/50">
            {RECENT_TRANSACTIONS.slice(0, 6).map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-700/20 transition">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tx.type === 'partner' ? 'bg-purple-500/20' : 'bg-blue-500/20'
                  }`}>
                    {tx.type === 'partner' ? (
                      <Building2 className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Users className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{tx.customer}</p>
                    <p className="text-sm text-gray-500">{tx.plan}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-400">+${tx.amount}</p>
                  <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Customers */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
          <div className="p-4 border-b border-gray-700/50">
            <h2 className="font-semibold text-white">Top Customers (All Time)</h2>
          </div>
          <div className="divide-y divide-gray-700/50">
            {TOP_CUSTOMERS.map((customer, i) => (
              <div key={customer.name} className="p-4 flex items-center justify-between hover:bg-gray-700/20 transition">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="flex items-center space-x-2">
                    {customer.type === 'partner' ? (
                      <Building2 className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Users className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="font-medium text-white">{customer.name}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">${customer.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{customer.events} events</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
