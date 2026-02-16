'use client'

import { useState } from 'react'
import { Check, Sparkles, Users, Zap } from 'lucide-react'

// Pricing configuration
const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for small gatherings',
    basePrice: 39,
    photos: 200,
    duration: '7 days',
    coreAiPrice: 49,
    faceDetectionPrice: 99,
    features: [
      '200 photo uploads',
      'QR code sharing',
      'Mobile-friendly gallery',
      'Download all photos',
      '7-day access',
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Great for weddings & parties',
    basePrice: 79,
    photos: 500,
    duration: '30 days',
    coreAiPrice: 99,
    faceDetectionPrice: 199,
    popular: true,
    features: [
      '500 photo uploads',
      'QR code sharing',
      'Mobile-friendly gallery',
      'Download all photos',
      '30-day access',
      'Guest favorites',
      'Social sharing',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For large events & conferences',
    basePrice: 149,
    photos: 2000,
    duration: '90 days',
    coreAiPrice: 149,
    faceDetectionPrice: 499,
    features: [
      '2,000 photo uploads',
      'QR code sharing',
      'Mobile-friendly gallery',
      'Download all photos',
      '90-day access',
      'Guest favorites',
      'Social sharing',
      'Priority support',
      'Custom branding',
    ],
  },
]

const AI_FEATURES = {
  core: {
    name: 'Core AI',
    icon: Zap,
    color: 'purple',
    features: [
      'Auto-remove blurry photos',
      'Remove duplicates',
      'AI "Best Photos" picks',
      'Auto-categorize by scene',
      'Smart color enhancement',
    ],
  },
  faceDetection: {
    name: 'Face Detection',
    icon: Users,
    color: 'amber',
    features: [
      '"Find Yourself" selfie search',
      'Auto-group by person',
      'Name detected people',
      'Face-based galleries',
    ],
  },
}

interface PricingCardsProps {
  onSelect?: (packageId: string, addons: { coreAi: boolean; faceDetection: boolean }) => void
}

export function PricingCards({ onSelect }: PricingCardsProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [addons, setAddons] = useState({ coreAi: false, faceDetection: false })

  const calculateTotal = (pkg: typeof PACKAGES[0]) => {
    let total = pkg.basePrice
    if (addons.coreAi) total += pkg.coreAiPrice
    if (addons.faceDetection) total += pkg.faceDetectionPrice
    return total
  }

  const handleSelect = (pkgId: string) => {
    setSelectedPackage(pkgId)
    onSelect?.(pkgId, addons)
  }

  return (
    <div className="space-y-12">
      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white rounded-2xl border-2 p-8 transition ${
              pkg.popular
                ? 'border-purple-500 shadow-xl shadow-purple-100'
                : selectedPackage === pkg.id
                ? 'border-purple-300'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="px-4 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
              <p className="text-gray-600 text-sm">{pkg.description}</p>
            </div>

            <div className="text-center mb-6">
              <div className="flex items-end justify-center">
                <span className="text-4xl font-bold text-gray-900">${pkg.basePrice}</span>
                <span className="text-gray-500 ml-1 mb-1">one-time</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {pkg.photos.toLocaleString()} photos • {pkg.duration}
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {pkg.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelect(pkg.id)}
              className={`w-full py-3 rounded-xl font-semibold transition ${
                pkg.popular
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              Select {pkg.name}
            </button>
          </div>
        ))}
      </div>

      {/* AI Add-ons Section */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-amber-50 rounded-2xl p-8 border border-purple-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Features
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Supercharge your event with AI
          </h2>
          <p className="text-gray-600">
            Add intelligent photo organization and face recognition
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Core AI */}
          <div
            onClick={() => setAddons({ ...addons, coreAi: !addons.coreAi })}
            className={`p-6 rounded-xl border-2 cursor-pointer transition ${
              addons.coreAi
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 bg-white hover:border-purple-200'
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

            <ul className="space-y-2 mb-4">
              {AI_FEATURES.core.features.map((f, i) => (
                <li key={i} className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-purple-500 mr-2" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">Starting at</p>
              <p className="text-2xl font-bold text-gray-900">+$49</p>
              <p className="text-xs text-gray-500">Price scales with package</p>
            </div>
          </div>

          {/* Face Detection */}
          <div
            onClick={() => setAddons({ ...addons, faceDetection: !addons.faceDetection })}
            className={`p-6 rounded-xl border-2 cursor-pointer transition ${
              addons.faceDetection
                ? 'border-amber-500 bg-amber-50'
                : 'border-gray-200 bg-white hover:border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  addons.faceDetection ? 'bg-amber-500' : 'bg-amber-100'
                }`}>
                  <Users className={`w-5 h-5 ${addons.faceDetection ? 'text-white' : 'text-amber-600'}`} />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">Face Detection</h3>
                  <p className="text-sm text-gray-500">Find yourself instantly</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                addons.faceDetection ? 'border-amber-500 bg-amber-500' : 'border-gray-300'
              }`}>
                {addons.faceDetection && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>

            <ul className="space-y-2 mb-4">
              {AI_FEATURES.faceDetection.features.map((f, i) => (
                <li key={i} className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-amber-500 mr-2" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">Starting at</p>
              <p className="text-2xl font-bold text-gray-900">+$99</p>
              <p className="text-xs text-gray-500">Price scales with package</p>
            </div>
          </div>
        </div>

        {/* Dynamic Pricing Table */}
        {(addons.coreAi || addons.faceDetection) && (
          <div className="mt-8 bg-white rounded-xl p-6 max-w-2xl mx-auto">
            <h4 className="font-semibold text-gray-900 mb-4 text-center">
              Your AI Add-on Pricing
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              {PACKAGES.map((pkg) => (
                <div key={pkg.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">{pkg.name}</p>
                  <div className="space-y-1 text-sm">
                    {addons.coreAi && (
                      <p className="text-purple-600">Core AI: +${pkg.coreAiPrice}</p>
                    )}
                    {addons.faceDetection && (
                      <p className="text-amber-600">Face: +${pkg.faceDetectionPrice}</p>
                    )}
                    <p className="font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                      Total: ${calculateTotal(pkg)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PricingCards
