import { useEffect, useState, useRef } from "react";
import { FiCheckCircle } from "react-icons/fi";

const ModernBanner = () => {
  const texts = useRef([
    "Selamat Datang.",
    "Sistem Manajemen Kehadiran Sekolah",
    "Digitalisasi Absensi Modern",
    "Monitoring Kehadiran Real-time",
    "Analisis Data Pendidikan",
  ]);

  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  const textIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);

  // Typing Effect
  useEffect(() => {
    const typingInterval = setInterval(
      () => {
        const currentText = texts.current[textIndex.current];

        if (!isDeleting.current && charIndex.current < currentText.length) {
          charIndex.current += 1;
          setDisplayText(currentText.substring(0, charIndex.current));
        } else if (isDeleting.current && charIndex.current > 0) {
          charIndex.current -= 1;
          setDisplayText(currentText.substring(0, charIndex.current));
        } else {
          if (!isDeleting.current && charIndex.current === currentText.length) {
            isDeleting.current = true;
            return;
          }

          if (isDeleting.current && charIndex.current === 0) {
            isDeleting.current = false;
            textIndex.current = (textIndex.current + 1) % texts.current.length;
          }
        }
      },
      isDeleting.current ? 50 : 100
    ); // Speed typing & deleting

    return () => clearInterval(typingInterval);
  }, []);

  // Blinking Cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="mt-8 relative min-h-[85vh] md:min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-yellow-50/20 px-4 py-16 md:py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl"></div>

        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500/20 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-yellow-500/20 rounded-full animate-ping animation-delay-700"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left Content - Copywriting */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge/Slogan */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-yellow-100 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-blue-200/50 shadow-sm">
              <FiCheckCircle className="text-blue-600 animate-pulse" />
              <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-yellow-600">
                Solusi Pendidikan 4.0
              </span>
            </div>

            {/* Main Headline with Typewriter Effect */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-700 to-yellow-600">
                {displayText}
              </span>
              <span className="inline-block w-1 h-12 ml-1 bg-gradient-to-b from-blue-500 to-yellow-500 animate-pulse"></span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              Transformasi digital untuk{" "}
              <span className="font-semibold text-blue-600">efisiensi</span>,
              <span className="font-semibold text-yellow-600"> akurasi</span>,
              dan
              <span className="font-semibold text-green-600">
                {" "}
                transparansi
              </span>{" "}
              administrasi sekolah
            </p>

            {/* School Identity */}
            <div className="mb-10">
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-6 py-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-yellow-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">SMP</span>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-gray-800">
                    SMP 227 Jakarta
                  </h2>
                  <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Sekolah Unggulan
                    </span>
                    <span className="hidden sm:inline mx-2">•</span>
                    <span className="hidden sm:inline">Terakreditasi A</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 100;
          }
        }
        .animate-dash {
          animation: dash 3s linear infinite;
        }
        .animation-delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
};

export default ModernBanner;
