import { Suspense } from 'react'
import Link from 'next/link'
import { getMyEvents } from '@/lib/actions/events'
import { createClient } from '@/lib/supabase/server'
import { formatDistanceToNow } from 'date-fns'
import { 
  Plus, 
  Image, 
  Users, 
  Calendar, 
  Sparkles, 
  Zap, 
  ArrowUpRight,
  Camera,
  Star,
  Clock,
  Download,
  Settings
} from 'lucide-react'

export const metadata = {
  title: 'Dashboard — PixHive',
}

async function EventsList() {
  const { events, error } = await getMyEvents()

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-amber-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Camera className="w-10 h-10 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
        <p className="text-gray-600 mb-6">Create your first event to start collecting photos</p>
        <Link
          href="/events/new"
          className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Event
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event: any) => (
        <Link
          key={event.id}
          href={`/events/${event.id}`}
          className="bg-white rounded-xl border border-gray-200 p-5 hover:border-purple-300 hover:shadow-lg transition group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-amber-100 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center space-x-2">
              {event.ai_features?.core && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  AI
                </span>
              )}
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                event.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {event.status}
              </span>
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition">
            {event.name}
          </h3>
          
          {event.event_date && (
            <p className="text-sm text-gray-500 mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(event.event_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Image className="w-4 h-4 mr-1" />
              {event.photo_count} photos
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {event.guest_count} guests
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Created {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
            </p>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition" />
          </div>
        </Link>
      ))}
    </div>
  )
}

async function DashboardStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileData as any

  const { data: eventsData } = await supabase
    .from('events')
    .select('photo_count, guest_count, ai_features')
    .eq('user_id', user.id)
    .neq('status', 'deleted')

  const events = (eventsData || []) as any[]

  const totalPhotos = events.reduce((sum, e) => sum + (e.photo_count || 0), 0)
  const totalGuests = events.reduce((sum, e) => sum + (e.guest_count || 0), 0)
  const totalEvents = events.length
  const aiEvents = events.filter(e => e.ai_features?.core || e.ai_features?.face_detection).length

  const planColors: Record<string, string> = {
    free: 'text-gray-600',
    basic: 'text-green-600',
    standard: 'text-blue-600',
    premium: 'text-purple-600',
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Image className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalPhotos.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Photos</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalGuests.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Guests</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
          <p className="text-sm text-gray-500">Events Created</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{aiEvents}</p>
          <p className="text-sm text-gray-500">AI-Enhanced Events</p>
        </div>
      </div>

      {/* Plan Status Card */}
      <div className="bg-gradient-to-br from-purple-50 to-amber-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-600">Current Plan</span>
            </div>
            <h3 className={`text-2xl font-bold capitalize ${planColors[profile?.plan] || 'text-gray-900'}`}>
              {profile?.plan || 'Free'}
            </h3>
            {profile?.plan === 'free' && (
              <p className="text-sm text-gray-500 mt-1">Upgrade to unlock AI features and more photos</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/account"
              className="flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:border-purple-300 transition"
            >
              <Settings className="w-4 h-4 mr-2" />
              Manage
            </Link>
            {(profile?.plan === 'free' || profile?.plan === 'basic') && (
              <Link
                href="/upgrade"
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                <Zap className="w-4 h-4 mr-2" />
                Upgrade
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <Link
        href="/events/new"
        className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition group"
      >
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-purple-200 transition">
          <Plus className="w-6 h-6 text-purple-600" />
        </div>
        <span className="text-sm font-medium text-gray-900">New Event</span>
      </Link>
      <Link
        href="/account"
        className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition group"
      >
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-200 transition">
          <Settings className="w-6 h-6 text-blue-600" />
        </div>
        <span className="text-sm font-medium text-gray-900">Settings</span>
      </Link>
      <Link
        href="/upgrade"
        className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition group"
      >
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-amber-200 transition">
          <Sparkles className="w-6 h-6 text-amber-600" />
        </div>
        <span className="text-sm font-medium text-gray-900">AI Features</span>
      </Link>
      <a
        href="#"
        className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition group"
      >
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-200 transition">
          <Download className="w-6 h-6 text-green-600" />
        </div>
        <span className="text-sm font-medium text-gray-900">Export Data</span>
      </a>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your events and photos</p>
        </div>
        <Link
          href="/events/new"
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Event
        </Link>
      </div>

      <Suspense fallback={<div className="animate-pulse bg-gray-100 rounded-xl h-48 mb-8" />}>
        <DashboardStats />
      </Suspense>

      <QuickActions />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Events</h2>
        <div className="flex items-center space-x-2">
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500">
            <option>All Events</option>
            <option>Active</option>
            <option>Completed</option>
          </select>
        </div>
      </div>
      
      <Suspense fallback={
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-48" />
          ))}
        </div>
      }>
        <EventsList />
      </Suspense>

      {/* AI Features Promo */}
      <div className="mt-12 bg-gradient-to-br from-purple-600 to-amber-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium text-white/80">AI-Powered Features</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Let AI organize your photos</h3>
            <p className="text-white/80 max-w-md">
              Automatically remove blurry shots, find duplicates, detect faces, and pick the best photos.
            </p>
          </div>
          <Link
            href="/upgrade"
            className="flex items-center px-6 py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            <Zap className="w-5 h-5 mr-2" />
            Explore AI Features
          </Link>
        </div>
      </div>
    </div>
  )
}
