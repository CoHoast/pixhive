'use client'

import { 
  TrendingUp,
  Users,
  Image,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Smartphone,
  Monitor,
  Sparkles
} from 'lucide-react'

// Mock data
const METRICS = [
  { label: 'Page Views', value: '124,847', change: '+18.2%', up: true },
  { label: 'Unique Visitors', value: '32,156', change: '+12.4%', up: true },
  { label: 'Sign-up Rate', value: '4.2%', change: '+0.8%', up: true },
  { label: 'Avg. Session', value: '3m 24s', change: '-12s', up: false },
]

const TOP_EVENTS = [
  { name: 'Thompson Wedding', host: 'Sarah Johnson', views: 8472, uploads: 847 },
  { name: 'TechCorp Summit', host: 'Perfect Day Planning', views: 6234, uploads: 1234 },
  { name: 'Annual Gala 2026', host: 'Elegant Events Co.', views: 4891, uploads: 1847 },
  { name: 'Miller-Davis Wedding', host: 'Wedding Bliss', views: 3456, uploads: 2103 },
]

const DEVICE_BREAKDOWN = [
  { device: 'Mobile', percentage: 68, icon: Smartphone },
  { device: 'Desktop', percentage: 28, icon: Monitor },
  { device: 'Tablet', percentage: 4, icon: Monitor },
]

const TOP_COUNTRIES = [
  { country: 'United States', percentage: 62 },
  { country: 'United Kingdom', percentage: 12 },
  { country: 'Canada', percentage: 8 },
  { country: 'Australia', percentage: 6 },
  { country: 'Germany', percentage: 4 },
]

const HOURLY_ACTIVITY = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  uploads: Math.floor(Math.random() * 500) + 50,
}))

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400">Platform usage and engagement metrics</p>
        </div>
        <select className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
          <option>This year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {METRICS.map((metric) => (
          <div key={metric.label} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <p className="text-sm text-gray-400 mb-1">{metric.label}</p>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
            <div className={`flex items-center text-sm mt-1 ${metric.up ? 'text-green-400' : 'text-red-400'}`}>
              {metric.up ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
        <h2 className="font-semibold text-white mb-6">Upload Activity (Last 24 Hours)</h2>
        <div className="flex items-end justify-between h-40 gap-1">
          {HOURLY_ACTIVITY.map((hour) => (
            <div key={hour.hour} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t"
                style={{ height: `${(hour.uploads / 550) * 100}%` }}
              />
              {hour.hour % 4 === 0 && (
                <span className="text-xs text-gray-500 mt-2">{hour.hour}:00</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Events */}
        <div className="lg:col-span-2 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <div className="p-4 border-b border-gray-700/50">
            <h2 className="font-semibold text-white">Top Events by Views</h2>
          </div>
          <div className="divide-y divide-gray-700/50">
            {TOP_EVENTS.map((event, i) => (
              <div key={event.name} className="p-4 flex items-center justify-between hover:bg-gray-700/20 transition">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium text-white">{event.name}</p>
                    <p className="text-sm text-gray-500">{event.host}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-8 text-sm">
                  <div className="text-right">
                    <p className="text-white font-medium">{event.views.toLocaleString()}</p>
                    <p className="text-gray-500">views</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{event.uploads.toLocaleString()}</p>
                    <p className="text-gray-500">uploads</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
          <div className="p-4 border-b border-gray-700/50">
            <h2 className="font-semibold text-white">Device Breakdown</h2>
          </div>
          <div className="p-4 space-y-4">
            {DEVICE_BREAKDOWN.map((device) => (
              <div key={device.device}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <device.icon className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-300">{device.device}</span>
                  </div>
                  <span className="text-white font-medium">{device.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
          <div className="p-4 border-b border-gray-700/50 flex items-center">
            <Globe className="w-5 h-5 text-gray-400 mr-2" />
            <h2 className="font-semibold text-white">Top Countries</h2>
          </div>
          <div className="p-4 space-y-3">
            {TOP_COUNTRIES.map((country) => (
              <div key={country.country}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300">{country.country}</span>
                  <span className="text-white font-medium">{country.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-amber-500 rounded-full"
                    style={{ width: `${country.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Usage */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
          <div className="p-4 border-b border-gray-700/50 flex items-center">
            <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
            <h2 className="font-semibold text-white">AI Feature Usage</h2>
          </div>
          <div className="p-4 space-y-4">
            {[
              { feature: 'Blur Detection', usage: 847234, percentage: 92 },
              { feature: 'Duplicate Removal', usage: 623451, percentage: 78 },
              { feature: 'Best Photo Picks', usage: 412389, percentage: 65 },
              { feature: 'Face Detection', usage: 234567, percentage: 42 },
              { feature: 'Scene Categorization', usage: 189234, percentage: 35 },
            ].map((item) => (
              <div key={item.feature}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-300">{item.feature}</span>
                  <span className="text-gray-400 text-sm">{item.usage.toLocaleString()} uses</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
