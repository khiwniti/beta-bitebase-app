import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bitebase.com';
  
  const staticPages = [
    '',
    '/auth',
    '/dashboard',
    '/market-analysis',
    '/place',
    '/product',
    '/price',
    '/promotion',
    '/reports',
    '/subscription',
    '/restaurant-explorer',
    '/franchise',
    '/campaigns',
    '/pos-integration',
    '/restaurant-settings',
    '/settings',
  ];

  const blogPosts = [
    '/blog/restaurant-analytics-guide',
    '/blog/market-analysis-best-practices',
    '/blog/ai-powered-restaurant-insights',
    '/blog/location-intelligence-for-restaurants',
    '/blog/menu-optimization-strategies',
    '/blog/competitor-analysis-tools',
    '/blog/restaurant-pricing-strategies',
    '/blog/customer-behavior-analytics',
    '/blog/restaurant-technology-trends',
    '/blog/franchise-management-tips',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`
    )
    .join('')}
  ${blogPosts
    .map(
      (post) => `
  <url>
    <loc>${baseUrl}${post}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}