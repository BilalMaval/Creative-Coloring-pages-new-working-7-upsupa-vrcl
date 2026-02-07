import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
  title: 'Privacy Policy - Creative Coloring Pages',
  description: 'Our privacy policy explains how we handle your information when you use our website.',
  url: '/privacy-policy'
});

export default function PrivacyPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: {lastUpdated}</p>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Welcome to Creative Coloring Pages ("we," "our," or "us"). We are committed to protecting your privacy 
              and ensuring transparency about how we handle information when you visit our website. This Privacy Policy 
              explains our practices regarding any information that may be associated with your use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Information We Process</h2>
            <p className="text-muted-foreground mb-4">
              We believe in data minimization and only process information that is necessary for providing our services:
            </p>
            <h3 className="text-xl font-semibold mb-2">Information You Voluntarily Provide:</h3>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li><strong>Contact Information:</strong> When you use our contact form, you provide your name, email address, and message content</li>
              <li><strong>Order Information:</strong> When making a purchase, you provide your name and email for order processing and delivery of digital products</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Automatically Collected Information:</h3>
            <p className="text-muted-foreground mb-4">
              We use essential cookies to maintain basic website functionality. We do not use tracking cookies, 
              analytics services, or any technology designed to profile your behavior across websites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the information you provide solely for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li><strong>Service Delivery:</strong> To process orders and deliver digital products you purchase</li>
              <li><strong>Communication:</strong> To respond to your inquiries submitted through our contact form</li>
              <li><strong>Order Confirmation:</strong> To send you confirmation emails regarding your purchases</li>
              <li><strong>Website Functionality:</strong> To ensure our website operates correctly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following limited circumstances:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li><strong>Service Providers:</strong> With trusted third-party services that help us operate our website (e.g., email delivery services), who are contractually obligated to protect your information</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
            <p className="text-muted-foreground mb-4">
              We retain your information only for as long as necessary to fulfill the purposes outlined in this policy:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li><strong>Contact Form Submissions:</strong> Retained until your inquiry is resolved</li>
              <li><strong>Order Information:</strong> Retained for the period required by applicable tax and accounting laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              To exercise any of these rights, please contact us using the information provided below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational measures to protect your information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over 
              the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
            <p className="text-muted-foreground mb-4">
              Our website is designed to be family-friendly. We do not knowingly collect personal information from 
              children under 13 years of age. If you are a parent or guardian and believe your child has provided 
              us with personal information, please contact us so we can take appropriate action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. International Users</h2>
            <p className="text-muted-foreground mb-4">
              If you are accessing our website from outside the United States, please be aware that your information 
              may be transferred to, stored, and processed in the United States or other countries. By using our 
              services, you consent to this transfer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this 
              Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Through our <a href="/contact" className="text-primary hover:underline">Contact Form</a></li>
              <li>Email: sufyan.afzalk@gmail.com</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
