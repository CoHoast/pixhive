import Link from 'next/link'
import { 
  Camera, 
  Home, 
  Users, 
  Building2, 
  Calendar, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Shield,
  LogOut,
  Bell
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin', icon: Home, label: 'Overview' },
  { href: '/admin/consumers', icon: Users, label: 'Consumers' },
  { href: '/admin/partners', icon: Building2, label: 'Partners' },
  { href: '/admin/events', icon: Calendar, label: 'All Events' },
  { href: '/admin/revenue', icon: CreditCard, label: 'Revenue' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 z-30">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">PixHive</span>
              <span className="text-xs text-red-400 font-medium ml-1">Admin</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-4 py-3 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition group"
            >
              <item.icon className="w-5 h-5 mr-3 group-hover:text-red-400" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Links */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link
            href="/"
            className="flex items-center px-4 py-3 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition"
          >
            <Camera className="w-5 h-5 mr-3" />
            <span className="font-medium">View Site</span>
          </Link>
          <button
            className="w-full flex items-center px-4 py-3 text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        {/* Top Bar */}
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-red-400" />
            <span className="text-gray-400 text-sm">Super Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-white transition relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">CG</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 bg-gray-950 min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  )
}
