import React from 'react';
import { Search, Bell, Settings, Palette, Code, BarChart2, Sparkles } from 'lucide-react';

const categories = [
  {
    id: '01',
    title: 'تصميم',
    icon: <Palette size={32} />,
    color: 'bg-brand-teal',
    textColor: 'text-white'
  },
  {
    id: '02',
    title: 'تطوير',
    icon: <Code size={34} />,
    color: 'bg-[#074C5B]',
    textColor: 'text-white'
  },
  {
    id: '03',
    title: 'إدارة',
    icon: <BarChart2 size={32} />,
    color: 'bg-[#8C9896]',
    textColor: 'text-white'
  },
  {
    id: '04',
    title: 'إبداع',
    icon: <Sparkles size={34} />,
    color: 'bg-white',
    textColor: 'text-brand-dark',
    border: 'shadow-[0_0_20px_rgba(255,255,255,0.3)]'
  }
];

const ProjectsScreen = () => {
  return (
    <div className="flex flex-col flex-1 h-full relative p-4 sm:p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-16">

        {/* Left (Avatar & Notifications) */}
        <div className="flex items-center gap-8">
          <div className="w-14 h-14 rounded-full bg-white/5 border border-brand-teal/30 overflow-hidden shadow-[0_5px_15px_rgba(52,165,147,0.2)]">
            <div className="w-full h-full flex items-center justify-center text-brand-teal text-sm">أ.س</div>
          </div>
          <button className="text-white/70 hover:text-white transition-colors relative">
            <Bell size={24} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full shadow-[0_0_10px_rgba(248,113,113,0.8)]"></span>
          </button>
        </div>

        {/* Center (Search Bar) */}
        <div className="flex-1 max-w-xl mx-12 relative">
          <input
            type="text"
            placeholder="بحث عن الفئات..."
            className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-brand-teal/50 px-8 py-4 rounded-full text-right text-base text-white outline-none transition-all pr-14 placeholder-white/40 shadow-inner"
          />
          <Search size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/40" />
        </div>

        {/* Right (Top right settings if needed, but we keep it empty or add logo) */}
        <div className="w-12"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col items-center mt-10">

        <div className="text-center mb-20">
          <h2 className="text-5xl text-white mb-6 tracking-wide">إكتشف مساحتـك</h2>
          <p className="text-lg text-brand-gray tracking-wide">اختر الفئة التي تعبر عن مشروعك القادم. بيئة عمل صُممت لتعزيز التركيز والإبداع.</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 h-72 flex flex-col justify-between items-center group cursor-pointer hover:bg-white/10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:border-brand-teal/30 transition-all duration-500 hover:-translate-y-2`}
            >
              <div className="w-full flex justify-between items-start">
                <span className="text-sm tracking-[0.3em] text-brand-gray uppercase">
                  CATEGORY / {cat.id}
                </span>
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-lg ${cat.color} ${cat.textColor} ${cat.border || ''}`}>
                  {cat.icon}
                </div>
              </div>
              <h3 className="text-5xl text-white self-end tracking-wide">{cat.title}</h3>
            </div>
          ))}
        </div>

        {/* Bottom Helper */}
        <div className="mt-24 bg-white/5 rounded-[2.5rem] p-10 max-w-3xl w-full text-center border border-white/10 backdrop-blur-xl shadow-2xl">
          <h4 className="text-2xl text-white mb-4 tracking-wide">هل تحتاج لمساعدة في الاختيار؟</h4>
          <p className="text-base text-brand-gray mb-8 tracking-wide">نظام الذكاء الاصطناعي في أنجزلي يمكنه توجيهك للفئة المناسبة بناءً على أهدافك.</p>
          <button className="bg-brand-teal text-white px-8 py-4 rounded-full text-lg tracking-wide shadow-[0_10px_30px_rgba(52,165,147,0.3)] hover:shadow-[0_15px_40px_rgba(52,165,147,0.4)] hover:-translate-y-1 transition-all duration-300">
            تحدث مع المساعد الرقمي
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProjectsScreen;
