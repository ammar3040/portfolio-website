export const SITE_URL = 'https://ammarshaikh.com';
export const PERSON_ID = `${SITE_URL}/#person`;

export function pageMetadata(title, description, pathname) {
  const url = `${SITE_URL}${pathname}`;
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website', siteName: 'Ammar Shaikh', images: [{ url: '/assets/ammar1.jpeg', width: 1024, height: 1024, alt: 'Ammar Shaikh — Full-Stack Developer in India' }] },
    twitter: { card: 'summary', title, description, images: ['/assets/ammar1.jpeg'] },
  };
}
