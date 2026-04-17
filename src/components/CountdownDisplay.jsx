import React from 'react';
import CountdownBox from './CountdownBox';

const CountdownDisplay = ({ minutes = "00", seconds = "52" }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 relative w-full">
      {/* Timer Container */}
      <div className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-10 mb-20">
        
        {/* Minutes */}
        <div className="flex gap-3 sm:gap-5">
          <CountdownBox digit={minutes[0]} colorClass="text-brand-teal/80" />
          <CountdownBox digit={minutes[1]} colorClass="text-brand-teal/80" />
        </div>

        {/* Colon */}
        <div className="flex flex-col gap-8 mx-4 sm:mx-6">
          <div className="w-5 h-5 rounded-full bg-brand-teal opacity-60 shadow-[0_0_15px_rgba(52,165,147,0.5)]"></div>
          <div className="w-5 h-5 rounded-full bg-brand-teal opacity-60 shadow-[0_0_15px_rgba(52,165,147,0.5)]"></div>
        </div>

        {/* Seconds */}
        <div className="flex gap-3 sm:gap-5">
          <CountdownBox digit={seconds[0]} colorClass="text-white" />
          <CountdownBox digit={seconds[1]} colorClass="text-white" />
        </div>

      </div>

      {/* Start Button */}
      <button className="px-20 py-6 rounded-full bg-brand-teal text-white text-2xl tracking-wide shadow-[0_15px_40px_rgba(52,165,147,0.3)] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(52,165,147,0.5)] transition-all duration-300">
        ابدأ التركيز
      </button>

    </div>
  );
};

export default CountdownDisplay;
