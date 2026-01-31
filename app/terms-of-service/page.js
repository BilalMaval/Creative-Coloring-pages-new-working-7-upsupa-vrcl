import prisma from '@/lib/prisma';
import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
  title: 'Terms of Service - Creative Coloring Pages',
  description: 'Our terms of service outline the rules and regulations for using our website.',
  url: '/terms-of-service'
});

export const dynamic = 'force-dynamic';

async function getPageContent() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'terms-of-service' }
    });
    return page ? JSON.parse(JSON.stringify(page)) : null;
  } catch (error) {
    console.error('Error fetching terms of service:', error);
    return null;
  }
}

export default async function TermsOfServicePage() {
  const pageContent = await getPageContent();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          {pageContent?.title || 'Terms of Service'}
        </h1>
        
        {pageContent?.body ? (
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: pageContent.body }} />
          </div>
        ) : (
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-4">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            
            <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Use License</h2>
            <p className="text-muted-foreground mb-4">
              Permission is granted to download the materials (coloring pages) for personal, non-commercial use only.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Personal Use</h2>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Home use by families</li>
              <li>Educational use in classrooms</li>
              <li>Non-profit organization activities</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Prohibited Uses</h2>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Commercial purposes or resale</li>
              <li>Redistribution without permission</li>
              <li>Creating derivative works for commercial use</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us through our contact page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
