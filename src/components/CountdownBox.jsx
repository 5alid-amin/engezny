import React, { useEffect, useState } from 'react';

const CountdownBox = ({ value, isFullscreen }) => {
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setPrevValue(value);
        setIsFlipping(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  // تعديل الحجم ليكون مربعاً تماماً لضمان تناسق البادينج من كل الجهات
  const sizeClasses = isFullscreen
    ? "w-[38vw] aspect-square max-h-[80vh]"
    : "w-64 h-64 sm:w-80 sm:h-80";

  const textClasses = isFullscreen
    ? "text-[28vw]"
    : "text-[12rem] sm:text-[15rem]";

  const fontStyle = {
    fontFamily: "'Inter', sans-serif",
    transform: "scaleY(1.1)", // تقليل بسيط لنسبة الطول لزيادة التناسق
    display: "inline-block"
  };

  return (
    <div className={`relative ${sizeClasses} perspective-1000 select-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[18%] overflow-hidden transition-all duration-500`}>

      {/* النصف العلوي - سنترة مطلقة */}
      <div className="absolute top-0 w-full h-1/2 bg-[#0a1f24] flex items-end justify-center overflow-hidden border-t border-x border-white/5">
        <span style={fontStyle} className={`${textClasses} font-bold text-white/80 leading-none translate-y-[50%] text-center w-full`}>
          {value}
        </span>
      </div>

      {/* النصف السفلي - سنترة مطلقة */}
      <div className="absolute bottom-0 w-full h-1/2 bg-[#0d252a] flex items-start justify-center overflow-hidden border-b border-x border-white/5">
        <span style={fontStyle} className={`${textClasses} font-bold text-white/80 leading-none -translate-y-[50%] text-center w-full`}>
          {isFlipping ? prevValue : value}
        </span>
      </div>

      {/* الورقة المتحركة */}
      {isFlipping && (
        <div className="absolute top-0 w-full h-1/2 origin-bottom preserve-3d animate-flip-fast z-10">
          <div className="absolute inset-0 bg-[#0a1f24] flex items-end justify-center overflow-hidden backface-hidden border-t border-x border-white/5">
            <span style={fontStyle} className={`${textClasses} font-bold text-white/80 leading-none translate-y-[50%] text-center w-full`}>
              {prevValue}
            </span>
          </div>
          <div className="absolute inset-0 bg-[#0d252a] flex items-end justify-center overflow-hidden backface-hidden rotate-x-180 border-t border-x border-white/5 shadow-2xl">
            <span style={fontStyle} className={`${textClasses} font-bold text-white/80 leading-none translate-y-[50%] text-center w-full`}>
              {value}
            </span>
          </div>
        </div>
      )}

      {/* الخط الفاصل - تقليل السمك والوضوح */}
      <div className="absolute top-[50%] left-0 w-full h-[1px] bg-black/40 z-20 shadow-sm" />
    </div>
  );
};

export default CountdownBox;