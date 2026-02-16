'use client'

import { useState } from 'react'
import { Camera, Upload, Check, Eye, Palette, Type, Globe, Save } from 'lucide-react'

export default function BrandingPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [branding, setBranding] = useState({
    logoUrl: '',
    logoDarkUrl: '',
    primaryColor: '#7c3aed',
    secondaryColor: '#f59e0b',
    accentColor: '#10b981',
    fontFamily: 'Inter',
    customDomain: '',
    domainVerified: false,
  })

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Save to Supabase
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const FONTS = [
    { value: 'Inter', label: 'Inter (Modern)' },
    { value: 'Playfair Display', label: 'Playfair Display (Elegant)' },
    { value: 'Montserrat', label: 'Montserrat (Clean)' },
    { value: 'Lora', label: 'Lora (Classic)' },
    { value: 'Poppins', label: 'Poppins (Friendly)' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branding</h1>
          <p className="text-gray-600">Customize how your events look to clients and guests.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </button>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Logo Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Logo</h2>
                <p className="text-sm text-gray-600">Upload your company logo</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Light Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Light Background
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition cursor-pointer bg-white">
                  {branding.logoUrl ? (
                    <img src={branding.logoUrl} alt="Logo" className="h-12 mx-auto" />
                  ) : (
                    <>
                      <Camera className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600">Click to upload</p>
                      <p className="text-xs text-gray-400 mt-1">PNG or SVG, max 2MB</p>
                    </>
                  )}
                </div>
              </div>

              {/* Dark Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Dark Background
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-purple-400 transition cursor-pointer bg-gray-900">
                  {branding.logoDarkUrl ? (
                    <img src={branding.logoDarkUrl} alt="Logo Dark" className="h-12 mx-auto" />
                  ) : (
                    <>
                      <Camera className="w-10 h-10 mx-auto text-gray-500 mb-3" />
                      <p className="text-sm text-gray-400">Click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">PNG or SVG, max 2MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Colors Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Colors</h2>
                <p className="text-sm text-gray-600">Choose your brand colors</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <p className="text-xs text-gray-500 mb-3">Headers, buttons, links</p>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    className="w-14 h-14 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <p className="text-xs text-gray-500 mb-3">Accents, CTAs</p>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={branding.secondaryColor}
                    onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                    className="w-14 h-14 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.secondaryColor}
                    onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accent Color
                </label>
                <p className="text-xs text-gray-500 mb-3">Success states, highlights</p>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={branding.accentColor}
                    onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                    className="w-14 h-14 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.accentColor}
                    onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Type className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Typography</h2>
                <p className="text-sm text-gray-600">Choose your brand font</p>
              </div>
            </div>

            <div className="space-y-3">
              {FONTS.map((font) => (
                <label
                  key={font.value}
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${
                    branding.fontFamily === font.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="font"
                    value={font.value}
                    checked={branding.fontFamily === font.value}
                    onChange={(e) => setBranding({ ...branding, fontFamily: e.target.value })}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span 
                    className="ml-3 text-lg text-gray-900"
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Domain Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Custom Domain</h2>
                <p className="text-sm text-gray-600">Use your own domain for event pages</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain
                </label>
                <input
                  type="text"
                  value={branding.customDomain}
                  onChange={(e) => setBranding({ ...branding, customDomain: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="photos.yourdomain.com"
                />
              </div>

              {branding.customDomain && !branding.domainVerified && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-amber-800 mb-2">DNS Configuration Required</p>
                  <p className="text-sm text-amber-700 mb-3">
                    Add this CNAME record to your domain's DNS settings:
                  </p>
                  <div className="bg-white rounded-lg p-3 font-mono text-sm">
                    <p><span className="text-gray-500">Type:</span> CNAME</p>
                    <p><span className="text-gray-500">Name:</span> {branding.customDomain.split('.')[0]}</p>
                    <p><span className="text-gray-500">Value:</span> cname.pixhive.co</p>
                  </div>
                  <button className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition">
                    Verify Domain
                  </button>
                </div>
              )}

              {branding.domainVerified && (
                <div className="flex items-center text-green-600">
                  <Check className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Domain verified and active</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
            
            {/* Preview Card */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {/* Header Preview */}
              <div 
                className="h-14 flex items-center px-4"
                style={{ backgroundColor: branding.primaryColor }}
              >
                {branding.logoUrl ? (
                  <img src={branding.logoUrl} alt="Logo" className="h-8" />
                ) : (
                  <span 
                    className="text-white font-bold"
                    style={{ fontFamily: branding.fontFamily }}
                  >
                    Your Brand
                  </span>
                )}
              </div>
              
              {/* Content Preview */}
              <div className="p-4 bg-gray-50">
                <h4 
                  className="font-bold text-gray-900 mb-2"
                  style={{ fontFamily: branding.fontFamily }}
                >
                  Sarah & Mike's Wedding
                </h4>
                <p className="text-sm text-gray-600 mb-4">February 14, 2026</p>
                <button 
                  className="w-full py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: branding.secondaryColor }}
                >
                  Upload Photos
                </button>
              </div>

              {/* Footer Preview */}
              <div className="p-3 bg-gray-100 text-center">
                <p className="text-xs text-gray-500">
                  Powered by{' '}
                  <span style={{ color: branding.accentColor }}>PixHive</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              This is how guests will see your event pages
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
