import React, { useState } from 'react';
import { useReflections } from '../context/ReflectionContext';

interface NewEntryFormProps {
  onClose?: () => void;
}

const NewEntryForm: React.FC<NewEntryFormProps> = ({ onClose }) => {
  const { addEntry } = useReflections();
  const [gratitude, setGratitude] = useState('');
  const [achievement, setAchievement] = useState('');
  const [improvement, setImprovement] = useState('');
  const [mood, setMood] = useState('');
  const [activeField, setActiveField] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get current date and time
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timestamp = now.toISOString(); // Full ISO timestamp
    
    await addEntry({
      date,
      timestamp,
      gratitude,
      achievement,
      improvement,
      mood: mood || 'Neutral', // Default mood if not selected
    });
    
    // Reset form
    setGratitude('');
    setAchievement('');
    setImprovement('');
    setMood('');
    
    // Close form if callback provided
    if (onClose) onClose();
  };
  
  const moodOptions = [
    'Joyful', 'Happy', 'Content', 'Neutral', 
    'Tired', 'Anxious', 'Sad', 'Frustrated'
  ];
  
  return (
    <form onSubmit={handleSubmit} className="transition-all duration-300">
      <div className="mb-4 animate-fadeSlideUp opacity-0" style={{ animationDelay: '0.1s' }}>
        <label className="block text-amber-700 font-medium mb-2">
          How are you feeling today?
        </label>
        <div className="flex flex-wrap gap-2">
          {moodOptions.map((option, index) => (
            <button
              key={option}
              type="button"
              onClick={() => setMood(option)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all duration-300 transform ${
                mood === option
                  ? 'bg-amber-500 text-white scale-110'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200 hover:scale-105'
              }`}
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4 animate-fadeSlideUp opacity-0" style={{ animationDelay: '0.3s' }}>
        <label htmlFor="gratitude" className="block text-amber-700 font-medium mb-2">
          What are you grateful for today?
        </label>
        <textarea
          id="gratitude"
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          onFocus={() => setActiveField('gratitude')}
          onBlur={() => setActiveField(null)}
          className={`w-full px-3 py-2 bg-amber-50 text-gray-800 border transition-all duration-300 ${
            activeField === 'gratitude' 
              ? 'border-amber-500 ring-2 ring-amber-200' 
              : 'border-amber-200 hover:border-amber-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
          rows={3}
          required
          placeholder="I'm grateful for..."
        ></textarea>
      </div>
      
      <div className="mb-4 animate-fadeSlideUp opacity-0" style={{ animationDelay: '0.5s' }}>
        <label htmlFor="achievement" className="block text-amber-700 font-medium mb-2">
          What's one thing you accomplished today?
        </label>
        <textarea
          id="achievement"
          value={achievement}
          onChange={(e) => setAchievement(e.target.value)}
          onFocus={() => setActiveField('achievement')}
          onBlur={() => setActiveField(null)}
          className={`w-full px-3 py-2 bg-amber-50 text-gray-800 border transition-all duration-300 ${
            activeField === 'achievement' 
              ? 'border-amber-500 ring-2 ring-amber-200' 
              : 'border-amber-200 hover:border-amber-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
          rows={3}
          required
          placeholder="Today I accomplished..."
        ></textarea>
      </div>
      
      <div className="mb-6 animate-fadeSlideUp opacity-0" style={{ animationDelay: '0.7s' }}>
        <label htmlFor="improvement" className="block text-amber-700 font-medium mb-2">
          What's one thing you could improve on?
        </label>
        <textarea
          id="improvement"
          value={improvement}
          onChange={(e) => setImprovement(e.target.value)}
          onFocus={() => setActiveField('improvement')}
          onBlur={() => setActiveField(null)}
          className={`w-full px-3 py-2 bg-amber-50 text-gray-800 border transition-all duration-300 ${
            activeField === 'improvement' 
              ? 'border-amber-500 ring-2 ring-amber-200' 
              : 'border-amber-200 hover:border-amber-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500`}
          rows={3}
          required
          placeholder="I could improve on..."
        ></textarea>
      </div>
      
      <div className="flex justify-end space-x-2 animate-fadeSlideUp opacity-0" style={{ animationDelay: '0.9s' }}>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
        >
          Save Reflection
        </button>
      </div>
    </form>
  );
};

export default NewEntryForm;
