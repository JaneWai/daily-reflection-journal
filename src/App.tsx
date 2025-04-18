import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReflectionProvider, useReflections } from './context/ReflectionContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ListView from './components/ListView';
import CalendarView from './components/CalendarView';
import SyncStatus from './components/SyncStatus';
import { Calendar, List } from 'lucide-react';

const AppContent: React.FC = () => {
  const [view, setView] = React.useState<'list' | 'calendar'>('list');
  const { user } = useAuth();
  const { syncLocalEntries } = useReflections();

  // Attempt to sync local entries when user logs in
  useEffect(() => {
    if (user) {
      syncLocalEntries();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setView('list')}
              className={`flex items-center px-3 py-1.5 rounded-md transition-colors ${
                view === 'list'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-amber-600 border border-amber-600 hover:bg-amber-50'
              }`}
              aria-label="List View"
            >
              <List size={16} className="mr-1" />
              <span>List</span>
            </button>
            
            <button
              onClick={() => setView('calendar')}
              className={`flex items-center px-3 py-1.5 rounded-md transition-colors ${
                view === 'calendar'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-amber-600 border border-amber-600 hover:bg-amber-50'
              }`}
              aria-label="Calendar View"
            >
              <Calendar size={16} className="mr-1" />
              <span>Calendar</span>
            </button>
          </div>
        </div>
        
        <div className="mb-8 flex justify-center">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-amber-200 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                alt="Open journal with pen" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-800/70 to-transparent flex items-end justify-center">
                <div className="p-4 text-center">
                  <p className="text-xl font-serif italic text-white">
                    "Reflect, grow, transform"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {view === 'list' ? <ListView /> : <CalendarView />}
      </main>
      
      <SyncStatus />
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ReflectionProvider>
        <AppContent />
      </ReflectionProvider>
    </AuthProvider>
  );
};

export default App;
