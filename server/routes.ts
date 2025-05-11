import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";
import { apiResponseSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Proxy API for videos to avoid CORS issues
  app.get("/api/videos", async (req, res) => {
    try {
      const response = await fetch("https://video.imgdesu.art/api/videos/random");
      const data = await response.json();
      
      // Validate response against our schema
      const validatedData = apiResponseSchema.parse(data);
      
      res.json(validatedData);
    } catch (error) {
      console.error("Error fetching videos:", error);
      
      if (error instanceof ZodError) {
        res.status(500).json({ 
          message: "Invalid data received from the video API", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Failed to fetch videos from external API" 
        });
      }
    }
  });

  return httpServer;
}
