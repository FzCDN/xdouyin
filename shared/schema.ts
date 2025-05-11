import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define video schema based on the API response
export const videoSchema = z.object({
  id: z.number(),
  videoid: z.string(),
  url: z.string(),
  title_id: z.string(),
  title_en: z.string(),
  title_zh: z.string(),
  description_id: z.string(),
  description_en: z.string(),
  description_zh: z.string(),
  mp4: z.string(),
  m3u8: z.string(),
  image: z.string(),
  duration: z.number()
});

// Define API response schema
export const apiResponseSchema = z.object({
  total: z.number(),
  data: z.array(videoSchema)
});

export type Video = z.infer<typeof videoSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;

// Keep the original users table for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
