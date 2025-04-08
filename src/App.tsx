import React, { useState } from 'react';
import { PlusCircle, ListFilter, Calendar } from 'lucide-react';
import { ReflectionProvider } from './context/ReflectionContext';
import Header from './components/Header';
import ListView from './components/ListView';
import CalendarView from './components/CalendarView';
import NewEntryForm from './components/NewEntryForm';

type ViewMode = 'list' | 'calendar';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);

  return (
    <ReflectionProvider>
      <div className="min-h-screen bg-amber-50 flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto py-6 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-amber-500 text-white' 
                    : 'hover:bg-amber-100 text-gray-700'
                }`}
              >
                <ListFilter size={18} />
                <span>List View</span>
              </button>
              
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-1 px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'calendar' 
                    ? 'bg-amber-500 text-white' 
                    : 'hover:bg-amber-100 text-gray-700'
                }`}
              >
                <Calendar size={18} />
                <span>Calendar View</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowNewEntryForm(true)}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
            >
              <PlusCircle size={18} />
              <span>Add New Entry</span>
            </button>
          </div>
          
          {viewMode === 'list' ? <ListView /> : <CalendarView />}
        </main>
        
        <footer className="bg-amber-100 py-4 text-center text-amber-700">
          <p>Daily Reflections Journal &copy; {new Date().getFullYear()}</p>
        </footer>
        
        {showNewEntryForm && (
          <NewEntryForm onClose={() => setShowNewEntryForm(false)} />
        )}
      </div>
    </ReflectionProvider>
  );
}

export default App;
