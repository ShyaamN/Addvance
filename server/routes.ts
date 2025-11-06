import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all topics
  app.get("/api/topics", async (req, res) => {
    try {
      const topics = await storage.getAllTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch topics" });
    }
  });

  // Get topics by year level
  app.get("/api/topics/year/:yearLevel", async (req, res) => {
    try {
      const yearLevel = parseInt(req.params.yearLevel);
      if (isNaN(yearLevel)) {
        return res.status(400).json({ error: "Invalid year level" });
      }
      const topics = await storage.getTopicsByYear(yearLevel);
      res.json(topics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch topics" });
    }
  });

  // Get a specific topic by ID
  app.get("/api/topics/:topicId", async (req, res) => {
    try {
      const topic = await storage.getTopicById(req.params.topicId);
      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }
      res.json(topic);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch topic" });
    }
  });

  // Get year levels summary
  app.get("/api/year-levels", async (req, res) => {
    try {
      const topics = await storage.getAllTopics();
      const yearLevels = [
        { year: 6, grade: "Year 6", topics: topics.filter(t => t.yearLevel === 6).length },
        { year: 7, grade: "Year 7", topics: topics.filter(t => t.yearLevel === 7).length },
        { year: 8, grade: "Year 8", topics: topics.filter(t => t.yearLevel === 8).length },
        { year: 9, grade: "Year 9 GCSE", topics: topics.filter(t => t.yearLevel === 9).length },
        { year: 10, grade: "Year 10 GCSE", topics: topics.filter(t => t.yearLevel === 10).length },
        { year: 11, grade: "Year 11 GCSE", topics: topics.filter(t => t.yearLevel === 11).length },
      ];
      res.json(yearLevels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch year levels" });
    }
  });

  // Create or update a topic
  app.post("/api/topics", async (req, res) => {
    try {
      const topic = req.body;
      if (!topic.id || !topic.name || !topic.yearLevel) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      await storage.saveTopic(topic);
      res.json({ success: true, topic });
    } catch (error) {
      console.error("Error saving topic:", error);
      res.status(500).json({ error: "Failed to save topic" });
    }
  });

  // Update a topic
  app.put("/api/topics/:topicId", async (req, res) => {
    try {
      const topic = req.body;
      if (topic.id !== req.params.topicId) {
        return res.status(400).json({ error: "Topic ID mismatch" });
      }
      await storage.updateTopic(topic);
      res.json({ success: true, topic });
    } catch (error) {
      console.error("Error updating topic:", error);
      res.status(500).json({ error: "Failed to update topic" });
    }
  });

  // Delete a topic
  app.delete("/api/topics/:topicId", async (req, res) => {
    try {
      await storage.deleteTopic(req.params.topicId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting topic:", error);
      res.status(500).json({ error: "Failed to delete topic" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
