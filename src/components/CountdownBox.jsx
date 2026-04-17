import React from 'react';

const CountdownBox = ({ digit, colorClass }) => {
  return (
    <div className="relative w-36 h-48 sm:w-48 sm:h-64 bg-white/5 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center overflow-hidden border border-white/10">
      {/* Horizontal line for flip clock effect */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.1)]"></div>
      
      {/* Digit */}
      <span className={`text-[9rem] sm:text-[12rem] font-normal tracking-tighter leading-none z-0 ${colorClass} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
        {digit}
      </span>
    </div>
  );
};

export default CountdownBox;
