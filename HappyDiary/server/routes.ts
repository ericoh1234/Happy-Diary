import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEntrySchema } from "@shared/schema";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Redirect root to minimal version of the journal app
  app.get("/", (req, res) => {
    res.redirect('/minimal');
  });

  // Simple Hello World route for testing
  app.get("/hello", (req, res) => {
    try {
      const filePath = path.resolve(
        process.cwd(),
        "client",
        "src",
        "hello.html"
      );
      const content = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(content);
    } catch (error) {
      console.error("Error serving hello world page:", error);
      res.status(500).send("Error loading the hello world page");
    }
  });
  
  // Simple test page for API connectivity
  app.get("/simple", (req, res) => {
    try {
      const filePath = path.resolve(
        process.cwd(),
        "client",
        "src",
        "simple.html"
      );
      const content = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(content);
    } catch (error) {
      console.error("Error serving simple test page:", error);
      res.status(500).send("Error loading the simple test page");
    }
  });
  
  // Debug page with server-side rendered information
  app.get("/debug", async (req, res) => {
    try {
      const filePath = path.resolve(
        process.cwd(),
        "client",
        "src",
        "debug.html"
      );
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Get current server time
      const serverTime = new Date().toLocaleString();
      
      // Get Node.js version
      const nodeVersion = process.version;
      
      // Get entries from storage
      const entries = await storage.getEntries();
      const entriesJson = JSON.stringify(entries.slice(0, 3), null, 2);
      
      // Replace placeholders with actual data
      content = content
        .replace('SERVER_TIME_PLACEHOLDER', serverTime)
        .replace('NODE_VERSION_PLACEHOLDER', nodeVersion)
        .replace('ENTRIES_PLACEHOLDER', entriesJson || 'No entries found');
      
      res.setHeader('Content-Type', 'text/html');
      res.send(content);
    } catch (error) {
      console.error("Error serving debug page:", error);
      res.status(500).send("Error loading the debug page");
    }
  });

  // Special route for our basic HTML version
  app.get("/basic", (req, res) => {
    try {
      const filePath = path.resolve(
        process.cwd(),
        "client",
        "src",
        "static_app.html"
      );
      const content = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(content);
    } catch (error) {
      console.error("Error serving static HTML:", error);
      res.status(500).send("Error loading the application");
    }
  });
  
  // Minimal version with all-in-one HTML/CSS/JS
  app.get("/minimal", (req, res) => {
    try {
      const filePath = path.resolve(
        process.cwd(),
        "client",
        "src",
        "minimal.html"
      );
      const content = fs.readFileSync(filePath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.send(content);
    } catch (error) {
      console.error("Error serving minimal HTML version:", error);
      res.status(500).send("Error loading the minimal application");
    }
  });

  // Get all journal entries
  app.get("/api/entries", async (req, res) => {
    try {
      const entries = await storage.getEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entries" });
    }
  });

  // Get a single journal entry
  app.get("/api/entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid entry ID" });
      }

      const entry = await storage.getEntry(id);
      if (!entry) {
        return res.status(404).json({ message: "Entry not found" });
      }

      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entry" });
    }
  });

  // Create a new journal entry
  app.post("/api/entries", async (req, res) => {
    try {
      const result = insertEntrySchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid entry data", 
          errors: result.error.errors 
        });
      }

      const newEntry = await storage.createEntry(result.data);
      res.status(201).json(newEntry);
    } catch (error) {
      res.status(500).json({ message: "Failed to create entry" });
    }
  });

  // Update a journal entry
  app.put("/api/entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid entry ID" });
      }

      const result = insertEntrySchema.partial().safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid entry data", 
          errors: result.error.errors 
        });
      }

      const updatedEntry = await storage.updateEntry(id, result.data);
      if (!updatedEntry) {
        return res.status(404).json({ message: "Entry not found" });
      }

      res.json(updatedEntry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update entry" });
    }
  });

  // Delete a journal entry
  app.delete("/api/entries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid entry ID" });
      }

      const success = await storage.deleteEntry(id);
      if (!success) {
        return res.status(404).json({ message: "Entry not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete entry" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
