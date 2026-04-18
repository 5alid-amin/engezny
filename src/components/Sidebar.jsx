import React, { useState } from 'react';
import {
  CheckCircle2,
  Zap,
  Rocket,
  LayoutDashboard,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

const BrainLogo = ({ isCollapsed }) => (
  <div className={`relative ${isCollapsed ? 'w-12 h-10' : 'w-16 h-14'} transition-all duration-300`}>
    <svg
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path
        d="M50 10C65 10 78 22 78 38C78 50 72 60 62 66"
        stroke="#34A593"
        strokeWidth="6"
        strokeLinecap="round"
        className="opacity-90"
      />
      <path
        d="M58 25H70"
        stroke="#34A593"
        strokeWidth="5"
        strokeLinecap="round"
        className="opacity-70"
      />
      <path
        d="M58 38H75"
        stroke="#34A593"
        strokeWidth="5"
        strokeLinecap="round"
        className="opacity-70"
      />
      <path
        d="M50 10C35 10 22 22 22 38C22 54 35 66 50 66"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        className="opacity-80"
      />
      <circle cx="50" cy="38" r="6" fill="#34A593" className="animate-pulse" />
      <path
        d="M30 74C42 80 58 80 70 74"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        className="opacity-30"
      />
    </svg>
  </div>
);

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'tasks', label: 'المهام', icon: <CheckCircle2 size={30} strokeWidth={2.5} /> },
    { id: 'timer', label: 'المؤقت', icon: <Zap size={30} strokeWidth={2.5} /> },
    { id: 'projects', label: 'المشاريع', icon: <Rocket size={30} strokeWidth={2.5} /> },
    { id: 'stats', label: 'الإحصائيات', icon: <LayoutDashboard size={30} strokeWidth={2.5} /> },
  ];

  return (
    <div className="h-screen sticky top-0 z-20 flex items-center pr-4">
      {/* Container wrapper removed overflow-hidden from main container to show button */}
      <div className={`h-[96vh] flex flex-col justify-between py-10 bg-gradient-to-b from-[#074C5B] via-[#003B46] via-20% to-[#003B46] shadow-[0_15px_40px_rgba(0,0,0,0.4)]
      border border-brand-teal/20 text-white relative transition-all duration-300 ease-in-out bg-brand-surface/30 backdrop-blur-3xl
      ${isCollapsed ? 'w-[90px] rounded-[2.5rem] px-2' : 'w-[320px] rounded-[3rem] px-6'
        }`}
      >
        {/* Toggle Button - Now fully visible */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -left-5 top-16 bg-brand-teal text-brand-dark w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(52,165,147,0.5)] hover:scale-110 active:scale-95 transition-all z-50 border border-white/20"
        >
          {isCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
        </button>

        <div className="flex flex-col gap-10 items-center">
          <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-100' : 'px-4'}`}>
            <BrainLogo isCollapsed={isCollapsed} />
            {!isCollapsed && (
              <div className="h-1 w-16 bg-brand-teal mt-4 mx-auto rounded-full opacity-50" />
            )}
          </div>

          <nav className="flex flex-col gap-4 w-full">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center transition-all duration-300 relative group
                  ${isCollapsed ? 'justify-center h-16 w-16 mx-auto rounded-2xl' : 'justify-end gap-6 p-4 rounded-[1.8rem] w-full'}
                  ${activeTab === item.id
                    ? 'bg-white/10 border border-white/10 shadow-lg'
                    : 'hover:bg-white/5 border border-transparent'}
                `}
              >
                {!isCollapsed && (
                  <span className={`text-2xl transition-all ${activeTab === item.id ? 'text-white font-black' : 'text-white/60 font-bold group-hover:text-white/90'}`}>
                    {item.label}
                  </span>
                )}
                <div className={`transition-all duration-300 ${activeTab === item.id ? 'text-brand-teal scale-110 drop-shadow-[0_0_8px_#34a593]' : 'text-white/40 group-hover:text-white'}`}>
                  {item.icon}
                </div>

                {activeTab === item.id && (
                  <div className="absolute right-0 w-1.5 h-10 bg-brand-teal rounded-full shadow-[0_0_15px_#34a593]" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Premium Divider - فاصل البريميوم الشيك */}
        <div className="w-full px-6 my-4">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-brand-teal/30 to-transparent" />
        </div>

        <div className={`px-2 mt-auto pt-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button className={`flex items-center group transition-all duration-300 relative
            ${isCollapsed ? 'justify-center' : 'justify-end gap-4 bg-white/5 p-4 rounded-[2rem] hover:bg-white/10 w-full border border-white/5'}`}>

            {!isCollapsed && (
              <div className="text-right">
                <p className="text-white font-bold text-sm">الحساب</p>
                <p className="text-brand-teal text-[10px] uppercase tracking-widest font-bold mt-0.5">Premium</p>
              </div>
            )}

            <div className="w-12 h-12 rounded-full bg-brand-teal/10 border-2 border-brand-teal/40 flex items-center justify-center text-brand-teal font-black text-lg shadow-[0_0_15px_rgba(52,165,147,0.3)] group-hover:scale-105 group-hover:border-brand-teal/70 transition-all duration-300">
              خ م
            </div>

            <div className="absolute inset-0 rounded-[2rem] bg-brand-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;