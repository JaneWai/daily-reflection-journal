import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ReflectionEntry } from '../types';
import { useAuth } from './AuthContext';
import GoogleDriveService from '../services/GoogleDriveService';

interface ReflectionContextType {
  entries: ReflectionEntry[];
  addEntry: (entry: Omit<ReflectionEntry, 'id' | 'date'>) => void;
  deleteEntry: (id: string) => void;
  isLoading: boolean;
  syncWithGoogleDrive: () => Promise<void>;
}

const ReflectionContext = createContext<ReflectionContextType | undefined>(undefined);

export const useReflections = () => {
  const context = useContext(ReflectionContext);
  if (!context) {
    throw new Error('useReflections must be used within a ReflectionProvider');
  }
  return context;
};

interface ReflectionProviderProps {
  children: ReactNode;
}

export const ReflectionProvider: React.FC<ReflectionProviderProps> = ({ children }) => {
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, accessToken } = useAuth();

  // Load entries from localStorage on initial render
  useEffect(() => {
    const savedEntries = localStorage.getItem('reflectionEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Sync with Google Drive when user authenticates
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      syncWithGoogleDrive();
    }
  }, [isAuthenticated, accessToken]);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('reflectionEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: Omit<ReflectionEntry, 'id' | 'date'>) => {
    const newEntry: ReflectionEntry = {
      ...entry,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };

    setEntries(prevEntries => {
      const updatedEntries = [newEntry, ...prevEntries];
      return updatedEntries;
    });
  };

  const deleteEntry = (id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };

  const syncWithGoogleDrive = async () => {
    if (!isAuthenticated || !accessToken) {
      console.warn('Cannot sync with Google Drive: User not authenticated');
      return;
    }

    setIsLoading(true);
    try {
      const driveService = new GoogleDriveService(accessToken);
      
      // Load entries from Google Drive
      const driveEntries = await driveService.loadReflections();
      
      if (driveEntries.length > 0) {
        // Merge local and remote entries, keeping the most recent version of each entry
        const mergedEntries = mergeEntries(entries, driveEntries);
        setEntries(mergedEntries);
      } else if (entries.length > 0) {
        // If no entries on Drive but we have local entries, save them to Drive
        await driveService.saveReflections(entries);
      }
      
      // Save the final merged state back to Google Drive
      await driveService.saveReflections(entries);
      
      console.log('Successfully synced with Google Drive');
    } catch (error) {
      console.error('Error syncing with Google Drive:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to merge entries from local storage and Google Drive
  const mergeEntries = (localEntries: ReflectionEntry[], driveEntries: ReflectionEntry[]): ReflectionEntry[] => {
    // Create a map of all entries by ID
    const entriesMap = new Map<string, ReflectionEntry>();
    
    // Add all local entries to the map
    localEntries.forEach(entry => {
      entriesMap.set(entry.id, entry);
    });
    
    // Add or update with drive entries
    driveEntries.forEach(entry => {
      if (!entriesMap.has(entry.id) || new Date(entry.date) > new Date(entriesMap.get(entry.id)!.date)) {
        entriesMap.set(entry.id, entry);
      }
    });
    
    // Convert map back to array and sort by date (newest first)
    return Array.from(entriesMap.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <ReflectionContext.Provider value={{ entries, addEntry, deleteEntry, isLoading, syncWithGoogleDrive }}>
      {children}
    </ReflectionContext.Provider>
  );
};
