import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ReflectionEntry, SyncStatus, User } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../services/supabase';

interface ReflectionContextType {
  entries: ReflectionEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (entry: Omit<ReflectionEntry, 'id' | 'synced'>) => Promise<void>;
  updateEntry: (id: string, entry: Partial<ReflectionEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  syncStatus: SyncStatus;
  syncLocalEntries: () => Promise<void>;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    syncing: false,
    lastSynced: null,
    error: null,
  });
  
  const { user } = useAuth();

  // Load entries from local storage or Supabase
  useEffect(() => {
    const loadEntries = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First, load from local storage
        const localEntries = loadFromLocalStorage();
        
        // If user is logged in, fetch from Supabase
        if (user) {
          const { data, error } = await supabase
            .from('reflections')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });
            
          if (error) throw error;
          
          // Merge remote entries with local entries
          // Local entries that aren't synced take precedence
          const remoteEntries = data as ReflectionEntry[];
          
          // Filter out local entries that exist in remote (already synced)
          const unsynced = localEntries.filter(
            local => !remoteEntries.some(remote => remote.id === local.id)
          );
          
          // Combine remote entries with unsynced local entries
          setEntries([...remoteEntries, ...unsynced]);
          
          // Update last synced time
          setSyncStatus(prev => ({
            ...prev,
            lastSynced: new Date(),
            error: null,
          }));
        } else {
          // If not logged in, just use local entries
          setEntries(localEntries);
        }
      } catch (err: any) {
        console.error('Error loading entries:', err);
        setError('Failed to load entries. Please try again later.');
        setSyncStatus(prev => ({
          ...prev,
          error: err.message || 'Failed to sync entries',
        }));
        
        // Fall back to local entries
        setEntries(loadFromLocalStorage());
      } finally {
        setLoading(false);
      }
    };
    
    loadEntries();
  }, [user]);

  // Save entries to local storage whenever they change
  useEffect(() => {
    saveToLocalStorage(entries);
  }, [entries]);

  // Load entries from local storage
  const loadFromLocalStorage = (): ReflectionEntry[] => {
    try {
      const storedEntries = localStorage.getItem('reflectionEntries');
      return storedEntries ? JSON.parse(storedEntries) : [];
    } catch (err) {
      console.error('Error loading from local storage:', err);
      return [];
    }
  };

  // Save entries to local storage
  const saveToLocalStorage = (entries: ReflectionEntry[]) => {
    try {
      localStorage.setItem('reflectionEntries', JSON.stringify(entries));
    } catch (err) {
      console.error('Error saving to local storage:', err);
    }
  };

  // Add a new entry
  const addEntry = async (entry: Omit<ReflectionEntry, 'id' | 'synced'>) => {
    try {
      const newEntry: ReflectionEntry = {
        ...entry,
        id: crypto.randomUUID(),
        synced: false,
      };
      
      // Add to local state
      setEntries(prev => [newEntry, ...prev]);
      
      // If user is logged in, sync to Supabase
      if (user) {
        await syncEntryToSupabase(newEntry, user);
      }
    } catch (err: any) {
      console.error('Error adding entry:', err);
      setError('Failed to add entry. Please try again.');
    }
  };

  // Update an existing entry
  const updateEntry = async (id: string, updates: Partial<ReflectionEntry>) => {
    try {
      // Update in local state
      setEntries(prev => 
        prev.map(entry => 
          entry.id === id 
            ? { ...entry, ...updates, synced: false } 
            : entry
        )
      );
      
      // If user is logged in, sync to Supabase
      if (user) {
        const updatedEntry = entries.find(e => e.id === id);
        if (updatedEntry) {
          await syncEntryToSupabase({ ...updatedEntry, ...updates }, user);
        }
      }
    } catch (err: any) {
      console.error('Error updating entry:', err);
      setError('Failed to update entry. Please try again.');
    }
  };

  // Delete an entry
  const deleteEntry = async (id: string) => {
    try {
      // Remove from local state
      setEntries(prev => prev.filter(entry => entry.id !== id));
      
      // If user is logged in, delete from Supabase
      if (user) {
        await supabase
          .from('reflections')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);
      }
    } catch (err: any) {
      console.error('Error deleting entry:', err);
      setError('Failed to delete entry. Please try again.');
    }
  };

  // Sync a single entry to Supabase
  const syncEntryToSupabase = async (entry: ReflectionEntry, user: User) => {
    try {
      // Prepare entry for Supabase (add user_id, remove synced flag)
      const { synced, ...entryData } = entry;
      const supabaseEntry = {
        ...entryData,
        user_id: user.id,
      };
      
      // Upsert to Supabase (insert if not exists, update if exists)
      const { error } = await supabase
        .from('reflections')
        .upsert(supabaseEntry, { onConflict: 'id' });
        
      if (error) throw error;
      
      // Mark as synced in local state
      setEntries(prev => 
        prev.map(e => 
          e.id === entry.id 
            ? { ...e, synced: true } 
            : e
        )
      );
      
      // Update sync status
      setSyncStatus(prev => ({
        ...prev,
        lastSynced: new Date(),
        error: null,
      }));
    } catch (err: any) {
      console.error('Error syncing entry to Supabase:', err);
      setSyncStatus(prev => ({
        ...prev,
        error: err.message || 'Failed to sync entry',
      }));
      throw err;
    }
  };

  // Sync all local entries to Supabase
  const syncLocalEntries = async () => {
    if (!user) return;
    
    setSyncStatus(prev => ({ ...prev, syncing: true, error: null }));
    
    try {
      // Get unsynced entries
      const unsynced = entries.filter(entry => !entry.synced);
      
      // Sync each entry
      for (const entry of unsynced) {
        await syncEntryToSupabase(entry, user);
      }
      
      // Update sync status
      setSyncStatus({
        syncing: false,
        lastSynced: new Date(),
        error: null,
      });
    } catch (err: any) {
      console.error('Error syncing entries:', err);
      setSyncStatus({
        syncing: false,
        lastSynced: syncStatus.lastSynced,
        error: err.message || 'Failed to sync entries',
      });
    }
  };

  return (
    <ReflectionContext.Provider
      value={{
        entries,
        loading,
        error,
        addEntry,
        updateEntry,
        deleteEntry,
        syncStatus,
        syncLocalEntries,
      }}
    >
      {children}
    </ReflectionContext.Provider>
  );
};
