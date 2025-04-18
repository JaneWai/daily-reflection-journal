import React, { useState } from 'react';
import { ReflectionEntry } from '../types';
import { useReflections } from '../context/ReflectionContext';

interface ReflectionCardProps {
  entry: ReflectionEntry;
}

const ReflectionCard: React.FC<ReflectionCardProps> = ({ entry }) => {
  const { deleteEntry } = useReflections();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Format time for display
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Handle delete confirmation
  const handleDelete = () => {
    deleteEntry(entry.id);
    setShowConfirmDelete(false);
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden mb-4 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4 transition-all duration-300 ${isHovered ? 'from-amber-100 to-amber-200' : ''}`}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-amber-800">
            {formatDate(entry.date)}
          </h3>
          
          <div className="flex items-center space-x-2">
            {entry.timestamp && (
              <span className="text-sm text-amber-700">
                {formatTime(entry.timestamp)}
              </span>
            )}
            
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="text-gray-400 hover:text-red-500 transition-colors transform hover:scale-110 duration-200"
              aria-label="Delete entry"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mt-1">
          <span className="inline-block bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-sm transition-all duration-300 hover:bg-amber-300">
            {entry.mood}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4 transition-all duration-300 hover:translate-x-1">
          <h4 className="text-amber-700 font-medium mb-2">I'm grateful for:</h4>
          <p className="text-gray-700">{entry.gratitude}</p>
        </div>
        
        <div className="mb-4 transition-all duration-300 hover:translate-x-1">
          <h4 className="text-amber-700 font-medium mb-2">Today's achievement:</h4>
          <p className="text-gray-700">{entry.achievement}</p>
        </div>
        
        <div className="transition-all duration-300 hover:translate-x-1">
          <h4 className="text-amber-700 font-medium mb-2">I could improve:</h4>
          <p className="text-gray-700">{entry.improvement}</p>
        </div>
      </div>
      
      {showConfirmDelete && (
        <div className="p-4 bg-red-50 border-t border-red-100 animate-fadeIn">
          <p className="text-red-700 mb-2">Are you sure you want to delete this reflection?</p>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowConfirmDelete(false)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReflectionCard;
