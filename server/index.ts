import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import session from 'express-session';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Simple logging function
function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit", 
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

// In-memory storage for Railway (no database dependencies)
class SimpleStorage {
  private buttonDesigns: any[] = [];
  private customButtons: any[] = [];
  private adSpaces: any[] = [];
  private appSettings: any[] = [];
  private admins: any[] = [];
  private users: any[] = [];

  // Button design operations
  async saveButtonDesign(design: any) {
    const id = Date.now();
    const newDesign = { ...design, id, createdAt: new Date() };
    this.buttonDesigns.push(newDesign);
    return newDesign;
  }

  async getAllButtonDesigns(limit = 100) {
    return this.buttonDesigns.slice(0, limit);
  }

  async getButtonDesign(id: number) {
    return this.buttonDesigns.find(d => d.id === id);
  }

  async deleteButtonDesign(id: number, userId: string) {
    const index = this.buttonDesigns.findIndex(d => d.id === id && d.userId === userId);
    if (index !== -1) {
      this.buttonDesigns.splice(index, 1);
      return true;
    }
    return false;
  }

  // Custom button operations
  async createCustomButton(button: any) {
    const id = Date.now();
    const newButton = { ...button, id, createdAt: new Date() };
    this.customButtons.push(newButton);
    return newButton;
  }

  async getAllCustomButtons() {
    return this.customButtons;
  }

  async getCustomButton(id: number) {
    return this.customButtons.find(b => b.id === id);
  }

  async deleteCustomButton(id: number) {
    const index = this.customButtons.findIndex(b => b.id === id);
    if (index !== -1) {
      this.customButtons.splice(index, 1);
      return true;
    }
    return false;
  }

  // Ad space operations
  async createAdSpace(adSpace: any) {
    const id = Date.now();
    const newAdSpace = { ...adSpace, id, createdAt: new Date() };
    this.adSpaces.push(newAdSpace);
    return newAdSpace;
  }

  async getAllAdSpaces() {
    return this.adSpaces;
  }

  async getAdSpace(id: number) {
    return this.adSpaces.find(a => a.id === id);
  }

  async getAdSpacesByLocation(location: string) {
    return this.adSpaces.filter(a => a.location === location && a.isActive);
  }

  async updateAdSpace(id: number, updates: any) {
    const index = this.adSpaces.findIndex(a => a.id === id);
    if (index !== -1) {
      this.adSpaces[index] = { ...this.adSpaces[index], ...updates };
      return this.adSpaces[index];
    }
    return undefined;
  }

  async deleteAdSpace(id: number) {
    const index = this.adSpaces.findIndex(a => a.id === id);
    if (index !== -1) {
      this.adSpaces.splice(index, 1);
      return true;
    }
    return false;
  }

  // App settings operations
  async getAppSetting(key: string) {
    return this.appSettings.find(s => s.key === key);
  }

  async setAppSetting(setting: any) {
    const index = this.appSettings.findIndex(s => s.key === setting.key);
    if (index !== -1) {
      this.appSettings[index] = { ...this.appSettings[index], ...setting };
      return this.appSettings[index];
    } else {
      const newSetting = { ...setting, id: Date.now() };
      this.appSettings.push(newSetting);
      return newSetting;
    }
  }

  async getAllAppSettings() {
    return this.appSettings;
  }

  async deleteAppSetting(key: string) {
    const index = this.appSettings.findIndex(s => s.key === key);
    if (index !== -1) {
      this.appSettings.splice(index, 1);
      return true;
    }
    return false;
  }

  // Admin operations
  async createAdmin(admin: any) {
    const id = `admin_${Date.now()}`;
    const newAdmin = { ...admin, id, createdAt: new Date() };
    this.admins.push(newAdmin);
    return newAdmin;
  }

  async getAdminByUsername(username: string) {
    return this.admins.find(a => a.username === username);
  }

  async getAllAdmins() {
    return this.admins.map(a => ({ id: a.id, username: a.username }));
  }

  // User operations
  async getUser(id: string) {
    return this.users.find(u => u.id === id);
  }

  async upsertUser(userData: any) {
    const index = this.users.findIndex(u => u.id === userData.id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...userData };
      return this.users[index];
    } else {
      const newUser = { ...userData, createdAt: new Date() };
      this.users.push(newUser);
      return newUser;
    }
  }

  async getAllUsers() {
    return this.users;
  }

  async updateUserRole(id: string, role: string) {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], role };
      return this.users[index];
    }
    return undefined;
  }
}

const storage = new SimpleStorage();

// Debug environment variables in production
if (process.env.NODE_ENV === 'production') {
  console.log("🔍 Environment Debug:", {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL ? '[SET]' : '[NOT SET]',
    SESSION_SECRET: process.env.SESSION_SECRET ? '[SET]' : '[NOT SET]',
    REPL_ID: process.env.REPL_ID ? '[SET]' : '[NOT SET]',
    REPLIT_DOMAINS: process.env.REPLIT_DOMAINS ? '[SET]' : '[NOT SET]'
  });
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Register routes directly in the server
async function registerRoutes(app: Express): Promise<Server> {
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
      const design = await storage.saveButtonDesign({
        ...req.body,
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

// Main server setup
(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error(err);
  });

  // RAILWAY FIX: Serve static files from dist/client/ directory
  if (process.env.NODE_ENV === "production") {
    // Frontend is in dist/client/, backend is in dist/index.js
    const publicPath = path.join(__dirname, "..", "dist", "client");
    console.log(`🗂️  RAILWAY: Serving static files from: ${publicPath}`);
    
    app.use(express.static(publicPath));
    
    // SPA catch-all route - serve index.html for all non-API routes
    app.get("*", (req, res) => {
      if (!req.path.startsWith("/api")) {
        console.log(`📄 RAILWAY: Serving index.html for route: ${req.path}`);
        res.sendFile(path.join(publicPath, "index.html"));
      } else {
        res.status(404).json({ message: "API endpoint not found" });
      }
    });
  }

  // Use Railway's PORT environment variable in production, fallback to 5000 for development
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`🚀 CSS Button Maker server running on port ${port}`);
    log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    log(`🏥 Health check: http://localhost:${port}/health`);
    
    if (process.env.NODE_ENV === "production") {
      log(`🌐 RAILWAY: Frontend served from: ${path.join(__dirname, "..", "dist", "client")}`);
    }
  });
})();
