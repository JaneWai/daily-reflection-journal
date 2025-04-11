import React from 'react';
import { useReflections } from '../context/ReflectionContext';
import { useAuth } from '../context/AuthContext';
import { Cloud, RefreshCw } from 'lucide-react';

const SyncStatus: React.FC = () => {
  const { isLoading, syncWithGoogleDrive } = useReflections();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-center my-4">
      {isLoading ? (
        <div className="flex items-center gap-2 text-amber-600">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Syncing with Google Drive...</span>
        </div>
      ) : (
        <button
          onClick={() => syncWithGoogleDrive()}
          className="flex items-center gap-2 py-2 px-4 text-sm bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
        >
          <Cloud className="h-4 w-4" />
          <span>Sync with Google Drive</span>
        </button>
      )}
    </div>
  );
};

export default SyncStatus;
