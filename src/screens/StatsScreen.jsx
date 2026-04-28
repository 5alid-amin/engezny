import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Award, Zap, CheckCircle2, Timer as TimerIcon, ChevronDown, Star, Flame, Trophy, Rocket, Target, ListChecks } from 'lucide-react';
import { XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, YAxis } from 'recharts';
import axiosInstance from '../api/axiosInstance';

const StatsScreen = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const filterRef = useRef(null);

  const getCurrentWeek = () => Math.floor((new Date().getDate() - 1) / 7) + 1;

  const [filter, setFilter] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    week: getCurrentWeek()
  });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/Statistics/dashboard`, {
          params: {
            userId: userId,
            year: filter.year,
            month: filter.month,
            week: filter.week
          }
        });
        setStats(response.data);
      } catch (error) {
        console.error("خطأ في جلب الإحصائيات:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchStats();
  }, [userId, filter]);

  const chartData = stats?.weeklyFlow?.map((item) => ({
    name: item.dayName,
    hours: item.hours
  })) || [];

  const maxHoursInData = chartData.length > 0 ? Math.max(...chartData.map(d => d.hours)) : 0;

  const getYAxisDomain = (max) => {
    if (max <= 5) return 5;
    if (max <= 7) return 7;
    if (max <= 10) return 10;
    return Math.ceil(max / 5) * 5;
  };

  const yDomainMax = getYAxisDomain(maxHoursInData);

  const renderBadgeIcon = (iconName) => {
    const iconSize = 80;
    const iconClass = "drop-shadow-[0_0_15px_rgba(52,165,147,0.6)] text-[#34A593]";
    switch (iconName) {
      case 'boss_badge': return <Trophy size={iconSize} className={iconClass} />;
      case 'fire_badge': return <Flame size={iconSize} className={iconClass} />;
      case 'legendary_badge': return <Star size={iconSize} className={iconClass} />;
      case 'distinguished_badge': return <Award size={iconSize} className={iconClass} />;
      case 'active_badge': return <Rocket size={iconSize} className={iconClass} />;
      default: return <Target size={iconSize} className={iconClass} />;
    }
  };

  if (loading && !stats) return <div className="min-h-screen flex items-center justify-center text-white">جاري تحليل بياناتك...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#022c35] p-4 sm:p-8 font-sans relative" dir="rtl">

      {/* Header */}
      <div className="flex justify-between items-center mb-10 relative z-50">
        <div className="text-right">
          <p className="text-white/40 mb-1 text-sm tracking-wide">نظرة عامة على أدائك</p>
          <h2 className="text-4xl font-bold text-white tracking-tight">إحصائيات الإنجاز</h2>
        </div>

        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xl hover:bg-white/10 transition-all text-white"
          >
            <Calendar size={18} className="text-[#34A593]" />
            <span className="text-sm font-medium">تصفية النتائج</span>
            <ChevronDown size={16} className="text-white/40" />
          </button>

          {showFilters && (
            <div className="absolute top-full mt-2 left-0 w-64 bg-[#074C5B] border border-white/10 rounded-2xl shadow-2xl p-4 z-[100] grid grid-cols-1 gap-3 animate-in fade-in zoom-in duration-200">
              <select
                value={filter.year}
                onChange={(e) => setFilter({ ...filter, year: parseInt(e.target.value) })}
                className="bg-white/10 border border-white/10 rounded-xl p-2 text-white text-xs outline-none"
              >
                {[2026, 2025, 2024].map(y => <option key={y} value={y} className="bg-[#074C5B]">{y}</option>)}
              </select>
              <select
                value={filter.month}
                onChange={(e) => setFilter({ ...filter, month: parseInt(e.target.value) })}
                className="bg-white/10 border border-white/10 rounded-xl p-2 text-white text-xs outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1} className="bg-[#074C5B]">شهر {i + 1}</option>
                ))}
              </select>
              <select
                value={filter.week}
                onChange={(e) => setFilter({ ...filter, week: parseInt(e.target.value) })}
                className="bg-white/10 border border-white/10 rounded-xl p-2 text-white text-xs outline-none"
              >
                {[1, 2, 3, 4, 5].map(w => <option key={w} value={w} className="bg-[#074C5B]">الأسبوع {w}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col-reverse lg:flex-row gap-8 flex-1">

        {/* Left Column */}
        <div className="w-full lg:w-[320px] flex flex-col gap-6">
          <div className="bg-gradient-to-br from-[#074C5B] to-[#002229] rounded-[2.5rem] p-8 shadow-2xl border border-white/5 relative overflow-hidden group flex flex-col items-center justify-center text-center min-h-[300px]">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#34A593]/20 rounded-full blur-[60px]"></div>
            <h3 className="text-3xl font-bold text-white mb-8 tracking-wide z-10">
              أسبوع <span className="text-[#34A593]">{stats?.weekStatus}</span> جداً!
            </h3>
            <div className="relative z-10 animate-bounce duration-[2000ms]">
              {renderBadgeIcon(stats?.badgeIcon)}
            </div>
            <div className="mt-6 inline-block bg-white/5 backdrop-blur-md border border-white/5 px-6 py-2 rounded-full text-[12px] font-bold tracking-widest text-[#34A593] uppercase z-10 shadow-lg">
              {stats?.badgeIcon?.replace('_', ' ')}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden bg-clip-padding">
            <h3 className="text-xl font-semibold text-white text-right mb-8 tracking-wide">توزيع العمل العميق</h3>
            <div className="flex flex-col gap-6 relative z-10">
              {stats?.deepWorkDistribution?.map((item, idx) => (
                <DistributionRow
                  key={idx}
                  label={item.categoryName}
                  percentage={`${item.percentage}%`}
                  color={idx === 0 ? "#34A593" : "#ffffff99"}
                  width={`${item.percentage}%`}
                />
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-xs text-white/40 mb-2 uppercase tracking-widest">إجمالي ساعات التركيز</p>
              <p className="text-5xl font-light text-[#34A593] drop-shadow-[0_0_20px_rgba(52,165,147,0.4)]">{stats?.totalFocusHours}</p>
              <p className="text-[10px] text-white/30 mt-2 opacity-50">ساعة للفترة المحددة</p>
            </div>
          </div>
        </div>

        {/* Right Column (Chart Area) */}
        <div className="flex-1 flex flex-col gap-6 ">
          <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/10 shadow-2xl flex-1 flex flex-col relative overflow-hidden min-h-[520px] bg-clip-padding">
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
                <AreaChart data={chartData} margin={{ right: 10, left: -20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34A593" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#34A593" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="2 2"
                    vertical={true}
                    horizontal={true}
                    stroke="rgba(255,255,255,0.08)"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                    dy={10}
                  />

                  <YAxis
                    domain={[0, yDomainMax]}
                    tickCount={yDomainMax + 1}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }}
                    dx={-10}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <SummaryCard
              icon={<CheckCircle2 size={26} />}
              label="معدل الإنجاز"
              value={`${stats?.completionRate}%`}
              subValue="مقارنة بالمتوسط العام"
              isPositive={true}
            />
            <SummaryCard
              icon={<ListChecks size={26} />}
              label="التاسكات المنجزة"
              value={stats?.totalCompletedTasks || 0}
              subValue="إجمالي إنجاز الأسبوع"
              isPositive={true}
            />
            <SummaryCard
              icon={<TimerIcon size={26} />}
              label="متوسط التركيز اليومي"
              value={<>{Math.floor(stats?.averageFocusMinutes / 60)}<span className="text-xl mx-1 opacity-50">س</span> {Math.floor(stats?.averageFocusMinutes % 60)}<span className="text-xl mx-1 opacity-50">د</span></>}
              subValue="متوسط وقت اليوم الواحد"
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
      <div className="h-full rounded-full transition-all duration-1000" style={{ width: width, backgroundColor: color }}></div>
    </div>
  </div>
);

const SummaryCard = ({ icon, label, value, subValue, isPositive }) => (
  <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/10 flex items-center justify-between hover:border-[#34A593]/30 transition-all bg-clip-padding h-full">
    <div className="w-16 h-16 rounded-2xl bg-[#34A593]/10 border border-[#34A593]/20 flex items-center justify-center text-[#34A593] shrink-0">
      {icon}
    </div>
    <div className="text-right">
      <p className="text-xs font-bold text-white/30 mb-2 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      <p className={`text-[10px] font-bold ${isPositive ? 'text-[#34A593]' : 'text-red-400'} flex items-center gap-1 justify-end whitespace-nowrap`}>
        {subValue}
      </p>
    </div>
  </div>
);

export default StatsScreen;