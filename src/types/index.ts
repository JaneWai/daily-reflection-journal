export interface ReflectionEntry {
  id: string;
  date: string;
  timestamp: string; // New field to store the full ISO timestamp
  gratitude: string;
  achievement: string;
  improvement: string;
  mood: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}
