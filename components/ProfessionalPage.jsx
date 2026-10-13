export default function ProfessionalPage({ title, intro, children }) {
  return (
    <main className="professional-page">
      <nav aria-label="Portfolio navigation">
        <a href="/">Ammar Shaikh · Portfolio</a>
        <a href="/services">Development services</a>
        <a href="/hire">For recruiters</a>
      </nav>
      <header>
        <p className="professional-location">Surat, Gujarat, India · Remote collaboration</p>
        <h1>{title}</h1>
        <p>{intro}</p>
        <div className="professional-actions">
          <a href="mailto:ammar15102004@gmail.com">Email Ammar</a>
          <a href="https://www.linkedin.com/in/ammar-shaikh-747897250" rel="me">LinkedIn</a>
          <a href="https://github.com/ammar3040" rel="me">GitHub</a>
        </div>
      </header>
      {children}
      <footer>
        <h2>Let’s talk about your project or role</h2>
        <p>Share your requirements, timeline, or job description. Ammar can discuss the scope, working arrangement, and next steps with you.</p>
        <a href="mailto:ammar15102004@gmail.com">ammar15102004@gmail.com</a>
        <p><a href="https://wa.me/919898326125">WhatsApp: +91 98983 26125</a></p>
      </footer>
    </main>
  );
}
