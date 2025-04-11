import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NewEntryForm from './components/NewEntryForm';
import ListView from './components/ListView';
import CalendarView from './components/CalendarView';
import Footer from './components/Footer';
import SyncStatus from './components/SyncStatus';
import { ReflectionProvider } from './context/ReflectionContext';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [showForm, setShowForm] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = 'Daily Reflection Journal';
  }, []);

  return (
    <ReflectionProvider>
      <div className="min-h-screen flex flex-col bg-amber-50">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-2 rounded-lg ${
                  view === 'list'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-amber-700 border border-amber-300'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-lg ${
                  view === 'calendar'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-amber-700 border border-amber-300'
                }`}
              >
                Calendar View
              </button>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Add Reflection
            </button>
          </div>
          
          {isAuthenticated && <SyncStatus />}
          
          {view === 'list' ? <ListView /> : <CalendarView />}
          
          {showForm && <NewEntryForm onClose={() => setShowForm(false)} />}
        </main>
        
        <Footer />
      </div>
    </ReflectionProvider>
  );
};

export default App;
