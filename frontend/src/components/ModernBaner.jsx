import { useEffect, useState, useRef, useCallback } from "react";
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
  const [activeTextIndex, setActiveTextIndex] = useState(0);

  const textIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const typingTimeoutRef = useRef(null);
  const cursorTimeoutRef = useRef(null);

  // Optimized typing effect menggunakan setTimeout dengan callback
  const typeNextCharacter = useCallback(() => {
    const currentText = texts.current[textIndex.current];

    if (!isDeleting.current && charIndex.current < currentText.length) {
      charIndex.current += 1;
      setDisplayText(currentText.substring(0, charIndex.current));
    } else if (isDeleting.current && charIndex.current > 0) {
      charIndex.current -= 1;
      setDisplayText(currentText.substring(0, charIndex.current));
    } else {
      // Switch to next text or start deleting
      if (!isDeleting.current && charIndex.current === currentText.length) {
        // Pause before deleting
        typingTimeoutRef.current = setTimeout(() => {
          isDeleting.current = true;
          typeNextCharacter();
        }, 1500); // Pause for 1.5 seconds at full text
        return;
      }

      if (isDeleting.current && charIndex.current === 0) {
        isDeleting.current = false;
        textIndex.current = (textIndex.current + 1) % texts.current.length;
        setActiveTextIndex(textIndex.current);
      }
    }

    // Set timeout for next character
    const speed = isDeleting.current ? 30 : 80; // Slower than before
    typingTimeoutRef.current = setTimeout(typeNextCharacter, speed);
  }, []);

  // Inisialisasi typing effect
  useEffect(() => {
    // Start typing after a brief delay
    typingTimeoutRef.current = setTimeout(typeNextCharacter, 500);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (cursorTimeoutRef.current) {
        clearTimeout(cursorTimeoutRef.current);
      }
    };
  }, [typeNextCharacter]);

  // Optimized cursor blink dengan requestAnimationFrame
  useEffect(() => {
    let animationFrameId;
    let lastTime = 0;

    const blinkCursor = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      // Update hanya setiap 500ms
      if (elapsed > 500) {
        setCursorVisible((prev) => !prev);
        lastTime = timestamp;
      }

      animationFrameId = requestAnimationFrame(blinkCursor);
    };

    animationFrameId = requestAnimationFrame(blinkCursor);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="mt-8 relative min-h-[85vh] md:min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-yellow-50/20 px-4 py-16 md:py-20">
      {/* Background Elements - Simplified */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Hanya 1 blur element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>

        {/* Static orbs instead of animated */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-500/20 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-yellow-500/20 rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left Content - Copywriting */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge/Slogan */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-yellow-100 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-blue-200/50 shadow-sm">
              <FiCheckCircle className="text-blue-600" />
              <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-yellow-600">
                Solusi Pendidikan 4.0
              </span>
            </div>

            {/* Main Headline with Typewriter Effect */}
            <div className="min-h-[120px] md:min-h-[140px] lg:min-h-[160px] flex items-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold mb-0 leading-tight tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-700 to-yellow-600">
                  {displayText}
                </span>
                <span
                  className={`inline-block w-1 h-12 ml-1 bg-gradient-to-b from-blue-500 to-yellow-500 ${
                    cursorVisible ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-100`}
                />
              </h1>
            </div>

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
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
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
    </div>
  );
};

export default ModernBanner;
