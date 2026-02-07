import { generateMetadata as genMeta } from '@/lib/seo';

export const metadata = genMeta({
  title: 'Terms of Service - Creative Coloring Pages',
  description: 'Our terms of service outline the rules and regulations for using our website.',
  url: '/terms-of-service'
});

export default function TermsOfServicePage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: {lastUpdated}</p>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using Creative Coloring Pages ("the Website"), you accept and agree to be bound by 
              these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              Creative Coloring Pages provides downloadable digital content including coloring pages, calendars, 
              printables, and digital books. Our content is available as both free downloads and premium purchases.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. License and Permitted Use</h2>
            <p className="text-muted-foreground mb-4">
              When you download content from our Website, you are granted a limited, non-exclusive, 
              non-transferable license to use the content for the following purposes:
            </p>
            <h3 className="text-xl font-semibold mb-2">Permitted Uses:</h3>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Personal, non-commercial use at home</li>
              <li>Educational use in classrooms and schools</li>
              <li>Use by non-profit organizations for educational activities</li>
              <li>Printing unlimited copies for personal use</li>
              <li>Sharing printed copies with family members and students</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">Prohibited Uses:</h3>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Selling, redistributing, or sublicensing downloaded content</li>
              <li>Using content for commercial purposes without explicit written permission</li>
              <li>Claiming ownership or authorship of our content</li>
              <li>Removing or altering any watermarks, credits, or copyright notices</li>
              <li>Creating derivative works for commercial distribution</li>
              <li>Uploading content to other websites or file-sharing platforms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Intellectual Property Rights</h2>
            <p className="text-muted-foreground mb-4">
              All content on this Website, including but not limited to images, text, graphics, logos, and 
              downloadable materials, is the property of Creative Coloring Pages or its content suppliers 
              and is protected by international copyright laws. The compilation of all content on this 
              Website is the exclusive property of Creative Coloring Pages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              Some features of our Website may require you to create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Purchases and Payments</h2>
            <p className="text-muted-foreground mb-4">
              For premium content purchases:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>All prices are displayed in USD unless otherwise stated</li>
              <li>Payment is processed securely through our payment partners</li>
              <li>Digital products are delivered immediately upon successful payment</li>
              <li>Due to the digital nature of our products, all sales are final</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Refund Policy</h2>
            <p className="text-muted-foreground mb-4">
              Due to the digital nature of our products, we generally do not offer refunds. However, we may 
              consider refund requests in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Technical issues preventing access to purchased content</li>
              <li>Duplicate purchases made in error</li>
              <li>Product significantly different from its description</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              Refund requests must be made within 7 days of purchase by contacting us through our contact form.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. User Conduct</h2>
            <p className="text-muted-foreground mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4">
              <li>Use the Website for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Website</li>
              <li>Interfere with or disrupt the Website or servers</li>
              <li>Use automated systems to access the Website without permission</li>
              <li>Submit false or misleading information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground mb-4">
              THE WEBSITE AND ALL CONTENT ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY 
              KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE WEBSITE WILL BE UNINTERRUPTED, 
              ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              TO THE FULLEST EXTENT PERMITTED BY LAW, CREATIVE COLORING PAGES SHALL NOT BE LIABLE FOR ANY 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING 
              TO YOUR USE OF THE WEBSITE OR DOWNLOADED CONTENT.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Indemnification</h2>
            <p className="text-muted-foreground mb-4">
              You agree to indemnify and hold harmless Creative Coloring Pages and its affiliates from any 
              claims, damages, losses, or expenses arising from your use of the Website or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These Terms shall be governed by and construed in accordance with applicable laws, without 
              regard to conflict of law principles. Any disputes arising under these Terms shall be resolved 
              through good-faith negotiation or, if necessary, through appropriate legal channels.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately 
              upon posting to the Website. Your continued use of the Website after any changes constitutes 
              acceptance of the new Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">14. Severability</h2>
            <p className="text-muted-foreground mb-4">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall 
              be limited or eliminated to the minimum extent necessary, and the remaining provisions shall 
              remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">15. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us:
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
