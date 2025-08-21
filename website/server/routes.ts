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

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
