'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Menu, X, Zap } from 'lucide-react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-gray-900">Pix</span>
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">Hive</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">How It Works</a>
            <Link href="/features" className="text-gray-600 hover:text-gray-900 font-medium flex items-center">
              <Zap className="w-4 h-4 mr-1 text-purple-600" />
              AI Features
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">Log in</Link>
            <Button asChild className="bg-purple-600 hover:bg-purple-700 rounded-full px-6">
              <Link href="/signup">Get Started Free</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <nav className="px-4 py-4 space-y-2">
            <a href="#how-it-works" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">
              How It Works
            </a>
            <Link href="/features" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">
              AI Features
            </Link>
            <Link href="/pricing" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">
              Pricing
            </Link>
            <hr className="my-2" />
            <Link href="/login" className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 font-medium">
              Log in
            </Link>
            <Link href="/signup" className="block px-4 py-3 rounded-xl bg-purple-600 text-white text-center font-medium">
              Get Started Free
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
