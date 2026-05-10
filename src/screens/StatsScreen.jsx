import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Award, Zap, CheckCircle2, Timer as TimerIcon, ChevronDown, Star, Flame, Trophy, Rocket, Target, ListChecks } from 'lucide-react';
import { XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, YAxis } from 'recharts';
import axiosInstance from '../api/axiosInstance';

const StatsScreen = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const filterRef = useRef(null);
  const wheelTimeout = useRef(null);

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

    const handleGlobalWheel = (e) => {
      if (chartContainerRef.current && chartContainerRef.current.contains(e.target)) {
        e.preventDefault();
        if (wheelTimeout.current) return;
        if (Math.abs(e.deltaY) < 30) return;

        if (e.deltaY > 0) {
          setCurrentSlide(prev => {
            if (prev === 0) {
              wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null; }, 1000);
              return 1;
            }
            return prev;
          });
        } else if (e.deltaY < 0) {
          setCurrentSlide(prev => {
            if (prev === 1) {
              wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null; }, 1000);
              return 0;
            }
            return prev;
          });
        }
      }
    };

    document.addEventListener('wheel', handleGlobalWheel, { passive: false });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener('wheel', handleGlobalWheel);
    };
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

  useEffect(() => {
    if (!loading && stats) {
      const timer = setTimeout(() => {
        setCurrentSlide(prev => {
          if (prev === 0) return 1;
          return prev;
        });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [loading, stats]);

  // التعديل هنا لسحب الـ fullDate من الباك اند وتنسيقه (يوم/شهر)
  const chartData = stats?.weeklyFlow?.map((item) => ({
    name: item.dayName,
    hours: item.hours,
    date: item.fullDate ? item.fullDate.split('-').slice(1).reverse().join('/') : ''
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
          <div
            className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/10 shadow-2xl flex-1 flex flex-col relative overflow-hidden min-h-[520px] bg-clip-padding transition-all"
            onWheel={(e) => {
              if (wheelTimeout.current) return;
              if (Math.abs(e.deltaY) < 30) return;

              if (e.deltaY > 0 && currentSlide === 0) {
                setCurrentSlide(1);
                wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null; }, 800);
              } else if (e.deltaY < 0 && currentSlide === 1) {
                setCurrentSlide(0);
                wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null; }, 800);
              }
            }}
          >
            <div className="flex justify-between items-start mb-12 relative z-10 text-right">
              <div className="flex gap-2 cursor-pointer z-20">
                <button
                  onClick={() => setCurrentSlide(0)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === 0 ? 'bg-[#34A593] shadow-[0_0_10px_#34A593] scale-110' : 'bg-white/20 hover:bg-white/40'}`}
                />
                <button
                  onClick={() => setCurrentSlide(1)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === 1 ? 'bg-[#34A593] shadow-[0_0_10px_#34A593] scale-110' : 'bg-white/20 hover:bg-white/40'}`}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {currentSlide === 0 ? "تحليل التدفق الأسبوعي" : "حالة العمل اليومي"}
                </h3>
                <p className="text-sm text-white/40">
                  {currentSlide === 0 ? "قياس ساعات التركيز العميق اليومية" : "متابعة أيام الإنجاز في الأسبوع"}
                </p>
              </div>
            </div>

            <div className="flex-1 w-full relative z-10 overflow-hidden min-h-[300px]">

              {/* Slide 0: Area Chart */}
              <div
                className={`absolute inset-0 w-full h-full flex flex-col transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${currentSlide === 0
                  ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
                  : 'opacity-0 -translate-y-16 pointer-events-none scale-95 blur-sm'
                  }`}
              >
                <div className="flex-1 w-full h-full">
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
                        height={70}
                        // التعديل هنا لعرض التاريخ أسفل اليوم
                        tick={({ x, y, payload }) => {
                          const hasData = chartData[payload.index]?.hours > 0;
                          return (
                            <g transform={`translate(${x},${y})`}>
                              <text
                                x={0}
                                y={10}
                                dy={16}
                                textAnchor="middle"
                                fill="rgba(255,255,255,0.4)"
                                fontSize={12}
                              >
                                {payload.value}
                              </text>
                              <text
                                x={0}
                                y={24}
                                dy={16}
                                textAnchor="middle"
                                fill="rgba(255,255,255,0.15)"
                                fontSize={9}
                              >
                                {chartData[payload.index]?.date}
                              </text>
                              {hasData && (
                                <g transform="translate(-6, 48)">
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34A593" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_5px_rgba(52,165,147,0.5)]">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </g>
                              )}
                            </g>
                          );
                        }}
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

              {/* Slide 1: Horizontal Chain */}
              <div
                className={`absolute inset-0 w-full h-full flex flex-col justify-center gap-8 md:gap-12 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${currentSlide === 1
                  ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
                  : 'opacity-0 translate-y-16 pointer-events-none scale-95 blur-sm'
                  }`}
              >
                {/* Day Names Row */}
                <div className="w-full flex flex-row-reverse justify-between items-end">
                  {chartData.map((day, idx) => (
                    <div key={`name-${idx}`} className="flex-1 flex justify-center">
                      <span className={`text-base sm:text-2xl lg:text-3xl font-bold transition-all duration-700 ${day.hours > 0 ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)] scale-110' : 'text-white/30'}`}>
                        {day.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Nodes Row */}
                <div className="relative w-full flex flex-row-reverse justify-between items-center py-6">
                  {/* Background Line */}
                  <div className="absolute left-[calc(100%/14)] right-[calc(100%/14)] h-[3px] bg-gradient-to-r from-white/5 via-white/10 to-white/5 z-0 rounded-full"></div>

                  {chartData.map((day, idx) => {
                    const isCompleted = day.hours > 0;
                    return (
                      <div key={`node-${idx}`} className="flex-1 flex justify-center relative z-10 group cursor-pointer">
                        <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24">
                          {isCompleted ? (
                            <>
                              <div className="absolute inset-0 bg-[#34A593] blur-[20px] opacity-40 rounded-full group-hover:opacity-70 group-hover:blur-[30px] transition-all duration-500"></div>
                              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#022c35] border-2 border-[#34A593]/50 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(52,165,147,0.4),inset_0_0_15px_rgba(52,165,147,0.2)] group-hover:scale-110 group-hover:border-[#34A593] group-hover:shadow-[0_0_30px_rgba(52,165,147,0.8)] transition-all duration-500">
                                <svg viewBox="0 0 24 24" fill="none" stroke="#34A593" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-[0_0_10px_rgba(52,165,147,0.9)] group-hover:scale-110 transition-transform duration-500">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                            </>
                          ) : (
                            <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[#022c35] border-2 border-white/10 group-hover:bg-white/5 group-hover:border-white/20 group-hover:scale-125 transition-all duration-500 shadow-[0_0_10px_rgba(0,0,0,0.5)]"></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Status Badges Row */}
                <div className="w-full flex flex-row-reverse justify-between items-start">
                  {chartData.map((day, idx) => {
                    const isCompleted = day.hours > 0;
                    return (
                      <div key={`status-${idx}`} className="flex-1 flex justify-center">
                        <div className={`transition-all duration-700 transform ${isCompleted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                          <span className="text-xs sm:text-sm font-bold tracking-widest text-[#34A593] uppercase px-3 py-1 sm:px-4 sm:py-2 bg-[#34A593]/10 rounded-full border border-[#34A593]/30 shadow-[0_0_15px_rgba(52,165,147,0.15)] backdrop-blur-md">
                            مُنجز
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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