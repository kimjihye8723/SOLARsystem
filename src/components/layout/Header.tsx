'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  Search,
  RefreshCw,
  Bell,
  Moon,
  Sun,
  ChevronDown
} from 'lucide-react';

export default function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<string>('15:55');
  const [dateStr, setDateStr] = useState<string>('2028.05.20 (수)');

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      // Keep static date format similar to mockup or use system date
      const days = ['일', '월', '화', '수', '목', '금', '토'];

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dayOfWeek = days[now.getDay()];
      setDateStr(`${year}.${month}.${day} (${dayOfWeek})`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <header className="h-16 border-b border-slate-200 dark:border-[#1f2430] bg-white dark:bg-[#131518] px-6 flex items-center justify-between transition-colors duration-300 z-10">
      {/* Title */}
      <div className="flex items-center gap-1.5">
        <h2 className="text-lg font-black text-slate-850 dark:text-white tracking-tight">대시보드</h2>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold ml-2">시설 전체의 운영 효율과 주요 지표를 한눈에 확인합니다</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Dropdown Location Selector */}
        <div className="relative">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>리앤 본사빌딩 · 동관</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Search Command Input */}
        <div className="relative w-64 hidden lg:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="설비·구역·작업지시 검색"
            className="w-full pl-9 pr-12 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-slate-400/50 dark:focus:border-slate-700/50 text-slate-800 dark:text-slate-100"
          />
          <span className="absolute right-2 top-1.5 px-1.5 py-0.5 text-[9px] font-bold text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono">
            ⌘K
          </span>
        </div>

        {/* Refresh Action Button */}
        <button
          onClick={() => window.location.reload()}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-250 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all"
        >
          <RefreshCw className="w-4.5 h-4.5" />
        </button>

        {/* Alarm Notification Action Button */}
        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-250 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all relative">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
        </button>

        {/* Dark Mode toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-1 px-3 py-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all text-xs font-semibold"
        >
          {resolvedTheme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-500" />
              <span>라이트</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-slate-600" />
              <span>다크</span>
            </>
          )}
        </button>

        {/* Clock */}
        <div className="flex flex-col items-end pl-2 font-mono border-l border-slate-200 dark:border-slate-800">
          <span className="text-sm font-bold text-slate-800 dark:text-white leading-none">
            {time}
          </span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold mt-1">
            {dateStr}
          </span>
        </div>

        {/* Avatar Profile */}
        <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-sky-500/20 cursor-pointer">
          박
        </div>
      </div>
    </header>
  );
}
