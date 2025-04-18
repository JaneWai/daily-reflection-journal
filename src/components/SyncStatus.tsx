import React from 'react';
import { useReflections } from '../context/ReflectionContext';
import { useAuth } from '../context/AuthContext';

const SyncStatus: React.FC = () => {
  const { syncStatus, syncLocalEntries } = useReflections();
  const { user } = useAuth();
  
  if (!user) return null;
  
  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };
  
  return (
    <div className="fixed bottom-16 right-4 bg-white rounded-lg shadow-md p-3 text-sm">
      <div className="flex items-center space-x-2">
        <div className={`h-2 w-2 rounded-full ${
          syncStatus.error ? 'bg-red-500' : 
          syncStatus.syncing ? 'bg-amber-500 animate-pulse' : 
          'bg-green-500'
        }`}></div>
        
        <span className="text-gray-600">
          {syncStatus.error ? 'Sync error' : 
           syncStatus.syncing ? 'Syncing...' : 
           `Last synced: ${formatTime(syncStatus.lastSynced)}`}
        </span>
        
        {!syncStatus.syncing && (
          <button 
            onClick={syncLocalEntries}
            className="text-amber-600 hover:text-amber-800"
            aria-label="Sync now"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>
      
      {syncStatus.error && (
        <div className="mt-1 text-xs text-red-600">
          {syncStatus.error}
        </div>
      )}
    </div>
  );
};

export default SyncStatus;
