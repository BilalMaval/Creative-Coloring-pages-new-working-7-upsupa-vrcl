import { notFound } from 'next/navigation';
import Link from 'next/link';
import PrintableCard from '@/components/PrintableCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { getCollection } from '@/lib/db';
import { generateMetadata as genMeta, generateBreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    const categories = await getCollection('categories');
    const category = await categories.findOne({ slug });
    
    if (!category) {
      return {};
    }
    
    return genMeta({
      title: `${category.name} Coloring Pages - Free Printables`,
      description: category.description || `Download free ${category.name.toLowerCase()} coloring pages. High-quality printable designs perfect for kids and adults.`,
      keywords: `${category.name} coloring pages, ${category.name} printables, free ${category.name} coloring sheets`,
      url: `/category/${slug}`,
      image: category.image
    });
  } catch (error) {
    return {};
  }
}

async function getCategoryData(slug, page = 1) {
  try {
    const categories = await getCollection('categories');
    const printables = await getCollection('printables');
    
    const category = await categories.findOne({ slug });
    if (!category) return null;
    
    const limit = 12;
    const skip = (page - 1) * limit;
    
    const total = await printables.countDocuments({ category_id: category._id });
    const items = await printables
      .find({ category_id: category._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    return {
      category: JSON.parse(JSON.stringify(category)),
      printables: JSON.parse(JSON.stringify(items)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = params;
  const page = parseInt(searchParams.page || '1');
  
  const data = await getCategoryData(slug, page);
  
  if (!data) {
    notFound();
  }
  
  const { category, printables, pagination } = data;
  
  const breadcrumbItems = [
    { name: 'Categories', url: '/search' },
    { name: category.name }
  ];
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    ...breadcrumbItems
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{category.name} Coloring Pages</h1>
        {category.description && (
          <p className="text-lg text-muted-foreground max-w-3xl">
            {category.description}
          </p>
        )}
      </div>
      
      {/* SEO Content */}
      <div className="max-w-4xl mb-12 prose prose-slate dark:prose-invert">
        <p className="text-muted-foreground">
          Explore our collection of free {category.name.toLowerCase()} coloring pages. Each design is carefully crafted to provide hours of creative fun. Perfect for children and adults alike, these printable coloring sheets are high-quality and ready to download. Simply click on any image to view the full-size coloring page, then download and print as many copies as you need.
        </p>
        <p className="text-muted-foreground">
          Our {category.name.toLowerCase()} coloring pages are suitable for all skill levels. Whether you're just starting out or you're an experienced colorist, you'll find designs that inspire your creativity. All printables are completely free with no registration required.
        </p>
      </div>
      
      {printables.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {printables.map((printable) => (
              <PrintableCard key={printable._id} printable={printable} />
            ))}
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4">
              {pagination.hasPrev && (
                <Link href={`/category/${slug}?page=${page - 1}`}>
                  <Button variant="outline">Previous</Button>
                </Link>
              )}
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              {pagination.hasNext && (
                <Link href={`/category/${slug}?page=${page + 1}`}>
                  <Button variant="outline">Next</Button>
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No printables available in this category yet.</p>
        </div>
      )}
    </div>
  );
}