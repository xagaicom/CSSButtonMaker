import {
  pgTable,
  text,
  varchar,
  serial,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"), // user, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin table for simple admin authentication
export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique().notNull(),
  password: varchar("password").notNull(),
  email: varchar("email").unique(),
  resetToken: varchar("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  lastPasswordChange: timestamp("last_password_change"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const buttonDesigns = pgTable("button_designs", {
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
  createdAt: timestamp("created_at").defaultNow(),
});

// Widget layouts table for admin system
export const widgetLayouts = pgTable("widget_layouts", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;

export const insertButtonDesignSchema = createInsertSchema(buttonDesigns).omit({
  id: true,
  createdAt: true,
  userId: true,
});

export type InsertButtonDesign = z.infer<typeof insertButtonDesignSchema>;
export type ButtonDesign = typeof buttonDesigns.$inferSelect;

export const insertWidgetLayoutSchema = createInsertSchema(widgetLayouts).omit({
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export type InsertWidgetLayout = z.infer<typeof insertWidgetLayoutSchema>;
export type WidgetLayout = typeof widgetLayouts.$inferSelect;

// Custom buttons table for admin-created button styles
export const customButtons = pgTable("custom_buttons", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  cssCode: text("css_code").notNull(),
  htmlCode: text("html_code").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCustomButtonSchema = createInsertSchema(customButtons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCustomButton = z.infer<typeof insertCustomButtonSchema>;
export type CustomButton = typeof customButtons.$inferSelect;

// Ad Spaces Management
export const adSpaces = pgTable("ad_spaces", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(), // header, left-sidebar, right-sidebar, css-output, modal
  adType: varchar("ad_type", { length: 100 }).notNull(), // banner, rectangle, square, leaderboard, interstitial
  adSize: varchar("ad_size", { length: 50 }).notNull(), // 728x90, 300x250, 320x50, etc.
  adCode: text("ad_code").notNull(), // Google AdSense code
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(0), // for ordering multiple ads in same location
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAdSpaceSchema = createInsertSchema(adSpaces).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAdSpace = z.infer<typeof insertAdSpaceSchema>;
export type AdSpace = typeof adSpaces.$inferSelect;

// App settings table for logo and other configuration
export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).unique().notNull(),
  value: text("value"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAppSettingSchema = createInsertSchema(appSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAppSetting = z.infer<typeof insertAppSettingSchema>;
export type AppSetting = typeof appSettings.$inferSelect;

// AdSense Verification table
export const adsenseVerifications = pgTable("adsense_verifications", {
  id: varchar("id").primaryKey().notNull(),
  method: varchar("method").notNull(), // "adsense_code" | "ads_txt" | "meta_tag"
  code: text("code").notNull(),
  publisherId: varchar("publisher_id"),
  isActive: boolean("is_active").default(true),
  verified: boolean("verified").default(false),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAdSenseVerificationSchema = createInsertSchema(adsenseVerifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAdSenseVerification = z.infer<typeof insertAdSenseVerificationSchema>;
export type AdSenseVerification = typeof adsenseVerifications.$inferSelect;
