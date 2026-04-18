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
  <div className={`relative ${isCollapsed ? 'w-10 h-10' : 'w-16 h-14'} transition-all duration-300 ease-out`}>
    <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path d="M50 10C65 10 78 22 78 38C78 50 72 60 62 66" stroke="#34A593" strokeWidth="6" strokeLinecap="round" className="opacity-90" />
      <path d="M58 25H70" stroke="#34A593" strokeWidth="5" strokeLinecap="round" className="opacity-70" />
      <path d="M58 38H75" stroke="#34A593" strokeWidth="5" strokeLinecap="round" className="opacity-70" />
      <path d="M50 10C35 10 22 22 22 38C22 54 35 66 50 66" stroke="white" strokeWidth="6" strokeLinecap="round" className="opacity-80" />
      <circle cx="50" cy="38" r="6" fill="#34A593" className="animate-pulse" />
    </svg>
  </div>
);

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'tasks', label: 'المهام', icon: <CheckCircle2 size={26} /> },
    { id: 'timer', label: 'المؤقت', icon: <Zap size={26} /> },
    { id: 'projects', label: 'المشاريع', icon: <Rocket size={26} /> },
    { id: 'stats', label: 'الإحصائيات', icon: <LayoutDashboard size={26} /> },
  ];

  return (
    <div className="h-screen sticky top-0 z-20 flex items-center pr-4 overflow-visible">
      <div
        className={`h-[96vh] flex flex-col py-10 bg-[#003B46]/80 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]
        border border-white/10 text-white relative 
        transition-all duration-300 ease-out
        ${isCollapsed ? 'w-[100px] rounded-[2.5rem] px-3' : 'w-[300px] rounded-[3.5rem] px-6'}`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -left-5 top-20 bg-[#34A593] text-[#003B46] w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(52,165,147,0.4)] hover:scale-110 active:scale-95 transition-all z-50 border border-white/20"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* Logo Section */}
        <div className="flex flex-col items-center mb-12">
          <BrainLogo isCollapsed={isCollapsed} />
          <div className={`h-[2px] bg-gradient-to-r from-transparent via-[#34A593]/40 to-transparent transition-all duration-300 ease-out mt-6 ${isCollapsed ? 'w-8' : 'w-24'}`} />
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col w-full">
          {navItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center transition-all duration-200 relative group mb-1
                  ${isCollapsed ? 'justify-center h-16 w-16 mx-auto rounded-2xl' : 'justify-end gap-5 p-4 rounded-2xl w-full'}
                  ${activeTab === item.id ? 'bg-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]' : 'hover:bg-white/5'}
                `}
              >
                {/* Label - Back to original hover logic but with faster transition */}
                {!isCollapsed && (
                  <span
                    className={`text-xl transition-all duration-200 ease-out transform
                    ${activeTab === item.id
                        ? 'text-white font-bold opacity-100 translate-x-0'
                        : 'text-white/40 font-medium group-hover:text-white/80 group-hover:-translate-x-1 opacity-100'
                      }`}
                  >
                    {item.label}
                  </span>
                )}

                {/* Icon */}
                <div className={`transition-all duration-200 ${activeTab === item.id
                  ? 'text-[#34A593] drop-shadow-[0_0_10px_rgba(52,165,147,0.8)] scale-110'
                  : 'text-white/30 group-hover:text-white/80 group-hover:scale-105'
                  }`}>
                  {item.icon}
                </div>

                {/* Active Indicator Line */}
                {activeTab === item.id && (
                  <div className="absolute right-0 w-1 h-8 bg-[#34A593] rounded-full shadow-[0_0_15px_#34A593] animate-pulse" />
                )}
              </button>

              {/* Minimal Divider */}
              {index !== navItems.length - 1 && (
                <div className={`h-[1px] bg-white/5 transition-all duration-300 ease-out mx-auto ${isCollapsed ? 'w-8 my-1' : 'w-full my-1'}`} />
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Bottom Section - Account */}
        <div className={`mt-auto pt-6 border-t border-white/5 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center group transition-all duration-300 ease-out relative
            ${isCollapsed ? 'justify-center' : 'justify-end gap-4 p-3 rounded-[2rem] w-full'}
            ${activeTab === 'account' ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5'}`}
          >
            {!isCollapsed && (
              <div className="text-right">
                <p className="text-white font-bold text-sm tracking-tight">خالد أمين</p>
                <p className="text-[#34A593] text-[9px] uppercase font-black tracking-[0.2em] opacity-80">Premium</p>
              </div>
            )}

            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#34A593] to-[#074C5B] border-2 border-white/10 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-[#34A593]/20 transition-all duration-300">
              خ م
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;