import React, { useState } from 'react';
import { Calendar, Award, Zap, CheckCircle2, Timer as TimerIcon, ChevronDown } from 'lucide-react';
import { XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { name: 'السبت', hours: 7.5 },
  { name: 'الأحد', hours: 7 },
  { name: 'الإثنين', hours: 9 },
  { name: 'الثلاثاء', hours: 5 },
  { name: 'الأربعاء', hours: 8.5 },
  { name: 'الخميس', hours: 3.5 },
  { name: 'الجمعة', hours: 4 },
];

const StatsScreen = () => {
  const productivityStatus = "مثمر جداً";
  const [showFilters, setShowFilters] = useState(false);

  const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020];
  const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  const weeks = ["الأسبوع الأول", "الأسبوع الثاني", "الأسبوع الثالث", "الأسبوع الرابع"];

  return (
    <div className="flex flex-col min-h-screen bg-[#022c35] p-4 sm:p-8 font-sans relative" dir="rtl">

      {/* Header */}
      <div className="flex justify-between items-center mb-10 relative z-50">
        <div className="text-right">
          <p className="text-white/40 mb-1 text-sm tracking-wide">نظرة عامة على أدائك</p>
          <h2 className="text-4xl font-bold text-white tracking-tight">إحصائيات الإنجاز</h2>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xl hover:bg-white/10 transition-all text-white"
          >
            <Calendar size={18} className="text-[#34A593]" />
            <span className="text-sm font-medium">هذا الأسبوع</span>
            <ChevronDown size={16} className="text-white/40" />
          </button>

          {showFilters && (
            <div className="absolute top-full mt-2 left-0 w-64 bg-[#074C5B] border border-white/10 rounded-2xl shadow-2xl p-4 z-[100] grid grid-cols-1 gap-3 animate-in fade-in zoom-in duration-200">
              <select className="bg-white/10 border border-white/10 rounded-xl p-2 text-white text-xs outline-none cursor-pointer focus:border-[#34A593]">
                {years.map(y => <option key={y} className="bg-[#074C5B]">{y}</option>)}
              </select>
              <select className="bg-white/10 border border-white/10 rounded-xl p-2 text-white text-xs outline-none cursor-pointer focus:border-[#34A593]">
                {months.map(m => <option key={m} className="bg-[#074C5B]">{m}</option>)}
              </select>
              <select className="bg-white/10 border border-white/10 rounded-xl p-2 text-white text-xs outline-none cursor-pointer focus:border-[#34A593]">
                {weeks.map(w => <option key={w} className="bg-[#074C5B]">{w}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col-reverse lg:flex-row gap-8 flex-1">

        {/* Left Column */}
        <div className="w-full lg:w-[320px] flex flex-col gap-6">
          <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#34A593]/5 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-semibold text-white text-right mb-8 tracking-wide">توزيع العمل العميق</h3>
            <div className="flex flex-col gap-6 relative z-10">
              <DistributionRow label="تطوير البرمجيات" percentage="42%" color="#34A593" width="42%" />
              <DistributionRow label="التخطيط الاستراتيجي" percentage="28%" color="#ffffff99" width="28%" />
              <DistributionRow label="إدارة المحتوى" percentage="15%" color="#ffffff44" width="15%" />
            </div>
            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-xs text-white/40 mb-2 uppercase tracking-widest">إجمالي ساعات التركيز</p>
              <p className="text-5xl font-light text-[#34A593] drop-shadow-[0_0_20px_rgba(52,165,147,0.4)]">32.5</p>
              <p className="text-[10px] text-white/30 mt-2 opacity-50">ساعة هذا الأسبوع</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#074C5B] to-[#002229] rounded-[2.5rem] p-8 shadow-2xl border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#34A593]/20 rounded-full blur-[60px] group-hover:bg-[#34A593]/30 transition-all"></div>
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest mb-6 text-[#34A593] uppercase">إنجازات مميزة</div>
            <h3 className="text-3xl font-bold text-white mb-3 tracking-wide">أسبوع {productivityStatus}!</h3>
            <p className="text-sm text-white/60 mb-8 leading-relaxed">لقد أكملت 24 مهمة عالية الأولوية، وهو رقم قياسي جديد.</p>
            <div className="flex flex-col gap-4">
              <AchievementRow icon={<Award size={20} />} title="وسام المثابرة" subtitle="5 أيام عمل عميق متتالية" />
              <AchievementRow icon={<Zap size={20} />} title="نمو الإنتاجية" subtitle="+18% مقارنة بالأسبوع السابق" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-6 " >
          <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/10 shadow-2xl flex-1 flex flex-col relative overflow-hidden min-h-[520px]">
            {/* تعديل: الحواف الدائرية للخلفية السوداء ورجوع كلمة السبت */}
            <div className="absolute inset-x-0 top-0 bottom-[-60px] opacity-[0.03] pointer-events-none rounded-[3rem]"
              style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
            </div>

            <div className="flex justify-between items-start mb-12 relative z-10 text-right">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#34A593] shadow-[0_0_10px_#34A593]"></div>
                <div className="w-3 h-3 rounded-full bg-white/10"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">تحليل التدفق الأسبوعي</h3>
                <p className="text-sm text-white/40">قياس ساعات التركيز العميق اليومية</p>
              </div>
            </div>

            <div className="flex-1 w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ right: 30, left: 10, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34A593" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#34A593" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                    dy={10}
                    padding={{ left: 20, right: 20 }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#074C5B', borderRadius: '15px', border: '1px solid rgba(52,165,147,0.4)', textAlign: 'right' }}
                    itemStyle={{ color: '#34A593' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#34A593"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorHours)"
                    dot={{ r: 6, fill: '#34A593', strokeWidth: 2, stroke: '#022c35' }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <SummaryCard
              icon={<CheckCircle2 size={26} />}
              label="معدل الإنجاز"
              value="94%"
              subValue="أعلى من المتوسط بـ 5%"
              isPositive={true}
            />
            <SummaryCard
              icon={<TimerIcon size={26} />}
              label="متوسط التركيز"
              value={<>5<span className="text-xl mx-1 opacity-50">س</span> 42<span className="text-xl mx-1 opacity-50">د</span></>}
              subValue="12% زيادة عن الأسبوع الماضي"
              isPositive={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DistributionRow = ({ label, percentage, color, width }) => (
  <div className="flex flex-col gap-3">
    <div className="flex justify-between items-center text-[13px] font-medium text-white/80">
      <span>{percentage}</span>
      <span>{label}</span>
    </div>
    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000" style={{ width: width, backgroundColor: color, boxShadow: `0 0 15px ${color}66` }}></div>
    </div>
  </div>
);

const AchievementRow = ({ icon, title, subtitle }) => (
  <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between border border-white/5 hover:bg-white/10 transition-all cursor-default group">
    <div className="w-11 h-11 rounded-xl bg-[#34A593]/10 flex items-center justify-center text-[#34A593] group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="text-right flex-1 pr-4">
      <h4 className="text-sm font-bold text-white/90">{title}</h4>
      <p className="text-[11px] text-white/40 font-medium">{subtitle}</p>
    </div>
  </div>
);

const SummaryCard = ({ icon, label, value, subValue, isPositive }) => (
  <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/10 flex items-center justify-between hover:border-[#34A593]/30 transition-all shadow-xl">
    <div className="w-16 h-16 rounded-2xl bg-[#34A593]/10 border border-[#34A593]/20 flex items-center justify-center text-[#34A593] shadow-inner">
      {icon}
    </div>
    <div className="text-right">
      <p className="text-xs font-bold text-white/30 mb-2 uppercase tracking-widest">{label}</p>
      <p className="text-4xl font-bold text-white mb-2">{value}</p>
      <p className={`text-[10px] font-bold ${isPositive ? 'text-[#34A593]' : 'text-red-400'} flex items-center gap-1 justify-end`}>
        {isPositive && <CheckCircle2 size={10} />}
        {subValue}
      </p>
    </div>
  </div>
);

export default StatsScreen;
