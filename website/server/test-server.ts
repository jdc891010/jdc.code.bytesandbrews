import express from 'express';
import { registerRoutes } from './routes.js';
import { createServer } from 'http';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register routes
const server = await registerRoutes(app);

// Simple test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// Start server on a different port for testing
const testPort = 5001;
server.listen(testPort, () => {
  console.log(`Test server running on port ${testPort}`);
  console.log('You can now test the blog endpoints:');
  console.log(`  GET http://localhost:${testPort}/api/blog-posts`);
  console.log(`  GET http://localhost:${testPort}/api/blog-posts/avoidcabinfever`);
});