'use client'

import { useState } from 'react'
import { CreditCard, Download, Calendar, Sparkles, Zap, TrendingUp, Check, AlertCircle } from 'lucide-react'

// Mock data
const CURRENT_PLAN = {
  name: 'Professional',
  price: 399,
  status: 'active',
  nextBilling: '2026-03-15',
  aiCredits: 'Usage-based',
}

const AI_USAGE = [
  { id: '1', event: 'Sarah & Mike Wedding', type: 'Core AI', photos: 342, cost: 49, date: '2026-02-14' },
  { id: '2', event: 'Sarah & Mike Wedding', type: 'Face Detection', photos: 342, cost: 149, date: '2026-02-14' },
  { id: '3', event: 'Emily\'s Sweet 16', type: 'Core AI', photos: 528, cost: 49, date: '2026-02-08' },
]

const INVOICES = [
  { id: 'INV-2026-002', date: '2026-02-01', amount: 399, status: 'paid', description: 'Professional Plan - February 2026' },
  { id: 'INV-2026-001', date: '2026-01-01', amount: 399, status: 'paid', description: 'Professional Plan - January 2026' },
]

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const totalAiCost = AI_USAGE.reduce((sum, item) => sum + item.cost, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-600">Manage your subscription and view AI usage.</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {['overview', 'ai-usage', 'invoices'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 border-b-2 font-medium transition ${
                activeTab === tab
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'overview' ? 'Overview' : tab === 'ai-usage' ? 'AI Usage' : 'Invoices'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Plan */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Active
              </span>
            </div>

            <div className="flex items-end justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">{CURRENT_PLAN.name}</h3>
                <p className="text-gray-600">White-label platform with AI add-ons</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">${CURRENT_PLAN.price}<span className="text-lg text-gray-500">/mo</span></p>
                <p className="text-sm text-gray-500">+ AI usage</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center text-gray-600 mb-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Next Billing</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {new Date(CURRENT_PLAN.nextBilling).toLocaleDateString('en-US', { 
                    month: 'long', day: 'numeric', year: 'numeric' 
                  })}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center text-gray-600 mb-1">
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="text-sm">AI Pricing</span>
                </div>
                <p className="font-semibold text-gray-900">Usage-based</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                Manage Subscription
              </button>
              <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Update Payment Method
              </button>
            </div>
          </div>

          {/* AI Usage Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">This Month's AI Usage</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-700">Core AI</span>
                  <span className="font-semibold text-purple-900">$98</span>
                </div>
                <p className="text-xs text-purple-600">870 photos processed</p>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-amber-700">Face Detection</span>
                  <span className="font-semibold text-amber-900">$149</span>
                </div>
                <p className="text-xs text-amber-600">342 photos processed</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total AI Charges</span>
                  <span className="text-xl font-bold text-gray-900">${totalAiCost}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Usage Tab */}
      {activeTab === 'ai-usage' && (
        <div className="space-y-6">
          {/* AI Pricing Reference */}
          <div className="bg-gradient-to-br from-purple-50 to-amber-50 rounded-xl border border-purple-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
              AI Pricing by Event Size
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Small (≤250)</p>
                <p className="font-semibold">Core: $29</p>
                <p className="font-semibold">Face: $79</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Medium (≤500)</p>
                <p className="font-semibold">Core: $49</p>
                <p className="font-semibold">Face: $149</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Large (≤2,000)</p>
                <p className="font-semibold">Core: $99</p>
                <p className="font-semibold">Face: $349</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">XL (2,000+)</p>
                <p className="font-semibold">Core: $149</p>
                <p className="font-semibold">Face: $499</p>
              </div>
            </div>
          </div>

          {/* Usage Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">AI Usage History</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Event</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">AI Type</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Photos</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Cost</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {AI_USAGE.map((usage) => (
                  <tr key={usage.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{usage.event}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        usage.type === 'Core AI' 
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {usage.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">{usage.photos}</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900">${usage.cost}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(usage.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-4 font-semibold text-gray-900">Total</td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">${totalAiCost}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Invoice History</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Invoice</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {INVOICES.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{invoice.id}</td>
                  <td className="px-6 py-4 text-gray-600">{invoice.description}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-gray-900">${invoice.amount}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-purple-600 transition">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
