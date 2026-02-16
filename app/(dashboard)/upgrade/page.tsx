'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles, Users, Zap, ArrowLeft, Star } from 'lucide-react'

const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic',
    price: 39,
    photos: 200,
    duration: '7 days',
    coreAi: 49,
    faceAi: 99,
    features: [
      '200 photo uploads',
      'QR code sharing',
      'Mobile gallery',
      'Download all photos',
      '7-day access',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 79,
    photos: 500,
    duration: '30 days',
    coreAi: 99,
    faceAi: 199,
    popular: true,
    features: [
      '500 photo uploads',
      'QR code sharing',
      'Mobile gallery',
      'Download all photos',
      '30-day access',
      'Guest favorites',
      'Social sharing',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 149,
    photos: 2000,
    duration: '90 days',
    coreAi: 149,
    faceAi: 499,
    features: [
      '2,000 photo uploads',
      'QR code sharing',
      'Mobile gallery',
      'Download all photos',
      '90-day access',
      'Guest favorites',
      'Social sharing',
      'Priority support',
      'Content moderation',
    ],
  },
]

export default function UpgradePage() {
  const [selectedPackage, setSelectedPackage] = useState<string>('standard')
  const [addons, setAddons] = useState({ coreAi: false, faceAi: false })

  const selected = PACKAGES.find(p => p.id === selectedPackage)!
  
  const calculateTotal = () => {
    let total = selected.price
    if (addons.coreAi) total += selected.coreAi
    if (addons.faceAi) total += selected.faceAi
    return total
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Upgrade Your Plan</h1>
        <p className="text-xl text-gray-600">Choose the perfect plan for your event</p>
      </div>

      {/* Package Selection */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => setSelectedPackage(pkg.id)}
            className={`relative bg-white rounded-2xl p-6 cursor-pointer transition ${
              selectedPackage === pkg.id
                ? 'border-2 border-purple-500 shadow-lg'
                : 'border-2 border-gray-200 hover:border-gray-300'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                MOST POPULAR
              </div>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedPackage === pkg.id ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
              }`}>
                {selectedPackage === pkg.id && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
            
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
              <span className="text-gray-500 ml-1">one-time</span>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              {pkg.photos.toLocaleString()} photos • {pkg.duration}
            </p>
            
            <ul className="space-y-2">
              {pkg.features.slice(0, 5).map((feature, i) => (
                <li key={i} className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
              {pkg.features.length > 5 && (
                <li className="text-sm text-purple-600">+{pkg.features.length - 5} more</li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* AI Add-ons */}
      <div className="bg-gradient-to-br from-purple-50 to-amber-50 rounded-2xl p-8 mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">AI Add-ons</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Supercharge with AI</h2>
          <p className="text-gray-600">Add intelligent features to your event</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Core AI */}
          <div
            onClick={() => setAddons({ ...addons, coreAi: !addons.coreAi })}
            className={`p-6 rounded-xl cursor-pointer transition ${
              addons.coreAi
                ? 'bg-purple-100 border-2 border-purple-500'
                : 'bg-white border-2 border-gray-200 hover:border-purple-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  addons.coreAi ? 'bg-purple-500' : 'bg-purple-100'
                }`}>
                  <Zap className={`w-5 h-5 ${addons.coreAi ? 'text-white' : 'text-purple-600'}`} />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">Core AI</h3>
                  <p className="text-sm text-gray-500">Smart organization</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                addons.coreAi ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
              }`}>
                {addons.coreAi && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li>• Auto-remove blurry photos</li>
              <li>• Remove duplicates</li>
              <li>• AI "Best Photos" picks</li>
              <li>• Auto-categorize by scene</li>
            </ul>
            <div className="pt-4 border-t border-gray-200">
              <span className="text-2xl font-bold text-gray-900">+${selected.coreAi}</span>
            </div>
          </div>

          {/* Face Detection */}
          <div
            onClick={() => setAddons({ ...addons, faceAi: !addons.faceAi })}
            className={`p-6 rounded-xl cursor-pointer transition ${
              addons.faceAi
                ? 'bg-amber-100 border-2 border-amber-500'
                : 'bg-white border-2 border-gray-200 hover:border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  addons.faceAi ? 'bg-amber-500' : 'bg-amber-100'
                }`}>
                  <Users className={`w-5 h-5 ${addons.faceAi ? 'text-white' : 'text-amber-600'}`} />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">Face Detection</h3>
                  <p className="text-sm text-gray-500">Find yourself instantly</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                addons.faceAi ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
              }`}>
                {addons.faceAi && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 mb-4">
              <li>• "Find Yourself" selfie search</li>
              <li>• Auto-group photos by person</li>
              <li>• Name detected people</li>
              <li>• Face-based galleries</li>
            </ul>
            <div className="pt-4 border-t border-gray-200">
              <span className="text-2xl font-bold text-gray-900">+${selected.faceAi}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">{selected.name} Package</span>
            <span className="font-medium text-gray-900">${selected.price}</span>
          </div>
          {addons.coreAi && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Core AI Add-on</span>
              <span className="font-medium text-gray-900">+${selected.coreAi}</span>
            </div>
          )}
          {addons.faceAi && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Face Detection Add-on</span>
              <span className="font-medium text-gray-900">+${selected.faceAi}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-purple-600">${calculateTotal()}</span>
          </div>
        </div>

        <button className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition flex items-center justify-center">
          <Star className="w-5 h-5 mr-2" />
          Upgrade Now
        </button>
        
        <p className="text-center text-xs text-gray-500 mt-4">
          Secure payment powered by Stripe
        </p>
      </div>
    </div>
  )
}
