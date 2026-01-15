import { getCollection } from '@/lib/db';
import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
  title: 'About Us - Free Printable Coloring Pages',
  description: 'Learn more about our mission to provide free, high-quality printable coloring pages and mandalas for everyone.',
  url: '/about'
});

export const dynamic = 'force-dynamic';

async function getPageContent() {
  try {
    const pages = await getCollection('pages');
    const page = await pages.findOne({ slug: 'about' });
    return page ? JSON.parse(JSON.stringify(page)) : null;
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
}

export default async function AboutPage() {
  const pageContent = await getPageContent();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          {pageContent?.title || 'About Us'}
        </h1>
        
        {pageContent?.body ? (
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: pageContent.body }} />
          </div>
        ) : (
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">Welcome to Free Printable Coloring Pages</h2>
            
            <p className="text-muted-foreground mb-4">
              We are passionate about bringing joy, creativity, and relaxation to people of all ages through the art of coloring. Our mission is simple: to provide a comprehensive collection of free, high-quality printable coloring pages and mandala designs that anyone can download and enjoy.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Our Story</h3>
            <p className="text-muted-foreground mb-4">
              Founded with a love for art and creativity, our platform was created to make coloring accessible to everyone. We believe that coloring is not just a children's activity – it's a powerful tool for stress relief, mindfulness, and creative expression for people of all ages.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">What We Offer</h3>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Thousands of free printable coloring pages</li>
              <li>Beautiful mandala designs for relaxation and meditation</li>
              <li>Designs suitable for all skill levels</li>
              <li>Regular updates with new content</li>
              <li>High-quality PDFs optimized for printing</li>
              <li>No registration or subscription required</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Our Values</h3>
            <p className="text-muted-foreground mb-4">
              <strong>Accessibility:</strong> We believe everyone should have access to quality coloring resources, which is why all our content is completely free.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Quality:</strong> Each design is carefully selected and optimized to ensure the best printing and coloring experience.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Community:</strong> We're building a community of coloring enthusiasts who share a love for creativity and self-expression.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Get in Touch</h3>
            <p className="text-muted-foreground mb-4">
              We love hearing from our users! If you have suggestions, requests, or just want to share your colored creations, please don't hesitate to contact us through our contact page.
            </p>
            
            <p className="text-muted-foreground mt-8">
              Thank you for being part of our coloring community. Happy coloring!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}