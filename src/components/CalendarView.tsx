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
    const startingDayOfWeek = firstDay.getDay();
    
    // Total days in the month
    const daysInMonth = lastDay.getDate();
    
    // Calendar rows needed
    const totalDays = startingDayOfWeek + daysInMonth;
    const totalWeeks = Math.ceil(totalDays / 7);
    
    const calendar = [];
    let dayCount = 1;
    
    // Create entries map for quick lookup
    const entriesMap: Record<string, boolean> = {};
    entries.forEach(entry => {
      const date = new Date(entry.date);
      if (date.getMonth() === month && date.getFullYear() === year) {
        const key = `${year}-${month + 1}-${date.getDate()}`;
        entriesMap[key] = true;
      }
    });
    
    // Generate weeks
    for (let week = 0; week < totalWeeks; week++) {
      const weekDays = [];
      
      // Generate days for each week
      for (let day = 0; day < 7; day++) {
        if ((week === 0 && day < startingDayOfWeek) || dayCount > daysInMonth) {
          // Empty cell
          weekDays.push(<td key={`empty-${week}-${day}`} className="p-1"></td>);
        } else {
          // Date cell
          const date = new Date(year, month, dayCount);
          const dateString = date.toISOString();
          const dateKey = `${year}-${month + 1}-${dayCount}`;
          const hasEntry = entriesMap[dateKey];
          
          const isSelected = selectedDate === dateString;
          const isToday = new Date().toDateString() === date.toDateString();
          
          weekDays.push(
            <td key={dateString} className="p-1">
              <button
                onClick={() => setSelectedDate(dateString)}
                className={`w-full h-10 rounded-full flex items-center justify-center transition-colors
                  ${isSelected ? 'bg-amber-500 text-white' : ''}
                  ${isToday && !isSelected ? 'bg-amber-100' : ''}
                  ${hasEntry && !isSelected ? 'font-bold text-amber-700' : 'text-gray-700'}
                  hover:bg-amber-200`}
              >
                {dayCount}
              </button>
            </td>
          );
          dayCount++;
        }
      }
      
      calendar.push(<tr key={`week-${week}`}>{weekDays}</tr>);
    }
    
    return calendar;
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-amber-100 to-amber-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-amber-300 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            
            <h2 className="text-xl font-semibold text-amber-800">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            
            <button 
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-amber-300 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <th key={day} className="p-2 text-amber-700">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {generateCalendar()}
            </tbody>
          </table>
        </div>
        
        {selectedDate && (
          <div className="p-4">
            <h3 className="text-lg font-medium text-amber-800 mb-4">
              Reflections for {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h3>
            
            {selectedEntries.length > 0 ? (
              <div className="space-y-4">
                {selectedEntries.map(entry => (
                  <ReflectionCard key={entry.id} entry={entry} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No reflections for this date.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
