import { useState, useEffect } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Update waktu real-time
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDate(now);
      
      // Jika hari berganti, update selected date juga
      if (selectedDate.toDateString() !== now.toDateString()) {
        setSelectedDate(now);
      }
    }, 1000); // Update setiap detik

    return () => clearInterval(timer);
  }, [selectedDate]);

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const days = ['Mg', 'Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb'];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const calendar = [];

    // Hari dari bulan sebelumnya
    const prevMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
    const prevMonthDays = getDaysInMonth(prevMonth);
    
    for (let i = firstDay - 1; i >= 0; i--) {
      calendar.push(
        <div
          key={`prev-${i}`}
          className="p-2 text-center text-gray-400 border rounded-lg"
        >
          {prevMonthDays - i}
        </div>
      );
    }

    // Hari dalam bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const isToday = date.toDateString() === currentDate.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();

      calendar.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`p-2 text-center border rounded-lg cursor-pointer transition-colors ${
            isToday && isSelected
              ? 'bg-blue-600 text-white'
              : isToday
              ? 'bg-blue-100 text-blue-600 border-blue-300'
              : isSelected
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          {day}
        </div>
      );
    }

    // Hari dari bulan berikutnya
    const totalCells = 42; // 6 minggu × 7 hari
    const remainingCells = totalCells - calendar.length;
    
    for (let day = 1; day <= remainingCells; day++) {
      calendar.push(
        <div
          key={`next-${day}`}
          className="p-2 text-center text-gray-400 border rounded-lg"
        >
          {day}
        </div>
      );
    }

    return calendar;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg text-xl transition-colors"
        >
          ‹
        </button>
        
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">
            {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </h2>
          <div className="text-sm text-gray-600 space-y-1 mt-2">
            <div>{currentDate.toLocaleTimeString('id-ID')}</div>
            <div>{currentDate.toLocaleDateString('id-ID', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}</div>
          </div>
        </div>
        
        <button 
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg text-xl transition-colors"
        >
          ›
        </button>
      </div>

      {/* Tombol Aksi */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={goToToday}
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          Hari Ini
        </button>
      </div>

      {/* Nama Hari */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2 text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Tanggal */}
      <div className="grid grid-cols-7 gap-1">
        {generateCalendar()}
      </div>

      {/* Info Tanggal Terpilih */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">Tanggal Terpilih:</h3>
        <p className="text-gray-600">
          {selectedDate.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>
    </div>
  );
};

export default Calendar;