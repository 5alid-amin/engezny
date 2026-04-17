import React from 'react';
import { Calendar, Award, Zap, CheckCircle2, Timer as TimerIcon, ChevronDown } from 'lucide-react';

const StatsScreen = () => {
  return (
    <div className="flex flex-col flex-1 h-full relative p-4 sm:p-8">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        
        {/* Left Header (Dates & Avatar) */}
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-white/5 border border-brand-teal/30 overflow-hidden shadow-[0_5px_15px_rgba(52,165,147,0.2)]">
             {/* Avatar Image Placeholder */}
             <div className="w-full h-full flex items-center justify-center text-brand-teal text-sm">أ.س</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md px-6 py-3 rounded-full shadow-inner flex items-center gap-3 border border-white/10">
            <span className="text-base tracking-wide text-white">12 أكتوبر - 18 أكتوبر</span>
            <Calendar size={20} className="text-brand-teal" />
          </div>
        </div>

        {/* Right Header (Title) */}
        <div className="text-right">
          <p className="text-base text-brand-gray mb-2 tracking-wide">نظرة عامة على أدائك</p>
          <h2 className="text-4xl text-white tracking-wide">إحصائيات الإنجاز</h2>
        </div>

      </div>

      {/* Main Grid */}
      <div className="flex flex-col-reverse lg:flex-row gap-8 flex-1">
        
        {/* Left Column (Sidebar-like Stats) */}
        <div className="w-full lg:w-[300px] flex flex-col gap-6">
          
          {/* Deep Work Distribution */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.2)] border border-white/10">
            <h3 className="text-xl text-white text-right mb-8 tracking-wide">توزيع العمل العميق</h3>
            
            <div className="flex flex-col gap-6">
              <DistributionRow label="تطوير البرمجيات" percentage="42%" color="bg-brand-teal" width="w-[42%]" />
              <DistributionRow label="التخطيط الاستراتيجي" percentage="28%" color="bg-white/60" width="w-[28%]" />
              <DistributionRow label="إدارة المحتوى" percentage="15%" color="bg-white/30" width="w-[15%]" />
            </div>

            <div className="mt-10 pt-8 border-t border-white/10 text-center">
              <p className="text-sm text-brand-gray mb-2 tracking-wide">إجمالي ساعات التركيز</p>
              <p className="text-5xl font-light text-brand-teal mb-2 drop-shadow-[0_0_15px_rgba(52,165,147,0.3)]">32.5</p>
              <p className="text-xs text-brand-gray tracking-wide">ساعة هذا الأسبوع</p>
            </div>
          </div>

          {/* Achievement Card */}
          <div className="bg-gradient-to-br from-[#074C5B] to-[#003B46] rounded-[2.5rem] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.4)] border border-brand-teal/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/10 rounded-full blur-2xl"></div>
            <div className="inline-block bg-brand-teal/20 border border-brand-teal/30 px-4 py-1.5 rounded-full text-xs tracking-wider mb-6 relative z-10 text-brand-teal">
              إنجازات مميزة
            </div>
            <h3 className="text-3xl mb-3 tracking-wide relative z-10">أسبوع مثمر جداً!</h3>
            <p className="text-base text-white/70 mb-8 leading-relaxed relative z-10">
              لقد أكملت 24 مهمة عالية الأولوية، وهو رقم قياسي جديد لهذا الشهر.
            </p>

            <div className="flex flex-col gap-4 relative z-10">
              <AchievementRow icon={<Award size={20} />} title="وسام المثابرة" subtitle="5 أيام عمل عميق متتالية" />
              <AchievementRow icon={<Zap size={20} />} title="نمو الإنتاجية" subtitle="+18% مقارنة بالشهر السابق" />
            </div>
          </div>

        </div>

        {/* Right Column (Charts & Summary) */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Chart Card */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.2)] border border-white/10 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-10">
              <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-5 py-2.5 rounded-full flex items-center gap-3 text-base text-white transition-colors">
                <ChevronDown size={20} className="text-brand-gray" />
                <span>هذا الأسبوع</span>
              </button>
              <div className="text-right">
                <h3 className="text-2xl text-white mb-2 tracking-wide">تحليل التدفق الأسبوعي</h3>
                <p className="text-sm text-brand-gray tracking-wide">ساعات التركيز العميق مقابل المهام المكتملة</p>
              </div>
            </div>

            {/* Placeholder for Chart */}
            <div className="flex-1 relative min-h-[280px] w-full flex items-end justify-between px-4 pb-10">
              {/* Fake Chart Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pb-10 z-0">
                <div className="w-full h-[1px] bg-white/5"></div>
                <div className="w-full h-[1px] bg-white/5"></div>
                <div className="w-full h-[1px] bg-white/5"></div>
                <div className="w-full h-[1px] bg-white/5"></div>
              </div>
              
              {/* Fake Graph SVG */}
              <div className="absolute inset-0 z-10 flex items-center justify-center opacity-80 pointer-events-none">
                 <svg viewBox="0 0 500 150" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                   <path d="M0,100 L70,80 L140,90 L210,40 L280,60 L350,10 L420,30 L500,20 L500,150 L0,150 Z" fill="rgba(52, 165, 147, 0.1)" />
                   <path d="M0,100 L70,80 L140,90 L210,40 L280,60 L350,10 L420,30 L500,20" fill="none" stroke="#34A593" strokeWidth="3" />
                   {/* Data Points */}
                   <circle cx="210" cy="40" r="4" fill="#34A593" />
                   <circle cx="350" cy="10" r="4" fill="#34A593" />
                 </svg>
              </div>

              {/* Tooltip Placeholder */}
              <div className="absolute top-[20%] left-[45%] bg-[#074C5B] border border-brand-teal/30 text-white text-sm p-3 rounded-xl z-20 shadow-[0_10px_25px_rgba(0,0,0,0.3)] text-center transform -translate-x-1/2 -translate-y-full backdrop-blur-md">
                <p className="mb-1 tracking-wide">الأربعاء</p>
                <p className="text-brand-teal tracking-wide">8.5 ساعات</p>
              </div>

              {/* X Axis Labels */}
              <div className="absolute bottom-0 w-full flex justify-between text-sm text-brand-gray px-4 tracking-wide">
                <span>السبت</span>
                <span>الأحد</span>
                <span>الإثنين</span>
                <span>الثلاثاء</span>
                <span>الأربعاء</span>
                <span>الخميس</span>
                <span>الجمعة</span>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.2)] border border-white/10 flex items-center justify-between">
              <div className="w-16 h-16 rounded-[1.5rem] bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center text-brand-teal shadow-inner">
                <CheckCircle2 size={28} />
              </div>
              <div className="text-right">
                <p className="text-sm text-brand-gray mb-2 tracking-wide">معدل الإنجاز</p>
                <p className="text-4xl text-white mb-2 tracking-wide drop-shadow-md">94%</p>
                <p className="text-xs text-brand-teal flex items-center gap-1.5 justify-end tracking-wider">
                  <CheckCircle2 size={12} />
                  <span>أعلى من المتوسط بـ 5%</span>
                </p>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.2)] border border-white/10 flex items-center justify-between">
              <div className="w-16 h-16 rounded-[1.5rem] bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center text-brand-teal shadow-inner">
                <TimerIcon size={28} />
              </div>
              <div className="text-right">
                <p className="text-sm text-brand-gray mb-2 tracking-wide">متوسط التركيز</p>
                <p className="text-4xl text-white mb-2 tracking-wide drop-shadow-md">5<span className="text-2xl">س</span> 42<span className="text-2xl">د</span></p>
                <p className="text-xs text-brand-teal tracking-wider">
                  12% زيادة عن الأسبوع الماضي
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

const DistributionRow = ({ label, percentage, color, width }) => (
  <div className="flex flex-col gap-3">
    <div className="flex justify-between items-center text-sm text-white tracking-wide">
      <span>{percentage}</span>
      <span>{label}</span>
    </div>
    <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden flex justify-end shadow-inner">
      <div className={`h-full rounded-full ${color} ${width} shadow-[0_0_10px_currentColor]`}></div>
    </div>
  </div>
);

const AchievementRow = ({ icon, title, subtitle }) => (
  <div className="bg-white/5 p-4 rounded-3xl flex items-center justify-between gap-5 border border-white/10 hover:bg-white/10 transition-colors">
    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-brand-teal shadow-inner border border-white/5">
      {icon}
    </div>
    <div className="text-right flex-1">
      <h4 className="text-lg mb-1 tracking-wide">{title}</h4>
      <p className="text-xs text-white/60 tracking-wider">{subtitle}</p>
    </div>
  </div>
);

export default StatsScreen;
