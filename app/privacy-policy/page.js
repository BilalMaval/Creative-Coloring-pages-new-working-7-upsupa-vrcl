import prisma from '@/lib/prisma';
import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
  title: 'Privacy Policy - Creative Coloring Pages',
  description: 'Our privacy policy explains how we collect, use, and protect your information.',
  url: '/privacy-policy'
});

export const dynamic = 'force-dynamic';

async function getPageContent() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'privacy-policy' }
    });
    return page ? JSON.parse(JSON.stringify(page)) : null;
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    return null;
  }
}

export default async function PrivacyPolicyPage() {
  const pageContent = await getPageContent();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          {pageContent?.title || 'Privacy Policy'}
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
            
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Welcome to Creative Coloring Pages. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect minimal personal information from our users. When you use our website, we may collect:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Technical data including your IP address, browser type, and device information</li>
              <li>Usage data including how you interact with our website</li>
              <li>Contact information if you voluntarily provide it through our contact form</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Provide and maintain our service</li>
              <li>Improve and optimize our website</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Send you updates (only if you've opted in)</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this privacy policy, please contact us through our contact page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
