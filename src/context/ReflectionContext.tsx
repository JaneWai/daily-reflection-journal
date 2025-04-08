import React, { createContext, useContext, useState, useEffect } from 'react';
import { ReflectionEntry } from '../types';

interface ReflectionContextType {
  entries: ReflectionEntry[];
  addEntry: (entry: Omit<ReflectionEntry, 'id'>) => void;
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

export const ReflectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<ReflectionEntry[]>(() => {
    const savedEntries = localStorage.getItem('reflectionEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  useEffect(() => {
    localStorage.setItem('reflectionEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: Omit<ReflectionEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setEntries((prev) => [...prev, newEntry]);
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <ReflectionContext.Provider value={{ entries, addEntry, deleteEntry }}>
      {children}
    </ReflectionContext.Provider>
  );
};
