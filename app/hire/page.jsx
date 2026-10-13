import ProfessionalPage from '../../components/ProfessionalPage';
import { pageMetadata, SITE_URL, PERSON_ID } from '../../lib/seo';

export const metadata = pageMetadata(
  'Hire Ammar Shaikh | Full-Stack & MERN Developer in India',
  'Ammar Shaikh is a full-stack software developer in Surat, India. Review his React, Node.js, MERN, API, and commercial project experience for your team.',
  '/hire'
);

export default function HirePage() {
  const schema = {
    '@context': 'https://schema.org', '@type': 'ProfilePage',
    '@id': `${SITE_URL}/hire#profile`, url: `${SITE_URL}/hire`,
    name: metadata.title, mainEntity: { '@id': PERSON_ID },
    isPartOf: { '@id': `${SITE_URL}/#website` },
  };
  return (
    <ProfessionalPage title="Hire Ammar Shaikh — full-stack developer in India" intro="I’m a software developer based in Surat, Gujarat, with production experience across frontend interfaces, backend APIs, and databases. I’m interested in full-stack, MERN, and React/Node.js developer opportunities, including remote roles and contract work.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section>
        <h2>Technical focus</h2>
        <ul><li>Frontend: React, Next.js, JavaScript, responsive interfaces, and UI/UX implementation.</li><li>Backend: Node.js, Express, REST APIs, JWT authentication, and role-based access.</li><li>Data and additional experience: MongoDB, Firebase Firestore, Python, and Laravel.</li><li>Delivery: connecting frontend and backend workflows, integrating third-party APIs, and maintaining production applications.</li></ul>
      </section>
      <section>
        <h2>Professional and independent work</h2>
        <h3>CoderKube Technology — MERN Stack Developer</h3>
        <p>My portfolio describes work on client and in-house applications including JD Web and Ship, across MERN, Python, and Laravel. Responsibilities include web application development, REST APIs, and database integration.</p>
        <h3>CrystalStonesMart — commercial e-commerce development</h3>
        <p>An independent MERN build for a paying client, covering product catalogs, cart workflows, Google OAuth, orders, and an analytics portal.</p>
        <h3>Nutrition Mate — React and Firebase</h3>
        <p>A health and wellness application using React and Firebase Firestore, with BMI calculation and calorie planning.</p>
        <p><a href="/#work">View project details</a> · <a href="https://github.com/ammar3040">Review code on GitHub</a></p>
      </section>
      <section>
        <h2>For recruiters and engineering teams</h2>
        <p>Send the job description, technology stack, location or remote policy, and interview process. We can discuss fit, availability, and joining timelines directly.</p>
        <p>For a resume or additional project context, <a href="mailto:ammar15102004@gmail.com?subject=Developer%20opportunity%20for%20Ammar%20Shaikh">email me</a> or connect on LinkedIn.</p>
        <p>Looking for help with a client project? <a href="/services">Explore my development services</a>.</p>
      </section>
    </ProfessionalPage>
  );
}
