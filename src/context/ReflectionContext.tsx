import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ReflectionEntry } from '../types';

interface ReflectionContextType {
  entries: ReflectionEntry[];
  addEntry: (entry: Omit<ReflectionEntry, 'id' | 'timestamp'>) => void;
  updateEntry: (id: string, entry: Partial<ReflectionEntry>) => void;
  deleteEntry: (id: string) => void;
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

  // Load entries from localStorage on initial render
  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem('reflectionEntries');
      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries);
        
        // Handle migration of old entries without timestamp
        const migratedEntries = parsedEntries.map((entry: any) => {
          if (!entry.timestamp) {
            // For old entries, use the date and set a default time (noon)
            const dateObj = new Date(entry.date);
            return {
              ...entry,
              timestamp: dateObj.toISOString()
            };
          }
          return entry;
        });
        
        setEntries(migratedEntries);
      }
    } catch (error) {
      console.error('Error loading entries from localStorage:', error);
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('reflectionEntries', JSON.stringify(entries));
    }
  }, [entries]);

  const addEntry = (entry: Omit<ReflectionEntry, 'id' | 'timestamp'>) => {
    // Create a new timestamp using the user's local timezone
    const now = new Date();
    
    const newEntry: ReflectionEntry = {
      ...entry,
      id: uuidv4(),
      timestamp: now.toISOString() // Store full ISO timestamp
    };
    
    setEntries(prevEntries => [...prevEntries, newEntry]);
  };

  const updateEntry = (id: string, updatedFields: Partial<ReflectionEntry>) => {
    setEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === id ? { ...entry, ...updatedFields } : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };

  return (
    <ReflectionContext.Provider value={{
      entries,
      addEntry,
      updateEntry,
      deleteEntry
    }}>
      {children}
    </ReflectionContext.Provider>
  );
};
