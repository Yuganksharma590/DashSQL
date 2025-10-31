import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User profiles with sustainability tracking
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  totalPoints: integer("total_points").notNull().default(0),
  totalCarbonSaved: real("total_carbon_saved").notNull().default(0), // in kg CO2
  level: integer("level").notNull().default(1),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Eco-friendly activities logged by users
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  category: text("category").notNull(), // Transport, Energy, Waste, Water, Food
  activityType: text("activity_type").notNull(), // Bike, Walk, PublicTransit, Solar, Recycle, etc.
  quantity: real("quantity").notNull(), // miles, kWh, lbs, gallons, etc.
  unit: text("unit").notNull(), // miles, kWh, lbs, gallons
  carbonSaved: real("carbon_saved").notNull(), // calculated kg CO2 saved
  pointsEarned: integer("points_earned").notNull(),
  location: jsonb("location").$type<{ lat: number; lng: number; name?: string }>(),
  notes: text("notes"),
  activityDate: timestamp("activity_date").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Rewards and achievements
export const rewards = pgTable("rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  rewardType: text("reward_type").notNull(), // Achievement, Milestone, Bonus
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(), // Lucide icon name
  pointsAwarded: integer("points_awarded").notNull(),
  unlockedAt: timestamp("unlocked_at").notNull().default(sql`now()`),
});

// Eco-coach chat messages
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  role: text("role").notNull(), // user or assistant
  content: text("content").notNull(),
  category: text("category"), // tips, advice, facts, motivation
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  totalPoints: true,
  totalCarbonSaved: true,
  level: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  carbonSaved: true,
  pointsEarned: true,
  createdAt: true,
}).extend({
  activityDate: z.coerce.date(),
});

export const insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
  unlockedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Reward = typeof rewards.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Activity categories and types configuration
export const ACTIVITY_CATEGORIES = {
  Transport: {
    icon: "Bike",
    types: [
      { name: "Bike", unit: "miles", carbonPerUnit: 0.9, pointsPerUnit: 10 },
      { name: "Walk", unit: "miles", carbonPerUnit: 0.9, pointsPerUnit: 8 },
      { name: "Public Transit", unit: "miles", carbonPerUnit: 0.6, pointsPerUnit: 6 },
      { name: "Carpool", unit: "miles", carbonPerUnit: 0.4, pointsPerUnit: 5 },
      { name: "Electric Vehicle", unit: "miles", carbonPerUnit: 0.3, pointsPerUnit: 4 },
    ],
  },
  Energy: {
    icon: "Zap",
    types: [
      { name: "Solar Power Used", unit: "kWh", carbonPerUnit: 0.5, pointsPerUnit: 12 },
      { name: "LED Bulbs", unit: "count", carbonPerUnit: 0.1, pointsPerUnit: 3 },
      { name: "Unplugged Devices", unit: "hours", carbonPerUnit: 0.05, pointsPerUnit: 2 },
      { name: "Energy Efficient Appliance", unit: "kWh", carbonPerUnit: 0.3, pointsPerUnit: 8 },
    ],
  },
  Waste: {
    icon: "Trash",
    types: [
      { name: "Recycled", unit: "lbs", carbonPerUnit: 1.2, pointsPerUnit: 7 },
      { name: "Composted", unit: "lbs", carbonPerUnit: 0.8, pointsPerUnit: 6 },
      { name: "Reusable Bag Used", unit: "count", carbonPerUnit: 0.02, pointsPerUnit: 2 },
      { name: "Avoided Plastic", unit: "items", carbonPerUnit: 0.05, pointsPerUnit: 3 },
    ],
  },
  Water: {
    icon: "Droplet",
    types: [
      { name: "Shower Shortened", unit: "minutes", carbonPerUnit: 0.15, pointsPerUnit: 4 },
      { name: "Dishwasher Eco Mode", unit: "loads", carbonPerUnit: 0.3, pointsPerUnit: 5 },
      { name: "Rainwater Collected", unit: "gallons", carbonPerUnit: 0.01, pointsPerUnit: 3 },
    ],
  },
  Food: {
    icon: "Apple",
    types: [
      { name: "Plant-based Meal", unit: "meals", carbonPerUnit: 2.5, pointsPerUnit: 15 },
      { name: "Local Produce", unit: "lbs", carbonPerUnit: 0.5, pointsPerUnit: 5 },
      { name: "Food Waste Prevented", unit: "lbs", carbonPerUnit: 1.0, pointsPerUnit: 8 },
    ],
  },
} as const;

export type ActivityCategory = keyof typeof ACTIVITY_CATEGORIES;
