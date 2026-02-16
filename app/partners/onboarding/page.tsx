'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Check, ArrowRight, ArrowLeft, Palette, Globe, Upload, Sparkles } from 'lucide-react'

const STEPS = [
  { id: 1, title: 'Your Brand', icon: Palette },
  { id: 2, title: 'Logo & Colors', icon: Upload },
  { id: 3, title: 'Custom Domain', icon: Globe },
  { id: 4, title: 'All Set!', icon: Sparkles },
]

export default function PartnerOnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Step 1: Brand basics
    companyName: '',
    phone: '',
    website: '',
    
    // Step 2: Logo & Colors
    logoUrl: '',
    primaryColor: '#7c3aed',
    secondaryColor: '#f59e0b',
    
    // Step 3: Domain (optional)
    customDomain: '',
    useSubdomain: true,
  })

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final step - complete onboarding
      setIsLoading(true)
      // TODO: Save all data and mark onboarding complete
      await new Promise(resolve => setTimeout(resolve, 1500))
      router.push('/partner-dashboard')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-amber-500 rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">PixHive</span>
            <span className="text-sm text-purple-600 font-medium">Setup</span>
          </div>
        </div>
      </header>

      <main className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${currentStep > step.id ? 'bg-green-500 text-white' : 
                      currentStep === step.id ? 'bg-purple-600 text-white' : 
                      'bg-gray-200 text-gray-500'}
                  `}>
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`w-16 sm:w-24 h-1 mx-2 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {STEPS.map(step => (
                <span key={step.id} className={`text-xs sm:text-sm ${
                  currentStep === step.id ? 'text-purple-600 font-medium' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {/* Step 1: Brand Basics */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your business</h2>
                <p className="text-gray-600 mb-8">This information will appear on your branded event pages.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Elegant Events Co."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://elegantevents.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Logo & Colors */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize your brand</h2>
                <p className="text-gray-600 mb-8">Upload your logo and choose your brand colors.</p>
                
                <div className="space-y-8">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Company Logo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Drag and drop your logo here</p>
                      <p className="text-sm text-gray-500">PNG, SVG, or JPG (recommended: 200x60px)</p>
                      <button className="mt-4 px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition">
                        Browse Files
                      </button>
                    </div>
                  </div>
                  
                  {/* Color Pickers */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={formData.primaryColor}
                          onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                          className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.primaryColor}
                          onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={formData.secondaryColor}
                          onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                          className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.secondaryColor}
                          onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Preview
                    </label>
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <div 
                        className="h-16 flex items-center px-6"
                        style={{ backgroundColor: formData.primaryColor }}
                      >
                        <span className="text-white font-bold">
                          {formData.companyName || 'Your Company'}
                        </span>
                      </div>
                      <div className="p-6 bg-gray-50">
                        <button 
                          className="px-6 py-2 rounded-lg text-white font-medium"
                          style={{ backgroundColor: formData.secondaryColor }}
                        >
                          Upload Photos
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Custom Domain */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Set up your domain</h2>
                <p className="text-gray-600 mb-8">Choose how clients will access your photo sharing platform.</p>
                
                <div className="space-y-6">
                  {/* Subdomain Option */}
                  <label className={`block p-6 border-2 rounded-xl cursor-pointer transition ${
                    formData.useSubdomain ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-start">
                      <input
                        type="radio"
                        checked={formData.useSubdomain}
                        onChange={() => setFormData({ ...formData, useSubdomain: true })}
                        className="w-5 h-5 text-purple-600 mt-0.5"
                      />
                      <div className="ml-4">
                        <p className="font-semibold text-gray-900">Use PixHive subdomain</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Your clients will access photos at:
                        </p>
                        <p className="text-purple-600 font-mono mt-2">
                          {formData.companyName.toLowerCase().replace(/\s+/g, '-') || 'your-company'}.pixhive.co
                        </p>
                      </div>
                    </div>
                  </label>
                  
                  {/* Custom Domain Option */}
                  <label className={`block p-6 border-2 rounded-xl cursor-pointer transition ${
                    !formData.useSubdomain ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-start">
                      <input
                        type="radio"
                        checked={!formData.useSubdomain}
                        onChange={() => setFormData({ ...formData, useSubdomain: false })}
                        className="w-5 h-5 text-purple-600 mt-0.5"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-semibold text-gray-900">Use custom domain</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Use your own domain (e.g., photos.yourdomain.com)
                        </p>
                        
                        {!formData.useSubdomain && (
                          <div className="mt-4">
                            <input
                              type="text"
                              value={formData.customDomain}
                              onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="photos.yourdomain.com"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              You'll need to add a CNAME record pointing to pixhive.co
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 4: Complete */}
            {currentStep === 4 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Your partner account is ready. Start creating events for your clients and offer them a premium photo sharing experience.
                </p>
                
                <div className="bg-gray-50 rounded-xl p-6 text-left max-w-md mx-auto mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">What's next:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-purple-600 text-sm font-medium">1</span>
                      </div>
                      <span className="text-gray-600">Add your first client</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-purple-600 text-sm font-medium">2</span>
                      </div>
                      <span className="text-gray-600">Create an event with your branding</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-purple-600 text-sm font-medium">3</span>
                      </div>
                      <span className="text-gray-600">Share the QR code with guests</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
              ) : (
                <div />
              )}
              
              <button
                onClick={handleNext}
                disabled={isLoading || (currentStep === 1 && !formData.companyName)}
                className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === 4 ? (
                  isLoading ? 'Setting up...' : 'Go to Dashboard'
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
