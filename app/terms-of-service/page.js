import { getCollection } from '@/lib/db';
import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
  title: 'Terms of Service - Free Printable Coloring Pages',
  description: 'Our terms of service outline the rules and regulations for using our website.',
  url: '/terms-of-service'
});

export const dynamic = 'force-dynamic';

async function getPageContent() {
  try {
    const pages = await getCollection('pages');
    const page = await pages.findOne({ slug: 'terms-of-service' });
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
              Permission is granted to temporarily download one copy of the materials (coloring pages) on Free Printable Coloring Pages' website for personal, non-commercial transitory viewing only.
            </p>
            <p className="text-muted-foreground mb-4">
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Personal Use</h2>
            <p className="text-muted-foreground mb-4">
              All coloring pages are provided free of charge for personal use, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Home use by families</li>
              <li>Educational use in classrooms</li>
              <li>Non-profit organization activities</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Prohibited Uses</h2>
            <p className="text-muted-foreground mb-4">
              You may not use our coloring pages for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Commercial purposes or resale</li>
              <li>Redistribution or republishing without permission</li>
              <li>Creating derivative works for commercial use</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Disclaimer</h2>
            <p className="text-muted-foreground mb-4">
              The materials on Free Printable Coloring Pages' website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Limitations</h2>
            <p className="text-muted-foreground mb-4">
              In no event shall Free Printable Coloring Pages or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Links</h2>
            <p className="text-muted-foreground mb-4">
              Our website may contain links to third-party websites. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Modifications</h2>
            <p className="text-muted-foreground mb-4">
              We may revise these terms of service for our website at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these terms of service.
            </p>
            
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