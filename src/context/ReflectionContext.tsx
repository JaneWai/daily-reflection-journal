import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ReflectionEntry } from '../types';

interface ReflectionContextType {
  entries: ReflectionEntry[];
  addEntry: (entry: Omit<ReflectionEntry, 'id'>) => void;
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
        setEntries(JSON.parse(savedEntries));
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

  const addEntry = (entry: Omit<ReflectionEntry, 'id'>) => {
    const newEntry: ReflectionEntry = {
      ...entry,
      id: uuidv4()
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
