import React, { useState } from 'react';
import { ReflectionProvider } from './context/ReflectionContext';
import Header from './components/Header';
import Footer from './components/Footer';
import NewEntryForm from './components/NewEntryForm';
import ListView from './components/ListView';
import CalendarView from './components/CalendarView';

function App() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [showForm, setShowForm] = useState(false);

  return (
    <ReflectionProvider>
      <div className="min-h-screen bg-amber-50 flex flex-col">
        <Header />
        
        <main className="container mx-auto py-6 px-4 flex-grow">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex">
                  <button
                    onClick={() => setView('list')}
                    className={`px-6 py-3 text-center font-medium transition-colors ${
                      view === 'list'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-white text-gray-600 hover:bg-amber-50'
                    }`}
                  >
                    List View
                  </button>
                  <button
                    onClick={() => setView('calendar')}
                    className={`px-6 py-3 text-center font-medium transition-colors ${
                      view === 'calendar'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-white text-gray-600 hover:bg-amber-50'
                    }`}
                  >
                    Calendar View
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setShowForm(true)}
                className="py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg shadow hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Entry
              </button>
            </div>
            
            {showForm && (
              <div className="mb-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100">
                  <h2 className="text-xl font-bold text-amber-800 mb-4">New Reflection</h2>
                  
                  <NewEntryForm onClose={() => setShowForm(false)} />
                </div>
              </div>
            )}
            
            {view === 'list' ? <ListView /> : <CalendarView />}
          </div>
        </main>
        
        <Footer />
      </div>
    </ReflectionProvider>
  );
}

export default App;
