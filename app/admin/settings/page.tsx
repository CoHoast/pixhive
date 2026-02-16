'use client'

import { useState } from 'react'
import { 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  Database, 
  Key, 
  Save, 
  Check,
  AlertTriangle,
  Mail,
  Globe,
  Zap
} from 'lucide-react'

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'database', label: 'Database', icon: Database },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Configure platform settings and integrations</p>
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
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <section.icon className={`w-5 h-5 mr-3 ${
                  activeSection === section.id ? 'text-purple-400' : 'text-gray-500'
                }`} />
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-800/50 rounded-xl border border-gray-700/50 p-6">
          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white mb-6">General Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Platform Name
                </label>
                <input
                  type="text"
                  defaultValue="PixHive"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Support Email
                </label>
                <input
                  type="email"
                  defaultValue="support@pixhive.co"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default Event Duration
                </label>
                <select className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500">
                  <option>7 days</option>
                  <option>30 days</option>
                  <option>90 days</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <p className="font-medium text-white">Maintenance Mode</p>
                  <p className="text-sm text-gray-500">Disable access for non-admins</p>
                </div>
                <button className="w-12 h-6 bg-gray-700 rounded-full relative">
                  <div className="w-5 h-5 bg-gray-400 rounded-full absolute left-0.5 top-0.5"></div>
                </button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white mb-6">Security Settings</h2>
              
              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <p className="font-medium text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                </div>
                <button className="w-12 h-6 bg-purple-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <p className="font-medium text-white">Force HTTPS</p>
                  <p className="text-sm text-gray-500">Redirect all traffic to HTTPS</p>
                </div>
                <button className="w-12 h-6 bg-purple-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  defaultValue="60"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-400">Danger Zone</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Changing security settings may affect user access. Proceed with caution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white mb-6">Notification Settings</h2>
              
              {[
                { label: 'New Signups', desc: 'Get notified when new users sign up' },
                { label: 'New Partner Signups', desc: 'Get notified when partners join' },
                { label: 'Failed Payments', desc: 'Alert on payment failures' },
                { label: 'High Usage Alerts', desc: 'Alert when AI usage spikes' },
                { label: 'Weekly Reports', desc: 'Receive weekly summary emails' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <button className="w-12 h-6 bg-purple-500 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* API Keys */}
          {activeSection === 'api' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white mb-6">API Keys & Integrations</h2>
              
              {[
                { name: 'Stripe', icon: CreditCard, status: 'connected', key: 'sk_live_...4K0r' },
                { name: 'Supabase', icon: Database, status: 'connected', key: 'eyJhbGc...Tz0a' },
                { name: 'Replicate', icon: Zap, status: 'connected', key: 'r8_abc...xyz' },
                { name: 'Resend', icon: Mail, status: 'not_configured', key: null },
              ].map((service) => (
                <div key={service.name} className="p-4 bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <service.icon className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="font-medium text-white">{service.name}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      service.status === 'connected' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {service.status === 'connected' ? 'Connected' : 'Not Configured'}
                    </span>
                  </div>
                  {service.key ? (
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 px-3 py-2 bg-gray-800 rounded text-sm text-gray-400 font-mono">
                        {service.key}
                      </code>
                      <button className="px-3 py-2 text-purple-400 hover:text-purple-300 text-sm">
                        Update
                      </button>
                    </div>
                  ) : (
                    <button className="px-3 py-2 text-purple-400 hover:text-purple-300 text-sm">
                      + Add API Key
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Billing Settings */}
          {activeSection === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white mb-6">Billing Configuration</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Currency
                </label>
                <select className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500">
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  defaultValue="0"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                <div>
                  <p className="font-medium text-white">Automatic Invoicing</p>
                  <p className="text-sm text-gray-500">Send invoices automatically</p>
                </div>
                <button className="w-12 h-6 bg-purple-500 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
            </div>
          )}

          {/* Database Settings */}
          {activeSection === 'database' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white mb-6">Database & Storage</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Database Size</p>
                  <p className="text-2xl font-bold text-white">2.4 GB</p>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Storage Used</p>
                  <p className="text-2xl font-bold text-white">847 GB</p>
                </div>
              </div>

              <div className="p-4 bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300">Storage Usage</span>
                  <span className="text-white font-medium">847 GB / 1 TB</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '84.7%' }} />
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                  Backup Database
                </button>
                <button className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                  Clear Cache
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
