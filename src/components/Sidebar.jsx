import React from 'react';

import {
  CheckSquare,
  BarChart2,
  Folder as FolderIcon,
  Clock,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-[320px] h-screen bg-brand-surface backdrop-blur-3xl flex flex-col justify-between p-10 shadow-2xl z-20 sticky top-0 border-r border-white/5">

      {/* Top Section */}
      <div className="flex flex-col gap-12">

        {/* Logo */}
        <div className="text-right">
          <h1 className="text-4xl text-brand-teal mb-2 tracking-wide">أنجزلي</h1>
          <p className="text-xs tracking-widest text-brand-gray uppercase">The Ethereal Flow</p>
        </div>

        {/* User Profile */}
        <div className="bg-white/5 rounded-3xl p-5 flex items-center justify-end gap-5 border border-white/10 shadow-inner">
          <div className="text-right flex-1">
            <h2 className="text-lg text-white mb-1 tracking-wide">أحمد السعدي</h2>
            <p className="text-sm text-brand-gray tracking-wide">مستوى التركيز: عال</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-brand-dark flex items-center justify-center overflow-hidden border border-brand-teal/30 shadow-lg">
            {/* Avatar placeholder */}
            <div className="text-brand-teal text-sm">أ.س</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 mt-4">
          <NavItem icon={<CheckSquare size={18} />} label="المهام" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
          <NavItem icon={<BarChart2 size={18} />} label="الإحصائيات" active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} />
          <NavItem icon={<FolderIcon size={18} />} label="المشاريع" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
          <NavItem icon={<Clock size={18} />} label="المؤقت" active={activeTab === 'timer'} onClick={() => setActiveTab('timer')} />
        </nav>

      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-8">
        <button className="w-full py-4 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-full text-lg tracking-wide transition-all shadow-[0_10px_30px_rgba(52,165,147,0.2)]">
          مهمة جديدة
        </button>

        <div className="flex flex-col gap-3">
          <NavItem icon={<Settings size={22} />} label="الإعدادات" />
          <NavItem
            icon={<LogOut size={22} />}
            label="تسجيل الخروج"
            textColor="text-red-400"
            iconColor="text-red-400"
          />
        </div>
      </div>

    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick, textColor = "text-white", iconColor = "text-brand-gray" }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-end gap-5 w-full p-5 rounded-3xl transition-all duration-300
        ${active ? 'bg-white/10 shadow-[0_5px_20px_rgba(0,0,0,0.1)] border border-brand-teal/30' : 'hover:bg-white/5 border border-transparent'}
      `}
    >
      <span className={`text-lg tracking-wide ${active ? 'text-brand-teal' : textColor}`}>
        {label}
      </span>
      <div className={`${active ? 'text-brand-teal' : iconColor}`}>
        {icon}
      </div>
    </button>
  );
};

export default Sidebar;
