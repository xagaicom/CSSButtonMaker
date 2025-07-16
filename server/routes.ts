import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin, requireAdminSession } from "./replitAuth";
import bcrypt from "bcrypt";
import { sendEmail, generatePasswordResetEmail } from "./email-service";
import { insertButtonDesignSchema } from "@shared/schema";

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

  // Remove the conflicting root route - let static file serving handle this

  // Setup Replit authentication
  await setupAuth(app);

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
  app.post("/api/designs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const design = insertButtonDesignSchema.parse(req.body);
      const designWithUserId = { ...design, userId };
      const savedDesign = await storage.saveButtonDesign(designWithUserId);
      res.json(savedDesign);
    } catch (error) {
      console.error(`Error saving design: ${error}`);
      res.status(400).json({ error: "Invalid design data" });
    }
  });

  app.get("/api/designs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const designs = await storage.getUserButtonDesigns(userId);
      res.json(designs);
    } catch (error) {
      console.error(`Error fetching designs: ${error}`);
      res.status(500).json({ error: "Failed to fetch designs" });
    }
  });

  app.get("/api/gallery", isAuthenticated, async (req, res) => {
    try {
      const designs = await storage.getAllButtonDesigns(100);
      res.json(designs);
    } catch (error) {
      console.error(`Error fetching gallery: ${error}`);
      res.status(500).json({ error: "Failed to fetch gallery" });
    }
  });

  app.get("/api/designs/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const design = await storage.getButtonDesign(id);
      if (!design) {
        return res.status(404).json({ error: "Design not found" });
      }
      res.json(design);
    } catch (error) {
      console.error(`Error fetching design: ${error}`);
      res.status(500).json({ error: "Failed to fetch design" });
    }
  });

  app.delete("/api/designs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const success = await storage.deleteButtonDesign(id, userId);
      if (!success) {
        return res.status(404).json({ error: "Design not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error(`Error deleting design: ${error}`);
      res.status(500).json({ error: "Failed to delete design" });
    }
  });

  // Widget Layout API routes (Admin only)
  
  // Get user's widget layouts
  app.get('/api/widget-layouts', requireAdmin, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const layouts = await storage.getUserWidgetLayouts(userId);
      res.json(layouts);
    } catch (error) {
      console.error("Error fetching widget layouts:", error);
      res.status(500).json({ message: "Failed to fetch widget layouts" });
    }
  });

  // Get specific widget layout
  app.get('/api/widget-layouts/:id', requireAdmin, async (req: any, res) => {
    try {
      const layout = await storage.getWidgetLayout(req.params.id);
      if (!layout) {
        return res.status(404).json({ message: "Layout not found" });
      }
      res.json(layout);
    } catch (error) {
      console.error("Error fetching widget layout:", error);
      res.status(500).json({ message: "Failed to fetch widget layout" });
    }
  });

  // Save new widget layout
  app.post('/api/widget-layouts', requireAdmin, async (req: any, res) => {
    try {
      const adminId = (req.session as any).adminId;
      const layoutData = {
        ...req.body,
        userId: adminId,
        id: `layout_${Date.now()}_${adminId}`
      };
      
      const savedLayout = await storage.saveWidgetLayout(layoutData);
      res.json(savedLayout);
    } catch (error) {
      console.error("Error saving widget layout:", error);
      res.status(500).json({ message: "Failed to save widget layout" });
    }
  });

  // Update widget layout
  app.put('/api/widget-layouts/:id', requireAdmin, async (req: any, res) => {
    try {
      const adminId = (req.session as any).adminId;
      const updatedLayout = await storage.updateWidgetLayout(req.params.id, req.body, adminId);
      
      if (!updatedLayout) {
        return res.status(404).json({ message: "Layout not found or unauthorized" });
      }
      
      res.json(updatedLayout);
    } catch (error) {
      console.error("Error updating widget layout:", error);
      res.status(500).json({ message: "Failed to update widget layout" });
    }
  });

  // Delete widget layout
  app.delete('/api/widget-layouts/:id', requireAdmin, async (req: any, res) => {
    try {
      const adminId = (req.session as any).adminId;
      const deleted = await storage.deleteWidgetLayout(req.params.id, adminId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Layout not found or unauthorized" });
      }
      
      res.json({ message: "Layout deleted successfully" });
    } catch (error) {
      console.error("Error deleting widget layout:", error);
      res.status(500).json({ message: "Failed to delete widget layout" });
    }
  });

  // Get default widget layout
  app.get('/api/widget-layouts/default/layout', async (req, res) => {
    try {
      const defaultLayout = await storage.getDefaultWidgetLayout();
      res.json(defaultLayout);
    } catch (error) {
      console.error("Error fetching default widget layout:", error);
      res.status(500).json({ message: "Failed to fetch default widget layout" });
    }
  });

  // Simple admin authentication system - Registration removed for security

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

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set admin session
      (req.session as any).adminId = admin.id;
      (req.session as any).adminUsername = admin.username;
      (req.session as any).isAdminAuthenticated = true;
      
      res.json({ message: "Login successful", admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      console.error("Error logging in admin:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.post('/api/admin/logout', async (req, res) => {
    try {
      (req.session as any).adminId = null;
      (req.session as any).isAdminAuthenticated = false;
      res.json({ message: "Logout successful" });
    } catch (error) {
      console.error("Error logging out admin:", error);
      res.status(500).json({ message: "Failed to logout" });
    }
  });

  app.get('/api/admin/status', async (req, res) => {
    try {
      const isAuthenticated = (req.session as any)?.isAdminAuthenticated || false;
      const adminId = (req.session as any)?.adminId || null;
      
      res.json({ 
        isAuthenticated,
        adminId
      });
    } catch (error) {
      console.error("Error checking admin status:", error);
      res.status(500).json({ message: "Failed to check admin status" });
    }
  });

  // Custom button routes (admin only)
  const requireAdminAuth = (req: any, res: any, next: any) => {
    if (!(req.session as any)?.isAdminAuthenticated) {
      return res.status(401).json({ message: "Admin authentication required" });
    }
    next();
  };

  app.get('/api/admin/custom-buttons', requireAdminAuth, async (req, res) => {
    try {
      const customButtons = await storage.getAllCustomButtons();
      res.json(customButtons);
    } catch (error) {
      console.error("Error fetching custom buttons:", error);
      res.status(500).json({ message: "Failed to fetch custom buttons" });
    }
  });

  app.post('/api/admin/custom-buttons', requireAdminAuth, async (req, res) => {
    try {
      const { name, cssCode, htmlCode, description } = req.body;
      
      if (!name || !cssCode || !htmlCode) {
        return res.status(400).json({ message: "Name, CSS code, and HTML code are required" });
      }

      const newButton = await storage.createCustomButton({
        name,
        cssCode,
        htmlCode,
        description: description || null,
      });
      
      res.json(newButton);
    } catch (error) {
      console.error("Error creating custom button:", error);
      res.status(500).json({ message: "Failed to create custom button" });
    }
  });

  app.delete('/api/admin/custom-buttons/:id', requireAdminAuth, async (req, res) => {
    try {
      const buttonId = parseInt(req.params.id);
      
      if (isNaN(buttonId)) {
        return res.status(400).json({ message: "Invalid button ID" });
      }

      const deleted = await storage.deleteCustomButton(buttonId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Custom button not found" });
      }
      
      res.json({ message: "Custom button deleted successfully" });
    } catch (error) {
      console.error("Error deleting custom button:", error);
      res.status(500).json({ message: "Failed to delete custom button" });
    }
  });

  // Public endpoint to get custom buttons for use in the main app
  app.get('/api/custom-buttons', async (req, res) => {
    try {
      const customButtons = await storage.getAllCustomButtons();
      res.json(customButtons);
    } catch (error) {
      console.error("Error fetching custom buttons:", error);
      res.status(500).json({ message: "Failed to fetch custom buttons" });
    }
  });

  // Ad spaces management routes
  app.get('/api/ad-spaces', async (req, res) => {
    try {
      const adSpaces = await storage.getAllAdSpaces();
      res.json(adSpaces);
    } catch (error) {
      console.error("Error fetching ad spaces:", error);
      res.status(500).json({ message: "Failed to fetch ad spaces" });
    }
  });

  app.get('/api/ad-spaces/location/:location', async (req, res) => {
    try {
      const { location } = req.params;
      const adSpaces = await storage.getAdSpacesByLocation(location);
      res.json(adSpaces);
    } catch (error) {
      console.error("Error fetching ad spaces by location:", error);
      res.status(500).json({ message: "Failed to fetch ad spaces" });
    }
  });

  app.post('/api/admin/ad-spaces', requireAdminAuth, async (req, res) => {
    try {
      const adSpaceData = req.body;
      const newAdSpace = await storage.createAdSpace(adSpaceData);
      res.status(201).json(newAdSpace);
    } catch (error) {
      console.error("Error creating ad space:", error);
      res.status(500).json({ message: "Failed to create ad space" });
    }
  });

  app.get('/api/admin/ad-spaces', requireAdminAuth, async (req, res) => {
    try {
      const adSpaces = await storage.getAllAdSpaces();
      res.json(adSpaces);
    } catch (error) {
      console.error("Error fetching ad spaces:", error);
      res.status(500).json({ message: "Failed to fetch ad spaces" });
    }
  });

  app.put('/api/admin/ad-spaces/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedAdSpace = await storage.updateAdSpace(id, updates);
      if (updatedAdSpace) {
        res.json(updatedAdSpace);
      } else {
        res.status(404).json({ message: "Ad space not found" });
      }
    } catch (error) {
      console.error("Error updating ad space:", error);
      res.status(500).json({ message: "Failed to update ad space" });
    }
  });

  app.put('/api/admin/ad-spaces/:id/toggle', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const toggledAdSpace = await storage.toggleAdSpace(id);
      if (toggledAdSpace) {
        res.json(toggledAdSpace);
      } else {
        res.status(404).json({ message: "Ad space not found" });
      }
    } catch (error) {
      console.error("Error toggling ad space:", error);
      res.status(500).json({ message: "Failed to toggle ad space" });
    }
  });

  app.delete('/api/admin/ad-spaces/:id', requireAdminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAdSpace(id);
      if (success) {
        res.json({ message: "Ad space deleted successfully" });
      } else {
        res.status(404).json({ message: "Ad space not found" });
      }
    } catch (error) {
      console.error("Error deleting ad space:", error);
      res.status(500).json({ message: "Failed to delete ad space" });
    }
  });

  // Public endpoint for AdSense verification meta tags (no auth required)
  app.get('/api/adsense-verification', async (req, res) => {
    try {
      console.log("Public AdSense verification endpoint called");
      const verification = await storage.getAdSenseVerification();
      console.log("Verification data:", verification);
      
      // Only return active meta tag verifications for public use
      if (verification && verification.isActive && verification.method === 'meta_tag') {
        const response = {
          code: verification.code,
          method: verification.method,
          isActive: verification.isActive
        };
        console.log("Returning verification response:", response);
        res.json(response);
      } else {
        console.log("No active meta tag verification found, returning null");
        res.json(null);
      }
    } catch (error) {
      console.error("Error fetching public AdSense verification:", error);
      res.status(500).json({ message: "Failed to fetch AdSense verification" });
    }
  });

  // App settings routes
  app.get('/api/app-settings', async (req, res) => {
    try {
      const settings = await storage.getAllAppSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching app settings:", error);
      res.status(500).json({ message: "Failed to fetch app settings" });
    }
  });

  // AdSense verification routes
  app.get('/api/admin/adsense-verification', requireAdminSession, async (req, res) => {
    try {
      const verification = await storage.getAdSenseVerification();
      res.json(verification);
    } catch (error) {
      console.error("Error fetching AdSense verification:", error);
      res.status(500).json({ message: "Failed to fetch AdSense verification" });
    }
  });

  app.post('/api/admin/adsense-verification', requireAdminSession, async (req, res) => {
    try {
      const verification = await storage.createAdSenseVerification(req.body);
      res.json(verification);
    } catch (error) {
      console.error("Error creating AdSense verification:", error);
      res.status(500).json({ message: "Failed to create AdSense verification" });
    }
  });

  app.post('/api/admin/adsense-verification/verify', requireAdminSession, async (req, res) => {
    try {
      const { method, code } = req.body;
      
      // Get current verification
      const verification = await storage.getAdSenseVerification();
      if (!verification) {
        return res.status(404).json({ message: "No verification found" });
      }

      // Simulate verification check (in production, this would check actual implementation)
      // For now, we'll just mark it as verified
      const verifiedVerification = await storage.verifyAdSenseVerification(verification.id);
      
      res.json(verifiedVerification);
    } catch (error) {
      console.error("Error verifying AdSense:", error);
      res.status(500).json({ message: "Failed to verify AdSense" });
    }
  });

  // Admin credential management routes
  app.get('/api/admin/profile', requireAdminSession, async (req: any, res) => {
    try {
      const adminId = req.session.adminId;
      const admin = await storage.getAdminById(adminId);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.json(admin);
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      res.status(500).json({ message: "Failed to fetch admin profile" });
    }
  });

  app.put('/api/admin/credentials', requireAdminSession, async (req: any, res) => {
    try {
      const adminId = req.session.adminId;
      const { username, password, email, currentPassword } = req.body;

      // Verify current password
      const admin = await storage.getAdminByUsername(req.session.adminUsername);
      if (!admin || !bcrypt.compareSync(currentPassword, admin.password)) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const updates: { username?: string; password?: string; email?: string } = {};
      if (username) updates.username = username;
      if (password) updates.password = password;
      if (email !== undefined) updates.email = email;

      const success = await storage.updateAdminCredentials(adminId, updates);
      if (!success) {
        return res.status(400).json({ message: "Failed to update credentials. Username or email may already exist." });
      }

      // Update session if username changed
      if (username) {
        req.session.adminUsername = username;
      }

      res.json({ message: "Credentials updated successfully" });
    } catch (error) {
      console.error("Error updating admin credentials:", error);
      res.status(500).json({ message: "Failed to update credentials" });
    }
  });



  app.get('/api/app-settings/:key', async (req, res) => {
    try {
      const { key } = req.params;
      const setting = await storage.getAppSetting(key);
      if (setting) {
        res.json(setting);
      } else {
        res.status(404).json({ message: "Setting not found" });
      }
    } catch (error) {
      console.error("Error fetching app setting:", error);
      res.status(500).json({ message: "Failed to fetch app setting" });
    }
  });

  app.post('/api/admin/app-settings', requireAdminAuth, async (req, res) => {
    try {
      const setting = await storage.setAppSetting(req.body);
      res.json(setting);
    } catch (error) {
      console.error("Error saving app setting:", error);
      res.status(500).json({ message: "Failed to save app setting" });
    }
  });

  app.delete('/api/admin/app-settings/:key', requireAdminAuth, async (req, res) => {
    try {
      const { key } = req.params;
      const success = await storage.deleteAppSetting(key);
      if (success) {
        res.json({ message: "Setting deleted successfully" });
      } else {
        res.status(404).json({ message: "Setting not found" });
      }
    } catch (error) {
      console.error("Error deleting app setting:", error);
      res.status(500).json({ message: "Failed to delete app setting" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
