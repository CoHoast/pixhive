import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  QrCode, 
  Sparkles, 
  Users, 
  Star, 
  Check,
  ArrowRight,
  Zap,
  Download,
  Shield,
  Share2,
  Heart,
  Mail,
  Building2,
  ChevronDown,
  Play,
  Image,
  Smartphone,
  Globe,
  Clock,
  Lock,
  Palette,
  BarChart3
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2 fill-amber-400 text-amber-400" />
                Trusted by 10,000+ events
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Collect Every Photo From Your{' '}
                <span className="bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
                  Special Event
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                One QR code. Zero app downloads. Guests scan, upload, and you get every magical moment — organized by AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 rounded-full px-8 py-6 text-lg">
                  <Link href="/signup">
                    Create Your Event — Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg">
                  <a href="#how-it-works">
                    <Play className="w-5 h-5 mr-2" />
                    See How It Works
                  </a>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  No app required
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  Works on any phone
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  AI-powered organization
                </div>
              </div>
            </div>

            {/* Hero Image/Demo */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 to-amber-100 rounded-3xl p-8">
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-amber-500 rounded-xl flex items-center justify-center">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Sarah & Mike's Wedding</p>
                      <p className="text-sm text-gray-500">June 15, 2026</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-purple-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-purple-600">847</p>
                      <p className="text-xs text-gray-500">photos</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-amber-600">142</p>
                      <p className="text-xs text-gray-500">guests</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-green-600">23</p>
                      <p className="text-xs text-gray-500">people found</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-purple-600 bg-purple-50 rounded-lg py-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI organized by person & moment</span>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg px-4 py-2 flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-medium">Auto-removes blurry</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-2 flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium">"Find Yourself" selfie search</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 mb-8">Perfect for every occasion</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Weddings', 'Corporate Events', 'Birthday Parties', 'Conferences', 'Graduations', 'Baby Showers', 'Reunions', 'Galas'].map((useCase) => (
              <span key={useCase} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 font-medium">
                {useCase}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to collect every photo from your event
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <QrCode className="w-10 h-10 text-white" />
              </div>
              <div className="text-sm font-bold text-purple-600 mb-2">STEP 1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Create & Share</h3>
              <p className="text-gray-600">
                Set up your event in 60 seconds. Get a unique QR code and shareable link. Print it, display it, or text it to guests.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <div className="text-sm font-bold text-amber-600 mb-2">STEP 2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Guests Upload</h3>
              <p className="text-gray-600">
                Guests scan the QR code and upload photos instantly from their phone. No app download. No sign-up friction.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <div className="text-sm font-bold text-green-600 mb-2">STEP 3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Organizes</h3>
              <p className="text-gray-600">
                Our AI removes blurry shots, finds duplicates, groups by person, and picks the best photos automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Everything You Need
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Every Event
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From simple photo collection to AI-powered organization
            </p>
          </div>

          {/* Core Features */}
          <div className="mb-16">
            <h3 className="text-lg font-semibold text-gray-500 mb-6 text-center">Core Features</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: QrCode, title: 'QR Code Sharing', desc: 'Unique QR code for each event. Print, display, or share digitally.' },
                { icon: Smartphone, title: 'No App Required', desc: 'Works in any mobile browser. Zero friction for guests.' },
                { icon: Image, title: 'Unlimited Viewing', desc: 'Beautiful gallery view. Browse, favorite, and relive moments.' },
                { icon: Download, title: 'Bulk Download', desc: 'Download all photos as a ZIP. Your memories, forever.' },
                { icon: Share2, title: 'Social Sharing', desc: 'Share to Instagram, Facebook, WhatsApp with one tap.' },
                { icon: Heart, title: 'Guest Favorites', desc: 'Guests can favorite photos. See which moments everyone loved.' },
                { icon: Lock, title: 'Privacy Controls', desc: 'Control who sees what. All photos, own photos, or none.' },
                { icon: Clock, title: 'Flexible Duration', desc: '7 days to 90 days access. Extend anytime.' },
              ].map((feature, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-200 hover:shadow-lg transition">
                  <feature.icon className="w-8 h-8 text-purple-600 mb-4" />
                  <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Features */}
          <div className="bg-gradient-to-br from-purple-50 to-amber-50 rounded-3xl p-8 md:p-12">
            <div className="flex items-center justify-center mb-8">
              <div className="inline-flex items-center bg-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                <span className="text-purple-700">AI-Powered Features</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Users, color: 'purple', title: 'Face Recognition', desc: 'Automatically groups photos by person. Find all photos of anyone instantly.' },
                { icon: Camera, color: 'amber', title: '"Find Yourself"', desc: 'Guests take a selfie and instantly see every photo they appear in.' },
                { icon: Star, color: 'green', title: 'AI Best Picks', desc: 'Our AI selects the top 20 photos based on quality and composition.' },
                { icon: Zap, color: 'blue', title: 'Blur Detection', desc: 'Automatically flags or removes blurry, out-of-focus photos.' },
                { icon: Image, color: 'pink', title: 'Duplicate Removal', desc: 'Finds near-identical shots and keeps only the best one.' },
                { icon: BarChart3, color: 'indigo', title: 'Scene Categories', desc: 'Auto-tags: ceremony, reception, dancing, speeches, candids.' },
              ].map((feature, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Email Growth Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Mail className="w-4 h-4 mr-2" />
                Built-in Growth Engine
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Turn Every Guest Into a Subscriber
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                When guests register to view photos, they opt into your marketing list. One event with 100 guests = 100+ new email subscribers.
              </p>
              <ul className="space-y-4">
                {[
                  'Guests register with email to access gallery',
                  'Marketing consent included in Terms of Service',
                  'Export subscriber list anytime',
                  'GDPR compliant with easy opt-out',
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900">Sarah & Mike's Wedding</h3>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg" disabled />
                <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 border border-gray-300 rounded-lg" disabled />
                <label className="flex items-start text-sm text-gray-600">
                  <input type="checkbox" checked disabled className="mt-1 mr-2" />
                  I agree to the Terms of Service and consent to receive emails
                </label>
                <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold" disabled>
                  View Photos
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Moderation */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Shield className="w-4 h-4 mr-2" />
                  Content Moderation
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Keep Your Gallery Safe
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  AI-powered content moderation automatically flags inappropriate uploads. You review and approve before they appear in the gallery.
                </p>
                <ul className="space-y-3">
                  {[
                    'Auto-detects inappropriate content',
                    'Flagged photos held for your review',
                    'One-click approve or reject',
                    'Protects your event from embarrassing uploads',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="w-5 h-5 text-red-500 mr-3" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-500">Flagged for Review</span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">1 pending</span>
                  </div>
                  <div className="bg-gray-100 rounded-xl h-32 flex items-center justify-center mb-4">
                    <Shield className="w-12 h-12 text-gray-300" />
                  </div>
                  <div className="flex space-x-3">
                    <button className="flex-1 py-2 bg-green-500 text-white rounded-lg text-sm font-medium">Approve</button>
                    <button className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-medium">Reject</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">Pay per event. Add AI features as needed.</p>
          </div>

          {/* Package Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {[
              { 
                name: 'Basic', 
                price: 39, 
                photos: '200', 
                duration: '7 days',
                coreAi: 49,
                faceAi: 99,
                features: ['200 photo uploads', 'QR code sharing', 'Mobile gallery', 'Download all photos', '7-day access'],
                popular: false 
              },
              { 
                name: 'Standard', 
                price: 79, 
                photos: '500', 
                duration: '30 days',
                coreAi: 99,
                faceAi: 199,
                features: ['500 photo uploads', 'QR code sharing', 'Mobile gallery', 'Download all photos', '30-day access', 'Guest favorites', 'Social sharing'],
                popular: true 
              },
              { 
                name: 'Premium', 
                price: 149, 
                photos: '2,000', 
                duration: '90 days',
                coreAi: 149,
                faceAi: 499,
                features: ['2,000 photo uploads', 'QR code sharing', 'Mobile gallery', 'Download all photos', '90-day access', 'Guest favorites', 'Social sharing', 'Priority support', 'Content moderation'],
                popular: false 
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl p-8 ${
                  plan.popular ? 'border-2 border-purple-500 shadow-xl relative' : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{plan.photos} photos • {plan.duration}</p>
                <div className="text-4xl font-bold text-gray-900 mb-6">${plan.price}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`w-full rounded-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
                <p className="text-center text-xs text-gray-500 mt-4">
                  + Core AI: ${plan.coreAi} | Face AI: ${plan.faceAi}
                </p>
              </div>
            ))}
          </div>

          {/* AI Add-ons Explainer */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Sparkles className="w-10 h-10 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Add-ons</h3>
              <p className="text-gray-600">Supercharge your event with intelligent features</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="border border-purple-200 rounded-xl p-6 bg-purple-50">
                <div className="flex items-center mb-4">
                  <Zap className="w-6 h-6 text-purple-600 mr-2" />
                  <h4 className="font-bold text-gray-900">Core AI</h4>
                  <span className="ml-auto text-purple-600 font-bold">from +$49</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Auto-remove blurry photos</li>
                  <li>• Remove duplicates</li>
                  <li>• AI "Best Photos" picks</li>
                  <li>• Auto-categorize by scene</li>
                  <li>• Smart color enhancement</li>
                </ul>
              </div>
              <div className="border border-amber-200 rounded-xl p-6 bg-amber-50">
                <div className="flex items-center mb-4">
                  <Users className="w-6 h-6 text-amber-600 mr-2" />
                  <h4 className="font-bold text-gray-900">Face Detection</h4>
                  <span className="ml-auto text-amber-600 font-bold">from +$99</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• "Find Yourself" selfie search</li>
                  <li>• Auto-group photos by person</li>
                  <li>• Name detected people</li>
                  <li>• Face-based galleries</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Wedding Planners */}
      <section className="py-24 bg-gradient-to-br from-purple-900 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Building2 className="w-4 h-4 mr-2" />
                For Wedding Planners & Event Pros
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                White-Label Photo Sharing Under Your Brand
              </h2>
              <p className="text-xl text-purple-200 mb-8">
                Offer premium photo sharing to your clients with your logo, colors, and custom domain. No development needed.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Your logo & brand colors on every page',
                  'Custom domain (photos.yourbrand.com)',
                  'Manage unlimited clients & events',
                  'Pay-per-event AI pricing',
                  'Client management dashboard',
                ].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="w-6 h-6 text-green-400 mr-3" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100 rounded-full px-8">
                  <Link href="/partners">
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">$399</span>
                  <span className="text-purple-300 ml-1">/month</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Elegant Events Co.</p>
                    <p className="text-sm text-gray-500">Your Brand Here</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Active Events</span>
                    <span className="font-bold text-gray-900">12</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Clients</span>
                    <span className="font-bold text-gray-900">47</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Photos This Month</span>
                    <span className="font-bold text-gray-900">8,432</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Do guests need to download an app?', a: 'No! PixHive works entirely in the browser. Guests simply scan the QR code and can upload photos immediately.' },
              { q: 'How long do photos stay available?', a: 'Depends on your plan: Basic (7 days), Standard (30 days), or Premium (90 days). You can always download all photos as a ZIP before expiry.' },
              { q: 'What are the AI features?', a: 'Core AI includes blur detection, duplicate removal, best photo picks, and scene categorization. Face Detection adds "Find Yourself" selfie search and auto-grouping by person.' },
              { q: 'Can guests see all photos or just their own?', a: 'You control this! Set guest access to all photos, only photos they uploaded, or view-only mode.' },
              { q: 'Is there a limit to how many guests can upload?', a: 'No guest limit! The photo limit depends on your plan (200, 500, or 2,000 photos).' },
              { q: 'Can I use my own branding?', a: 'Yes! Our Partner plan ($399/mo) lets you white-label with your logo, colors, and custom domain.' },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition" />
                </summary>
                <div className="px-6 pb-6 text-gray-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-purple-600 via-purple-500 to-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Capture Every Moment?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of hosts who never miss a memory. Create your first event free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-purple-700 hover:bg-gray-100 rounded-full px-10 py-6 text-lg font-semibold shadow-xl">
              <Link href="/signup">
                Create Your Event — Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-10 py-6 text-lg font-semibold">
              <Link href="/partners">
                For Event Professionals
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
