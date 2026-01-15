import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import CategoryCard from '@/components/CategoryCard';
import PrintableCard from '@/components/PrintableCard';
import SearchBar from '@/components/SearchBar';
import { getCollection, initializeDatabase } from '@/lib/db';
import { ensureAdminUser } from '@/lib/auth';
import { Sparkles, Star, Heart, Smile, Download, Palette } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getHomeData() {
  try {
    await initializeDatabase();
    await ensureAdminUser();
    
    const categories = await getCollection('categories');
    const printables = await getCollection('printables');
    
    const featuredCategories = await categories.find({}).limit(12).toArray();
    const latestPrintables = await printables.find({}).sort({ createdAt: -1 }).limit(8).toArray();
    
    return {
      categories: JSON.parse(JSON.stringify(featuredCategories)),
      printables: JSON.parse(JSON.stringify(latestPrintables))
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return { categories: [], printables: [] };
  }
}

export default async function Home() {
  const { categories, printables } = await getHomeData();

  return (
    <div className="bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50 min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center space-y-6">
          {/* Logo and Title */}
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              <Image
                src="https://customer-assets.emergentagent.com/job_mandala-maker-2/artifacts/xyc9pvqy_Coloringpages%20logo%20%281%29.png"
                alt="Creative Coloring Pages Logo"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl font-black text-gray-800">
                Creative Coloring Pages
              </h1>
              <div className="inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold text-xl md:text-3xl py-3 px-8 rounded-full shadow-xl transform hover:scale-105 transition-transform">
                <Palette className="inline-block mr-2 h-8 w-8" />
                100% FREE Coloring Pages!
              </div>
            </div>
          </div>
          
          <p className="text-xl md:text-2xl font-bold text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Perfect for kids and families! Download, print, and color amazing pages!
          </p>
          
          {/* Search Bar */}
          <div className="flex justify-center pt-4">
            <div className="w-full max-w-2xl">
              <SearchBar />
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <div className="bg-white border-4 border-blue-400 text-blue-600 font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <Star className="inline-block mr-2 h-5 w-5" />
              {categories.length}+ Categories
            </div>
            <div className="bg-white border-4 border-pink-400 text-pink-600 font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <Palette className="inline-block mr-2 h-5 w-5" />
              New Pages Daily
            </div>
            <div className="bg-white border-4 border-green-400 text-green-600 font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <Download className="inline-block mr-2 h-5 w-5" />
              Easy to Print!
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="h-8 w-8 text-yellow-300 animate-pulse" />
              <h2 className="text-3xl md:text-5xl font-black text-white text-center">
                Choose Your Favorite Category!
              </h2>
              <Heart className="h-8 w-8 text-yellow-300 animate-pulse" />
            </div>
            <p className="text-center text-white font-bold text-lg md:text-xl">
              Click any category to see amazing coloring pages!
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <div key={category._id} className="transform hover:scale-105 transition-all duration-300">
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/search">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-black text-xl md:text-2xl py-6 md:py-8 px-8 md:px-12 rounded-full shadow-2xl border-4 border-white transform hover:scale-110 transition-all">
                <Sparkles className="mr-2 h-6 w-6" />
                See All Categories
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Latest Printables */}
      {printables.length > 0 && (
        <section className="container mx-auto px-4 mb-16">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-8 shadow-2xl mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
              <h2 className="text-3xl md:text-5xl font-black text-white text-center">
                New Coloring Pages!
              </h2>
              <Smile className="h-8 w-8 text-yellow-300" />
            </div>
            <p className="text-center text-white font-bold text-lg md:text-xl">
              Fresh pages added just for you!
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {printables.map((printable) => (
              <div key={printable._id} className="transform hover:scale-105 transition-all duration-300">
                <PrintableCard printable={printable} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/search">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-black text-xl md:text-2xl py-6 md:py-8 px-8 md:px-12 rounded-full shadow-2xl border-4 border-white transform hover:scale-110 transition-all">
                <Palette className="mr-2 h-6 w-6" />
                Browse All Pages
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Empty State */}
      {categories.length === 0 && printables.length === 0 && (
        <section className="container mx-auto px-4 py-20">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-12 shadow-2xl text-center max-w-2xl mx-auto">
            <Sparkles className="h-24 w-24 text-white mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl font-black text-white mb-4">
              Coming Soon!
            </h2>
            <p className="text-white font-bold text-xl mb-8">
              We are adding amazing coloring pages for you! Check back soon!
            </p>
            <Link href="/admin/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-black text-xl py-6 px-10 rounded-full shadow-xl transform hover:scale-110 transition-all">
                Admin Panel
              </Button>
            </Link>
            <div className="mt-6 bg-white rounded-2xl p-4 inline-block">
              <p className="text-blue-600 font-bold">Default Login:</p>
              <p className="text-gray-700 font-mono text-sm">admin@printables.com</p>
              <p className="text-gray-700 font-mono text-sm">admin123</p>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-purple-300">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
            Why Kids Love CCP!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-xl transform hover:scale-105 transition-transform">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="font-black text-2xl mb-3 text-white">Super Fun!</h3>
              <p className="text-white font-bold">
                Thousands of cool coloring pages that kids love!
              </p>
            </div>
            <div className="text-center bg-gradient-to-br from-pink-500 to-orange-500 rounded-3xl p-8 shadow-xl transform hover:scale-105 transition-transform">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="font-black text-2xl mb-3 text-white">Always Free!</h3>
              <p className="text-white font-bold">
                Download and print as many times as you want - FREE!
              </p>
            </div>
            <div className="text-center bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl p-8 shadow-xl transform hover:scale-105 transition-transform">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="font-black text-2xl mb-3 text-white">Easy Peasy!</h3>
              <p className="text-white font-bold">
                One click to download, print, and start coloring!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}