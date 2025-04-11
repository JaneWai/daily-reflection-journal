import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReflections } from '../context/ReflectionContext';
import ReflectionCard from './ReflectionCard';

const CalendarView: React.FC = () => {
  const { entries } = useReflections();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Get entries for the selected date
  const selectedEntries = entries.filter(entry => {
    if (!selectedDate) return false;
    const entryDate = new Date(entry.date);
    const selected = new Date(selectedDate);
    return (
      entryDate.getDate() === selected.getDate() &&
      entryDate.getMonth() === selected.getMonth() &&
      entryDate.getFullYear() === selected.getFullYear()
    );
  });

  // Calendar navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  // Generate calendar days
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const startDay = firstDay.getDay();
    // Total days in month
    const totalDays = lastDay.getDate();
    
    // Create array for calendar days
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= totalDays; day++) {
      calendarDays.push(new Date(year, month, day));
    }
    
    return calendarDays;
  };

  // Check if a date has entries
  const hasEntries = (date: Date) => {
    return entries.some(entry => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getDate() === date.getDate() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Format month and year
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    const formattedDate = date.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
  };

  const calendarDays = generateCalendar();

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Calendar header */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 flex items-center justify-between">
          <button 
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-amber-200 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-semibold text-amber-800">
            {formatMonthYear(currentMonth)}
          </h2>
          <button 
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-amber-200 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {/* Calendar grid */}
        <div className="p-4">
          {/* Day names */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-amber-700">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => (
              <div key={index} className="aspect-square">
                {day && (
                  <button
                    onClick={() => handleDateClick(day)}
                    className={`w-full h-full flex items-center justify-center rounded-full relative
                      ${hasEntries(day) ? 'font-semibold' : ''}
                      ${
                        selectedDate === day.toISOString().split('T')[0]
                          ? 'bg-amber-500 text-white'
                          : hasEntries(day)
                          ? 'hover:bg-amber-100'
                          : 'hover:bg-gray-100'
                      }
                    `}
                  >
                    {day.getDate()}
                    {hasEntries(day) && (
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full"></span>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Selected date entries */}
      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">
            Entries for {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          {selectedEntries.length > 0 ? (
            <div className="space-y-4">
              {selectedEntries.map(entry => (
                <ReflectionCard key={entry.id} entry={entry} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No entries for this date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
