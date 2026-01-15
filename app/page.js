import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CategoryCard from '@/components/CategoryCard';
import PrintableCard from '@/components/PrintableCard';
import SearchBar from '@/components/SearchBar';
import { getCollection, initializeDatabase } from '@/lib/db';
import { ensureAdminUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function getHomeData() {
  try {
    // Initialize database and admin user
    await initializeDatabase();
    await ensureAdminUser();
    
    const categories = await getCollection('categories');
    const printables = await getCollection('printables');
    
    const featuredCategories = await categories.find({}).limit(6).toArray();
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
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Free Printable Coloring Pages & Mandalas
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover thousands of beautiful coloring pages and mandala designs. Perfect for kids and adults. Download, print, and start coloring today - completely free!
        </p>
        <div className="flex justify-center">
          <SearchBar />
        </div>
      </section>

      {/* SEO Content */}
      <section className="max-w-4xl mx-auto mb-12 prose prose-slate dark:prose-invert">
        <h2 className="text-2xl font-bold mb-4">Welcome to Your Free Printable Coloring Page Resource</h2>
        <p className="text-muted-foreground">
          Welcome to the ultimate destination for free printable coloring pages and mandala designs! Whether you're looking for coloring sheets for kids, intricate adult coloring pages, or beautiful mandala patterns, we have thousands of high-quality printables ready for instant download. All our coloring pages are completely free, and you can print as many copies as you need.
        </p>
        <p className="text-muted-foreground">
          Our collection includes a wide variety of themes and difficulty levels. From simple coloring pages perfect for toddlers and preschoolers to complex mandala designs for adults seeking stress relief and creative expression. Each printable coloring page is carefully curated and optimized for printing, ensuring you get the best results every time.
        </p>
        <p className="text-muted-foreground">
          Coloring has been proven to reduce stress, improve focus, and boost creativity. Whether you're a teacher looking for classroom resources, a parent seeking fun activities for your children, or an adult looking for a relaxing hobby, our free printable coloring pages offer something for everyone. New designs are added regularly, so check back often for fresh content!
        </p>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Browse Categories</h2>
            <Link href="/search">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Printables */}
      {printables.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Latest Printables</h2>
            <Link href="/search">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {printables.map((printable) => (
              <PrintableCard key={printable._id} printable={printable} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {categories.length === 0 && printables.length === 0 && (
        <section className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">No Content Yet</h2>
          <p className="text-muted-foreground mb-6">
            The site is ready! Please log in to the admin panel to add categories and printables.
          </p>
          <Link href="/admin/login">
            <Button>Go to Admin Panel</Button>
          </Link>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Default credentials:</p>
            <p className="font-mono">Email: admin@printables.com</p>
            <p className="font-mono">Password: admin123</p>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="bg-muted rounded-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Our Printable Coloring Pages?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-semibold mb-2">High Quality Designs</h3>
            <p className="text-sm text-muted-foreground">
              Every coloring page is carefully designed and optimized for perfect printing results
            </p>
          </div>
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-semibold mb-2">Completely Free</h3>
            <p className="text-sm text-muted-foreground">
              All our coloring pages are 100% free. No subscriptions, no hidden fees, unlimited downloads
            </p>
          </div>
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold mb-2">Easy to Use</h3>
            <p className="text-sm text-muted-foreground">
              Simple one-click download. Print from any device and start coloring immediately
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}