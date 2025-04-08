import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useReflections } from '../context/ReflectionContext';

interface NewEntryFormProps {
  onClose: () => void;
}

const NewEntryForm: React.FC<NewEntryFormProps> = ({ onClose }) => {
  const { addEntry } = useReflections();
  const [formData, setFormData] = useState({
    gratitude: '',
    achievement: '',
    improvement: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.gratitude || !formData.achievement || !formData.improvement) {
      alert('Please fill in all fields');
      return;
    }
    
    addEntry({
      ...formData,
      date: new Date().toISOString(),
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-amber-800">New Reflection</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-amber-700 mb-1 font-medium">
              What am I grateful for today?
            </label>
            <textarea
              name="gratitude"
              value={formData.gratitude}
              onChange={handleChange}
              className="w-full p-2 border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-300 focus:border-transparent"
              rows={3}
              placeholder="I'm grateful for..."
            />
          </div>
          
          <div>
            <label className="block text-amber-700 mb-1 font-medium">
              What have I done great today?
            </label>
            <textarea
              name="achievement"
              value={formData.achievement}
              onChange={handleChange}
              className="w-full p-2 border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-300 focus:border-transparent"
              rows={3}
              placeholder="I did great at..."
            />
          </div>
          
          <div>
            <label className="block text-amber-700 mb-1 font-medium">
              What can I do better tomorrow?
            </label>
            <textarea
              name="improvement"
              value={formData.improvement}
              onChange={handleChange}
              className="w-full p-2 border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-300 focus:border-transparent"
              rows={3}
              placeholder="Tomorrow I will..."
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition duration-200"
          >
            Save Reflection
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewEntryForm;
