'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-kid-yellow bg-gradient-to-r from-kid-blue via-kid-purple to-kid-pink shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-kid-blue font-black text-2xl shadow-lg group-hover:scale-110 transition-transform border-4 border-kid-yellow">
              CCP
            </div>
            <div className="hidden sm:block">
              <div className="font-black text-xl text-white drop-shadow-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-kid-yellow animate-pulse" />
                Creative Coloring Pages
              </div>
              <div className="text-xs text-kid-yellow font-bold">FUN FOR KIDS & FAMILIES!</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/">
              <Button className="bg-white text-kid-blue hover:bg-kid-yellow hover:text-white font-bold text-lg rounded-2xl h-12 px-6 shadow-md border-3 border-kid-blue">
                🏠 Home
              </Button>
            </Link>
            <Link href="/search">
              <Button className="bg-white text-kid-pink hover:bg-kid-green hover:text-white font-bold text-lg rounded-2xl h-12 px-6 shadow-md border-3 border-kid-pink">
                🔍 Browse
              </Button>
            </Link>
            <Link href="/about">
              <Button className="bg-white text-kid-purple hover:bg-kid-orange hover:text-white font-bold text-lg rounded-2xl h-12 px-6 shadow-md border-3 border-kid-purple">
                ❓ About
              </Button>
            </Link>
            <Link href="/contact">
              <Button className="bg-white text-kid-green hover:bg-kid-blue hover:text-white font-bold text-lg rounded-2xl h-12 px-6 shadow-md border-3 border-kid-green">
                ✉️ Contact
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden bg-white rounded-xl p-3 shadow-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-8 w-8 text-kid-pink" />
            ) : (
              <Menu className="h-8 w-8 text-kid-blue" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-3 pb-6">
            <Link
              href="/"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full bg-white text-kid-blue hover:bg-kid-yellow hover:text-white font-bold text-lg rounded-2xl h-14 shadow-md border-3 border-kid-blue">
                🏠 Home
              </Button>
            </Link>
            <Link
              href="/search"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full bg-white text-kid-pink hover:bg-kid-green hover:text-white font-bold text-lg rounded-2xl h-14 shadow-md border-3 border-kid-pink">
                🔍 Browse All Pages
              </Button>
            </Link>
            <Link
              href="/about"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full bg-white text-kid-purple hover:bg-kid-orange hover:text-white font-bold text-lg rounded-2xl h-14 shadow-md border-3 border-kid-purple">
                ❓ About Us
              </Button>
            </Link>
            <Link
              href="/contact"
              className="block"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button className="w-full bg-white text-kid-green hover:bg-kid-blue hover:text-white font-bold text-lg rounded-2xl h-14 shadow-md border-3 border-kid-green">
                ✉️ Contact Us
              </Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}