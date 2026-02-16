import { Camera, Users, Calendar, TrendingUp, Plus, ArrowUpRight, Clock, Image } from 'lucide-react'

// Mock data - will be replaced with real data from Supabase
const STATS = [
  { label: 'Total Clients', value: '12', change: '+2 this month', icon: Users, color: 'purple' },
  { label: 'Active Events', value: '8', change: '3 upcoming', icon: Calendar, color: 'blue' },
  { label: 'Photos Shared', value: '4,283', change: '+847 this week', icon: Image, color: 'amber' },
  { label: 'Guest Uploads', value: '1,247', change: '+156 today', icon: TrendingUp, color: 'green' },
]

const RECENT_EVENTS = [
  { id: 1, name: 'Sarah & Mike Wedding', client: 'Sarah Johnson', date: 'Feb 14, 2026', photos: 342, status: 'active' },
  { id: 2, name: 'Corporate Summit 2026', client: 'TechCorp Inc.', date: 'Feb 20, 2026', photos: 0, status: 'upcoming' },
  { id: 3, name: 'Emily\'s Sweet 16', client: 'The Thompson Family', date: 'Feb 8, 2026', photos: 528, status: 'completed' },
]

const RECENT_ACTIVITY = [
  { id: 1, action: 'New photos uploaded', event: 'Sarah & Mike Wedding', time: '5 minutes ago', count: 24 },
  { id: 2, action: 'Guest registered', event: 'Sarah & Mike Wedding', time: '12 minutes ago', guest: 'Jessica M.' },
  { id: 3, action: 'Event created', event: 'Corporate Summit 2026', time: '2 hours ago' },
  { id: 4, action: 'Client added', client: 'TechCorp Inc.', time: '2 hours ago' },
]

export default function PartnerDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your events.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Users className="w-4 h-4 mr-2" />
            Add Client
          </button>
          <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === 'purple' ? 'bg-purple-100' :
                stat.color === 'blue' ? 'bg-blue-100' :
                stat.color === 'amber' ? 'bg-amber-100' : 'bg-green-100'
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === 'purple' ? 'text-purple-600' :
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'amber' ? 'text-amber-600' : 'text-green-600'
                }`} />
              </div>
              <ArrowUpRight className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-gray-600">{stat.label}</p>
              <p className="text-sm text-green-600">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
            <a href="/partner-dashboard/events" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View all →
            </a>
          </div>
          <div className="divide-y divide-gray-100">
            {RECENT_EVENTS.map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{event.name}</h3>
                    <p className="text-sm text-gray-600">{event.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{event.date}</p>
                    <p className="text-sm font-medium text-gray-900">{event.photos} photos</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'active' ? 'bg-green-100 text-green-700' :
                    event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    {activity.action.includes('photo') ? (
                      <Image className="w-4 h-4 text-purple-600" />
                    ) : activity.action.includes('Guest') ? (
                      <Users className="w-4 h-4 text-purple-600" />
                    ) : activity.action.includes('Event') ? (
                      <Calendar className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Plus className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">
                      {activity.event || activity.client}
                      {activity.count && ` (+${activity.count})`}
                      {activity.guest && ` - ${activity.guest}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Ready to create your next event?</h2>
            <p className="text-purple-200">
              Set up a new event in minutes and share with your clients.
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </button>
        </div>
      </div>
    </div>
  )
}
