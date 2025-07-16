import type { 
  User, 
  UpsertUser, 
  ButtonDesign, 
  InsertButtonDesign, 
  WidgetLayout, 
  InsertWidgetLayout, 
  CustomButton, 
  InsertCustomButton, 
  AdSpace, 
  InsertAdSpace, 
  AppSetting, 
  InsertAppSetting,
  AdSenseVerification,
  InsertAdSenseVerification
} from "@shared/schema";
import { IStorage } from "./storage";
import bcrypt from "bcrypt";

export class MemStorage implements IStorage {
  private users: User[] = [];
  private admins: Array<{ 
    id: string; 
    username: string; 
    password: string; 
    email?: string;
    resetToken?: string;
    resetTokenExpiry?: Date;
    lastPasswordChange?: Date;
    createdAt: Date | null;
    updatedAt: Date | null;
  }> = [];
  private buttonDesigns: ButtonDesign[] = [];
  private widgetLayouts: WidgetLayout[] = [];
  private customButtons: CustomButton[] = [];
  private adSpaces: AdSpace[] = [];
  private appSettings: AppSetting[] = [
    {
      id: 1,
      key: "app_logo_height",
      value: "32",
      description: "Height of the app logo in pixels",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  private adsenseVerifications: AdSenseVerification[] = [];

  private nextId = 1;

  constructor() {
    // Initialize with default admin (Username: "Admin", Password: "123")
    this.createAdmin({ username: "Admin", password: "123" });
    
    // Add some sample custom buttons
    this.customButtons = [
      {
        id: 10,
        name: "Click Me Button",
        cssCode: `.custom-btn {
  background: linear-gradient(45deg, #ff6b6b, #ee5a52);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}
.custom-btn:hover {
  transform: scale(1.05);
}`,
        htmlCode: `<button class="custom-btn">Click Me</button>`,
        description: "A simple gradient button with hover scale effect",
        createdAt: new Date()
      }
    ];
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingIndex = this.users.findIndex(user => user.id === userData.id);
    const user: User = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (existingIndex >= 0) {
      this.users[existingIndex] = { ...this.users[existingIndex], ...user, updatedAt: new Date() };
      return this.users[existingIndex];
    } else {
      this.users.push(user);
      return user;
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      (user as any).role = role;
      user.updatedAt = new Date();
    }
    return user;
  }

  // Admin operations
  async createAdmin(adminData: { username: string; password: string; email?: string }): Promise<{ id: string; username: string; createdAt: Date | null }> {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = {
      id: `admin-${this.nextId++}`,
      username: adminData.username,
      password: hashedPassword,
      email: adminData.email,
      resetToken: undefined,
      resetTokenExpiry: undefined,
      lastPasswordChange: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.admins.push(admin);
    return { id: admin.id, username: admin.username, createdAt: admin.createdAt };
  }

  async getAdminByUsername(username: string): Promise<{ id: string; username: string; password: string; email?: string } | undefined> {
    const admin = this.admins.find(admin => admin.username === username);
    if (admin) {
      return {
        id: admin.id,
        username: admin.username,
        password: admin.password,
        email: admin.email
      };
    }
    return undefined;
  }

  async getAllAdmins(): Promise<{ id: string; username: string; email?: string }[]> {
    return this.admins.map(admin => ({ 
      id: admin.id, 
      username: admin.username, 
      email: admin.email 
    }));
  }

  async updateAdminCredentials(id: string, updates: { username?: string; password?: string; email?: string }): Promise<boolean> {
    const admin = this.admins.find(admin => admin.id === id);
    if (!admin) return false;

    if (updates.username) {
      // Check if username already exists
      const existingAdmin = this.admins.find(a => a.username === updates.username && a.id !== id);
      if (existingAdmin) return false;
      admin.username = updates.username;
    }

    if (updates.password) {
      admin.password = await bcrypt.hash(updates.password, 10);
      admin.lastPasswordChange = new Date();
    }

    if (updates.email !== undefined) {
      // Check if email already exists
      if (updates.email) {
        const existingAdmin = this.admins.find(a => a.email === updates.email && a.id !== id);
        if (existingAdmin) return false;
      }
      admin.email = updates.email;
    }

    admin.updatedAt = new Date();
    return true;
  }



  async getAdminById(id: string): Promise<{ id: string; username: string; email?: string } | undefined> {
    const admin = this.admins.find(admin => admin.id === id);
    if (admin) {
      return {
        id: admin.id,
        username: admin.username,
        email: admin.email
      };
    }
    return undefined;
  }

  // Button design operations
  async saveButtonDesign(design: InsertButtonDesign & { userId: string }): Promise<ButtonDesign> {
    const buttonDesign: ButtonDesign = {
      id: this.nextId++,
      ...design,
      createdAt: new Date()
    };
    this.buttonDesigns.push(buttonDesign);
    return buttonDesign;
  }

  async getUserButtonDesigns(userId: string): Promise<ButtonDesign[]> {
    return this.buttonDesigns.filter(design => design.userId === userId);
  }

  async getAllButtonDesigns(limit: number = 100): Promise<ButtonDesign[]> {
    return this.buttonDesigns.slice(0, limit);
  }

  async getButtonDesign(id: number): Promise<ButtonDesign | undefined> {
    return this.buttonDesigns.find(design => design.id === id);
  }

  async deleteButtonDesign(id: number, userId: string): Promise<boolean> {
    const index = this.buttonDesigns.findIndex(design => design.id === id && design.userId === userId);
    if (index >= 0) {
      this.buttonDesigns.splice(index, 1);
      return true;
    }
    return false;
  }

  // Widget layout operations
  async saveWidgetLayout(layout: InsertWidgetLayout & { userId: string }): Promise<WidgetLayout> {
    const widgetLayout: WidgetLayout = {
      id: `widget-${this.nextId++}`,
      ...layout,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.widgetLayouts.push(widgetLayout);
    return widgetLayout;
  }

  async getUserWidgetLayouts(userId: string): Promise<WidgetLayout[]> {
    return this.widgetLayouts.filter(layout => layout.userId === userId);
  }

  async getWidgetLayout(id: string): Promise<WidgetLayout | undefined> {
    return this.widgetLayouts.find(layout => layout.id === id);
  }

  async updateWidgetLayout(id: string, updates: Partial<InsertWidgetLayout>, userId: string): Promise<WidgetLayout | undefined> {
    const layout = this.widgetLayouts.find(l => l.id === id && l.userId === userId);
    if (layout) {
      Object.assign(layout, updates, { updatedAt: new Date() });
    }
    return layout;
  }

  async deleteWidgetLayout(id: string, userId: string): Promise<boolean> {
    const index = this.widgetLayouts.findIndex(layout => layout.id === id && layout.userId === userId);
    if (index >= 0) {
      this.widgetLayouts.splice(index, 1);
      return true;
    }
    return false;
  }

  async getDefaultWidgetLayout(): Promise<WidgetLayout | undefined> {
    return this.widgetLayouts.find(layout => layout.isDefault);
  }

  // Custom button operations
  async createCustomButton(button: InsertCustomButton): Promise<CustomButton> {
    const customButton: CustomButton = {
      id: this.nextId++,
      ...button,
      createdAt: new Date()
    };
    this.customButtons.push(customButton);
    return customButton;
  }

  async getAllCustomButtons(): Promise<CustomButton[]> {
    return this.customButtons;
  }

  async getCustomButton(id: number): Promise<CustomButton | undefined> {
    return this.customButtons.find(button => button.id === id);
  }

  async deleteCustomButton(id: number): Promise<boolean> {
    const index = this.customButtons.findIndex(button => button.id === id);
    if (index >= 0) {
      this.customButtons.splice(index, 1);
      return true;
    }
    return false;
  }

  // Ad space operations
  async createAdSpace(adSpace: InsertAdSpace): Promise<AdSpace> {
    const newAdSpace: AdSpace = {
      id: this.nextId++,
      ...adSpace,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.adSpaces.push(newAdSpace);
    return newAdSpace;
  }

  async getAllAdSpaces(): Promise<AdSpace[]> {
    return this.adSpaces;
  }

  async getAdSpace(id: number): Promise<AdSpace | undefined> {
    return this.adSpaces.find(space => space.id === id);
  }

  async getAdSpacesByLocation(location: string): Promise<AdSpace[]> {
    return this.adSpaces.filter(space => space.location === location && space.isActive);
  }

  async updateAdSpace(id: number, updates: Partial<InsertAdSpace>): Promise<AdSpace | undefined> {
    const space = this.adSpaces.find(s => s.id === id);
    if (space) {
      Object.assign(space, updates, { updatedAt: new Date() });
    }
    return space;
  }

  async deleteAdSpace(id: number): Promise<boolean> {
    const index = this.adSpaces.findIndex(space => space.id === id);
    if (index >= 0) {
      this.adSpaces.splice(index, 1);
      return true;
    }
    return false;
  }

  async toggleAdSpace(id: number): Promise<AdSpace | undefined> {
    const space = this.adSpaces.find(s => s.id === id);
    if (space) {
      space.isActive = !space.isActive;
      space.updatedAt = new Date();
    }
    return space;
  }

  // App settings operations
  async getAppSetting(key: string): Promise<AppSetting | undefined> {
    return this.appSettings.find(setting => setting.key === key);
  }

  async setAppSetting(setting: InsertAppSetting): Promise<AppSetting> {
    const existingIndex = this.appSettings.findIndex(s => s.key === setting.key);
    const newSetting: AppSetting = {
      id: this.nextId++,
      ...setting,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (existingIndex >= 0) {
      this.appSettings[existingIndex] = { ...this.appSettings[existingIndex], ...newSetting, updatedAt: new Date() };
      return this.appSettings[existingIndex];
    } else {
      this.appSettings.push(newSetting);
      return newSetting;
    }
  }

  async getAllAppSettings(): Promise<AppSetting[]> {
    return this.appSettings;
  }

  async deleteAppSetting(key: string): Promise<boolean> {
    const index = this.appSettings.findIndex(setting => setting.key === key);
    if (index >= 0) {
      this.appSettings.splice(index, 1);
      return true;
    }
    return false;
  }

  // AdSense verification operations
  async createAdSenseVerification(verificationData: InsertAdSenseVerification): Promise<AdSenseVerification> {
    const verification: AdSenseVerification = {
      id: `verification-${Date.now()}`,
      ...verificationData,
      createdAt: new Date(),
      updatedAt: new Date(),
      verifiedAt: null,
    };
    
    // Remove existing verification (only one allowed)
    this.adsenseVerifications = [];
    this.adsenseVerifications.push(verification);
    
    return verification;
  }

  async getAdSenseVerification(): Promise<AdSenseVerification | undefined> {
    return this.adsenseVerifications.find(v => v.isActive);
  }

  async updateAdSenseVerification(id: string, updates: Partial<InsertAdSenseVerification>): Promise<AdSenseVerification | undefined> {
    const verification = this.adsenseVerifications.find(v => v.id === id);
    if (verification) {
      Object.assign(verification, updates, { updatedAt: new Date() });
      return verification;
    }
    return undefined;
  }

  async verifyAdSenseVerification(id: string): Promise<AdSenseVerification | undefined> {
    const verification = this.adsenseVerifications.find(v => v.id === id);
    if (verification) {
      verification.verified = true;
      verification.verifiedAt = new Date();
      verification.updatedAt = new Date();
      return verification;
    }
    return undefined;
  }

  async deleteAdSenseVerification(id: string): Promise<boolean> {
    const index = this.adsenseVerifications.findIndex(v => v.id === id);
    if (index !== -1) {
      this.adsenseVerifications.splice(index, 1);
      return true;
    }
    return false;
  }
}