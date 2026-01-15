import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 mt-16 border-t-4 border-yellow-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About with Logo */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-yellow-400">
            <div className="flex flex-col items-center mb-4">
              <div className="relative h-20 w-20 mb-3">
                <Image
                  src="https://customer-assets.emergentagent.com/job_mandala-maker-2/artifacts/xyc9pvqy_Coloringpages%20logo%20%281%29.png"
                  alt="CCP Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-black text-lg text-gray-800">Creative Coloring Pages</h3>
            </div>
            <p className="text-sm text-gray-700 font-medium text-center">
              🎨 Free coloring pages for kids and families!
            </p>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-pink-400">
            <h3 className="font-black text-lg mb-4 text-pink-600 flex items-center gap-2">
              <Star className="h-5 w-5" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
                  🔍 Browse All
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
                  ❓ About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
                  ✉️ Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Parents */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-green-400">
            <h3 className="font-black text-lg mb-4 text-green-600 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              For Parents
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
                  🔒 Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
                  📜 Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Website Info */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-blue-400">
            <h3 className="font-black text-lg mb-4 text-blue-600">Visit Us</h3>
            <p className="text-sm font-bold text-gray-700 mb-3 break-words">
              www.creativecoloringpages.online
            </p>
            <div className="space-y-1 text-xs text-gray-600 font-medium">
              <p>✨ 100% Free!</p>
              <p>🖨️ Easy to Print!</p>
              <p>👨‍👩‍👧‍👦 Family Friendly!</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 text-center">
          <div className="bg-white rounded-2xl p-4 inline-block shadow-lg border-4 border-yellow-400">
            <p className="text-sm font-black text-gray-800">
              © {currentYear} Creative Coloring Pages (CCP). Made with ❤️ for Kids!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}