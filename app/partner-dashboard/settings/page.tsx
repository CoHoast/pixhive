'use client'

import { useState } from 'react'
import { User, Building, Bell, Shield, Trash2, Save, Check, AlertTriangle } from 'lucide-react'

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState('account')
  
  const [settings, setSettings] = useState({
    // Account
    fullName: 'John Doe',
    email: 'john@elegantevents.com',
    
    // Company
    companyName: 'Elegant Events Co.',
    phone: '(555) 123-4567',
    website: 'https://elegantevents.com',
    
    // Notifications
    emailNotifications: true,
    newGuestUploads: true,
    weeklyReports: true,
    marketingEmails: false,
    
    // Privacy
    showPoweredBy: true,
    allowAnalytics: true,
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const sections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'company', label: 'Company', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : isSaving ? (
            'Saving...'
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition ${
                  activeSection === section.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <section.icon className={`w-5 h-5 mr-3 ${
                  activeSection === section.id ? 'text-purple-600' : 'text-gray-400'
                }`} />
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
          {/* Account Section */}
          {activeSection === 'account' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={settings.fullName}
                    onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <button className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Company Section */}
          {activeSection === 'company' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Company Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={settings.website}
                    onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'newGuestUploads', label: 'New Guest Uploads', desc: 'Get notified when guests upload photos' },
                  { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly summary of activity' },
                  { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive product updates and tips' },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings[item.key as keyof typeof settings] as boolean}
                        onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Section */}
          {activeSection === 'privacy' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Privacy Settings</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium text-gray-900">Show "Powered by PixHive"</p>
                    <p className="text-sm text-gray-500">Display PixHive branding on your event pages</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.showPoweredBy}
                      onChange={(e) => setSettings({ ...settings, showPoweredBy: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium text-gray-900">Allow Analytics</p>
                    <p className="text-sm text-gray-500">Help us improve by sharing anonymous usage data</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.allowAnalytics}
                      onChange={(e) => setSettings({ ...settings, allowAnalytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-purple-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          {activeSection === 'danger' && (
            <div>
              <h2 className="text-lg font-semibold text-red-600 mb-6">Danger Zone</h2>
              <div className="space-y-6">
                <div className="p-6 border-2 border-red-200 rounded-xl bg-red-50">
                  <h3 className="font-semibold text-red-800 mb-2">Cancel Subscription</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Cancel your subscription. You'll retain access until the end of your billing period.
                  </p>
                  <button className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-100 transition">
                    Cancel Subscription
                  </button>
                </div>

                <div className="p-6 border-2 border-red-200 rounded-xl bg-red-50">
                  <h3 className="font-semibold text-red-800 mb-2">Delete Account</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
