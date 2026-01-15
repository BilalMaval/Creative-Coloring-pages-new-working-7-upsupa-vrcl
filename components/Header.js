'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Sparkles, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-yellow-400 bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative h-14 w-14">
              <Image
                src="https://customer-assets.emergentagent.com/job_mandala-maker-2/artifacts/xyc9pvqy_Coloringpages%20logo%20%281%29.png"
                alt="CCP Logo"
                fill
                className="object-contain group-hover:scale-110 transition-transform"
              />
            </div>
            <div className="hidden lg:block">
              <div className="font-black text-xl text-gray-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Creative Coloring Pages
              </div>
              <div className="text-xs text-purple-600 font-bold">Fun for Kids & Families!</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3">
            <Link href="/category/coloring-pages">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-base rounded-full h-11 px-6 shadow-md">
                🎨 Coloring Pages
              </Button>
            </Link>
            <Link href="/category/calendars">
              <Button className="bg-green-500 hover:bg-green-600 text-white font-bold text-base rounded-full h-11 px-6 shadow-md">
                📅 Calendars
              </Button>
            </Link>
            <Link href="/category/printables">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-base rounded-full h-11 px-6 shadow-md">
                📄 Printables
              </Button>
            </Link>
            <Link href="/ebooks">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white font-bold text-base rounded-full h-11 px-6 shadow-md">
                📚 Book Shop
              </Button>
            </Link>
            <Link href="/search">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white font-bold text-base rounded-full h-11 px-6 shadow-md">
                🔍 Search
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" className="bg-white hover:bg-gray-100 font-bold text-base rounded-full h-11 px-4 shadow-md border-2 border-gray-300">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden bg-purple-500 rounded-xl p-3 shadow-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-3 pb-6">
            <Link
              href="/category/coloring-pages"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg rounded-full h-14 shadow-md">
                🎨 Coloring Pages
              </Button>
            </Link>
            <Link
              href="/category/calendars"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-full h-14 shadow-md">
                📅 Calendars
              </Button>
            </Link>
            <Link
              href="/category/printables"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-full h-14 shadow-md">
                📄 Printables
              </Button>
            </Link>
            <Link
              href="/ebooks"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg rounded-full h-14 shadow-md">
                📚 Book Shop
              </Button>
            </Link>
            <Link
              href="/search"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg rounded-full h-14 shadow-md">
                🔍 Search
              </Button>
            </Link>
            <Link
              href="/about"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold text-lg rounded-full h-14 shadow-md">
                ❓ About
              </Button>
            </Link>
            <Link
              href="/cart"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold text-lg rounded-full h-14 shadow-md border-2 border-gray-300">
                🛒 Cart
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}