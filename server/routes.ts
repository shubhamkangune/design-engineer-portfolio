import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendContactEmail } from "./email";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Contact form endpoint - POST /api/contact
  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ message: "name, email and message are required" });
    }

    try {
      await sendContactEmail({ name, email, subject, message });
      return res.json({ message: "Message sent" });
    } catch (err: any) {
      const msg = err?.message || "Failed to send message";
      return res.status(500).json({ message: msg });
    }
  });

  return httpServer;
}
