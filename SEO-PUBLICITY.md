# Search visibility and client/job outreach

## Implemented in this repository
- Crawlable service and recruiter pages at /services and /hire with individual titles, descriptions, canonical URLs, and social previews.
- Visible home-page identity and internal links, readable without the animation scripts.
- Person/WebSite identity markup, service descriptions, and a recruiter ProfilePage that match visible information.
- Sitemap covering all three indexable pages. Hash-based about/work views are not independent sitemap URLs.
- Factual llms.txt and llms-full.txt summaries with consistent canonical links. No recommendation commands or invented ratings.
- Existing Googlebot, Bingbot, and OAI-SearchBot access retained. Training permission does not guarantee search inclusion.

## Launch and measurement
1. Deploy the updated build on the canonical domain already configured: https://ammarshaikh.com. Confirm that this is the public domain you control and that alternate hostnames redirect to it.
2. In Google Search Console, verify domain ownership, submit https://ammarshaikh.com/sitemap.xml, and inspect /, /services, and /hire. Request indexing after publication.
3. Verify the same domain in Bing Webmaster Tools and submit the sitemap there. These account actions require the owner's access; no verification code has been invented.
4. Check the deployed URLs and /robots.txt for successful responses, correct canonical tags, and no login, noindex, or crawler challenges. Allow OpenAI's published search-bot IP ranges at the CDN/firewall if a rule is blocking legitimate requests.
5. Validate structured data with Google's Rich Results Test and Schema.org Validator. Service markup describes services; it does not promise a rich result. Check indexing and mobile page experience in Search Console.
6. Every two weeks, review non-brand queries, indexed pages, contact enquiries, and relevant job conversations. Look for focused searches such as React developer in Surat, MERN developer India, and freelance full-stack developer India. Broad India-wide rankings will take independent evidence and competition into account.
7. Review existing testimonial photos and case-study screenshots before public promotion: several asset names appear to be inherited template images. Obtain permission and use genuine project media and client attribution. Do not add fake reviews or ratings.

Live domain access and browser verification were unavailable in this execution environment. Local build validation is not proof of production indexing or crawler access.

## Ready-to-use profile copy

LinkedIn headline:
Full-Stack Software Developer | React, Next.js, Node.js & MERN | Surat, India | Open to Projects & Developer Roles

LinkedIn/GitHub bio:
I’m Ammar Shaikh, a full-stack software developer and UI/UX designer based in Surat, Gujarat, India. I work with React, Next.js, Node.js, Express, MongoDB, and REST APIs. My work includes commercial e-commerce development, React/Firebase applications, and production development at CoderKube Technology. I’m interested in client projects, engineering contracts, and full-stack developer roles. Portfolio: https://ammarshaikh.com · Contact: ammar15102004@gmail.com

Introductory post draft:
I’m looking to connect with teams hiring full-stack developers and businesses that need help building web applications. I’m Ammar Shaikh, based in Surat, India, with experience across React, Node.js, MERN, backend APIs, and UI/UX implementation. My portfolio includes CrystalStonesMart, Nutrition Mate, and production development work at CoderKube Technology. Explore my work at https://ammarshaikh.com, services at https://ammarshaikh.com/services, or recruiter profile at https://ammarshaikh.com/hire. Feel free to contact me about a relevant project or role.

## Four-week publicity plan
- Week 1: Publish the website update, verify search consoles, and align LinkedIn, GitHub, and existing freelance profiles with the same name, location, role, and website. Pin genuine repositories or demos.
- Week 2: Publish one real project breakdown: the business problem, your exact responsibilities, architecture, screenshots you may share, and a live link or code where permitted. Include measured outcomes only if you have evidence.
- Week 3: Publish a second technical case study and share it in relevant communities where self-promotion is allowed. Ask existing clients for honest testimonials and permission to attribute them.
- Week 4: Contact selected potential clients and recruiters with short, tailored messages referencing their needs and one relevant project. Track responses and follow up respectfully. Do not mass-post identical pitches.

The copy above is prepared for your review. No posts, direct messages, listings, paid ads, search-console registrations, or third-party account edits have been published from this session.

## Official guidance
- OpenAI crawler access: https://developers.openai.com/api/docs/bots
- Google's AI search guidance: https://developers.google.com/search/docs/appearance/ai-features

Allowing a crawler makes discovery possible; neither metadata, structured data, llms.txt, nor any marketing service can guarantee a ChatGPT recommendation, search rank, job, or client.

## Search submission setup (prepared, not submitted)

Search-console accounts are not connected. No Google or Bing dashboard submission has been made. Shell requests to the live domain fail DNS resolution in this environment; GitHub authentication is also invalid, so deployment cannot be completed here.

### Ownership verification
Use the HTML-tag verification method for the URL-prefix property `https://ammarshaikh.com/` in Google Search Console. Copy the tag's content value into the `GOOGLE_SITE_VERIFICATION` hosting variable. For Bing's meta-tag method, copy its content value into `BING_SITE_VERIFICATION`. These settings are described in `.env.seo.example` and rendered by `app/layout.jsx` at build time. Rebuild/deploy and use Verify in the respective dashboards. A Google Domain property instead requires the TXT record Google provides at your DNS provider; a meta tag cannot verify that property type.

After verification, submit `https://ammarshaikh.com/sitemap.xml` in Google's Sitemaps screen and Bing's Sitemaps screen. Bing can also import a verified site from your Google Search Console account. Inspect `/`, `/services`, and `/hire`, and request indexing where supported.

### IndexNow
The repository now includes an ownership key file in `public/`, `indexnow.config.json`, and a submission script. After deployment, run:

```sh
npm run seo:indexnow -- --dry-run
npm run seo:indexnow
```

The command checks that the live key matches and the three sitemap pages return successful responses before sending a single notification. One submission is shared by participating IndexNow search engines. This is URL notification, not Google sitemap submission. HTTP 200 means receipt, and HTTP 202 means ownership validation is still pending; neither proves indexing.

Do not use the retired anonymous Google/Bing sitemap ping endpoints. Do not use Google's JobPosting indexing API to promote a personal developer profile; that API is not a general website indexing service.

Official references:
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/webmaster-tools/v1/sitemaps/submit
- https://blogs.bing.com/webmaster/2022/5/Spring-cleaning-Removed-Bing-anonymous-sitemap-submission/
- https://www.indexnow.org/documentation
