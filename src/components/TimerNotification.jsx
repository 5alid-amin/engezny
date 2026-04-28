import React, { useEffect, useState } from 'react';

const TimerNotification = ({ show, type, duration, userName, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsFadingOut(false);

      // نبدأ تأثير الاختفاء التدريجي قبل النهاية بـ 1.5 ثانية
      // المدة الكلية 5 ثواني، إذن نبدأ عند 3.5 ثانية
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 5000);

      // إغلاق المكون نهائياً بعد 5 ثواني
      const closeTimer = setTimeout(() => {
        handleClose();
      }, 6500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    setIsFadingOut(false);
    onComplete();
  };

  if (!show || !isVisible) return null;

  let message = "";
  const isLongBreak = type === 'longBreak';

  if (type === 'shortBreak') {
    if (duration === 1) message = `بريك دقيقة واحدة ي ${userName}.. استمتع بوقتك`;
    else if (duration === 2) message = `بريك دقيقتين ي ${userName}.. استمتع بوقتك`;
    else if (duration === 3) message = `بريك تلات دقايق ي ${userName}.. استمتع بوقتك`;
    else if (duration >= 4 && duration <= 10) message = `بريك ${duration} دقايق ي ${userName}.. استمتع بوقتك`;
    else message = `بريك ${duration} دقيقة ي ${userName}.. استمتع بوقتك`;
  } else if (type === 'focus') {
    message = "فترة تركيز حماسية جديدة.. يلا بينا 🔥";
  } else if (type === 'longBreak') {
    message = `عاش يا ${userName}.. وقت اللعب ليسجوووو ✨🌍`;
  }

  return (
    <div className={`fixed inset-x-0 top-12 z-[9999] flex justify-center pointer-events-none px-4 ${isFadingOut ? 'animate-fadeOut' : ''}`}>

      {/* تأثيرات احتفالية للبريك الطويل */}
      {isLongBreak && !isFadingOut && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-ping absolute text-4xl">✨</div>
          <div className="animate-bounce absolute left-1/4 text-4xl">🎉</div>
          <div className="animate-bounce absolute right-1/4 text-4xl">🎊</div>
        </div>
      )}

      {/* البوكس الزجاجي المعدل */}
      <div
        className="relative flex flex-col items-center min-w-[300px] max-w-[550px] bg-white/5 backdrop-blur-md border border-white/10 px-10 py-8 rounded-[2.5rem] shadow-2xl pointer-events-auto overflow-hidden"
        style={{
          animation: 'slideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards',
          fontFamily: "'Inter', 'Cairo', sans-serif"
        }}
      >
        {/* زر الإغلاق */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-6 text-white/20 hover:text-white/60 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        {/* المحتوى */}
        <div className="flex flex-col items-center text-center gap-4 w-full">
          <div className="bg-white/5 p-4 rounded-full mb-2">
            <span className="text-2xl">{isLongBreak ? '🎁' : '🥷'}</span>
          </div>
          <h2 className="text-lg md:text-xl font-light text-white/80 leading-relaxed tracking-wide">
            {message}
          </h2>
        </div>

        {/* البروجرس بار الرفيع جداً */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-white/20 w-full origin-left animate-progress" />
      </div>

      <style jsx="true">{`
        @keyframes slideIn {
          0% { opacity: 0; transform: translateY(-20px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes fadeOut {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }

        @keyframes progress {
          0% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }

        .animate-fadeOut {
          animation: fadeOut 1.5s ease-out forwards;
        }

        .animate-progress {
          animation: progress 6.5s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default TimerNotification;