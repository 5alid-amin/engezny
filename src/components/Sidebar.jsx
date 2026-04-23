import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Zap,
  Rocket,
  LayoutDashboard,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [realName, setRealName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setRealName(storedName);
    }
  }, []);

  const navItems = [
    { id: 'tasks', label: 'المهام', icon: <CheckCircle2 size={26} /> },
    { id: 'timer', label: 'المؤقت', icon: <Zap size={26} /> },
    { id: 'projects', label: 'المشاريع', icon: <Rocket size={26} /> },
    { id: 'stats', label: 'الإحصائيات', icon: <LayoutDashboard size={26} /> },
  ];

  const getInitials = (name) => {
    if (!name) return "خ";
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]);
    }
    return name.slice(0, 1);
  };

  return (
    <div className="h-screen sticky top-0 z-20 flex items-center pr-4 overflow-visible" dir="rtl">
      <div
        className={`h-[96vh] flex flex-col py-10 bg-[#003B46]/80 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]
        border border-white/10 text-white relative 
        transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
        ${isCollapsed ? 'w-[90px] rounded-[2.5rem] px-2' : 'w-[280px] rounded-[3.5rem] px-5'}`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -left-4 top-20 bg-[#34A593] text-[#003B46] w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(52,165,147,0.3)] hover:scale-110 active:scale-95 transition-all z-50 border border-white/10"
        >
          {isCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        {/* Header / Logo Section */}
        <div className="flex flex-col items-center mb-12 overflow-hidden">
          {!isCollapsed ? (
            <span className="text-2xl font-bold text-white tracking-tight whitespace-nowrap animate-in fade-in duration-500">
              دماغ {realName.split(' ')[0] || "خالد"}
            </span>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg">
              <span className="text-[#34A593] font-bold text-2xl">د</span>
            </div>
          )}
          <div className={`h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-500 mt-6 ${isCollapsed ? 'w-8' : 'w-40'}`} />
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col w-full gap-3">
          {navItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center transition-all duration-400 relative group
                  ${isCollapsed ? 'justify-center h-16 w-16 mx-auto rounded-2xl' : 'justify-start gap-5 p-5 rounded-[1.8rem] w-full'}
                  ${activeTab === item.id
                    ? 'bg-white/10 backdrop-blur-md border border-white/10 shadow-xl'
                    : 'hover:bg-white/5 hover:translate-x-[-4px]'
                  }
                `}
              >
                <div className={`transition-all duration-300 ${activeTab === item.id
                  ? 'text-[#34A593] scale-110 drop-shadow-[0_0_8px_rgba(52,165,147,0.5)]'
                  : 'text-white/30 group-hover:text-white/80'
                  }`}>
                  {item.icon}
                </div>

                {!isCollapsed && (
                  <span
                    className={`text-xl transition-all duration-500 ease-out whitespace-nowrap
                    ${activeTab === item.id
                        ? 'text-white font-bold opacity-100'
                        : 'text-white/40 font-semibold group-hover:text-white/90'
                      }`}
                  >
                    {item.label}
                  </span>
                )}

                {activeTab === item.id && (
                  <div className={`absolute bg-[#34A593] rounded-full shadow-[0_0_12px_#34A593] animate-pulse
                    ${isCollapsed ? 'bottom-2 w-1.5 h-1.5' : 'left-4 w-1.5 h-8'}`}
                  />
                )}
              </button>

              {/* فاصل بسيط جداً بين التابات */}
              {index !== navItems.length - 1 && (
                <div className={`h-[1px] bg-white/[0.02] mx-auto ${isCollapsed ? 'w-6' : 'w-4/5'}`} />
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Footer / Account Section */}
        <div className="mt-auto pt-8 border-t border-white/5 flex flex-col items-center">
          <button
            onClick={() => setActiveTab('account')}
            className={`transition-all duration-500 ease-out group relative flex items-center justify-center
            ${isCollapsed ? 'w-16 h-16' : 'w-20 h-20'}
            ${activeTab === 'account' ? 'scale-110' : 'hover:scale-105'}`}
          >
            {/* أيقونة الحساب الكبيرة والزجاجية */}
            <div className={`w-full h-full rounded-[1.8rem] transition-all duration-500
              bg-white/5 backdrop-blur-2xl border border-white/10 
              flex items-center justify-center text-white font-bold text-xl
              shadow-2xl group-hover:border-[#34A593]/40
              ${activeTab === 'account' ? 'border-[#34A593]/60 bg-[#34A593]/10 ring-4 ring-[#34A593]/5' : ''}`}>
              {getInitials(realName)}
            </div>

            {/* نقطة حالة الحساب */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#34A593] border-4 border-[#003B46] rounded-full shadow-lg" />
          </button>

          {!isCollapsed && (
            <span className="text-white/20 text-[10px] mt-3 font-bold tracking-[0.3em] uppercase">Account</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;