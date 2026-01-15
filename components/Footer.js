import Link from 'next/link';
import { Heart, Star, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-kid-purple via-kid-pink to-kid-blue mt-16 border-t-4 border-kid-yellow">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-kid-yellow">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-kid-blue" />
              <h3 className="font-black text-xl text-kid-blue">CCP</h3>
            </div>
            <p className="text-sm text-gray-700 font-medium">
              🎨 Free coloring pages for kids and families! Download, print, and color!
            </p>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-kid-pink">
            <h3 className="font-black text-lg mb-4 text-kid-pink flex items-center gap-2">
              <Star className="h-5 w-5" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm font-bold text-gray-700 hover:text-kid-blue transition-colors">
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm font-bold text-gray-700 hover:text-kid-blue transition-colors">
                  🔍 Browse All
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm font-bold text-gray-700 hover:text-kid-blue transition-colors">
                  ❓ About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm font-bold text-gray-700 hover:text-kid-blue transition-colors">
                  ✉️ Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-kid-green">
            <h3 className="font-black text-lg mb-4 text-kid-green flex items-center gap-2">
              <Heart className="h-5 w-5" />
              For Parents
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-sm font-bold text-gray-700 hover:text-kid-blue transition-colors">
                  🔒 Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-sm font-bold text-gray-700 hover:text-kid-blue transition-colors">
                  📜 Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-kid-orange">
            <h3 className="font-black text-lg mb-4 text-kid-orange">Visit Us</h3>
            <p className="text-sm font-bold text-gray-700 mb-2">
              www.creativecoloringpages.online
            </p>
            <p className="text-xs text-gray-600 font-medium">
              ✨ 100% Free!
              <br />
              🖨️ Thousands of Pages!
              <br />
              👨‍👩‍👧‍👦 Kid & Parent Friendly!
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 text-center">
          <div className="bg-white rounded-2xl p-4 inline-block shadow-lg border-4 border-kid-yellow">
            <p className="text-sm font-black text-kid-blue">
              © {currentYear} Creative Coloring Pages (CCP). Made with ❤️ for Kids!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}