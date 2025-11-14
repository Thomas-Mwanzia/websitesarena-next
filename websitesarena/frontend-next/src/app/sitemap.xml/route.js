export async function GET() {
  const baseUrl = process.env.SITE_URL || 'https://websitesarena.com';

  // Default static routes - ONLY public, indexable pages
  const staticRoutes = [
    '',
    'webdevelopment',
    'contact',
    'about',
    'pastprojects',
    'blog',
    'feedbacks',
    'packages',
    'mobileappdev',
    'careers',
    // NOTE: Excluded protected pages:
    // - signin (user-only page, not meant for SEO)
    // - dashboard/* (protected routes)
    // - clientauth (protected route)
    // - notfound (error page)
    // - networkerror (error page)
  ];

  // Helper to normalize URL
  const makeUrl = (path) => `${baseUrl}/${path}`.replace(/([^:]\/)\/+/g, '$1');

  let dynamicRoutes = [];

  // 1) Try reading a local JSON file with dynamic slugs (optional)
  try {
    const fs = await import('fs');
    const path = await import('path');
    const dataPath = path.resolve(process.cwd(), 'src', 'data', 'dynamicRoutes.json');
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) dynamicRoutes = parsed;
    }
  } catch (e) {
    // ignore — optional file
  }

  // 2) If no local file, optionally try fetching from a backend API (env BACKEND_URL)
  if (dynamicRoutes.length === 0 && process.env.BACKEND_URL) {
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/api/sitemap-slugs`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) dynamicRoutes = json;
      }
    } catch (e) {
      // ignore fetch errors — fallback to staticRoutes
    }
  }

  // Merge and dedupe routes
  const allRoutes = Array.from(new Set([...staticRoutes, ...dynamicRoutes]));

  const urls = allRoutes
    .map((path) => {
      const url = makeUrl(path || '');
      return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=0, s-maxage=3600'
    }
  });
}
