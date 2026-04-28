import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Maximize, Settings, X, SkipForward } from 'lucide-react';
import { useTimer } from '../context/TimerContext';
import CountdownBox from './CountdownBox';

const CountdownDisplay = () => {
  const {
    focusTime, setFocusTime,
    breakTime, setBreakTime,
    longBreakTime, setLongBreakTime,
    longBreakInterval, setLongBreakInterval,
    completedSessions,
    isLongBreak,
    isFocusSession,
    isActive,
    secondsLeft,
    handleStartAction,
    handlePauseAction,
    handleResetAction,
    handleSkipAction,
    saveSettings: saveTimerSettings
  } = useTimer();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fsHandler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', fsHandler);
    return () => document.removeEventListener('fullscreenchange', fsHandler);
  }, []);

  const handleEnterFullscreen = () => {
    if (containerRef.current) containerRef.current.requestFullscreen();
  };

  const onStart = () => {
    handleStartAction();
    handleEnterFullscreen();
  };

  const handleSaveSettings = (f, b, lb, lbi) => {
    saveTimerSettings(f, b, lb, lbi);
    setShowSettings(false);
  };


  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const secs = (secondsLeft % 60).toString().padStart(2, '0');

  return (
    <div ref={containerRef} className={`relative flex flex-col items-center justify-center min-h-screen w-full transition-all duration-1000 ${isFullscreen ? 'bg-[#001a20]' : 'bg-transparent'}`}>

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
          {isFocusSession ? 'فترة تركيز' : (isLongBreak ? 'راحة طويلة' : 'فترة راحة')}
        </div>

        <div className="flex items-center">
          {!isFullscreen && isActive && (
            <button onClick={handleEnterFullscreen} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-brand-teal/60 hover:text-brand-teal animate-pulse transition-all active:scale-90">
              <Maximize size={28} />
            </button>
          )}
        </div>
      </div>

      <div className={`flex items-center justify-center ${isFullscreen ? 'gap-[4vw]' : 'gap-10 sm:gap-14'} mb-16 mt-12`} dir="ltr">
        <CountdownBox value={mins} isFullscreen={isFullscreen} />
        <div className={`flex flex-col ${isFullscreen ? 'gap-[6vw]' : 'gap-12'} opacity-60`}>
          <div className={`${isFullscreen ? 'w-[1.5vw] h-[1.5vw]' : 'w-4 h-4'} rounded-full bg-brand-teal shadow-[0_0_15px_#34A593] animate-pulse-gentle`} />
          <div className={`${isFullscreen ? 'w-[1.5vw] h-[1.5vw]' : 'w-4 h-4'} rounded-full bg-brand-teal shadow-[0_0_15px_#34A593] animate-pulse-gentle`} />
        </div>
        <CountdownBox value={secs} isFullscreen={isFullscreen} />
      </div>

      <div className={`${isFullscreen ? 'fixed bottom-24 opacity-0 hover:opacity-100 transition-opacity duration-500' : 'mt-10'} flex flex-col items-center gap-6 z-50`}>
        <div className="flex gap-10">
          {!isActive ? (
            <button onClick={onStart} className="px-20 py-6 rounded-[2rem] bg-brand-teal text-[#001b22] font-bold text-2xl hover:scale-105 shadow-[0_0_50px_rgba(52,165,147,0.4)] border border-white/20 transition-all active:scale-95">
              {secondsLeft === (isFocusSession ? focusTime : (isLongBreak ? longBreakTime : breakTime)) * 60 ? 'ابدأ' : 'استئناف'}
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

        {/* Skip Break Button */}
        {!isFocusSession && (
          <button 
            onClick={handleSkipAction}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-95 opacity-60 hover:opacity-100"
          >
            <SkipForward size={18} />
            <span className="text-sm font-medium">تخطي الاستراحة</span>
          </button>
        )}
      </div>

      {/* Session Progress Dots */}
      <div className={`absolute ${isFullscreen ? 'bottom-8' : 'bottom-6'} flex items-center justify-center gap-3 opacity-30 hover:opacity-100 transition-opacity duration-500 z-40`}>
        {Array.from({ length: longBreakInterval }).map((_, i) => (
          <div 
            key={i} 
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              i < completedSessions 
                ? 'bg-brand-teal shadow-[0_0_8px_rgba(52,165,147,0.6)] scale-110' 
                : 'bg-white/10 border border-white/20'
            }`} 
          />
        ))}
      </div>

      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 p-8 sm:p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 text-white relative z-10">
              <h2 className="text-3xl font-bold tracking-tight">الإعدادات</h2>
              <button onClick={() => setShowSettings(false)} className="hover:rotate-90 hover:text-brand-teal transition-all"><X size={24} /></button>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 mb-2 text-xs font-bold uppercase">التركيز (د)</label>
                  <input type="number" defaultValue={focusTime} onChange={(e) => setFocusTime(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-teal text-lg outline-none focus:border-brand-teal transition-all text-left" dir="ltr" min="1" max="60" />
                </div>
                <div>
                  <label className="block text-white/60 mb-2 text-xs font-bold uppercase">الراحة (د)</label>
                  <input type="number" defaultValue={breakTime} onChange={(e) => setBreakTime(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-teal text-lg outline-none focus:border-brand-teal transition-all text-left" dir="ltr" min="1" max="60" />
                </div>
              </div>

              <div>
                <label className="block text-white/60 mb-2 text-xs font-bold uppercase">الراحة الطويلة (د)</label>
                <input type="number" defaultValue={longBreakTime} onChange={(e) => setLongBreakTime(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-teal text-lg outline-none focus:border-brand-teal transition-all text-left" dir="ltr" min="1" max="60" />
              </div>

              <div>
                <label className="block text-white/60 mb-2 text-xs font-bold uppercase">راحة طويلة بعد (عدد جلسات)</label>
                <input type="number" defaultValue={longBreakInterval} onChange={(e) => setLongBreakInterval(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-teal text-lg outline-none focus:border-brand-teal transition-all text-left" dir="ltr" min="2" max="5" />
              </div>

              <button onClick={() => handleSaveSettings(focusTime, breakTime, longBreakTime, longBreakInterval)} className="w-full py-4 mt-4 bg-brand-teal hover:bg-[#2b8a7b] text-white text-lg font-bold rounded-2xl shadow-[0_0_20px_rgba(52,165,147,0.4)] transition-all">حفظ الإعدادات</button>
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