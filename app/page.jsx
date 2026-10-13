import fs from 'fs';
import path from 'path';
import Script from 'next/script';

export default function HomePage() {
  const cleanBodyHtml = fs.readFileSync(path.join(process.cwd(), 'app/clean_body.html'), 'utf8');

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: cleanBodyHtml }} />
      <Script src="/js/bootstrap.js" strategy="beforeInteractive" />
      <Script src="/js/site.js" strategy="afterInteractive" />
      <Script src="/js/portfolio-runtime.js" strategy="afterInteractive" />
    </>
  );
}
