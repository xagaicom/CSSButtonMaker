import { users, buttonDesigns, widgetLayouts, admins, customButtons, adSpaces, appSettings, type User, type UpsertUser, type ButtonDesign, type InsertButtonDesign, type WidgetLayout, type InsertWidgetLayout, type CustomButton, type InsertCustomButton, type AdSpace, type InsertAdSpace, type AppSetting, type InsertAppSetting } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(id: string, role: string): Promise<User | undefined>;
  // Admin operations
  createAdmin(admin: { username: string; password: string }): Promise<{ id: string; username: string; createdAt: Date | null }>;
  getAdminByUsername(username: string): Promise<{ id: string; username: string; password: string } | undefined>;
  getAllAdmins(): Promise<{ id: string; username: string }[]>;
  // Button design operations
  saveButtonDesign(design: InsertButtonDesign): Promise<ButtonDesign>;
  getUserButtonDesigns(userId: string): Promise<ButtonDesign[]>;
  getAllButtonDesigns(limit?: number): Promise<ButtonDesign[]>;
  getButtonDesign(id: number): Promise<ButtonDesign | undefined>;
  deleteButtonDesign(id: number, userId: string): Promise<boolean>;
  // Widget layout operations
  saveWidgetLayout(layout: InsertWidgetLayout & { userId: string }): Promise<WidgetLayout>;
  getUserWidgetLayouts(userId: string): Promise<WidgetLayout[]>;
  getWidgetLayout(id: string): Promise<WidgetLayout | undefined>;
  updateWidgetLayout(id: string, updates: Partial<InsertWidgetLayout>, userId: string): Promise<WidgetLayout | undefined>;
  deleteWidgetLayout(id: string, userId: string): Promise<boolean>;
  getDefaultWidgetLayout(): Promise<WidgetLayout | undefined>;
  // Custom button operations
  createCustomButton(button: InsertCustomButton): Promise<CustomButton>;
  getAllCustomButtons(): Promise<CustomButton[]>;
  getCustomButton(id: number): Promise<CustomButton | undefined>;
  deleteCustomButton(id: number): Promise<boolean>;
  // Ad space operations
  createAdSpace(adSpace: InsertAdSpace): Promise<AdSpace>;
  getAllAdSpaces(): Promise<AdSpace[]>;
  getAdSpace(id: number): Promise<AdSpace | undefined>;
  getAdSpacesByLocation(location: string): Promise<AdSpace[]>;
  updateAdSpace(id: number, updates: Partial<InsertAdSpace>): Promise<AdSpace | undefined>;
  deleteAdSpace(id: number): Promise<boolean>;
  toggleAdSpace(id: number): Promise<AdSpace | undefined>;
  // App settings operations
  getAppSetting(key: string): Promise<AppSetting | undefined>;
  setAppSetting(setting: InsertAppSetting): Promise<AppSetting>;
  getAllAppSettings(): Promise<AppSetting[]>;
  deleteAppSetting(key: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  private checkDatabase() {
    if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
      throw new Error('Database functionality not available - DATABASE_URL not configured');
    }
  }
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    try {
      this.checkDatabase();
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.warn('Database operation failed:', error);
      return undefined;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }

  async createAdmin(adminData: { username: string; password: string }): Promise<{ id: string; username: string; createdAt: Date | null }> {
    const adminId = `admin_${Date.now()}`;
    const [admin] = await db
      .insert(admins)
      .values({
        id: adminId,
        username: adminData.username,
        password: adminData.password,
      })
      .returning();
    return {
      id: admin.id,
      username: admin.username,
      createdAt: admin.createdAt,
    };
  }

  async getAdminByUsername(username: string): Promise<{ id: string; username: string; password: string } | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.username, username));
    return admin ? {
      id: admin.id,
      username: admin.username,
      password: admin.password,
    } : undefined;
  }

  async getAllAdmins(): Promise<{ id: string; username: string }[]> {
    const adminList = await db.select({
      id: admins.id,
      username: admins.username,
    }).from(admins);
    return adminList;
  }

  // Button design operations

  async saveButtonDesign(design: InsertButtonDesign & { userId: string }): Promise<ButtonDesign> {
    const [savedDesign] = await db
      .insert(buttonDesigns)
      .values(design)
      .returning();
    return savedDesign;
  }

  async getUserButtonDesigns(userId: string): Promise<ButtonDesign[]> {
    return await db
      .select()
      .from(buttonDesigns)
      .where(eq(buttonDesigns.userId, userId))
      .orderBy(desc(buttonDesigns.createdAt));
  }

  async getAllButtonDesigns(limit: number = 100): Promise<ButtonDesign[]> {
    return await db
      .select()
      .from(buttonDesigns)
      .orderBy(desc(buttonDesigns.createdAt))
      .limit(limit);
  }

  async getButtonDesign(id: number): Promise<ButtonDesign | undefined> {
    const [design] = await db
      .select()
      .from(buttonDesigns)
      .where(eq(buttonDesigns.id, id));
    return design || undefined;
  }

  async deleteButtonDesign(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(buttonDesigns)
      .where(and(eq(buttonDesigns.id, id), eq(buttonDesigns.userId, userId)));
    return (result.rowCount || 0) > 0;
  }

  // Widget layout operations
  async saveWidgetLayout(layout: InsertWidgetLayout & { userId: string }): Promise<WidgetLayout> {
    const [savedLayout] = await db
      .insert(widgetLayouts)
      .values(layout)
      .returning();
    return savedLayout;
  }

  async getUserWidgetLayouts(userId: string): Promise<WidgetLayout[]> {
    return await db
      .select()
      .from(widgetLayouts)
      .where(eq(widgetLayouts.userId, userId))
      .orderBy(desc(widgetLayouts.updatedAt));
  }

  async getWidgetLayout(id: string): Promise<WidgetLayout | undefined> {
    const [layout] = await db
      .select()
      .from(widgetLayouts)
      .where(eq(widgetLayouts.id, id));
    return layout || undefined;
  }

  async updateWidgetLayout(id: string, updates: Partial<InsertWidgetLayout>, userId: string): Promise<WidgetLayout | undefined> {
    const [updatedLayout] = await db
      .update(widgetLayouts)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(widgetLayouts.id, id), eq(widgetLayouts.userId, userId)))
      .returning();
    return updatedLayout || undefined;
  }

  async deleteWidgetLayout(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(widgetLayouts)
      .where(and(eq(widgetLayouts.id, id), eq(widgetLayouts.userId, userId)));
    return (result.rowCount || 0) > 0;
  }

  async getDefaultWidgetLayout(): Promise<WidgetLayout | undefined> {
    const [defaultLayout] = await db
      .select()
      .from(widgetLayouts)
      .where(eq(widgetLayouts.isDefault, true))
      .limit(1);
    return defaultLayout || undefined;
  }

  // Custom button operations
  async createCustomButton(button: InsertCustomButton): Promise<CustomButton> {
    const [newButton] = await db
      .insert(customButtons)
      .values(button)
      .returning();
    return newButton;
  }

  async getAllCustomButtons(): Promise<CustomButton[]> {
    return await db
      .select()
      .from(customButtons)
      .orderBy(desc(customButtons.createdAt));
  }

  async getCustomButton(id: number): Promise<CustomButton | undefined> {
    const [button] = await db
      .select()
      .from(customButtons)
      .where(eq(customButtons.id, id));
    return button || undefined;
  }

  async deleteCustomButton(id: number): Promise<boolean> {
    const result = await db
      .delete(customButtons)
      .where(eq(customButtons.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Ad space operations
  async createAdSpace(adSpace: InsertAdSpace): Promise<AdSpace> {
    const [newAdSpace] = await db
      .insert(adSpaces)
      .values(adSpace)
      .returning();
    return newAdSpace;
  }

  async getAllAdSpaces(): Promise<AdSpace[]> {
    return await db
      .select()
      .from(adSpaces)
      .orderBy(adSpaces.location, adSpaces.priority);
  }

  async getAdSpace(id: number): Promise<AdSpace | undefined> {
    const [adSpace] = await db
      .select()
      .from(adSpaces)
      .where(eq(adSpaces.id, id));
    return adSpace;
  }

  async getAdSpacesByLocation(location: string): Promise<AdSpace[]> {
    return await db
      .select()
      .from(adSpaces)
      .where(and(eq(adSpaces.location, location), eq(adSpaces.isActive, true)))
      .orderBy(adSpaces.priority);
  }

  async updateAdSpace(id: number, updates: Partial<InsertAdSpace>): Promise<AdSpace | undefined> {
    const [updatedAdSpace] = await db
      .update(adSpaces)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(adSpaces.id, id))
      .returning();
    return updatedAdSpace;
  }

  async deleteAdSpace(id: number): Promise<boolean> {
    const result = await db
      .delete(adSpaces)
      .where(eq(adSpaces.id, id));
    return (result.rowCount || 0) > 0;
  }

  async toggleAdSpace(id: number): Promise<AdSpace | undefined> {
    const adSpace = await this.getAdSpace(id);
    if (!adSpace) return undefined;
    
    return await this.updateAdSpace(id, { isActive: !adSpace.isActive });
  }

  // App settings operations
  async getAppSetting(key: string): Promise<AppSetting | undefined> {
    const [setting] = await db.select().from(appSettings).where(eq(appSettings.key, key));
    return setting || undefined;
  }

  async setAppSetting(setting: InsertAppSetting): Promise<AppSetting> {
    const [result] = await db
      .insert(appSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: appSettings.key,
        set: {
          value: setting.value,
          description: setting.description,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }

  async getAllAppSettings(): Promise<AppSetting[]> {
    return await db.select().from(appSettings).orderBy(appSettings.key);
  }

  async deleteAppSetting(key: string): Promise<boolean> {
    const result = await db.delete(appSettings).where(eq(appSettings.key, key));
    return result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
