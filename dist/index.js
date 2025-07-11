var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  adSpaces: () => adSpaces,
  admins: () => admins,
  appSettings: () => appSettings,
  buttonDesigns: () => buttonDesigns,
  customButtons: () => customButtons,
  insertAdSpaceSchema: () => insertAdSpaceSchema,
  insertAppSettingSchema: () => insertAppSettingSchema,
  insertButtonDesignSchema: () => insertButtonDesignSchema,
  insertCustomButtonSchema: () => insertCustomButtonSchema,
  insertWidgetLayoutSchema: () => insertWidgetLayoutSchema,
  sessions: () => sessions,
  users: () => users,
  widgetLayouts: () => widgetLayouts
});
import {
  pgTable,
  text,
  varchar,
  serial,
  integer,
  boolean,
  timestamp,
  jsonb,
  index
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions, users, admins, buttonDesigns, widgetLayouts, insertButtonDesignSchema, insertWidgetLayoutSchema, customButtons, insertCustomButtonSchema, adSpaces, insertAdSpaceSchema, appSettings, insertAppSettingSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    "use strict";
    sessions = pgTable(
      "sessions",
      {
        sid: varchar("sid").primaryKey(),
        sess: jsonb("sess").notNull(),
        expire: timestamp("expire").notNull()
      },
      (table) => [index("IDX_session_expire").on(table.expire)]
    );
    users = pgTable("users", {
      id: varchar("id").primaryKey().notNull(),
      email: varchar("email").unique(),
      firstName: varchar("first_name"),
      lastName: varchar("last_name"),
      profileImageUrl: varchar("profile_image_url"),
      role: varchar("role").default("user"),
      // user, admin
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    admins = pgTable("admins", {
      id: varchar("id").primaryKey().notNull(),
      username: varchar("username").unique().notNull(),
      password: varchar("password").notNull(),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    buttonDesigns = pgTable("button_designs", {
      id: serial("id").primaryKey(),
      userId: varchar("user_id").notNull().references(() => users.id),
      name: text("name").notNull(),
      text: text("text").notNull(),
      fontSize: integer("font_size").notNull(),
      fontWeight: integer("font_weight").notNull(),
      borderStartColor: text("border_start_color").notNull(),
      borderEndColor: text("border_end_color").notNull(),
      borderDirection: text("border_direction").notNull(),
      textStartColor: text("text_start_color").notNull(),
      textEndColor: text("text_end_color").notNull(),
      textDirection: text("text_direction").notNull(),
      backgroundStartColor: text("background_start_color").notNull(),
      backgroundEndColor: text("background_end_color").notNull(),
      backgroundDirection: text("background_direction").notNull(),
      paddingX: integer("padding_x").notNull(),
      paddingY: integer("padding_y").notNull(),
      borderRadius: integer("border_radius").notNull(),
      borderWidth: integer("border_width").notNull(),
      enable3D: boolean("enable_3d").notNull().default(false),
      shadowIntensity: integer("shadow_intensity").notNull().default(4),
      width: integer("width").notNull().default(200),
      height: integer("height").notNull().default(50),
      transparentBackground: boolean("transparent_background").notNull().default(false),
      enableTextShadow: boolean("enable_text_shadow").default(false),
      textShadowColor: text("text_shadow_color").default("#000000"),
      textShadowX: integer("text_shadow_x").default(0),
      textShadowY: integer("text_shadow_y").default(0),
      textShadowBlur: integer("text_shadow_blur").default(0),
      enableBoxShadow: boolean("enable_box_shadow").default(false),
      boxShadowColor: text("box_shadow_color").default("#000000"),
      boxShadowX: integer("box_shadow_x").default(0),
      boxShadowY: integer("box_shadow_y").default(0),
      boxShadowBlur: integer("box_shadow_blur").default(0),
      boxShadowSpread: integer("box_shadow_spread").default(0),
      boxShadowInset: boolean("box_shadow_inset").default(false),
      borderStyle: text("border_style").default("solid"),
      previewBackground: text("preview_background").default("#f0f0f0"),
      createdAt: timestamp("created_at").defaultNow()
    });
    widgetLayouts = pgTable("widget_layouts", {
      id: varchar("id").primaryKey(),
      userId: varchar("user_id").notNull().references(() => users.id),
      name: text("name").notNull(),
      description: text("description"),
      // Store the layout configuration as JSON
      layoutData: jsonb("layout_data").notNull(),
      // Column widths
      leftWidth: integer("left_width").default(30),
      centerWidth: integer("center_width").default(40),
      rightWidth: integer("right_width").default(30),
      // Metadata
      isDefault: boolean("is_default").default(false),
      isPublic: boolean("is_public").default(false),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertButtonDesignSchema = createInsertSchema(buttonDesigns).omit({
      id: true,
      createdAt: true,
      userId: true
    });
    insertWidgetLayoutSchema = createInsertSchema(widgetLayouts).omit({
      createdAt: true,
      updatedAt: true,
      userId: true
    });
    customButtons = pgTable("custom_buttons", {
      id: serial("id").primaryKey(),
      name: varchar("name").notNull(),
      cssCode: text("css_code").notNull(),
      htmlCode: text("html_code").notNull(),
      description: text("description"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertCustomButtonSchema = createInsertSchema(customButtons).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    adSpaces = pgTable("ad_spaces", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      location: varchar("location", { length: 255 }).notNull(),
      // header, left-sidebar, right-sidebar, css-output, modal
      adType: varchar("ad_type", { length: 100 }).notNull(),
      // banner, rectangle, square, leaderboard, interstitial
      adSize: varchar("ad_size", { length: 50 }).notNull(),
      // 728x90, 300x250, 320x50, etc.
      adCode: text("ad_code").notNull(),
      // Google AdSense code
      isActive: boolean("is_active").default(true),
      priority: integer("priority").default(0),
      // for ordering multiple ads in same location
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertAdSpaceSchema = createInsertSchema(adSpaces).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    appSettings = pgTable("app_settings", {
      id: serial("id").primaryKey(),
      key: varchar("key", { length: 100 }).unique().notNull(),
      value: text("value"),
      description: text("description"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    insertAppSettingSchema = createInsertSchema(appSettings).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
  }
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
var pool, db;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    neonConfig.webSocketConstructor = ws;
    if (!process.env.DATABASE_URL) {
      if (process.env.NODE_ENV === "production") {
        console.warn("\u26A0\uFE0F DATABASE_URL not set in production. App will run with limited functionality.");
        pool = {
          query: () => Promise.resolve({ rows: [] }),
          end: () => Promise.resolve()
        };
        db = {
          select: () => ({
            from: () => ({
              where: () => []
            })
          }),
          insert: () => ({
            values: () => ({
              returning: () => [],
              onConflictDoUpdate: () => ({
                returning: () => []
              })
            })
          })
        };
      } else {
        throw new Error(
          "DATABASE_URL must be set. Did you forget to provision a database?"
        );
      }
    } else {
      pool = new Pool({ connectionString: process.env.DATABASE_URL });
      db = drizzle({ client: pool, schema: schema_exports });
    }
  }
});

// server/storage.ts
import { eq, desc, and } from "drizzle-orm";
var DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_schema();
    init_db();
    DatabaseStorage = class {
      checkDatabase() {
        if (!process.env.DATABASE_URL && process.env.NODE_ENV === "production") {
          throw new Error("Database functionality not available - DATABASE_URL not configured");
        }
      }
      // User operations
      // (IMPORTANT) these user operations are mandatory for Replit Auth.
      async getUser(id) {
        try {
          this.checkDatabase();
          const [user] = await db.select().from(users).where(eq(users.id, id));
          return user;
        } catch (error) {
          console.warn("Database operation failed:", error);
          return void 0;
        }
      }
      async upsertUser(userData) {
        const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }).returning();
        return user;
      }
      async getAllUsers() {
        return await db.select().from(users);
      }
      async updateUserRole(id, role) {
        const [updatedUser] = await db.update(users).set({ role, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
        return updatedUser || void 0;
      }
      async createAdmin(adminData) {
        const adminId = `admin_${Date.now()}`;
        const [admin] = await db.insert(admins).values({
          id: adminId,
          username: adminData.username,
          password: adminData.password
        }).returning();
        return {
          id: admin.id,
          username: admin.username,
          createdAt: admin.createdAt
        };
      }
      async getAdminByUsername(username) {
        const [admin] = await db.select().from(admins).where(eq(admins.username, username));
        return admin ? {
          id: admin.id,
          username: admin.username,
          password: admin.password
        } : void 0;
      }
      async getAllAdmins() {
        const adminList = await db.select({
          id: admins.id,
          username: admins.username
        }).from(admins);
        return adminList;
      }
      // Button design operations
      async saveButtonDesign(design) {
        const [savedDesign] = await db.insert(buttonDesigns).values(design).returning();
        return savedDesign;
      }
      async getUserButtonDesigns(userId) {
        return await db.select().from(buttonDesigns).where(eq(buttonDesigns.userId, userId)).orderBy(desc(buttonDesigns.createdAt));
      }
      async getAllButtonDesigns(limit = 100) {
        return await db.select().from(buttonDesigns).orderBy(desc(buttonDesigns.createdAt)).limit(limit);
      }
      async getButtonDesign(id) {
        const [design] = await db.select().from(buttonDesigns).where(eq(buttonDesigns.id, id));
        return design || void 0;
      }
      async deleteButtonDesign(id, userId) {
        const result = await db.delete(buttonDesigns).where(and(eq(buttonDesigns.id, id), eq(buttonDesigns.userId, userId)));
        return (result.rowCount || 0) > 0;
      }
      // Widget layout operations
      async saveWidgetLayout(layout) {
        const [savedLayout] = await db.insert(widgetLayouts).values(layout).returning();
        return savedLayout;
      }
      async getUserWidgetLayouts(userId) {
        return await db.select().from(widgetLayouts).where(eq(widgetLayouts.userId, userId)).orderBy(desc(widgetLayouts.updatedAt));
      }
      async getWidgetLayout(id) {
        const [layout] = await db.select().from(widgetLayouts).where(eq(widgetLayouts.id, id));
        return layout || void 0;
      }
      async updateWidgetLayout(id, updates, userId) {
        const [updatedLayout] = await db.update(widgetLayouts).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(widgetLayouts.id, id), eq(widgetLayouts.userId, userId))).returning();
        return updatedLayout || void 0;
      }
      async deleteWidgetLayout(id, userId) {
        const result = await db.delete(widgetLayouts).where(and(eq(widgetLayouts.id, id), eq(widgetLayouts.userId, userId)));
        return (result.rowCount || 0) > 0;
      }
      async getDefaultWidgetLayout() {
        const [defaultLayout] = await db.select().from(widgetLayouts).where(eq(widgetLayouts.isDefault, true)).limit(1);
        return defaultLayout || void 0;
      }
      // Custom button operations
      async createCustomButton(button) {
        const [newButton] = await db.insert(customButtons).values(button).returning();
        return newButton;
      }
      async getAllCustomButtons() {
        return await db.select().from(customButtons).orderBy(desc(customButtons.createdAt));
      }
      async getCustomButton(id) {
        const [button] = await db.select().from(customButtons).where(eq(customButtons.id, id));
        return button || void 0;
      }
      async deleteCustomButton(id) {
        const result = await db.delete(customButtons).where(eq(customButtons.id, id));
        return (result.rowCount || 0) > 0;
      }
      // Ad space operations
      async createAdSpace(adSpace) {
        const [newAdSpace] = await db.insert(adSpaces).values(adSpace).returning();
        return newAdSpace;
      }
      async getAllAdSpaces() {
        return await db.select().from(adSpaces).orderBy(adSpaces.location, adSpaces.priority);
      }
      async getAdSpace(id) {
        const [adSpace] = await db.select().from(adSpaces).where(eq(adSpaces.id, id));
        return adSpace;
      }
      async getAdSpacesByLocation(location) {
        return await db.select().from(adSpaces).where(and(eq(adSpaces.location, location), eq(adSpaces.isActive, true))).orderBy(adSpaces.priority);
      }
      async updateAdSpace(id, updates) {
        const [updatedAdSpace] = await db.update(adSpaces).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(adSpaces.id, id)).returning();
        return updatedAdSpace;
      }
      async deleteAdSpace(id) {
        const result = await db.delete(adSpaces).where(eq(adSpaces.id, id));
        return (result.rowCount || 0) > 0;
      }
      async toggleAdSpace(id) {
        const adSpace = await this.getAdSpace(id);
        if (!adSpace) return void 0;
        return await this.updateAdSpace(id, { isActive: !adSpace.isActive });
      }
      // App settings operations
      async getAppSetting(key) {
        const [setting] = await db.select().from(appSettings).where(eq(appSettings.key, key));
        return setting || void 0;
      }
      async setAppSetting(setting) {
        const [result] = await db.insert(appSettings).values(setting).onConflictDoUpdate({
          target: appSettings.key,
          set: {
            value: setting.value,
            description: setting.description,
            updatedAt: /* @__PURE__ */ new Date()
          }
        }).returning();
        return result;
      }
      async getAllAppSettings() {
        return await db.select().from(appSettings).orderBy(appSettings.key);
      }
      async deleteAppSetting(key) {
        const result = await db.delete(appSettings).where(eq(appSettings.key, key));
        return result.rowCount > 0;
      }
    };
    storage = new DatabaseStorage();
  }
});

// server/index.ts
import express2 from "express";

// server/routes.ts
init_storage();
import { createServer } from "http";

// server/replitAuth.ts
init_storage();
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS && process.env.NODE_ENV !== "production") {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID || "default-repl-id"
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
    return session({
      secret: process.env.SESSION_SECRET || "railway-fallback-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        // Railway doesn't have HTTPS in all environments
        maxAge: sessionTtl
      }
    });
  }
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    // Create table if missing
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET || "development-secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  if (process.env.NODE_ENV === "production" && !process.env.REPLIT_DOMAINS) {
    console.log("Production mode: Skipping Replit OAuth setup (REPLIT_DOMAINS not configured)");
    return;
  }
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of (process.env.REPLIT_DOMAINS || "localhost").split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID || "default-repl-id",
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/routes.ts
init_schema();
import bcrypt from "bcrypt";
async function registerRoutes(app2) {
  app2.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      env: process.env.NODE_ENV,
      port: process.env.PORT || 5e3
    });
  });
  await setupAuth(app2);
  const requireAdmin = (req, res, next) => {
    const isAuthenticated2 = req.session?.isAdminAuthenticated || false;
    if (!isAuthenticated2) {
      return res.status(401).json({ message: "Admin authentication required" });
    }
    next();
  };
  app2.get("/api/auth/user", (req, res) => {
    res.status(401).json({ message: "Unauthorized" });
  });
  app2.get("/api/auth/admin-status", (req, res) => {
    const isAdmin2 = req.session?.isAdminAuthenticated || false;
    res.json({ isAdmin: isAdmin2, role: isAdmin2 ? "admin" : "user" });
  });
  app2.post("/api/designs", isAuthenticated, async (req, res) => {
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
  app2.get("/api/designs", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const designs = await storage.getUserButtonDesigns(userId);
      res.json(designs);
    } catch (error) {
      console.error(`Error fetching designs: ${error}`);
      res.status(500).json({ error: "Failed to fetch designs" });
    }
  });
  app2.get("/api/gallery", isAuthenticated, async (req, res) => {
    try {
      const designs = await storage.getAllButtonDesigns(100);
      res.json(designs);
    } catch (error) {
      console.error(`Error fetching gallery: ${error}`);
      res.status(500).json({ error: "Failed to fetch gallery" });
    }
  });
  app2.get("/api/designs/:id", isAuthenticated, async (req, res) => {
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
  app2.delete("/api/designs/:id", isAuthenticated, async (req, res) => {
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
  app2.get("/api/widget-layouts", requireAdmin, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const layouts = await storage.getUserWidgetLayouts(userId);
      res.json(layouts);
    } catch (error) {
      console.error("Error fetching widget layouts:", error);
      res.status(500).json({ message: "Failed to fetch widget layouts" });
    }
  });
  app2.get("/api/widget-layouts/:id", requireAdmin, async (req, res) => {
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
  app2.post("/api/widget-layouts", requireAdmin, async (req, res) => {
    try {
      const adminId = req.session.adminId;
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
  app2.put("/api/widget-layouts/:id", requireAdmin, async (req, res) => {
    try {
      const adminId = req.session.adminId;
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
  app2.delete("/api/widget-layouts/:id", requireAdmin, async (req, res) => {
    try {
      const adminId = req.session.adminId;
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
  app2.get("/api/widget-layouts/default/layout", async (req, res) => {
    try {
      const defaultLayout = await storage.getDefaultWidgetLayout();
      res.json(defaultLayout);
    } catch (error) {
      console.error("Error fetching default widget layout:", error);
      res.status(500).json({ message: "Failed to fetch default widget layout" });
    }
  });
  app2.post("/api/admin/register", async (req, res) => {
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
      req.session.adminId = admin.id;
      req.session.isAdminAuthenticated = true;
      res.json({ message: "Admin created successfully", admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      console.error("Error creating admin:", error);
      res.status(500).json({ message: "Failed to create admin" });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
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
      req.session.adminId = admin.id;
      req.session.isAdminAuthenticated = true;
      res.json({ message: "Login successful", admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      console.error("Error logging in admin:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });
  app2.post("/api/admin/logout", async (req, res) => {
    try {
      req.session.adminId = null;
      req.session.isAdminAuthenticated = false;
      res.json({ message: "Logout successful" });
    } catch (error) {
      console.error("Error logging out admin:", error);
      res.status(500).json({ message: "Failed to logout" });
    }
  });
  app2.get("/api/admin/status", async (req, res) => {
    try {
      const isAuthenticated2 = req.session?.isAdminAuthenticated || false;
      const adminId = req.session?.adminId || null;
      res.json({
        isAuthenticated: isAuthenticated2,
        adminId
      });
    } catch (error) {
      console.error("Error checking admin status:", error);
      res.status(500).json({ message: "Failed to check admin status" });
    }
  });
  const requireAdminAuth = (req, res, next) => {
    if (!req.session?.isAdminAuthenticated) {
      return res.status(401).json({ message: "Admin authentication required" });
    }
    next();
  };
  app2.get("/api/admin/custom-buttons", requireAdminAuth, async (req, res) => {
    try {
      const customButtons2 = await storage.getAllCustomButtons();
      res.json(customButtons2);
    } catch (error) {
      console.error("Error fetching custom buttons:", error);
      res.status(500).json({ message: "Failed to fetch custom buttons" });
    }
  });
  app2.post("/api/admin/custom-buttons", requireAdminAuth, async (req, res) => {
    try {
      const { name, cssCode, htmlCode, description } = req.body;
      if (!name || !cssCode || !htmlCode) {
        return res.status(400).json({ message: "Name, CSS code, and HTML code are required" });
      }
      const newButton = await storage.createCustomButton({
        name,
        cssCode,
        htmlCode,
        description: description || null
      });
      res.json(newButton);
    } catch (error) {
      console.error("Error creating custom button:", error);
      res.status(500).json({ message: "Failed to create custom button" });
    }
  });
  app2.delete("/api/admin/custom-buttons/:id", requireAdminAuth, async (req, res) => {
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
  app2.get("/api/custom-buttons", async (req, res) => {
    try {
      const customButtons2 = await storage.getAllCustomButtons();
      res.json(customButtons2);
    } catch (error) {
      console.error("Error fetching custom buttons:", error);
      res.status(500).json({ message: "Failed to fetch custom buttons" });
    }
  });
  app2.get("/api/ad-spaces", async (req, res) => {
    try {
      const adSpaces2 = await storage.getAllAdSpaces();
      res.json(adSpaces2);
    } catch (error) {
      console.error("Error fetching ad spaces:", error);
      res.status(500).json({ message: "Failed to fetch ad spaces" });
    }
  });
  app2.get("/api/ad-spaces/location/:location", async (req, res) => {
    try {
      const { location } = req.params;
      const adSpaces2 = await storage.getAdSpacesByLocation(location);
      res.json(adSpaces2);
    } catch (error) {
      console.error("Error fetching ad spaces by location:", error);
      res.status(500).json({ message: "Failed to fetch ad spaces" });
    }
  });
  app2.post("/api/admin/ad-spaces", requireAdminAuth, async (req, res) => {
    try {
      const adSpaceData = req.body;
      const newAdSpace = await storage.createAdSpace(adSpaceData);
      res.status(201).json(newAdSpace);
    } catch (error) {
      console.error("Error creating ad space:", error);
      res.status(500).json({ message: "Failed to create ad space" });
    }
  });
  app2.get("/api/admin/ad-spaces", requireAdminAuth, async (req, res) => {
    try {
      const adSpaces2 = await storage.getAllAdSpaces();
      res.json(adSpaces2);
    } catch (error) {
      console.error("Error fetching ad spaces:", error);
      res.status(500).json({ message: "Failed to fetch ad spaces" });
    }
  });
  app2.put("/api/admin/ad-spaces/:id", requireAdminAuth, async (req, res) => {
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
  app2.put("/api/admin/ad-spaces/:id/toggle", requireAdminAuth, async (req, res) => {
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
  app2.delete("/api/admin/ad-spaces/:id", requireAdminAuth, async (req, res) => {
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
  app2.get("/api/app-settings", async (req, res) => {
    try {
      const settings = await storage.getAllAppSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching app settings:", error);
      res.status(500).json({ message: "Failed to fetch app settings" });
    }
  });
  app2.get("/api/app-settings/:key", async (req, res) => {
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
  app2.post("/api/admin/app-settings", requireAdminAuth, async (req, res) => {
    try {
      const setting = await storage.setAppSetting(req.body);
      res.json(setting);
    } catch (error) {
      console.error("Error saving app setting:", error);
      res.status(500).json({ message: "Failed to save app setting" });
    }
  });
  app2.delete("/api/admin/app-settings/:key", requireAdminAuth, async (req, res) => {
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

// server/index.ts
import path3 from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path3.dirname(__filename);
var app = express2();
if (process.env.NODE_ENV === "production") {
  console.log("\u{1F50D} Environment Debug:", {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL ? "[SET]" : "[NOT SET]",
    SESSION_SECRET: process.env.SESSION_SECRET ? "[SET]" : "[NOT SET]",
    REPL_ID: process.env.REPL_ID ? "[SET]" : "[NOT SET]",
    REPLIT_DOMAINS: process.env.REPLIT_DOMAINS ? "[SET]" : "[NOT SET]"
  });
}
app.use(express2.json({ limit: "10mb" }));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  const isProduction = process.env.NODE_ENV === "production" || process.env.REPLIT_DEPLOYMENT === "1";
  if (!isProduction) {
    await setupVite(app, server);
  } else {
    const publicPath = path3.join(__dirname, "public");
    app.use(express2.static(publicPath));
    app.get("*", (req, res) => {
      if (!req.path.startsWith("/api")) {
        res.sendFile(path3.join(publicPath, "index.html"));
      }
    });
  }
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`\u{1F680} CSS Button Maker server running on port ${port}`);
    log(`\u{1F4E1} Environment: ${process.env.NODE_ENV || "development"}`);
    log(`\u{1F3E5} Health check: http://localhost:${port}/health`);
  });
})();
