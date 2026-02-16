import { 
  Users, 
  Building2, 
  Calendar, 
  Image, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock
} from 'lucide-react'

// Mock data - replace with real Supabase queries
const STATS = [
  { 
    label: 'Total Revenue', 
    value: '$24,847', 
    change: '+12.5%', 
    up: true,
    icon: DollarSign, 
    color: 'green',
    subtext: 'This month'
  },
  { 
    label: 'Active Consumers', 
    value: '1,247', 
    change: '+8.2%', 
    up: true,
    icon: Users, 
    color: 'blue',
    subtext: 'Total users'
  },
  { 
    label: 'Active Partners', 
    value: '34', 
    change: '+3', 
    up: true,
    icon: Building2, 
    color: 'purple',
    subtext: 'White-label accounts'
  },
  { 
    label: 'Total Events', 
    value: '3,892', 
    change: '+156', 
    up: true,
    icon: Calendar, 
    color: 'amber',
    subtext: 'All time'
  },
  { 
    label: 'Photos Stored', 
    value: '2.4M', 
    change: '+89K', 
    up: true,
    icon: Image, 
    color: 'pink',
    subtext: 'Total uploads'
  },
  { 
    label: 'AI Processing', 
    value: '847K', 
    change: '+12K', 
    up: true,
    icon: Activity, 
    color: 'cyan',
    subtext: 'Photos processed'
  },
]

const RECENT_SIGNUPS = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@email.com', type: 'consumer', plan: 'Premium', date: '5 min ago' },
  { id: '2', name: 'Elegant Events Co.', email: 'info@elegant.com', type: 'partner', plan: 'Professional', date: '23 min ago' },
  { id: '3', name: 'Mike Chen', email: 'mike@email.com', type: 'consumer', plan: 'Standard', date: '1 hour ago' },
  { id: '4', name: 'Perfect Day Planning', email: 'hello@perfectday.com', type: 'partner', plan: 'Professional', date: '2 hours ago' },
  { id: '5', name: 'Jessica Williams', email: 'jess@email.com', type: 'consumer', plan: 'Basic', date: '3 hours ago' },
]

const RECENT_EVENTS = [
  { id: '1', name: 'Thompson Wedding', host: 'Sarah Johnson', photos: 847, guests: 142, status: 'active' },
  { id: '2', name: 'TechCorp Summit 2026', host: 'TechCorp Inc.', photos: 234, guests: 89, status: 'active' },
  { id: '3', name: 'Emily\'s Sweet 16', host: 'Thompson Family', photos: 528, guests: 42, status: 'completed' },
  { id: '4', name: 'Annual Charity Gala', host: 'Giving Hearts Foundation', photos: 1203, guests: 312, status: 'completed' },
]

const REVENUE_BREAKDOWN = [
  { label: 'Consumer Events', amount: 15420, percentage: 62 },
  { label: 'Partner Subscriptions', amount: 6800, percentage: 27 },
  { label: 'AI Add-ons', amount: 2627, percentage: 11 },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome back, Chris. Here's what's happening with PixHive.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${stat.color}-500/20`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <div className={`flex items-center text-xs font-medium ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.subtext}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Signups */}
        <div className="lg:col-span-2 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
            <h2 className="font-semibold text-white">Recent Signups</h2>
            <a href="/admin/consumers" className="text-sm text-purple-400 hover:text-purple-300">View all →</a>
          </div>
          <div className="divide-y divide-gray-700/50">
            {RECENT_SIGNUPS.map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-700/20 transition">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    user.type === 'partner' ? 'bg-purple-500/20' : 'bg-blue-500/20'
                  }`}>
                    {user.type === 'partner' ? (
                      <Building2 className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Users className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.type === 'partner' 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {user.plan}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{user.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
          <div className="p-4 border-b border-gray-700/50">
            <h2 className="font-semibold text-white">Revenue Breakdown</h2>
            <p className="text-sm text-gray-500">This month</p>
          </div>
          <div className="p-4 space-y-4">
            {REVENUE_BREAKDOWN.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{item.label}</span>
                  <span className="text-sm font-medium text-white">${item.amount.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-amber-500 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-700/50">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-300">Total Revenue</span>
                <span className="text-xl font-bold text-white">$24,847</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50">
        <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
          <h2 className="font-semibold text-white">Recent Events</h2>
          <a href="/admin/events" className="text-sm text-purple-400 hover:text-purple-300">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Event</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Host</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Photos</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Guests</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {RECENT_EVENTS.map((event) => (
                <tr key={event.id} className="hover:bg-gray-700/20 transition">
                  <td className="px-4 py-3">
                    <span className="font-medium text-white">{event.name}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{event.host}</td>
                  <td className="px-4 py-3 text-center text-gray-300">{event.photos.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-gray-300">{event.guests}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      event.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'View All Consumers', href: '/admin/consumers', icon: Users, color: 'blue' },
          { label: 'View All Partners', href: '/admin/partners', icon: Building2, color: 'purple' },
          { label: 'Revenue Report', href: '/admin/revenue', icon: DollarSign, color: 'green' },
          { label: 'Analytics', href: '/admin/analytics', icon: TrendingUp, color: 'amber' },
        ].map((action) => (
          <a
            key={action.label}
            href={action.href}
            className={`flex items-center justify-between p-4 rounded-xl border border-gray-700/50 bg-gray-800/50 hover:bg-gray-700/50 transition group`}
          >
            <div className="flex items-center space-x-3">
              <action.icon className={`w-5 h-5 text-${action.color}-400`} />
              <span className="font-medium text-white">{action.label}</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition" />
          </a>
        ))}
      </div>
    </div>
  )
}
