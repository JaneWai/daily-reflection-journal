import React, { useState } from 'react';
import { useReflections } from '../context/ReflectionContext';

interface NewEntryFormProps {
  onClose: () => void;
}

const NewEntryForm: React.FC<NewEntryFormProps> = ({ onClose }) => {
  const { addEntry } = useReflections();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    gratitude: '',
    achievement: '',
    improvement: '',
    mood: 'neutral' as 'happy' | 'neutral' | 'sad'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEntry(formData);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      gratitude: '',
      achievement: '',
      improvement: '',
      mood: 'neutral'
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-amber-700 mb-1">
          Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="mood" className="block text-sm font-medium text-amber-700 mb-1">
          How are you feeling today?
        </label>
        <select
          id="mood"
          name="mood"
          value={formData.mood}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="happy">Happy 😊</option>
          <option value="neutral">Neutral 😐</option>
          <option value="sad">Sad 😔</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="gratitude" className="block text-sm font-medium text-amber-700 mb-1">
          What are you grateful for today?
        </label>
        <textarea
          id="gratitude"
          name="gratitude"
          value={formData.gratitude}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="achievement" className="block text-sm font-medium text-amber-700 mb-1">
          What have you done great today?
        </label>
        <textarea
          id="achievement"
          name="achievement"
          value={formData.achievement}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="improvement" className="block text-sm font-medium text-amber-700 mb-1">
          What can you do better tomorrow?
        </label>
        <textarea
          id="improvement"
          name="improvement"
          value={formData.improvement}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
          required
        />
      </div>
      
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md hover:from-amber-600 hover:to-amber-700 transition-colors"
        >
          Save Entry
        </button>
      </div>
    </form>
  );
};

export default NewEntryForm;
