import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { storage } from './storage.js';

interface BlogMetadata {
  title: string;
  description: string;
  slug: string;
  content: string;
}

function extractBlogMetadata(filePath: string, fileName: string): BlogMetadata {
  const content = readFileSync(filePath, 'utf-8');
  
  // Extract title from Helmet component
  const titleMatch = content.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(' - Brews and Bytes', '') : fileName.replace('.tsx', '');
  
  // Extract description from meta tag
  const descMatch = content.match(/<meta name="description" content="([^"]+)"/);
  const description = descMatch ? descMatch[1] : '';
  
  // Generate slug from filename
  const slug = fileName.replace('.tsx', '').toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, '');
  
  // Extract main content from prose section - updated regex to match actual structure
  const proseMatch = content.match(/<div className="prose[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/);
  let mainContent = '';
  
  if (proseMatch) {
    // Clean up the content - remove JSX syntax and convert to markdown-like format
    mainContent = proseMatch[1]
      .replace(/<p[^>]*>/g, '\n\n')
      .replace(/<\/p>/g, '')
      .replace(/<h2[^>]*>(.*?)<\/h2>/g, '\n\n## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/g, '\n\n### $1\n')
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<code>(.*?)<\/code>/g, '`$1`')
      .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
      .replace(/<[^>]+>/g, '') // Remove remaining HTML tags
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
      .trim();
  }
  
  return {
    title,
    description,
    slug,
    content: mainContent
  };
}

async function loadBlogsToDatabase() {
  const blogDir = join(process.cwd(), 'client', 'src', 'pages', 'blog');
  
  try {
    const files = readdirSync(blogDir).filter(file => file.endsWith('.tsx'));
    
    console.log(`Found ${files.length} blog files to process...`);
    
    for (const file of files) {
      const filePath = join(blogDir, file);
      const metadata = extractBlogMetadata(filePath, file);
      
      console.log(`Processing: ${metadata.title}`);
      
      // Check if blog post already exists
      const existingPosts = await storage.getAllBlogPosts();
      const existingPost = existingPosts.find(post => post.slug === metadata.slug);
      
      if (existingPost) {
        console.log(`  - Blog post with slug '${metadata.slug}' already exists, updating...`);
        // Update existing post instead of skipping
        const updatedPost = await storage.updateBlogPost(existingPost.id, {
          title: metadata.title,
          content: metadata.content,
          excerpt: metadata.description,
          status: 'published'
          // Not including publishedAt to avoid date format issues
        });
        
        if (updatedPost) {
          console.log(`  - Updated blog post: ${updatedPost.title}`);
        } else {
          console.log(`  - Failed to update blog post with slug '${metadata.slug}'`);
        }
        continue;
      }
      
      // Create blog post
      const blogPost = await storage.createBlogPost({
        title: metadata.title,
        slug: metadata.slug,
        content: metadata.content,
        excerpt: metadata.description,
        status: 'published'
        // Not including publishedAt to avoid date format issues
      });
      
      console.log(`  - Created blog post: ${blogPost.title}`);
    }
    
    console.log('\n✅ Blog loading completed successfully!');
    
    // Display summary
    const allPosts = await storage.getAllBlogPosts();
    console.log(`\nTotal blog posts in database: ${allPosts.length}`);
    allPosts.forEach(post => {
      console.log(`  - ${post.title} (${post.status})`);
    });
    
  } catch (error) {
    console.error('❌ Error loading blogs:', error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  loadBlogsToDatabase().then(() => {
    console.log('\n🎉 Script completed!');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

export { loadBlogsToDatabase };