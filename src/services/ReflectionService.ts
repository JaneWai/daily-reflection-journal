import { supabase } from './supabase';
import { ReflectionEntry, User } from '../types';

export const ReflectionService = {
  // Get all reflections for a user
  async getReflections(userId: string): Promise<ReflectionEntry[]> {
    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
      
    if (error) throw error;
    return data as ReflectionEntry[];
  },
  
  // Add a new reflection
  async addReflection(reflection: Omit<ReflectionEntry, 'id' | 'created_at'>, user: User): Promise<ReflectionEntry> {
    const { data, error } = await supabase
      .from('reflections')
      .insert({
        ...reflection,
        user_id: user.id,
      })
      .select()
      .single();
      
    if (error) throw error;
    return data as ReflectionEntry;
  },
  
  // Update an existing reflection
  async updateReflection(id: string, updates: Partial<ReflectionEntry>, userId: string): Promise<void> {
    const { error } = await supabase
      .from('reflections')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId);
      
    if (error) throw error;
  },
  
  // Delete a reflection
  async deleteReflection(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('reflections')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
      
    if (error) throw error;
  },
  
  // Sync local entries to Supabase
  async syncEntries(entries: ReflectionEntry[], userId: string): Promise<void> {
    // Filter entries that belong to this user
    const userEntries = entries.filter(entry => 
      !entry.user_id || entry.user_id === userId
    );
    
    // Add user_id to each entry
    const preparedEntries = userEntries.map(entry => ({
      ...entry,
      user_id: userId,
    }));
    
    // Upsert entries to Supabase
    const { error } = await supabase
      .from('reflections')
      .upsert(preparedEntries, { onConflict: 'id' });
      
    if (error) throw error;
  }
};
