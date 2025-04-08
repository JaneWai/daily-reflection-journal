import React from 'react';
import { Trash2 } from 'lucide-react';
import { ReflectionEntry } from '../types';
import { useReflections } from '../context/ReflectionContext';

interface ReflectionCardProps {
  entry: ReflectionEntry;
}

const ReflectionCard: React.FC<ReflectionCardProps> = ({ entry }) => {
  const { deleteEntry } = useReflections();
  const date = new Date(entry.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-100 hover:shadow-lg transition-shadow duration-300">
      <div className="bg-gradient-to-r from-amber-100 to-amber-200 px-4 py-2 flex justify-between items-center">
        <h3 className="font-medium text-amber-800">{formattedDate}</h3>
        <button 
          onClick={() => deleteEntry(entry.id)}
          className="text-amber-700 hover:text-red-600 transition-colors"
          aria-label="Delete entry"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-amber-700">Grateful for:</h4>
          <p className="text-gray-700">{entry.gratitude}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-amber-700">Done great:</h4>
          <p className="text-gray-700">{entry.achievement}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-amber-700">Improvement:</h4>
          <p className="text-gray-700">{entry.improvement}</p>
        </div>
      </div>
    </div>
  );
};

export default ReflectionCard;
