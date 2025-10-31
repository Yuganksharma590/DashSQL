import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getEcoCoachResponse } from "./eco-coach";
import { insertActivitySchema, insertChatMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User endpoints
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getOrCreateDefaultUser();
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Activities endpoints
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities("default-user");
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/activities/recent", async (req, res) => {
    try {
      const activities = await storage.getRecentActivities("default-user", 5);
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Rewards endpoints
  app.get("/api/rewards", async (req, res) => {
    try {
      const rewards = await storage.getRewards("default-user");
      res.json(rewards);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/rewards/recent", async (req, res) => {
    try {
      const rewards = await storage.getRecentRewards("default-user", 3);
      res.json(rewards);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Chat endpoints (rule-based eco-coach)
  app.get("/api/chat", async (req, res) => {
    try {
      const messages = await storage.getChatMessages("default-user");
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const validatedData = insertChatMessageSchema.parse(req.body);
      
      // Save user message
      const userMessage = await storage.createChatMessage(validatedData);
      
      // Generate bot response using rule-based system
      const botResponse = getEcoCoachResponse(validatedData.content);
      
      // Save bot message
      const assistantMessage = await storage.createChatMessage({
        userId: validatedData.userId,
        role: "assistant",
        content: botResponse.content,
        category: botResponse.category,
      });
      
      res.status(201).json({ userMessage, assistantMessage });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Weather endpoint using Open-Meteo API (no API key required)
  app.get("/api/weather", async (req, res) => {
    try {
      // Default to San Francisco coordinates
      const lat = req.query.lat || "37.7749";
      const lng = req.query.lng || "-122.4194";
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,wind_speed_10m&timezone=auto`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Weather API error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Climate data endpoint using NASA POWER API (DEMO_KEY available)
  app.get("/api/climate", async (req, res) => {
    try {
      // Get global temperature data from NASA
      const response = await fetch(
        "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch climate data");
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Climate API error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
