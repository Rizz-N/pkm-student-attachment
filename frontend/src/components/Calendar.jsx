import { useState, useRef, useEffect } from "react";
import { FaCalendar } from "react-icons/fa";

const Calendar = ({ onDateSelect, selectedDate }) => {
  const calendarRef = useRef(null);

  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      // desktop mode
      if (window.innerWidth > 768) {
        document.addEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "unset";
      } else {
        document.body.style.overflow = "hidden";
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [showCalendar]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDateSelect = (day) => {
    if (day) {
      const selected = new Date(currentYear, currentMonth, day);
      onDateSelect(selected);
      setShowCalendar(false);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const isFutureDate = (day) => {
    const checkDate = new Date(currentYear, currentMonth, day);
    const checkDateStart = new Date(
      checkDate.getFullYear(),
      checkDate.getMonth(),
      checkDate.getDate()
    );
    return checkDateStart > todayStart;
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentYear, currentMonth + 1, 1);
    const nextMonthStart = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth(),
      1
    );

    if (
      nextMonthStart <=
      new Date(todayStart.getFullYear(), todayStart.getMonth() + 1, 1)
    ) {
      setCurrentDate(nextMonth);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    onDateSelect(today);
    setShowCalendar(false);
  };

  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  const calendarDays = generateCalendarDays();

  return (
    <div className="relative" ref={calendarRef}>
      <button
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-3 md:py-2.5 md:px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 text-sm md:text-base w-full md:w-auto justify-center"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <FaCalendar className="text-white text-base md:text-lg" />
        <span className="truncate">
          {selectedDate
            ? selectedDate.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Pilih Tanggal"}
        </span>
      </button>

      {showCalendar && (
        <>
          {/* Mobile Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setShowCalendar(false)}
          />

          {/* Calendar Container */}
          <div className="fixed md:absolute top-50 left-1/2 md:top-full md:left-auto md:right-0 md:transform-none transform -translate-x-1/2 -translate-y-1/2 md:mt-2 bg-white/95 backdrop-blur-xl border border-gray-300/50 rounded-2xl shadow-2xl z-50 w-[95vw] max-w-sm md:w-80 p-4 md:p-4">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-3 hover:bg-gray-100/80 rounded-xl transition-colors duration-200 text-lg font-bold text-gray-600 hover:text-blue-600 active:scale-95"
              >
                ‹
              </button>
              <div className="font-bold text-gray-800 text-base md:text-lg text-center">
                {monthNames[currentMonth]} {currentYear}
              </div>
              <button
                onClick={goToNextMonth}
                className="p-3 hover:bg-gray-100/80 rounded-xl transition-colors duration-200 text-lg font-bold text-gray-600 hover:text-blue-600 active:scale-95"
              >
                ›
              </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-3">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-500 py-2"
                >
                  {day.charAt(0)}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const isToday =
                  day === today.getDate() &&
                  currentMonth === today.getMonth() &&
                  currentYear === today.getFullYear();
                const isSelected =
                  day &&
                  selectedDate &&
                  day === selectedDate.getDate() &&
                  currentMonth === selectedDate.getMonth() &&
                  currentYear === selectedDate.getFullYear();

                return (
                  <button
                    key={index}
                    onClick={() => !isFutureDate(day) && handleDateSelect(day)}
                    disabled={!day || isFutureDate(day)}
                    className={`
                      h-10 md:h-8 rounded-xl text-sm font-semibold transition-all duration-200
                      ${!day ? "invisible" : ""}
                      ${
                        isFutureDate(day)
                          ? "text-gray-400 cursor-default"
                          : "cursor-pointer"
                      }
                      ${
                        !isFutureDate(day) && isToday && !isSelected
                          ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          : ""
                      }
                      ${
                        !isFutureDate(day) && isSelected
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                          : "hover:bg-gray-100/80"
                      }
                      ${
                        !isFutureDate(day) && !isToday && !isSelected
                          ? "text-gray-700 hover:text-blue-600"
                          : ""
                      }
                      active:scale-95
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-between">
              <button
                onClick={goToToday}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95 text-sm order-2 sm:order-1 flex items-center justify-center gap-2"
              >
                <span>Hari Ini</span>
              </button>
              <button
                onClick={() => setShowCalendar(false)}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95 text-sm order-1 sm:order-2 flex items-center justify-center gap-2"
              >
                <span>Tutup</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Calendar;
