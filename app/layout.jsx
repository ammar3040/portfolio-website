import './globals.css';
import ClientShell from '../components/ClientShell';
import { BOOTSTRAP_JS } from '../lib/bootstrap';

export const metadata = {
  metadataBase: new URL('https://ammarshaikh.com'),
  title: 'Ammar Shaikh — Full-Stack Developer & Designer in Surat | Hire MERN Stack Engineer | Affordable Web & App Development',
  description: 'Ammar Shaikh — Full-stack developer and UI/UX designer in Surat, Gujarat, India. 3+ years shipping production MERN apps, React dashboards, mobile applications & beautiful interfaces. Affordable, reliable freelance developer-designer for hire. 15+ live projects. Get a world-class website, software, or app designed and built fast.',
  keywords: [
    'full stack developer', 'developer in Surat', 'best cheap developer', 'affordable web developer India',
    'MERN stack developer', 'freelance developer Surat Gujarat', 'hire full stack developer',
    'software developer Surat', 'website maker', 'application maker', 'app developer India',
    'React developer', 'Node.js developer', 'MongoDB developer', 'REST API developer',
    'best developer in Surat', 'cheap website developer', 'affordable software developer',
    'UI UX designer Surat', 'web designer India', 'Figma developer'
  ],
  authors: [{ name: 'Ammar Shaikh' }],
  creator: 'Ammar Shaikh',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://ammarshaikh.com/',
    siteName: 'Ammar Shaikh — Full-Stack Developer & Designer',
    title: 'Ammar Shaikh — Full-Stack Developer & Designer in Surat | Hire Affordable MERN Developer',
    description: 'Hire Ammar Shaikh — affordable full-stack developer & UI/UX designer from Surat, India. Expert in MERN stack, React, Node.js, REST APIs, mobile apps & modern design. 15+ production projects shipped. Fast turnaround, budget-friendly rates.',
    images: [
      {
        url: '/assets/og-card.jpg',
        width: 2400,
        height: 1260,
        alt: 'Ammar Shaikh — Full-Stack Developer, Surat, India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ammar Shaikh — Full-Stack Developer & Designer in Surat | Affordable Web & App Development',
    description: 'Looking for an affordable full-stack developer & designer? Ammar Shaikh designs and builds production-grade websites, web apps, and mobile applications from Surat, India. 3+ years, 15+ live projects.',
    images: ['/assets/og-card.jpg'],
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
      '@type': 'Person',
      '@id': 'https://ammarshaikh.com/#person',
      name: 'Ammar Shaikh',
      alternateName: ['Ammar Developer', 'Ammar Shaikh Developer', 'Ammar Designer', 'Ammar Surat'],
      jobTitle: 'Full-Stack Developer, UI/UX Designer & MERN Stack Engineer',
      url: 'https://ammarshaikh.com/',
      image: 'https://ammarshaikh.com/assets/ammar1.jpeg',
      email: 'ammar15102004@gmail.com',
      telephone: '+919898326125',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Surat',
        addressLocality: 'Surat',
        addressRegion: 'Gujarat',
        postalCode: '395003',
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
