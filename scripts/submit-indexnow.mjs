import fs from 'node:fs/promises';

const dryRun = process.argv.includes('--dry-run');
const timeout = () => AbortSignal.timeout(15000);

async function main() {
  const config = JSON.parse(await fs.readFile(new URL('../indexnow.config.json', import.meta.url), 'utf8'));
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(config.key)) throw new Error('Invalid IndexNow key.');
  const origin = new URL(`https://${config.host}`);
  const keyLocation = new URL(config.keyLocation);
  if (keyLocation.origin !== origin.origin || keyLocation.pathname !== `/${config.key}.txt`) {
    throw new Error('The ownership key must be at the configured site root.');
  }
  const localKey = await fs.readFile(new URL(`../public/${config.key}.txt`, import.meta.url), 'utf8');
  if (localKey.trim() !== config.key) throw new Error('Local key file does not match the configuration.');
  const sitemap = await fs.readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  const urlList = [...sitemap.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(match => match[1].trim());
  if (!urlList.length || urlList.length > 10000) throw new Error('Expected 1–10,000 sitemap URLs.');
  if (urlList.some(url => new URL(url).origin !== origin.origin)) throw new Error('All URLs must belong to the configured HTTPS host.');
  const payload = { ...config, urlList };
  if (dryRun) {
    console.log(`Local configuration validated for ${config.host}. No submission sent.`);
    console.log(urlList.join('\n'));
    return;
  }
  const response = await fetch(keyLocation, { signal: timeout(), redirect: 'error' });
  if (!response.ok || (await response.text()).trim() !== config.key) {
    throw new Error('Ownership key is not available on the live domain. Deploy the current public directory first. No submission sent.');
  }
  for (const url of urlList) {
    const page = await fetch(url, { method: 'HEAD', signal: timeout(), redirect: 'error' });
    if (!page.ok) throw new Error(`Live page check failed (${page.status}): ${url}. No submission sent.`);
    if (/noindex|\bnone\b/i.test(page.headers.get('x-robots-tag') || '')) {
      throw new Error(`Live page is marked noindex: ${url}. No submission sent.`);
    }
  }
  const submitted = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload), signal: timeout(),
  });
  if (submitted.status === 200) console.log(`IndexNow received ${urlList.length} URLs. Receipt does not guarantee indexing.`);
  else if (submitted.status === 202) console.log(`IndexNow received ${urlList.length} URLs; ownership validation is pending. Indexing is not confirmed.`);
  else throw new Error(`IndexNow rejected the notification (HTTP ${submitted.status}).`);
}
main().catch(error => {
  console.error(`IndexNow not completed: ${error.message}`);
  process.exitCode = 1;
});
