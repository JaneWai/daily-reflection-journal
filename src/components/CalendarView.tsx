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
    return entry.date.split('T')[0] === selectedDate;
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

  // Get entries for a specific date
  const getEntriesForDate = (date: Date) => {
    const dateStr = formatDateToYYYYMMDD(date);
    return entries.filter(entry => entry.date.split('T')[0] === dateStr);
  };

  // Check if a date has entries
  const hasEntries = (date: Date) => {
    return getEntriesForDate(date).length > 0;
  };

  // Get preview text for a date
  const getEntryPreview = (date: Date) => {
    const dateEntries = getEntriesForDate(date);
    if (dateEntries.length === 0) return null;
    
    // Sort entries by timestamp (newest first) if available
    const sortedEntries = [...dateEntries].sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return timeB - timeA;
    });
    
    // Get the first (most recent) entry for this date
    const entry = sortedEntries[0];
    
    // Create a short preview from gratitude text
    const gratitudePreview = entry.gratitude.length > 20 
      ? `${entry.gratitude.substring(0, 20)}...` 
      : entry.gratitude;
    
    return {
      mood: entry.mood,
      preview: gratitudePreview,
      count: dateEntries.length,
      time: entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit'
      }) : null
    };
  };

  // Format month and year
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Format date to YYYY-MM-DD
  const formatDateToYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    const formattedDate = formatDateToYYYYMMDD(date);
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
              <div key={index} className="min-h-[80px]">
                {day && (
                  <div 
                    className={`h-full w-full p-1 rounded-lg border ${
                      selectedDate === formatDateToYYYYMMDD(day)
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <button
                      onClick={() => handleDateClick(day)}
                      className={`w-7 h-7 flex items-center justify-center rounded-full mb-1 ${
                        selectedDate === formatDateToYYYYMMDD(day)
                          ? 'bg-amber-500 text-white'
                          : hasEntries(day)
                          ? 'font-semibold text-amber-700'
                          : ''
                      }`}
                    >
                      {day.getDate()}
                    </button>
                    
                    {hasEntries(day) && (
                      <div className="text-xs">
                        {(() => {
                          const preview = getEntryPreview(day);
                          if (!preview) return null;
                          
                          return (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="text-amber-700 font-medium truncate">
                                  {preview.mood.substring(0, 10)}
                                  {preview.mood.length > 10 ? '...' : ''}
                                </span>
                                {preview.count > 1 && (
                                  <span className="text-amber-600 text-[10px]">+{preview.count - 1}</span>
                                )}
                              </div>
                              {preview.time && (
                                <div className="text-gray-500 text-[10px] mt-0.5">
                                  {preview.time}
                                </div>
                              )}
                              <div className="text-gray-600 line-clamp-2 mt-1">
                                {preview.preview}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
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
            Entries for {new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          {selectedEntries.length > 0 ? (
            <div className="space-y-4">
              {selectedEntries
                .sort((a, b) => {
                  // Sort by timestamp if available (newest first)
                  const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                  const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                  return timeB - timeA;
                })
                .map(entry => (
                  <ReflectionCard key={entry.id} entry={entry} />
                ))
              }
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
