import Link from 'next/link'
import { Check, Star, Zap, Palette, Globe, BarChart3, Users, Camera, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'White-Label Photo Sharing for Wedding Professionals — PixHive Partners',
  description: 'Offer premium AI-powered photo sharing to your clients under your own brand. No development needed.',
}

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-amber-500 rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">PixHive</span>
            <span className="text-sm text-purple-600 font-medium">Partners</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/partners/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Sign In
            </Link>
            <Link
              href="/partners/signup"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-purple-50 via-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2 fill-amber-400 text-amber-400" />
              For Wedding Planners & Event Professionals
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Premium Photo Sharing,{' '}
              <span className="bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
                Your Brand
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Offer AI-powered event photo collection to your clients — fully white-labeled under your brand. 
              No development needed. Self-service setup in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/partners/signup"
                className="px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition text-lg"
              >
                Start 14-Day Free Trial
              </Link>
              <a
                href="#pricing"
                className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border border-gray-200 hover:border-gray-300 transition text-lg"
              >
                View Pricing
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-4">No credit card required • Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Add a Premium Service to Your Offerings
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stand out from competitors with AI-powered photo sharing your clients will love
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Palette className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Your Brand</h3>
              <p className="text-gray-600">
                Your logo, your colors, your domain. Clients never see PixHive branding.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Zero Development</h3>
              <p className="text-gray-600">
                Upload your logo, pick your colors, you're live. No coding, no hiring developers.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">New Revenue Stream</h3>
              <p className="text-gray-600">
                Charge clients $200-500 per event. Keep the margin. Grow your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need, Built-In
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Camera, title: 'QR Code Upload', desc: 'Guests scan and upload photos instantly. No app download.' },
              { icon: Globe, title: 'Custom Domain', desc: 'Use photos.yourbrand.com for full brand consistency.' },
              { icon: Users, title: 'Client Dashboard', desc: 'Manage all your events and clients in one place.' },
              { icon: Sparkles, title: 'AI Photo Curation', desc: 'Auto-remove blurry shots, pick best photos, create highlights.' },
              { icon: BarChart3, title: 'Analytics', desc: 'Track uploads, engagement, and guest participation.' },
              { icon: Palette, title: 'Brand Editor', desc: 'Visual editor for logo, colors, and messaging.' },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
                <feature.icon className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              One platform fee. Pay for AI features only when you use them.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Main Plan */}
            <div className="bg-white rounded-2xl border-2 border-purple-500 p-8 mb-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                PARTNER PLATFORM
              </div>
              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-gray-900 mb-2">$399<span className="text-xl text-gray-500">/month</span></div>
                <p className="text-gray-600">Unlimited events • Full white-label • Your branding</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  'Unlimited events',
                  'Your logo & colors',
                  'Custom domain support',
                  'Client management dashboard',
                  'QR codes & share links',
                  'Photo gallery & downloads',
                  'Guest registration',
                  'Priority support',
                ].map((feature, i) => (
                  <div key={i} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link
                  href="/partners/signup"
                  className="inline-flex items-center px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition text-lg"
                >
                  Start 14-Day Free Trial
                </Link>
              </div>
            </div>

            {/* AI Add-ons */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                ✨ AI Features (Per Event Add-ons)
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Core AI */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-2">Core AI</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Auto-curation, blur removal, best photo picks, highlights
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Small events (≤250 photos)</span>
                      <span className="font-semibold">$29</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Medium events (≤500 photos)</span>
                      <span className="font-semibold">$49</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Large events (≤2,000 photos)</span>
                      <span className="font-semibold">$99</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">XL events (2,000+ photos)</span>
                      <span className="font-semibold">$149</span>
                    </div>
                  </div>
                </div>
                {/* Face Detection */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-2">Face Detection (Premium)</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    "Find Yourself" selfie search, organize by person
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Small events (≤250 photos)</span>
                      <span className="font-semibold">$79</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Medium events (≤500 photos)</span>
                      <span className="font-semibold">$149</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Large events (≤2,000 photos)</span>
                      <span className="font-semibold">$349</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">XL events (2,000+ photos)</span>
                      <span className="font-semibold">$499</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-6">
                💡 Tip: Charge clients $99-499 for AI features and keep the margin!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-purple-500 to-amber-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Add Photo Sharing to Your Services?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Start your 14-day free trial. No credit card required.
          </p>
          <Link
            href="/partners/signup"
            className="inline-flex items-center px-10 py-4 bg-white text-purple-700 rounded-xl font-semibold hover:bg-gray-100 transition text-lg shadow-xl"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-amber-500 rounded-lg flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold">PixHive Partners</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </div>
          </div>
          <div className="text-center text-sm mt-8">
            © 2026 PixHive. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
