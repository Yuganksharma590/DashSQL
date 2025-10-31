import { 
  type User, type InsertUser,
  type Activity, type InsertActivity,
  type Reward, type InsertReward,
  type ChatMessage, type InsertChatMessage,
  ACTIVITY_CATEGORIES,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getOrCreateDefaultUser(): Promise<User>;

  // Activity methods
  getActivities(userId: string): Promise<Activity[]>;
  getActivity(id: string): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  getRecentActivities(userId: string, limit: number): Promise<Activity[]>;

  // Reward methods
  getRewards(userId: string): Promise<Reward[]>;
  getReward(id: string): Promise<Reward | undefined>;
  createReward(reward: InsertReward): Promise<Reward>;
  getRecentRewards(userId: string, limit: number): Promise<Reward[]>;

  // Chat methods
  getChatMessages(userId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private activities: Map<string, Activity>;
  private rewards: Map<string, Reward>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.activities = new Map();
    this.rewards = new Map();
    this.chatMessages = new Map();
    
    // Create default user
    this.initializeDefaultUser();
  }

  private initializeDefaultUser() {
    const defaultUser: User = {
      id: "default-user",
      username: "EcoWarrior",
      email: "warrior@greenmove.eco",
      totalPoints: 0,
      totalCarbonSaved: 0,
      level: 1,
      avatarUrl: null,
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      totalPoints: 0,
      totalCarbonSaved: 0,
      level: 1,
      avatarUrl: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    
    // Check for level up
    const pointsForNextLevel = updatedUser.level * 100;
    if (updatedUser.totalPoints >= pointsForNextLevel) {
      updatedUser.level += 1;
      this.users.set(id, updatedUser);
      
      // Award level up reward
      await this.createReward({
        userId: id,
        rewardType: "Milestone",
        title: `Level ${updatedUser.level} Reached!`,
        description: `You've reached level ${updatedUser.level}! Keep up the great work!`,
        iconName: "Trophy",
        pointsAwarded: 50,
      });
    }
    
    return updatedUser;
  }

  async getOrCreateDefaultUser(): Promise<User> {
    const user = this.users.get("default-user");
    if (user) return user;
    
    this.initializeDefaultUser();
    return this.users.get("default-user")!;
  }

  // Activity methods
  async getActivities(userId: string): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter((activity) => activity.userId === userId)
      .sort((a, b) => new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime());
  }

  async getActivity(id: string): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    
    // Calculate carbon saved and points
    const category = insertActivity.category as keyof typeof ACTIVITY_CATEGORIES;
    const categoryConfig = ACTIVITY_CATEGORIES[category];
    const typeConfig = categoryConfig?.types.find(t => t.name === insertActivity.activityType);
    
    const carbonSaved = typeConfig 
      ? insertActivity.quantity * typeConfig.carbonPerUnit 
      : insertActivity.quantity * 0.5; // fallback
      
    const pointsEarned = typeConfig
      ? Math.round(insertActivity.quantity * typeConfig.pointsPerUnit)
      : Math.round(insertActivity.quantity * 5); // fallback

    const activity: Activity = {
      ...insertActivity,
      id,
      carbonSaved,
      pointsEarned,
      createdAt: new Date(),
    };
    
    this.activities.set(id, activity);
    
    // Update user stats
    const user = await this.getUser(insertActivity.userId);
    if (user) {
      await this.updateUser(user.id, {
        totalPoints: user.totalPoints + pointsEarned,
        totalCarbonSaved: user.totalCarbonSaved + carbonSaved,
      });
    }
    
    // Check for milestone rewards
    await this.checkAndAwardMilestones(insertActivity.userId);
    
    return activity;
  }

  async getRecentActivities(userId: string, limit: number = 5): Promise<Activity[]> {
    const activities = await this.getActivities(userId);
    return activities.slice(0, limit);
  }

  private async checkAndAwardMilestones(userId: string) {
    const user = await this.getUser(userId);
    if (!user) return;
    
    const activities = await this.getActivities(userId);
    const existingRewards = await this.getRewards(userId);
    
    // First activity milestone
    if (activities.length === 1 && !existingRewards.some(r => r.title === "First Steps")) {
      await this.createReward({
        userId,
        rewardType: "Achievement",
        title: "First Steps",
        description: "Logged your first eco-friendly activity!",
        iconName: "Leaf",
        pointsAwarded: 25,
      });
    }
    
    // 10 kg CO2 milestone
    if (user.totalCarbonSaved >= 10 && !existingRewards.some(r => r.title === "Green Warrior")) {
      await this.createReward({
        userId,
        rewardType: "Milestone",
        title: "Green Warrior",
        description: "Saved 10 kg of CO₂! You're making a real impact!",
        iconName: "Award",
        pointsAwarded: 50,
      });
    }
    
    // 50 kg CO2 milestone
    if (user.totalCarbonSaved >= 50 && !existingRewards.some(r => r.title === "Eco Champion")) {
      await this.createReward({
        userId,
        rewardType: "Milestone",
        title: "Eco Champion",
        description: "Saved 50 kg of CO₂! Amazing dedication!",
        iconName: "Trophy",
        pointsAwarded: 100,
      });
    }
    
    // 10 activities milestone
    if (activities.length === 10 && !existingRewards.some(r => r.title === "Dedicated Green")) {
      await this.createReward({
        userId,
        rewardType: "Achievement",
        title: "Dedicated Green",
        description: "Logged 10 eco-friendly activities!",
        iconName: "Activity",
        pointsAwarded: 30,
      });
    }
  }

  // Reward methods
  async getRewards(userId: string): Promise<Reward[]> {
    return Array.from(this.rewards.values())
      .filter((reward) => reward.userId === userId)
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime());
  }

  async getReward(id: string): Promise<Reward | undefined> {
    return this.rewards.get(id);
  }

  async createReward(insertReward: InsertReward): Promise<Reward> {
    const id = randomUUID();
    const reward: Reward = {
      ...insertReward,
      id,
      unlockedAt: new Date(),
    };
    
    this.rewards.set(id, reward);
    
    // Award points to user
    const user = await this.getUser(insertReward.userId);
    if (user && insertReward.pointsAwarded > 0) {
      await this.updateUser(user.id, {
        totalPoints: user.totalPoints + insertReward.pointsAwarded,
      });
    }
    
    return reward;
  }

  async getRecentRewards(userId: string, limit: number = 3): Promise<Reward[]> {
    const rewards = await this.getRewards(userId);
    return rewards.slice(0, limit);
  }

  // Chat methods
  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((message) => message.userId === userId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    
    this.chatMessages.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
