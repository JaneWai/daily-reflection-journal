export interface User {
  id: string;
  email: string;
}

export interface ReflectionEntry {
  id: string;
  user_id?: string;
  date: string;
  timestamp: string;
  gratitude: string;
  achievement: string;
  improvement: string;
  mood: string;
  created_at?: string;
  synced?: boolean;
}

export interface SyncStatus {
  syncing: boolean;
  lastSynced: Date | null;
  error: string | null;
}
