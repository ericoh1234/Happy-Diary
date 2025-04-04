import { entries, type Entry, type InsertEntry, users, type User, type InsertUser } from "@shared/schema";
import { firebaseDb } from './firebase';

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Journal entries CRUD methods
  getEntries(): Promise<Entry[]>;
  getEntry(id: number): Promise<Entry | undefined>;
  createEntry(entry: InsertEntry): Promise<Entry>;
  updateEntry(id: number, entry: Partial<InsertEntry>): Promise<Entry | undefined>;
  deleteEntry(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private journalEntries: Map<number, Entry>;
  currentUserId: number;
  currentEntryId: number;

  constructor() {
    this.users = new Map();
    this.journalEntries = new Map();
    this.currentUserId = 1;
    this.currentEntryId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getEntries(): Promise<Entry[]> {
    return Array.from(this.journalEntries.values())
      .sort((a, b) => {
        // Sort by date descending (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async getEntry(id: number): Promise<Entry | undefined> {
    return this.journalEntries.get(id);
  }

  async createEntry(insertEntry: InsertEntry): Promise<Entry> {
    const id = this.currentEntryId++;
    const entry: Entry = { 
      ...insertEntry, 
      id,
      createdAt: new Date()
    };
    this.journalEntries.set(id, entry);
    return entry;
  }

  async updateEntry(id: number, updatedEntry: Partial<InsertEntry>): Promise<Entry | undefined> {
    const existingEntry = this.journalEntries.get(id);
    if (!existingEntry) {
      return undefined;
    }

    const updated: Entry = { 
      ...existingEntry, 
      ...updatedEntry 
    };
    this.journalEntries.set(id, updated);
    return updated;
  }

  async deleteEntry(id: number): Promise<boolean> {
    if (!this.journalEntries.has(id)) {
      return false;
    }
    return this.journalEntries.delete(id);
  }
}

export class FirebaseStorage implements IStorage {
  // For now, we'll keep the user methods using memory storage
  // since we're only focusing on diary entries
  private users: Map<number, User>;
  currentUserId: number;

  constructor() {
    this.users = new Map();
    this.currentUserId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Use Firebase for journal entries
  async getEntries(): Promise<Entry[]> {
    return await firebaseDb.getEntries();
  }

  async getEntry(id: number): Promise<Entry | undefined> {
    return await firebaseDb.getEntry(id);
  }

  async createEntry(insertEntry: InsertEntry): Promise<Entry> {
    return await firebaseDb.createEntry(insertEntry);
  }

  async updateEntry(id: number, updatedEntry: Partial<InsertEntry>): Promise<Entry | undefined> {
    return await firebaseDb.updateEntry(id, updatedEntry);
  }

  async deleteEntry(id: number): Promise<boolean> {
    return await firebaseDb.deleteEntry(id);
  }
}

// Temporarily using MemStorage until Firebase permissions are properly set
export const storage = new MemStorage();
