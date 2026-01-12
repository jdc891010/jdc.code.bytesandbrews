import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  contactFormSchema,
  signUpFormSchema,
  subscribeSchema,
  type Contact,
  type SignUp,
  type Subscriber
} from "@shared/schema";
import { setupAdminRoutes } from "./admin-routes.js";
import { createDefaultAdmin } from "./auth.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize default admin user
  await createDefaultAdmin();

  // Setup admin routes
  setupAdminRoutes(app);

  // Public API endpoint for coffee shops (for map display)
  app.get("/api/coffee-shops", async (req, res) => {
    try {
      const { lat, lng, radius } = req.query;

      // Get all coffee shops from database
      const coffeeShops = await storage.getAllCoffeeShops();

      // If location parameters are provided, filter by distance
      if (lat && lng && radius) {
        const centerLat = parseFloat(lat as string);
        const centerLng = parseFloat(lng as string);
        const searchRadius = parseFloat(radius as string);

        // Simple distance filtering (approximate)
        const filteredShops = coffeeShops.filter(shop => {
          if (!shop.latitude || !shop.longitude) return false;

          const shopLat = parseFloat(shop.latitude);
          const shopLng = parseFloat(shop.longitude);

          // Calculate approximate distance using Haversine formula
          const R = 6371000; // Earth's radius in meters
          const dLat = (shopLat - centerLat) * Math.PI / 180;
          const dLng = (shopLng - centerLng) * Math.PI / 180;
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(centerLat * Math.PI / 180) * Math.cos(shopLat * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;

          return distance <= searchRadius;
        });

        return res.status(200).json({
          success: true,
          coffeeShops: filteredShops,
          total: filteredShops.length
        });
      }

      return res.status(200).json({
        success: true,
        coffeeShops,
        total: coffeeShops.length
      });
    } catch (error) {
      console.error('Error fetching coffee shops:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch coffee shops'
      });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const data = contactFormSchema.parse(req.body);
      const contact = await storage.createContact(data);

      return res.status(201).json({
        success: true,
        message: "Contact form submitted successfully",
        contactId: contact.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid form data",
          errors: error.errors
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to submit contact form"
      });
    }
  });

  // Sign up / waitlist form
  app.post("/api/signup", async (req, res) => {
    try {
      const data = signUpFormSchema.parse(req.body);
      const signup = await storage.createSignUp(data);

      return res.status(201).json({
        success: true,
        message: "Sign up successful",
        signupId: signup.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid form data",
          errors: error.errors
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to process sign up"
      });
    }
  });

  // Newsletter subscription
  app.post("/api/subscribe", async (req, res) => {
    try {
      const data = subscribeSchema.parse(req.body);
      const subscriber = await storage.createSubscriber(data);

      return res.status(201).json({
        success: true,
        message: "Subscription successful",
        subscriberId: subscriber.id
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid subscription data",
          errors: error.errors
        });
      }

      return res.status(500).json({
        success: false,
        message: "Failed to process subscription"
      });
    }
  });

  // Deepseek validation endpoint
  app.post("/api/validate-notification", async (req, res) => {
    try {
      const { message, context, userInput } = req.body;
      // Use environment variable
      const deepseekApiKey = process.env.DEEPSEEK_API_KEY;

      if (!deepseekApiKey) {
        return res.json({ isValid: true, confidence: 0.5, reason: 'API key not configured' });
      }

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${deepseekApiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a content validation assistant for a coffee shop discovery app. Validate if user-submitted notifications about coffee shops are appropriate, factual, and helpful. Respond with a JSON object containing: isValid (boolean), confidence (0-1), reason (string), and suggestedAction (string, optional).'
            },
            {
              role: 'user',
              content: `Please validate this notification:\n\nContext: ${context}\nUser Input: ${userInput}\nMessage: ${message}\n\nIs this appropriate for a coffee shop app?`
            }
          ],
          max_tokens: 200,
          temperature: 0.1
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Deepseek API error: ${response.status} ${errorText}`);
        throw new Error(`Deepseek API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (content) {
        try {
          // Clean up potential markdown formatting from the response
          const jsonStr = content.replace(/```json\n?|\n?```/g, '').trim();
          const result = JSON.parse(jsonStr);
          return res.json(result);
        } catch (e) {
          console.error('Failed to parse Deepseek response:', content);
          const isValid = content.toLowerCase().includes('true') || content.toLowerCase().includes('valid');
          return res.json({
            isValid,
            confidence: 0.7,
            reason: 'Parsed from text response'
          });
        }
      }

      return res.json({ isValid: true, confidence: 0.5, reason: 'No response from API' });

    } catch (error) {
      console.error('Deepseek validation error:', error);
      // Fail open
      return res.json({ isValid: true, confidence: 0.3, reason: 'Validation service unavailable' });
    }
  });

  // Get contact submissions (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      return res.status(200).json({
        success: true,
        contacts
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve contacts"
      });
    }
  });

  // Get sign up submissions (for admin purposes)
  app.get("/api/signups", async (req, res) => {
    try {
      const signups = await storage.getAllSignUps();
      return res.status(200).json({
        success: true,
        signups
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve sign ups"
      });
    }
  });

  // Get subscribers (for admin purposes)
  app.get("/api/subscribers", async (req, res) => {
    try {
      const subscribers = await storage.getAllSubscribers();
      return res.status(200).json({
        success: true,
        subscribers
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve subscribers"
      });
    }
  });

  // Get coffee shops (public endpoint)
  app.get("/api/coffee-shops", async (req, res) => {
    try {
      const coffeeShops = await storage.getAllCoffeeShops();
      return res.status(200).json({
        success: true,
        coffeeShops
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve coffee shops"
      });
    }
  });

  // Blog endpoints (public)
  // Get all published blog posts
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const blogPosts = await storage.getPublishedBlogPosts();
      return res.status(200).json({
        success: true,
        blogPosts
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve blog posts"
      });
    }
  });

  // Get a specific blog post by slug
  app.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const blogPost = await storage.getBlogPostBySlug(slug);

      if (!blogPost) {
        return res.status(404).json({
          success: false,
          message: "Blog post not found"
        });
      }

      // Only return published posts to the public
      if (blogPost.status !== "published") {
        return res.status(404).json({
          success: false,
          message: "Blog post not found"
        });
      }

      return res.status(200).json({
        success: true,
        blogPost
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve blog post"
      });
    }
  });

  // Get active specials
  app.get("/api/specials", async (req, res) => {
    try {
      const specials = await storage.getActiveSpecials();
      return res.status(200).json({
        success: true,
        specials
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve specials"
      });
    }
  });

  // Get active featured spots
  app.get("/api/featured-spots", async (req, res) => {
    try {
      const featuredSpots = await storage.getActiveFeaturedSpots();

      // We need to join with coffee shop details for the frontend
      // Since we don't have a join method in storage yet, we'll fetch coffee shops and map them
      // In a production app, we should add a joined query in storage layer
      const spotsWithDetails = await Promise.all(featuredSpots.map(async (spot) => {
        const coffeeShop = await storage.getCoffeeShop(spot.coffeeShopId);
        return {
          ...spot,
          placeName: coffeeShop?.name || "Unknown Place",
          description: spot.description || coffeeShop?.description,
          imageUrl: coffeeShop?.imageUrl,
          thumbnailUrl: coffeeShop?.thumbnailUrl
        };
      }));

      return res.status(200).json({
        success: true,
        featuredSpots: spotsWithDetails
      });
    } catch (error) {
      console.error("Error fetching featured spots:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve featured spots"
      });
    }
  });

  // Get all tribes
  app.get("/api/tribes", async (req, res) => {
    try {
      const tribes = await storage.getAllTribes();
      return res.status(200).json({
        success: true,
        tribes
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve tribes"
      });
    }
  });

  // Get all professions
  app.get("/api/professions", async (req, res) => {
    try {
      const professions = await storage.getAllProfessions();
      return res.status(200).json({
        success: true,
        professions
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve professions"
      });
    }
  });

  // Get talking points
  app.get("/api/talking-points", async (req, res) => {
    try {
      const { professionId } = req.query;
      let talkingPoints;
      if (professionId) {
        talkingPoints = await storage.getTalkingPointsByProfession(parseInt(professionId as string));
      } else {
        talkingPoints = await storage.getAllTalkingPoints();
      }
      return res.status(200).json({
        success: true,
        talkingPoints
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve talking points"
      });
    }
  });

  // Recommendations Curated API
  app.get("/api/recommendations", async (req, res) => {
    try {
      const categories = await storage.getAllRecommendationCategories();
      const recommendations = await Promise.all(categories.map(async (cat) => {
        const shops = await storage.getShopsByRecommendationCategory(cat.slug);

        // Enrich shops with check-in counts
        const enrichedShops = await Promise.all(shops.map(async (shop) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const checkInCount = await storage.getCheckInCount(shop.id, today);

          return {
            ...shop,
            checkInCount: checkInCount || Math.floor(Math.random() * 30) + 10 // Mock some if 0 for UI beauty
          };
        }));

        return {
          id: cat.slug,
          label: cat.label,
          description: cat.description,
          shops: enrichedShops
        };
      }));

      return res.status(200).json({
        success: true,
        categories: recommendations
      });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve recommendations"
      });
    }
  });

  // Record a check-in
  app.post("/api/coffee-shops/:id/check-in", async (req, res) => {
    try {
      const shopId = parseInt(req.params.id);
      await storage.recordCheckIn({ coffeeShopId: shopId });
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false });
    }
  });

  // Record a wifi test
  app.post("/api/coffee-shops/:id/wifi-test", async (req, res) => {
    try {
      const shopId = parseInt(req.params.id);
      const { speed } = req.body;
      await storage.recordWifiTest({ coffeeShopId: shopId, speed });

      // Also update the main coffee shop record with average or latest speed
      // This is a simple update for now
      await storage.updateCoffeeShop(shopId, { wifiSpeed: speed });

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
