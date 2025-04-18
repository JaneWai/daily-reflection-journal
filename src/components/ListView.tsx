import React, { useState } from 'react';
import { useReflections } from '../context/ReflectionContext';
import ReflectionCard from './ReflectionCard';
import NewEntryForm from './NewEntryForm';
import { BookHeart } from 'lucide-react';

const ListView: React.FC = () => {
  const { entries, loading } = useReflections();
  const [isCreatingEntry, setIsCreatingEntry] = useState(false);
  
  const handleNewEntry = () => {
    setIsCreatingEntry(true);
  };
  
  const handleCloseForm = () => {
    setIsCreatingEntry(false);
  };
  
  // Group entries by date
  const groupedEntries = entries.reduce((groups: Record<string, typeof entries>, entry) => {
    const date = entry.date.split('T')[0]; // Extract YYYY-MM-DD
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {});
  
  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedEntries).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-20 h-20 mb-6 text-amber-400 animate-pulse hover:animate-bounce transition-all duration-300">
        <BookHeart size={80} className="transform transition-transform hover:scale-110 duration-300" />
      </div>
      <h3 className="text-xl font-semibold text-amber-700 mb-2 animate-fadeIn">
        You haven't added any reflections yet.
      </h3>
      <p className="text-amber-600 mb-6 max-w-md animate-fadeSlideUp opacity-0" style={{ animationDelay: '0.3s' }}>
        Start by creating a new entry!
      </p>
      <button
        onClick={handleNewEntry}
        className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md hover:from-amber-600 hover:to-amber-700 transition-all transform hover:scale-105 shadow-md animate-fadeSlideUp opacity-0"
        style={{ animationDelay: '0.6s' }}
      >
        Create First Entry
      </button>
    </div>
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-amber-800">Your Reflections</h2>
        {entries.length > 0 && (
          <button
            onClick={handleNewEntry}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md hover:from-amber-600 hover:to-amber-700 transition-all transform hover:scale-105 duration-300"
          >
            New Entry
          </button>
        )}
      </div>
      
      {isCreatingEntry ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fadeIn">
          <h3 className="text-xl font-semibold text-amber-700 mb-4">New Reflection</h3>
          <NewEntryForm onClose={handleCloseForm} />
        </div>
      ) : loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
          <p className="mt-2 text-amber-700 animate-fadeIn" style={{ animationDelay: '0.3s' }}>Loading your reflections...</p>
        </div>
      ) : entries.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          {sortedDates.map((date, index) => (
            <div 
              key={date} 
              className="mb-8 animate-fadeSlideUp opacity-0" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <h3 className="text-lg font-medium text-amber-700 mb-4">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              
              <div className="space-y-4">
                {groupedEntries[date]
                  .sort((a, b) => {
                    // Sort by timestamp if available (newest first)
                    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                    return timeB - timeA;
                  })
                  .map((entry, entryIndex) => (
                    <div 
                      key={entry.id} 
                      className="animate-fadeSlideUp opacity-0" 
                      style={{ animationDelay: `${0.2 + (index * 0.1) + (entryIndex * 0.05)}s` }}
                    >
                      <ReflectionCard entry={entry} />
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListView;
