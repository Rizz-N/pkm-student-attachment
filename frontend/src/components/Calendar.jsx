import { useState } from "react"
import { GoCalendar } from "react-icons/go"

const Calendar = ({onDateSelect, selectedDate}) => {

  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const getDaysInMonth = (year, month) =>{
    return new Date (year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) =>{
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () =>{
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];
    
    for(let i = 0; i < firstDay; i++){
      days.push(null);
    }
    
    for(let i = 1; i <= daysInMonth; i++){
      days.push(i);
    }

    return days;
  };

  const handleDateSelect = (day) => {
    if(day){
      const selected = new Date(currentYear, currentMonth, day);
      onDateSelect(selected);
      setShowCalendar(false);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth -1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth +1, 1));
  }

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateSelect(today);
    setShowCalendar(false);
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const dayNames = [
    "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
  ];

  const calendarDays = generateCalendarDays();

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <GoCalendar className="text-white text-lg" />
        <span>
          {selectedDate 
            ? selectedDate.toLocaleDateString('id-ID', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })
            : 'Pilih Tanggal'
          }
        </span>
      </button>

      {showCalendar && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 w-80 p-4">
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ‹
            </button>
            <div className="font-semibold">
              {monthNames[currentMonth]} {currentYear}
            </div>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              ›
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                {day.charAt(0)}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isToday = day === today.getDate() && 
                            currentMonth === today.getMonth() && 
                            currentYear === today.getFullYear();
              const isSelected = day && selectedDate && 
                               day === selectedDate.getDate() && 
                               currentMonth === selectedDate.getMonth() && 
                               currentYear === selectedDate.getFullYear();
              
              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day)}
                  disabled={!day}
                  className={`
                    h-8 rounded-lg text-sm font-medium
                    ${!day ? 'invisible' : ''}
                    ${isToday && !isSelected ? 'bg-blue-100 text-blue-600' : ''}
                    ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}
                    ${day ? 'cursor-pointer' : 'cursor-default'}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-between">
            <button
              onClick={goToToday}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Hari Ini
            </button>
            <button
              onClick={() => setShowCalendar(false)}
              className="text-gray-600 hover:text-gray-700 text-sm font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar
