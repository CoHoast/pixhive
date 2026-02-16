import Link from 'next/link';
import { Camera } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">PixHive</span>
            </div>
            <p className="text-sm">
              Collect every photo from your event with one QR code.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/features" className="hover:text-white transition">AI Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/demo" className="hover:text-white transition">Demo</Link></li>
            </ul>
          </div>

          {/* Use Cases */}
          <div>
            <h4 className="font-semibold text-white mb-4">Use Cases</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Weddings</a></li>
              <li><a href="#" className="hover:text-white transition">Corporate Events</a></li>
              <li><a href="#" className="hover:text-white transition">Birthdays</a></li>
              <li><a href="#" className="hover:text-white transition">Graduations</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-sm">
          © {new Date().getFullYear()} PixHive. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
