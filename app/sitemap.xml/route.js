import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const categories = await getCollection('categories');
    const printables = await getCollection('printables');
    
    const allCategories = await categories.find({}).toArray();
    const allPrintables = await printables.find({}).toArray();
    
    const staticPages = [
      { url: '', changefreq: 'daily', priority: '1.0' },
      { url: '/about', changefreq: 'monthly', priority: '0.8' },
      { url: '/contact', changefreq: 'monthly', priority: '0.8' },
      { url: '/search', changefreq: 'weekly', priority: '0.7' },
      { url: '/privacy-policy', changefreq: 'yearly', priority: '0.5' },
      { url: '/terms-of-service', changefreq: 'yearly', priority: '0.5' }
    ];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
  ${allCategories.map(cat => `
  <url>
    <loc>${baseUrl}/category/${cat.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
  ${allPrintables.map(printable => `
  <url>
    <loc>${baseUrl}/printable/${printable.slug}</loc>
    <lastmod>${new Date(printable.createdAt).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;
    
    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}