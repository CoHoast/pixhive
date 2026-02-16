import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Profile } from '@/lib/types/database'

export const dynamic = 'force-dynamic'

const PLAN_LIMITS = {
  free: { photos: 50, duration_days: 2, ai_features: false },
  starter: { photos: 500, duration_days: 90, ai_features: false },
  plus: { photos: 2000, duration_days: 180, ai_features: true },
  pro: { photos: Infinity, duration_days: 365, ai_features: true },
} as const

export const metadata = {
  title: 'Account — PixHive',
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data } = await supabase
    .from('profiles')
    .select('full_name, email, plan, avatar_url, created_at')
    .eq('id', user.id)
    .single()
  
  const profile = data as Pick<Profile, 'full_name' | 'email' | 'plan' | 'avatar_url' | 'created_at'> | null

  const plan = (profile?.plan || 'free') as keyof typeof PLAN_LIMITS
  const limits = PLAN_LIMITS[plan]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h1>

      <div className="space-y-6">
        {/* Profile Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-gray-900">{profile?.full_name || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Member since</label>
              <p className="text-gray-900">
                {profile?.created_at 
                  ? new Date(profile.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Current Plan */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
            <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-700 rounded-full capitalize">
              {plan}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Photos per event</p>
              <p className="text-2xl font-bold text-gray-900">
                {limits.photos === Infinity ? '∞' : limits.photos}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Event duration</p>
              <p className="text-2xl font-bold text-gray-900">{limits.duration_days} days</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">AI Features</p>
              <p className="text-2xl font-bold text-gray-900">{limits.ai_features ? '✓' : '✗'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Plan</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">{plan}</p>
            </div>
          </div>
          {plan !== 'pro' && (
            <Link
              href="/billing"
              className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
            >
              Upgrade Plan
            </Link>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
