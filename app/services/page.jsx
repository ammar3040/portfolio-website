import ProfessionalPage from '../../components/ProfessionalPage';
import { pageMetadata, SITE_URL, PERSON_ID } from '../../lib/seo';

export const metadata = pageMetadata(
  'Full-Stack Development Services in India | Ammar Shaikh',
  'Work with Ammar Shaikh in Surat, India for React and Next.js websites, MERN web applications, e-commerce, backend APIs, and UI/UX implementation.',
  '/services'
);

const services = [
  ['Websites and frontend development', 'Responsive business websites and web interfaces built with React and Next.js. Turn interface designs into usable pages with attention to accessibility, loading performance, and mobile layouts.'],
  ['MERN web applications', 'Build connected applications with MongoDB, Express, React, and Node.js: dashboards, user accounts, authentication, and the backend workflows behind them.'],
  ['E-commerce development', 'Connect product catalogs, carts, customer accounts, and order management. CrystalStonesMart is an example of Ammar’s independent commercial MERN work.'],
  ['Backend APIs and database integration', 'Develop REST APIs, authentication, role-based access, and database integrations. Experience includes Node.js, Express, MongoDB, Python, and Laravel.'],
  ['UI/UX implementation and ongoing development', 'Implement polished interfaces and maintain existing applications through feature delivery, bug fixes, and third-party integrations. Discuss a project contract or ongoing engineering retainer.'],
];

export default function ServicesPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': `${SITE_URL}/services#page`, url: `${SITE_URL}/services`, name: metadata.title, about: { '@id': PERSON_ID }, isPartOf: { '@id': `${SITE_URL}/#website` } },
      ...services.map(([name, description], i) => ({ '@type': 'Service', '@id': `${SITE_URL}/services#service-${i + 1}`, name, description, url: `${SITE_URL}/services`, provider: { '@id': PERSON_ID }, areaServed: [{ '@type': 'Country', name: 'India' }], availableChannel: { '@type': 'ServiceChannel', serviceUrl: `${SITE_URL}/services` } })),
    ],
  };
  return (
    <ProfessionalPage title="Full-stack development services from India" intro="I’m Ammar Shaikh, a full-stack software developer and UI/UX designer based in Surat, Gujarat. I help clients build and maintain websites, web applications, and backend systems, with remote collaboration available.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section aria-labelledby="services-title">
        <h2 id="services-title">What I can help you build</h2>
        <div className="professional-grid">{services.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>
      <section>
        <h2>Work you can review</h2>
        <p>My portfolio includes CrystalStonesMart, a MERN e-commerce build with catalog, cart, Google OAuth, orders, and an analytics portal; Nutrition Mate, built with React and Firebase Firestore; and production development at CoderKube Technology.</p>
        <p><a href="/#work">Explore the portfolio</a> · <a href="https://crystalstonesmart.com">Visit CrystalStonesMart</a> · <a href="https://github.com/ammar3040">Review my GitHub</a></p>
      </section>
      <section>
        <h2>Before we start</h2>
        <h3>Can we work together remotely?</h3><p>Yes. I’m based in Surat, India, and can discuss remote collaboration, communication, and timezone overlap with your team.</p>
        <h3>How much does a project cost?</h3><p>Pricing depends on the scope, integrations, and delivery requirements. Email a short brief and we can discuss an estimate.</p>
        <h3>Can you work on an existing application?</h3><p>Yes. Share the stack and the changes you need, such as new features, bug fixes, API integrations, or interface improvements.</p>
        <h3>Are you also open to developer roles?</h3><p>I’m interested in full-stack and MERN developer opportunities. <a href="/hire">See my recruiter profile</a> and contact me with the job description.</p>
      </section>
    </ProfessionalPage>
  );
}
