import './globals.css';
import ClientShell from '../components/ClientShell';
import { BOOTSTRAP_JS } from '../lib/bootstrap';

export const metadata = {
  metadataBase: new URL('https://ammarshaikh.com'),
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
  title: 'Ammar Shaikh | Full-Stack Software Developer in India',
  description: 'Ammar Shaikh is a full-stack software developer in Surat, India. Explore React, Next.js, MERN, and backend API work for client projects and developer roles.',
  keywords: ['Ammar Shaikh', 'Ammar Shaikh developer', 'full-stack developer Surat', 'MERN developer', 'React developer'],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  authors: [{ name: 'Ammar Shaikh' }],
  creator: 'Ammar Shaikh',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://ammarshaikh.com/',
    siteName: 'Ammar Shaikh — Full-Stack Developer & Designer',
    title: 'Ammar Shaikh | Full-Stack Software Developer in India',
    description: 'Explore Ammar Shaikh’s full-stack development work from Surat, India: React, Next.js, Node.js, MERN applications, and backend APIs. Contact him for projects or developer roles.',
    images: [
      {
        url: '/assets/ammar1.jpeg',
        width: 1024,
        height: 1024,
        alt: 'Ammar Shaikh — Full-Stack Developer, Surat, India',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Ammar Shaikh | Full-Stack Software Developer in India',
    description: 'Full-stack software developer in Surat, India. Explore Ammar Shaikh’s React, Node.js, and MERN portfolio for client projects and developer roles.',
    images: ['/assets/ammar1.jpeg'],
  },
  icons: {
    icon: [
      { url: '/assets/favicon-32.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/assets/favicon-180.png?v=2', sizes: '180x180', type: 'image/png' },
    ],
    apple: [
      { url: '/assets/favicon-180.png?v=2', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: 'https://ammarshaikh.com/',
    types: {
      'text/plain': [
        { url: '/llms.txt', title: 'LLM-readable profile' },
        { url: '/llms-full.txt', title: 'Comprehensive LLM documentation & context' }
      ]
    }
  }
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ImageObject',
      '@id': 'https://ammarshaikh.com/#portrait',
      contentUrl: 'https://ammarshaikh.com/assets/ammar1.jpeg',
      url: 'https://ammarshaikh.com/assets/ammar1.jpeg',
      caption: 'Ammar Shaikh — Full-Stack Developer in Surat, India',
      width: 1024,
      height: 1024
    },
    {
      '@type': 'Person',
      '@id': 'https://ammarshaikh.com/#person',
      name: 'Ammar Shaikh',
      jobTitle: 'Full-Stack Software Developer',
      description: 'Full-stack developer and UI/UX designer based in Surat, Gujarat, India, building web applications and backend APIs.',
      knowsAbout: ['React', 'Next.js', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'MERN stack', 'REST APIs', 'UI/UX design', 'Python', 'Laravel'],
      image: { '@id': 'https://ammarshaikh.com/#portrait' },
      url: 'https://ammarshaikh.com/',
      mainEntityOfPage: { '@id': 'https://ammarshaikh.com/hire#profile' },
      email: 'ammar15102004@gmail.com',
      telephone: '+919898326125',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Surat',
        addressRegion: 'Gujarat',
        addressCountry: 'IN'
      },
      sameAs: [
        'https://www.linkedin.com/in/ammar-shaikh-747897250',
        'https://github.com/ammar3040',
        'https://www.instagram.com/ammar_3040/',
        'https://wa.me/919898326125'
      ]
    },
    {
      '@type': 'WebSite',
      '@id': 'https://ammarshaikh.com/#website',
      url: 'https://ammarshaikh.com/',
      name: 'Ammar Shaikh — Full-Stack Developer & Designer in Surat, India',
      description: 'Portfolio of Ammar Shaikh — affordable full-stack developer and UI/UX designer for hire.'
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/assets/hero-shader.webp" fetchPriority="high" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Figtree:wght@300;400;500&family=Inter:wght@300;400&family=Roboto:wght@500;800&family=Lato:wght@300;400;700&family=Space+Grotesk:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400..600;1,400..600&family=Darker+Grotesque:wght@700&family=Bitter:ital,wght@1,400&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{ __html: BOOTSTRAP_JS }}
        />
        <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js" async></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.addEventListener('load', function() {
              if (window.supabase) {
                window.__supabase = window.supabase.createClient(
                  'https://ldlxdalxlvqpvukuchew.supabase.co',
                  'sb_publishable_RPR3CwyDLbmZDSc1cbcgqA_CmAtVpag'
                );
              }
            });`
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ClientShell>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
