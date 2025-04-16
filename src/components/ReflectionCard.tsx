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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-100 hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-3 flex justify-between items-center">
        <div className="flex flex-col">
          <h3 className="font-medium text-amber-800">{formatDate(entry.date)}</h3>
          <span className="text-xs text-amber-600">
            {entry.timestamp ? formatTime(entry.timestamp) : ""}
          </span>
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
          <h4 className="text-sm font-medium text-amber-700">Mood:</h4>
          <p className="text-gray-700">{entry.mood}</p>
        </div>
        
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
