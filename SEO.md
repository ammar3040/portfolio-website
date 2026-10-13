# Profile search setup

Working canonical domain: https://ammarshaikh.com (matches the existing Next.js metadata). Confirm that this is the domain you actually use before deployment; all canonical, sitemap, crawler and profile image URLs must point to the same live domain.

Main image: `/assets/ammar1.jpeg`, 1024×1024 JPEG, used in the visible hero, navigation, social sharing metadata and ImageObject/Person/ProfilePage structured data. Original photo preserved as `ammar1-original.jpeg` in the asset directories. The square crop was produced using the imagegen skill and visually inspected.

The sitemap includes the canonical homepage and portrait. Secondary paths currently redirect to hash views of the homepage, so they are excluded from the sitemap. Dedicated, server-rendered project/about routes with their own canonical metadata would allow those views to become independently indexable pages.

After deployment:
1. Verify the live domain in Google Search Console.
2. Submit `/sitemap.xml` and use URL Inspection to request indexing of the homepage.
3. Check that the homepage and `/assets/ammar1.jpeg` return HTTP 200 without authentication.
4. Test the homepage in Google's Rich Results Test.
5. Link this domain consistently from your genuine LinkedIn, GitHub and other professional profiles.

Google determines rankings and search-result images. Structured data, a sitemap and a preferred image do not guarantee first position, indexing or that Google will select this photo.

References:
- https://developers.google.com/search/docs/fundamentals/do-i-need-seo
- https://developers.google.com/search/docs/appearance/structured-data/profile-page

Local metadata, schema-reference, sitemap XML, JPEG dimension, CSS and syntax checks passed. A full Next.js build and live verification remain blocked by missing dependencies and network DNS in this environment.
