'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Camera, Check, ArrowRight } from 'lucide-react'

export default function PartnerSignupPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    fullName: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      setStep(2)
      return
    }

    setIsLoading(true)
    
    // TODO: Create partner account and redirect to Stripe checkout
    // For now, simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Redirect to Stripe checkout (will be implemented)
    window.location.href = '/partners/onboarding'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/partners" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-amber-500 rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">PixHive</span>
            <span className="text-sm text-purple-600 font-medium">Partners</span>
          </Link>
          <Link href="/partners/login" className="text-gray-600 hover:text-gray-900 font-medium">
            Already have an account?
          </Link>
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                2
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {step === 1 ? 'Create Your Partner Account' : 'Tell Us About You'}
              </h1>
              <p className="text-gray-600">
                {step === 1 
                  ? 'Start your 14-day free trial. No credit card required.'
                  : 'We\'ll use this to set up your account.'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <>
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Jane's Weddings"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This will appear on your white-labeled pages
                    </p>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Work Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@janesweddings.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      At least 8 characters
                    </p>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Jane Smith"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Your 14-Day Free Trial Includes:</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center">
                        <Check className="w-4 h-4 text-purple-600 mr-2" />
                        Unlimited events
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 text-purple-600 mr-2" />
                        Full white-label branding
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 text-purple-600 mr-2" />
                        Client management dashboard
                      </li>
                      <li className="flex items-center">
                        <Check className="w-4 h-4 text-purple-600 mr-2" />
                        AI features (usage-based pricing)
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="terms" className="text-xs text-gray-600">
                      I agree to the{' '}
                      <a href="/terms" className="text-purple-600 hover:underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  'Creating account...'
                ) : step === 1 ? (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  'Start Free Trial'
                )}
              </button>
            </form>

            {step === 1 && (
              <p className="text-center text-sm text-gray-500 mt-6">
                Already a partner?{' '}
                <Link href="/partners/login" className="text-purple-600 hover:underline">
                  Sign in
                </Link>
              </p>
            )}

            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="w-full text-center text-sm text-gray-500 mt-4 hover:text-gray-700"
              >
                ← Back
              </button>
            )}
          </div>

          {/* Trust Signals */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>🔒 Secure signup • No credit card required • Cancel anytime</p>
          </div>
        </div>
      </main>
    </div>
  )
}
