import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertButtonDesignSchema } from "@shared/schema";
import bcrypt from "bcrypt";
const session = require('express-session');

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Railway
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV,
      port: process.env.PORT || 5000
    });
  });

  // Simple session management for Railway
  app.use(session({
    secret: process.env.SESSION_SECRET || 'railway-fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

  // Admin middleware for protected routes
  const requireAdmin = (req: any, res: any, next: any) => {
    const isAuthenticated = (req.session as any)?.isAdminAuthenticated || false;
    if (!isAuthenticated) {
      return res.status(401).json({ message: "Admin authentication required" });
    }
    next();
  };

  // Simplified auth routes for Railway
  app.get('/api/auth/user', (req: any, res) => {
    res.status(401).json({ message: "Unauthorized" });
  });

  app.get('/api/auth/admin-status', (req: any, res) => {
    const isAdmin = (req.session as any)?.isAdminAuthenticated || false;
    res.json({ isAdmin, role: isAdmin ? 'admin' : 'user' });
  });

  // API routes for button designs
  app.get('/api/button-designs', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const designs = await storage.getAllButtonDesigns(limit);
      res.json(designs);
    } catch (error) {
      console.error("Error fetching button designs:", error);
      res.status(500).json({ message: "Failed to fetch button designs" });
    }
  });

  app.post('/api/button-designs', async (req, res) => {
    try {
      const validatedData = insertButtonDesignSchema.parse(req.body);
      const design = await storage.saveButtonDesign({
        ...validatedData,
        userId: 'anonymous'
      });
      res.status(201).json(design);
    } catch (error) {
      console.error("Error saving button design:", error);
      res.status(500).json({ message: "Failed to save button design" });
    }
  });

  // Custom buttons API
  app.get('/api/custom-buttons', async (req, res) => {
    try {
      const buttons = await storage.getAllCustomButtons();
      res.json(buttons);
    } catch (error) {
      console.error("Error fetching custom buttons:", error);
      res.status(500).json({ message: "Failed to fetch custom buttons" });
    }
  });

  app.post('/api/admin/custom-buttons', requireAdmin, async (req, res) => {
    try {
      const { buttonText, cssCode } = req.body;
      
      if (!buttonText || !cssCode) {
        return res.status(400).json({ message: "Button text and CSS code are required" });
      }

      const button = await storage.createCustomButton({
        buttonText,
        cssCode,
        htmlCode: `<button class="custom-btn">${buttonText}</button>`,
        description: `Custom button: ${buttonText}`,
        name: buttonText
      });

      res.status(201).json(button);
    } catch (error) {
      console.error("Error creating custom button:", error);
      res.status(500).json({ message: "Failed to create custom button" });
    }
  });

  // Ad spaces API
  app.get('/api/ad-spaces/location/:location', async (req, res) => {
    try {
      const { location } = req.params;
      const adSpaces = await storage.getAdSpacesByLocation(location);
      res.json(adSpaces);
    } catch (error) {
      console.error("Error fetching ad spaces:", error);
      res.status(500).json({ message: "Failed to fetch ad spaces" });
    }
  });

  app.post('/api/admin/ad-spaces', requireAdmin, async (req, res) => {
    try {
      const adSpace = await storage.createAdSpace(req.body);
      res.status(201).json(adSpace);
    } catch (error) {
      console.error("Error creating ad space:", error);
      res.status(500).json({ message: "Failed to create ad space" });
    }
  });

  // App settings API
  app.get('/api/app-settings', async (req, res) => {
    try {
      const settings = await storage.getAllAppSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching app settings:", error);
      res.status(500).json({ message: "Failed to fetch app settings" });
    }
  });

  app.post('/api/admin/app-settings', requireAdmin, async (req, res) => {
    try {
      const setting = await storage.setAppSetting(req.body);
      res.status(201).json(setting);
    } catch (error) {
      console.error("Error creating app setting:", error);
      res.status(500).json({ message: "Failed to create app setting" });
    }
  });

  // Simple admin authentication
  app.post('/api/admin/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const existingAdmins = await storage.getAllAdmins();
      if (existingAdmins.length > 0) {
        return res.status(403).json({ message: "Admin already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await storage.createAdmin({ username, password: hashedPassword });
      
      (req.session as any).adminId = admin.id;
      (req.session as any).isAdminAuthenticated = true;
      
      res.json({ message: "Admin created successfully", admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      console.error("Error creating admin:", error);
      res.status(500).json({ message: "Failed to create admin" });
    }
  });

  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const admin = await storage.getAdminByUsername(username);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      (req.session as any).adminId = admin.id;
      (req.session as any).isAdminAuthenticated = true;
      
      res.json({ message: "Login successful", admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post('/api/admin/logout', (req, res) => {
    (req.session as any).isAdminAuthenticated = false;
    delete (req.session as any).adminId;
    res.json({ message: "Logout successful" });
  });

  const httpServer = createServer(app);
  return httpServer;
}