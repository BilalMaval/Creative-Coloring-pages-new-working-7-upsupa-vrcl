import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/Breadcrumbs';
import PrintableCard from '@/components/PrintableCard';
import { getCollection } from '@/lib/db';
import { generateMetadata as genMeta, generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    const printables = await getCollection('printables');
    const printable = await printables.findOne({ slug });
    
    if (!printable) {
      return {};
    }
    
    return genMeta({
      title: `${printable.title} - Free Printable Coloring Page`,
      description: printable.description || `Download and print this free ${printable.title.toLowerCase()} coloring page. High-quality design perfect for coloring.`,
      keywords: `${printable.title}, coloring page, printable, free download, ${printable.tags?.join(', ')}`,
      url: `/printable/${slug}`,
      image: printable.image,
      type: 'article'
    });
  } catch (error) {
    return {};
  }
}

async function getPrintableData(slug) {
  try {
    const printables = await getCollection('printables');
    const categories = await getCollection('categories');
    
    const printable = await printables.findOne({ slug });
    if (!printable) return null;
    
    const category = await categories.findOne({ _id: printable.category_id });
    
    const related = await printables
      .find({ category_id: printable.category_id, _id: { $ne: printable._id } })
      .limit(4)
      .toArray();
    
    return {
      printable: JSON.parse(JSON.stringify(printable)),
      category: JSON.parse(JSON.stringify(category)),
      related: JSON.parse(JSON.stringify(related))
    };
  } catch (error) {
    console.error('Error fetching printable:', error);
    return null;
  }
}

export default async function PrintablePage({ params }) {
  const { slug } = params;
  const data = await getPrintableData(slug);
  
  if (!data) {
    notFound();
  }
  
  const { printable, category, related } = data;
  
  const breadcrumbItems = [
    { name: 'Categories', url: '/search' }
  ];
  
  if (category) {
    breadcrumbItems.push({ name: category.name, url: `/category/${category.slug}` });
  }
  
  breadcrumbItems.push({ name: printable.title });
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    ...breadcrumbItems
  ]);
  
  const articleSchema = generateArticleSchema({
    title: printable.title,
    description: printable.description,
    image: printable.image,
    publishDate: printable.createdAt
  });

  const handleDownload = async () => {
    'use client';
    // Increment download counter
    await fetch(`/api/printables/${slug}`, { method: 'POST' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image */}
        <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
          {printable.image ? (
            <Image
              src={printable.image}
              alt={printable.title}
              fill
              className="object-contain"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No preview available
            </div>
          )}
        </div>
        
        {/* Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{printable.title}</h1>
          
          {category && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Category:</span>
              <Link href={`/category/${category.slug}`}>
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors">
                  {category.name}
                </span>
              </Link>
            </div>
          )}
          
          {printable.createdAt && (
            <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {new Date(printable.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          )}
          
          {printable.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{printable.description}</p>
            </div>
          )}
          
          {printable.tags && printable.tags.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {printable.tags.map((tag, index) => (
                  <span key={index} className="text-sm bg-muted px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {printable.pdf_url ? (
              <a
                href={printable.pdf_url}
                download
                onClick={handleDownload}
                className="block"
              >
                <Button size="lg" className="w-full">
                  <Download className="h-5 w-5 mr-2" />
                  Download PDF
                </Button>
              </a>
            ) : (
              <Button size="lg" className="w-full" disabled>
                PDF Not Available
              </Button>
            )}
            
            <p className="text-sm text-muted-foreground text-center">
              Free to download and print for personal use
            </p>
          </div>
          
          {printable.downloads > 0 && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Downloaded {printable.downloads} times
            </div>
          )}
        </div>
      </div>
      
      {/* SEO Content */}
      <div className="max-w-4xl mx-auto mb-12 prose prose-slate dark:prose-invert">
        <h2 className="text-2xl font-bold mb-4">About This Coloring Page</h2>
        <p className="text-muted-foreground">
          This {printable.title.toLowerCase()} coloring page is part of our extensive collection of free printable coloring sheets. Perfect for both children and adults, this design offers a great way to relax, be creative, and express yourself through colors. The high-quality PDF format ensures crisp, clear lines that are easy to color within.
        </p>
        <p className="text-muted-foreground">
          To use this coloring page, simply click the download button above to save the PDF to your device. You can then print as many copies as you need. We recommend using quality coloring materials like colored pencils, markers, or crayons for the best results. This printable is completely free and can be used for personal, educational, or non-commercial purposes.
        </p>
      </div>
      
      {/* Related */}
      {related.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">Related Coloring Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <PrintableCard key={item._id} printable={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}