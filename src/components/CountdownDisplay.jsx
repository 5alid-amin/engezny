import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Maximize, Settings, X } from 'lucide-react';
import CountdownBox from './CountdownBox';

const CountdownDisplay = () => {
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [isFocusSession, setIsFocusSession] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef(null);

  // منطق الأصوات المبهجة
  const playJoyfulAlert = (sessionType) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playNote = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    if (sessionType === 'focus') {
      playNote(523.25, ctx.currentTime, 1.0);
      playNote(659.25, ctx.currentTime + 0.2, 1.0);
      playNote(783.99, ctx.currentTime + 0.4, 1.2);
    } else {
      playNote(440, ctx.currentTime, 1.5);
      playNote(554.37, ctx.currentTime + 0.3, 1.5);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft(p => p - 1), 1000);
    } else if (isActive && secondsLeft === 0) {
      playJoyfulAlert(isFocusSession ? 'focus' : 'break');
      const nextSessionIsFocus = !isFocusSession;
      setIsFocusSession(nextSessionIsFocus);
      setSecondsLeft((nextSessionIsFocus ? focusTime : breakTime) * 60);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, isFocusSession, focusTime, breakTime]);

  useEffect(() => {
    const fsHandler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', fsHandler);
    return () => document.removeEventListener('fullscreenchange', fsHandler);
  }, []);

  const handleEnterFullscreen = () => {
    if (containerRef.current) containerRef.current.requestFullscreen();
  };

  // الدالة المعدلة لتبدأ وتكبر الشاشة فوراً
  const handleStartAction = () => {
    handleEnterFullscreen();
    setIsActive(true);
  };

  const saveSettings = (f, b) => {
    const newF = Math.min(60, Math.max(1, parseInt(f) || 1));
    const newB = Math.min(60, Math.max(1, parseInt(b) || 1));
    setFocusTime(newF);
    setBreakTime(newB);
    setSecondsLeft((isFocusSession ? newF : newB) * 60);
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
            <button onClick={() => setIsActive(false)} className="p-6 rounded-full bg-white/[0.03] border border-white/10 text-white hover:text-brand-teal transition-all active:scale-90">
              <Pause size={38} />
            </button>
            <button onClick={() => { setIsActive(false); setSecondsLeft((isFocusSession ? focusTime : breakTime) * 60); }} className="p-6 rounded-full bg-white/[0.03] border border-white/10 text-white hover:text-red-400 transition-all active:scale-90">
              <RotateCcw size={38} />
            </button>
          </div>
        )}
      </div>

      {/* نافذة الإعدادات */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0a1f24] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8 text-brand-teal">
              <h2 className="text-2xl font-bold tracking-tight">الإعدادات</h2>
              <button onClick={() => setShowSettings(false)} className="hover:rotate-90 transition-transform"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-white/60 mb-2 mr-1 text-sm">وقت التركيز (دقيقة)</label>
                <input type="number" defaultValue={focusTime} onChange={(e) => setFocusTime(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-teal/50 transition-all" min="1" max="60" />
              </div>
              <div>
                <label className="block text-white/60 mb-2 mr-1 text-sm">وقت الراحة (دقيقة)</label>
                <input type="number" defaultValue={breakTime} onChange={(e) => setBreakTime(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-brand-teal/50 transition-all" min="1" max="60" />
              </div>
              <button onClick={() => saveSettings(focusTime, breakTime)} className="w-full py-5 bg-brand-teal text-[#001b22] font-bold rounded-2xl mt-4 hover:brightness-110 active:scale-95 transition-all shadow-lg">حفظ الإعدادات</button>
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