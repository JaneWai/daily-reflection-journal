import React from 'react';
import { useReflections } from '../context/ReflectionContext';
import ReflectionCard from './ReflectionCard';

const ListView: React.FC = () => {
  const { entries } = useReflections();
  
  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <img 
          src="https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
          alt="Empty journal" 
          className="w-40 h-40 object-cover rounded-full mb-4 opacity-70"
        />
        <h3 className="text-xl font-medium text-amber-800 mb-2">Your reflection journal is empty</h3>
        <p className="text-gray-600 max-w-md">
          Start your journey of self-reflection by adding your first entry using the "Add New Entry" button.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {sortedEntries.map((entry) => (
        <ReflectionCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default ListView;
