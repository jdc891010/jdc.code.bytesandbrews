import { storage } from './storage.js';

async function checkBlogs() {
  try {
    const blogPosts = await storage.getAllBlogPosts();
    console.log(`Total blog posts in database: ${blogPosts.length}`);
    
    if (blogPosts.length > 0) {
      console.log('\nBlog posts:');
      blogPosts.forEach(post => {
        console.log(`- ID: ${post.id}`);
        console.log(`  Title: ${post.title}`);
        console.log(`  Slug: ${post.slug}`);
        console.log(`  Status: ${post.status}`);
        console.log(`  Excerpt: ${post.excerpt}`);
        console.log(`  Content length: ${post.content?.length || 0} characters`);
        console.log(`  Content preview: ${post.content?.substring(0, 100)}...`);
        console.log('---');
      });
    } else {
      console.log('No blog posts found in database');
    }
  } catch (error) {
    console.error('Error checking blogs:', error);
  }
}

checkBlogs();