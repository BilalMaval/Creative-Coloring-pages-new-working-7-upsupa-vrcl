export function generateMetadata({ title, description, keywords, url, image, type = 'website' }) {
  const siteName = 'Free Printable Coloring Pages & Mandalas';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = 'Download free printable coloring pages and mandalas. Beautiful designs for kids and adults. Print and color today!';
  const finalDescription = description || defaultDescription;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const ogImage = image || `${baseUrl}/og-image.jpg`;

  return {
    title: fullTitle,
    description: finalDescription,
    keywords: keywords || 'coloring pages, printable coloring pages, mandalas, free printables, coloring sheets, kids coloring, adult coloring',
    authors: [{ name: siteName }],
    openGraph: {
      type,
      locale: 'en_US',
      url: fullUrl,
      siteName,
      title: fullTitle,
      description: finalDescription,
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title || siteName
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: finalDescription,
      images: [ogImage]
    },
    alternates: {
      canonical: fullUrl
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}

export function generateBreadcrumbSchema(items) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`
    }))
  };
}

export function generateArticleSchema({ title, description, image, publishDate, modifiedDate, author = 'Admin' }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: image ? `${baseUrl}${image}` : undefined,
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Free Printable Coloring Pages',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    }
  };
}

export function generateWebsiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Free Printable Coloring Pages & Mandalas',
    description: 'Download free printable coloring pages and mandalas for kids and adults',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}