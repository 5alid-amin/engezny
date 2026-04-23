import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Maximize, Settings, X } from 'lucide-react';
import CountdownBox from './CountdownBox';
import axiosInstance from '../api/axiosInstance'; // استيراد الاكسيوس

// استيراد ملفات الأصوات من المسار اللي حددته
import focusStartSound from '../assets/sounds/focus_start.wav';
import focusCompleteSound from '../assets/sounds/focus_complete.wav';
import breakCompleteSound from '../assets/sounds/break_complete.wav';

const CountdownDisplay = () => {
  // --- منطق الحفظ والاسترجاع من localStorage ---
  const [focusTime, setFocusTime] = useState(() => {
    const saved = localStorage.getItem('timerFocusTime');
    return saved ? parseInt(saved) : 25;
  });
  const [breakTime, setBreakTime] = useState(() => {
    const saved = localStorage.getItem('timerBreakTime');
    return saved ? parseInt(saved) : 5;
  });
  const [isFocusSession, setIsFocusSession] = useState(() => {
    const saved = localStorage.getItem('timerIsFocusSession');
    return saved === null ? true : saved === 'true';
  });
  const [isActive, setIsActive] = useState(() => {
    const saved = localStorage.getItem('timerIsActive');
    return saved === 'true';
  });
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const savedSeconds = localStorage.getItem('timerSecondsLeft');
    const savedEndTime = localStorage.getItem('timerTargetEndTime');
    const savedIsActive = localStorage.getItem('timerIsActive') === 'true';

    if (savedIsActive && savedEndTime) {
      const remaining = Math.max(0, Math.ceil((parseInt(savedEndTime) - Date.now()) / 1000));
      return remaining;
    }
    return savedSeconds ? parseInt(savedSeconds) : 25 * 60;
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef(null);

  const userId = localStorage.getItem('userId');

  // حفظ الحالة في localStorage عند أي تغيير
  useEffect(() => {
    localStorage.setItem('timerFocusTime', focusTime);
    localStorage.setItem('timerBreakTime', breakTime);
    localStorage.setItem('timerIsFocusSession', isFocusSession);
    localStorage.setItem('timerIsActive', isActive);
    if (!isActive) {
      localStorage.setItem('timerSecondsLeft', secondsLeft);
    }
  }, [focusTime, breakTime, isFocusSession, isActive, secondsLeft]);

  // ميثود تسجيل الجلسة في الباك إند
  const recordFocusSession = async (minutes) => {
    try {
      await axiosInstance.post('/FocusSessions', {
        userId: parseInt(userId),
        durationInMinutes: parseInt(minutes)
      });
      console.log("تم تسجيل جلسة التركيز بنجاح 💪");
    } catch (error) {
      console.error("فشل في تسجيل الجلسة:", error);
    }
  };

  // ميثود تشغيل الأصوات الجديدة
  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play().catch(err => console.error("خطأ في تشغيل الصوت:", err));
  };

  // المنطق الرئيسي للعداد والمزامنة
  useEffect(() => {
    let interval = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        const endTime = localStorage.getItem('timerTargetEndTime');
        if (endTime) {
          const remaining = Math.max(0, Math.ceil((parseInt(endTime) - Date.now()) / 1000));
          setSecondsLeft(remaining);
        } else {
          setSecondsLeft(prev => prev - 1);
        }
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      // تشغيل أصوات نهاية الجلسات
      if (isFocusSession) {
        playSound(focusCompleteSound); // خلصنا فوكس وداخلين بريك
        recordFocusSession(focusTime);
      } else {
        playSound(breakCompleteSound); // خلصنا البريك
      }

      const nextSessionIsFocus = !isFocusSession;
      const nextDuration = (nextSessionIsFocus ? focusTime : breakTime) * 60;

      setIsFocusSession(nextSessionIsFocus);
      setSecondsLeft(nextDuration);

      // تحديث وقت الانتهاء للجلسة القادمة لضمان الاستمرارية
      const newEndTime = Date.now() + nextDuration * 1000;
      localStorage.setItem('timerTargetEndTime', newEndTime);
    }

    return () => clearInterval(interval);
  }, [isActive, secondsLeft, isFocusSession, focusTime, breakTime]);

  // مزامنة الوقت فور العودة للتاب (Visibility Change)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) {
        const endTime = localStorage.getItem('timerTargetEndTime');
        if (endTime) {
          const remaining = Math.max(0, Math.ceil((parseInt(endTime) - Date.now()) / 1000));
          setSecondsLeft(remaining);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isActive]);

  useEffect(() => {
    const fsHandler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', fsHandler);
    return () => document.removeEventListener('fullscreenchange', fsHandler);
  }, []);

  const handleEnterFullscreen = () => {
    if (containerRef.current) containerRef.current.requestFullscreen();
  };

  const handleStartAction = () => {
    // تشغيل صوت البداية
    playSound(focusStartSound);

    handleEnterFullscreen();
    const endTime = Date.now() + secondsLeft * 1000;
    localStorage.setItem('timerTargetEndTime', endTime);
    setIsActive(true);
  };

  const handlePauseAction = () => {
    setIsActive(false);
    localStorage.removeItem('timerTargetEndTime');
  };

  const handleResetAction = () => {
    setIsActive(false);
    localStorage.removeItem('timerTargetEndTime');
    const resetSeconds = (isFocusSession ? focusTime : breakTime) * 60;
    setSecondsLeft(resetSeconds);
  };

  const saveSettings = (f, b) => {
    const newF = Math.min(60, Math.max(1, parseInt(f) || 1));
    const newB = Math.min(60, Math.max(1, parseInt(b) || 1));
    setFocusTime(newF);
    setBreakTime(newB);
    const newSeconds = (isFocusSession ? newF : newB) * 60;
    setSecondsLeft(newSeconds);

    if (isActive) {
      const newEndTime = Date.now() + newSeconds * 1000;
      localStorage.setItem('timerTargetEndTime', newEndTime);
    }

    setShowSettings(false);
  };

  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const secs = (secondsLeft % 60).toString().padStart(2, '0');

  return (
    <div ref={containerRef} className={`relative flex flex-col items-center justify-center min-h-screen w-full transition-all duration-1000 ${isFullscreen ? 'bg-[#001a20]' : 'bg-transparent'}`}>

      {/* شريط الأدوات العلوي */}
      <div className="absolute top-10 w-full px-12 flex justify-between items-center z-40">
        <div className="flex items-center gap-6">
          {!isFullscreen && (
            <button onClick={() => setShowSettings(true)} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-brand-teal/40 hover:text-brand-teal transition-all active:scale-90">
              <Settings size={28} />
            </button>
          )}
        </div>

        <div className={`px-8 py-2 rounded-full border border-brand-teal/20 bg-brand-teal/5 text-brand-teal font-medium tracking-[0.2em] uppercase transition-all duration-500 
          ${isFullscreen ? 'opacity-0 hover:opacity-100 cursor-default' : 'opacity-100'}`}>
          {isFocusSession ? 'فترة تركيز' : 'فترة راحة'}
        </div>

        <div className="flex items-center">
          {!isFullscreen && isActive && (
            <button onClick={handleEnterFullscreen} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-brand-teal/60 hover:text-brand-teal animate-pulse transition-all active:scale-90">
              <Maximize size={28} />
            </button>
          )}
        </div>
      </div>

      {/* العداد المسنتر */}
      <div className={`flex items-center justify-center ${isFullscreen ? 'gap-[4vw]' : 'gap-10 sm:gap-14'} mb-16 mt-12`} dir="ltr">
        <CountdownBox value={mins} isFullscreen={isFullscreen} />
        <div className={`flex flex-col ${isFullscreen ? 'gap-[6vw]' : 'gap-12'} opacity-60`}>
          <div className={`${isFullscreen ? 'w-[1.5vw] h-[1.5vw]' : 'w-4 h-4'} rounded-full bg-brand-teal shadow-[0_0_15px_#34A593] animate-pulse-gentle`} />
          <div className={`${isFullscreen ? 'w-[1.5vw] h-[1.5vw]' : 'w-4 h-4'} rounded-full bg-brand-teal shadow-[0_0_15px_#34A593] animate-pulse-gentle`} />
        </div>
        <CountdownBox value={secs} isFullscreen={isFullscreen} />
      </div>

      {/* التحكم */}
      <div className={`${isFullscreen ? 'fixed bottom-16 opacity-0 hover:opacity-100 transition-opacity duration-500' : 'mt-10'} flex gap-10 z-50`}>
        {!isActive ? (
          <button onClick={handleStartAction} className="px-20 py-6 rounded-[2rem] bg-brand-teal text-[#001b22] font-bold text-2xl hover:scale-105 shadow-[0_0_50px_rgba(52,165,147,0.4)] border border-white/20 transition-all active:scale-95">
            {secondsLeft === (isFocusSession ? focusTime : breakTime) * 60 ? 'ابدأ' : 'استئناف'}
          </button>
        ) : (
          <div className="flex gap-8">
            <button onClick={handlePauseAction} className="p-6 rounded-full bg-white/[0.03] border border-white/10 text-white hover:text-brand-teal transition-all active:scale-90">
              <Pause size={38} />
            </button>
            <button onClick={handleResetAction} className="p-6 rounded-full bg-white/[0.03] border border-white/10 text-white hover:text-red-400 transition-all active:scale-90">
              <RotateCcw size={38} />
            </button>
          </div>
        )}
      </div>

      {/* نافذة الإعدادات */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 p-8 sm:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 text-white relative z-10">
              <h2 className="text-3xl font-bold tracking-tight">الإعدادات</h2>
              <button onClick={() => setShowSettings(false)} className="hover:rotate-90 hover:text-brand-teal transition-all"><X size={24} /></button>
            </div>
            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-white/60 mb-2 mr-1 text-sm font-bold uppercase tracking-wider">وقت التركيز (دقيقة)</label>
                <input type="number" defaultValue={focusTime} onChange={(e) => setFocusTime(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-brand-teal text-xl font-medium outline-none focus:border-brand-teal focus:bg-white/5 transition-all text-left" dir="ltr" min="1" max="60" />
              </div>
              <div>
                <label className="block text-white/60 mb-2 mr-1 text-sm font-bold uppercase tracking-wider">وقت الراحة (دقيقة)</label>
                <input type="number" defaultValue={breakTime} onChange={(e) => setBreakTime(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-brand-teal text-xl font-medium outline-none focus:border-brand-teal focus:bg-white/5 transition-all text-left" dir="ltr" min="1" max="60" />
              </div>
              <button onClick={() => saveSettings(focusTime, breakTime)} className="w-full py-4 mt-6 bg-brand-teal hover:bg-[#2b8a7b] text-white text-lg font-bold rounded-2xl shadow-[0_0_20px_rgba(52,165,147,0.4)] hover:shadow-[0_0_30px_rgba(52,165,147,0.6)] hover:-translate-y-1 transition-all">حفظ الإعدادات</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap');
        .perspective-1000 { perspective: 2500px; } .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; } .rotate-x-180 { transform: rotateX(-180deg); }
        .origin-bottom { transform-origin: bottom; } .animate-flip-fast { animation: flipDown 0.1s cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards; }
        .animate-pulse-gentle { animation: pulseBreathe 3s ease-in-out infinite; }
        @keyframes pulseBreathe { 0%, 100% { opacity: 0.2; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } }
        @keyframes flipDown { 0% { transform: rotateX(0deg); } 100% { transform: rotateX(-180deg); } }
      `}</style>
    </div>
  );
};

export default CountdownDisplay;