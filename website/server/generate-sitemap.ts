import { createWriteStream } from 'fs';
import { join } from 'path';
import { storage } from '../server/storage.js';

async function generateSitemap() {
  const sitemapStream = createWriteStream(join(process.cwd(), 'client', 'public', 'sitemap-dynamic.xml'));
  
  sitemapStream.write('<?xml version="1.0" encoding="UTF-8"?>\n');
  sitemapStream.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n');
  
  // Add static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/community', priority: '0.8', changefreq: 'weekly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/creature-tribes', priority: '0.8', changefreq: 'weekly' },
    { url: '/download', priority: '0.8', changefreq: 'monthly' },
    { url: '/features', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog', priority: '0.9', changefreq: 'weekly' },
    { url: '/coffee-shops', priority: '0.9', changefreq: 'daily' },
    { url: '/signup', priority: '0.7', changefreq: 'monthly' },
    { url: '/login', priority: '0.6', changefreq: 'monthly' },
    { url: '/terms', priority: '0.5', changefreq: 'yearly' },
    { url: '/privacy', priority: '0.5', changefreq: 'yearly' }
  ];
  
  for (const page of staticPages) {
    sitemapStream.write(`  <url>\n`);
    sitemapStream.write(`    <loc>https://www.brewsandbytes.com${page.url}</loc>\n`);
    sitemapStream.write(`    <lastmod>${new Date().toISOString()}</lastmod>\n`);
    sitemapStream.write(`    <priority>${page.priority}</priority>\n`);
    sitemapStream.write(`    <changefreq>${page.changefreq}</changefreq>\n`);
    sitemapStream.write(`  </url>\n`);
  }
  
  // Add blog posts
  try {
    const blogPosts = await storage.getPublishedBlogPosts();
    for (const post of blogPosts) {
      sitemapStream.write(`  <url>\n`);
      sitemapStream.write(`    <loc>https://www.brewsandbytes.com/blog/${post.slug}</loc>\n`);
      sitemapStream.write(`    <lastmod>${post.updatedAt || post.createdAt || new Date().toISOString()}</lastmod>\n`);
      sitemapStream.write(`    <priority>0.8</priority>\n`);
      sitemapStream.write(`    <changefreq>monthly</changefreq>\n`);
      sitemapStream.write(`  </url>\n`);
    }
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }
  
  // Add coffee shops
  try {
    const coffeeShops = await storage.getAllCoffeeShops();
    for (const shop of coffeeShops) {
      sitemapStream.write(`  <url>\n`);
      sitemapStream.write(`    <loc>https://www.brewsandbytes.com/coffee-shops/${shop.id}</loc>\n`);
      sitemapStream.write(`    <lastmod>${shop.updatedAt || shop.createdAt || new Date().toISOString()}</lastmod>\n`);
      sitemapStream.write(`    <priority>0.7</priority>\n`);
      sitemapStream.write(`    <changefreq>monthly</changefreq>\n`);
      sitemapStream.write(`  </url>\n`);
    }
  } catch (error) {
    console.error('Error fetching coffee shops for sitemap:', error);
  }
  
  sitemapStream.write('</urlset>\n');
  sitemapStream.end();
  
  console.log('Dynamic sitemap generated successfully!');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap().then(() => {
    console.log('Sitemap generation completed!');
    process.exit(0);
  }).catch(error => {
    console.error('Sitemap generation failed:', error);
    process.exit(1);
  });
}

export { generateSitemap };