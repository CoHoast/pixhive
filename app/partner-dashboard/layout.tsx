import Link from 'next/link'
import { Camera, Home, Users, Calendar, Palette, Settings, CreditCard, BarChart3, HelpCircle, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/partner-dashboard', icon: Home, label: 'Dashboard' },
  { href: '/partner-dashboard/clients', icon: Users, label: 'Clients' },
  { href: '/partner-dashboard/events', icon: Calendar, label: 'Events' },
  { href: '/partner-dashboard/branding', icon: Palette, label: 'Branding' },
  { href: '/partner-dashboard/billing', icon: CreditCard, label: 'Billing' },
  { href: '/partner-dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/partner-dashboard/settings', icon: Settings, label: 'Settings' },
]

export default function PartnerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link href="/partner-dashboard" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-amber-500 rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold">PixHive</span>
              <span className="text-xs text-purple-600 font-medium ml-1">Partner</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition group"
            >
              <item.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-purple-600" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Links */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <Link
            href="/partner-dashboard/help"
            className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            <HelpCircle className="w-5 h-5 mr-3 text-gray-400" />
            <span className="font-medium">Help & Support</span>
          </Link>
          <button
            className="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            <LogOut className="w-5 h-5 mr-3 text-gray-400" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div>
            {/* Breadcrumb or page title inserted by child pages */}
          </div>
          <div className="flex items-center space-x-4">
            {/* Trial Badge */}
            <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
              14 days left in trial
            </div>
            {/* Profile */}
            <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-semibold text-sm">JD</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
