import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import { Sparkles, Star, Heart, Download, Palette, Smile } from 'lucide-react';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getHomeData() {
  try {
    // Get 3 main categories (parent categories only)
    const mainCategories = await prisma.category.findMany({
      where: {
        parentId: null,
        isActive: true
      },
      orderBy: {
        order: 'asc'
      },
      take: 3
    });

    // Get subcategories for each main category
    const categoriesWithSubs = await Promise.all(
      mainCategories.map(async (mainCat) => {
        const subcategories = await prisma.category.findMany({
          where: {
            parentId: mainCat.id,
            isActive: true
          },
          orderBy: {
            order: 'asc'
          },
          take: 12
        });
        
        return {
          ...mainCat,
          subcategories
        };
      })
    );

    // Get product count
    const productCount = await prisma.product.count({
      where: { isActive: true }
    });

    return {
      mainCategories: JSON.parse(JSON.stringify(categoriesWithSubs)),
      productCount
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return { mainCategories: [], productCount: 0 };
  }
}

export default async function Home() {
  const { mainCategories, productCount } = await getHomeData();

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
              {mainCategories.length * 12}+ Categories
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

      {/* 3 SUPER MAIN CATEGORIES */}
      <section className="container mx-auto px-4 mb-16">
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-3xl p-8 shadow-2xl mb-8">
          <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-2">
            🎨 Choose Your Collection! 🌈
          </h2>
          <p className="text-center text-white font-bold text-lg md:text-xl">
            Click on any category to explore amazing content!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {mainCategories.map((mainCat, index) => {
            const gradients = [
              'from-blue-500 to-purple-600',
              'from-green-500 to-teal-600', 
              'from-pink-500 to-orange-500'
            ];
            const emojis = ['🎨', '📅', '📄'];
            
            return (
              <Link key={mainCat.id} href={`/category/${mainCat.slug}`}>
                <div className={`bg-gradient-to-br ${gradients[index]} rounded-3xl p-8 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-white`}>
                  <div className="text-center space-y-4">
                    <div className="text-8xl mb-4">{emojis[index]}</div>
                    <h3 className="text-3xl md:text-4xl font-black text-white">
                      {mainCat.name}
                    </h3>
                    <p className="text-white font-bold text-lg">
                      {mainCat.description}
                    </p>
                    <div className="bg-white text-gray-800 font-black py-3 px-6 rounded-full inline-block">
                      {mainCat.subcategories?.length || 0} Categories Inside!
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 1: COLORING PAGES SUBCATEGORIES */}
      {mainCategories[0] && mainCategories[0].subcategories && (
        <section className="container mx-auto px-4 mb-16">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
              <h2 className="text-3xl md:text-5xl font-black text-white text-center">
                {mainCategories[0].name}
              </h2>
              <Heart className="h-8 w-8 text-yellow-300 animate-pulse" />
            </div>
            <p className="text-center text-white font-bold text-lg md:text-xl">
              Click any category to see beautiful coloring pages!
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {mainCategories[0].subcategories.map((subCat, idx) => {
              const colors = ['blue', 'pink', 'green', 'purple', 'orange', 'yellow'];
              const color = colors[idx % colors.length];
              
              return (
                <Link key={subCat.id} href={`/category/${subCat.slug}`}>
                  <div className={`bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-${color}-400`}>
                    <div className="aspect-square bg-gradient-to-br from-${color}-100 to-${color}-200 rounded-xl mb-3 flex items-center justify-center">
                      <span className="text-5xl">{['🐾', '👑', '🎮', '📺', '🦄', '🎄', '📚', '🌸', '🌳', '🚗', '⚽', '🍦'][idx]}</span>
                    </div>
                    <h3 className="font-black text-center text-gray-800 text-sm md:text-base">
                      {subCat.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 2: CALENDARS SUBCATEGORIES */}
      {mainCategories[1] && mainCategories[1].subcategories && (
        <section className="container mx-auto px-4 mb-16">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-3xl p-8 shadow-2xl mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Star className="h-8 w-8 text-yellow-300 animate-pulse" />
              <h2 className="text-3xl md:text-5xl font-black text-white text-center">
                {mainCategories[1].name}
              </h2>
              <Star className="h-8 w-8 text-yellow-300 animate-pulse" />
            </div>
            <p className="text-center text-white font-bold text-lg md:text-xl">
              Plan your days with our free printable calendars!
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {mainCategories[1].subcategories.map((subCat, idx) => {
              const colors = ['green', 'teal', 'blue', 'indigo', 'purple', 'pink'];
              const color = colors[idx % colors.length];
              
              return (
                <Link key={subCat.id} href={`/category/${subCat.slug}`}>
                  <div className={`bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-${color}-400`}>
                    <div className="aspect-square bg-gradient-to-br from-${color}-100 to-${color}-200 rounded-xl mb-3 flex items-center justify-center">
                      <span className="text-5xl">{['📅', '📆', '📋', '📝', '🎓', '🎂', '🍽️', '✅', '🎯', '💪', '💰', '📄'][idx]}</span>
                    </div>
                    <h3 className="font-black text-center text-gray-800 text-sm md:text-base">
                      {subCat.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 3: PRINTABLES SUBCATEGORIES */}
      {mainCategories[2] && mainCategories[2].subcategories && (
        <section className="container mx-auto px-4 mb-16">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 shadow-2xl mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Smile className="h-8 w-8 text-yellow-300 animate-pulse" />
              <h2 className="text-3xl md:text-5xl font-black text-white text-center">
                {mainCategories[2].name}
              </h2>
              <Smile className="h-8 w-8 text-yellow-300 animate-pulse" />
            </div>
            <p className="text-center text-white font-bold text-lg md:text-xl">
              Free templates for every occasion!
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {mainCategories[2].subcategories.map((subCat, idx) => {
              const colors = ['orange', 'red', 'pink', 'purple', 'blue', 'green'];
              const color = colors[idx % colors.length];
              
              return (
                <Link key={subCat.id} href={`/category/${subCat.slug}`}>
                  <div className={`bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-${color}-400`}>
                    <div className="aspect-square bg-gradient-to-br from-${color}-100 to-${color}-200 rounded-xl mb-3 flex items-center justify-center">
                      <span className="text-5xl">{['📝', '🃏', '🏆', '💌', '🏷️', '🎉', '🏷️', '🔖', '🖼️', '✓', '🎈', '🎲'][idx]}</span>
                    </div>
                    <h3 className="font-black text-center text-gray-800 text-sm md:text-base">
                      {subCat.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
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