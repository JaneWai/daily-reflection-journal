import React from 'react';
import { Trash2 } from 'lucide-react';
import { ReflectionEntry } from '../types';
import { useReflections } from '../context/ReflectionContext';

interface ReflectionCardProps {
  entry: ReflectionEntry;
}

const ReflectionCard: React.FC<ReflectionCardProps> = ({ entry }) => {
  const { deleteEntry } = useReflections();
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const moodEmoji = {
    happy: '😊',
    neutral: '😐',
    sad: '😔'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-100 hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-label={`Mood: ${entry.mood}`}>
            {moodEmoji[entry.mood]}
          </span>
          <h3 className="font-medium text-amber-800">{formatDate(entry.date)}</h3>
        </div>
        <button 
          onClick={() => deleteEntry(entry.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete entry"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h4 className="text-sm font-medium text-amber-700">Grateful for:</h4>
          <p className="text-gray-700">{entry.gratitude}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-amber-700">Achievement:</h4>
          <p className="text-gray-700">{entry.achievement}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-amber-700">Improvement:</h4>
          <p className="text-gray-700">{entry.improvement}</p>
        </div>
      </div>
    </div>
  );
};

export default ReflectionCard;
