import { users, messages, type User, type InsertUser, type Message, type InsertMessage, type MessageWithUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createMessage(message: InsertMessage): Promise<MessageWithUser>;
  getRecentMessages(limit?: number): Promise<MessageWithUser[]>;
  updateMessageReactions(messageId: number, reactions: Record<string, { count: number; users: string[] }>): Promise<MessageWithUser | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createMessage(insertMessage: InsertMessage): Promise<MessageWithUser> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    
    const messageWithUser = await db
      .select()
      .from(messages)
      .innerJoin(users, eq(messages.userId, users.id))
      .where(eq(messages.id, message.id));

    return {
      ...messageWithUser[0].messages,
      user: messageWithUser[0].users,
      parsedReactions: messageWithUser[0].messages.reactions ? JSON.parse(messageWithUser[0].messages.reactions) : {},
    };
  }

  async updateMessageReactions(messageId: number, reactions: Record<string, { count: number; users: string[] }>): Promise<MessageWithUser | undefined> {
    const [updatedMessage] = await db
      .update(messages)
      .set({ reactions: JSON.stringify(reactions) })
      .where(eq(messages.id, messageId))
      .returning();

    if (!updatedMessage) return undefined;

    const messageWithUser = await db
      .select()
      .from(messages)
      .innerJoin(users, eq(messages.userId, users.id))
      .where(eq(messages.id, messageId));

    return {
      ...messageWithUser[0].messages,
      user: messageWithUser[0].users,
      parsedReactions: reactions,
    };
  }

  async getRecentMessages(limit = 50): Promise<MessageWithUser[]> {
    const result = await db
      .select()
      .from(messages)
      .innerJoin(users, eq(messages.userId, users.id))
      .orderBy(desc(messages.createdAt))
      .limit(limit);

    return result.map(row => ({
      ...row.messages,
      user: row.users,
      parsedReactions: row.messages.reactions ? JSON.parse(row.messages.reactions) : {},
    })).reverse();
  }
}

export const storage = new DatabaseStorage();
