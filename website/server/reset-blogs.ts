import { storage } from './storage.js';

async function clearAndLoadBlogs() {
  try {
    // Get all blog posts
    const blogPosts = await storage.getAllBlogPosts();
    
    // Delete all existing blog posts
    for (const post of blogPosts) {
      await storage.deleteBlogPost(post.id);
      console.log(`Deleted blog post: ${post.title}`);
    }
    
    console.log(`Deleted ${blogPosts.length} existing blog posts`);
    
    // Import and run the load script
    const loadModule = await import('./load-blogs.js');
    await loadModule.loadBlogsToDatabase();
    
  } catch (error) {
    console.error('Error clearing and loading blogs:', error);
  }
}

clearAndLoadBlogs();