'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Settings,
  ShieldAlert,
  Wrench,
  HelpCircle,
  Play,
  Check,
  AlertTriangle,
  Info,
  SlidersHorizontal,
  Plus,
  Tv,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Zap
} from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function DashboardPage() {
  // Checklist interactive state
  const [tasks, setTasks] = useState([
    { id: 1, title: 'EHP-3F 압축기 점검', assignee: '이장미', type: '긴급수리', typeColor: 'text-red-500 bg-red-500/10 border-red-500/20', time: '오늘 15:00', checked: false },
    { id: 2, title: '비상발전기 시험가동', assignee: '최윤석', type: '정기점검', typeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', time: '오늘 12:00', checked: true },
    { id: 3, title: 'UPS-A 배터리 자가진단', assignee: '최윤석', type: '정기점검', typeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', time: '오늘 11:00', checked: true },
    { id: 4, title: '엘리베이터 2호기 윤활', assignee: '외부업체', type: '예방정비', typeColor: 'text-sky-500 bg-sky-500/10 border-sky-500/20', time: '내일 09:00', checked: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  // Sparkline mini SVG charts paths
  const orangeSpark = "M 0 15 Q 15 5 30 18 T 60 12 T 90 2 Q 105 10 120 17";
  const greenSpark = "M 0 18 Q 15 15 30 10 T 60 14 T 90 18 Q 105 7 120 3";
  const redSpark = "M 0 5 Q 15 15 30 7 T 60 18 T 90 12 Q 105 15 120 7";
  const blueSpark = "M 0 18 Q 15 17 30 14 T 60 11 T 90 8 Q 105 5 120 2";

  // 1. Donut Chart Options
  const donutOptions = {
    chart: {
      fontFamily: 'Pretendard, sans-serif',
      background: 'transparent',
    },
    labels: ['정상 가동', '대기', '주의', '장애', '정지'],
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'],
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { show: false },
    theme: { mode: 'light' as const },
    tooltip: { theme: 'dark' },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            total: {
              show: true,
              label: '가동률',
              color: '#64748b',
              fontSize: '11px',
              fontWeight: '600',
              formatter: () => '78.5%'
            },
            value: {
              fontSize: '20px',
              fontWeight: '800',
              color: '#0f172a',
              offsetY: -2,
              formatter: (val: string) => val === '78.5%' ? '78.5%' : val
            }
          }
        }
      }
    }
  };
  const donutSeries = [142, 18, 6, 3, 12];

  // 2. Telemetry trend (가동률 추세) area options
  const trendOptions = {
    chart: {
      id: 'trend-chart',
      toolbar: { show: false },
      fontFamily: 'Pretendard, sans-serif',
      background: 'transparent',
      sparkline: { enabled: false }
    },
    colors: ['#f97316'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' as const, width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.25,
        opacityTo: 0.01,
        stops: [0, 100]
      }
    },
    grid: {
      borderColor: 'rgba(148, 163, 184, 0.1)',
      strokeDashArray: 3
    },
    xaxis: {
      categories: ['00시', '03시', '06시', '09시', '12시', '15시', '18시', '21시', '23시'],
      labels: { style: { colors: '#94a3b8', fontSize: '10px' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 4,
      labels: { style: { colors: '#94a3b8', fontSize: '10px' } }
    },
    annotations: {
      yaxis: [{
        y: 90,
        borderColor: '#a8a29e',
        strokeDashArray: 4,
        label: {
          text: '목표 90%',
          style: {
            color: '#78716c',
            background: 'transparent',
            fontSize: '9px',
            fontWeight: 'bold'
          },
          offsetY: -8,
          offsetX: -10
        }
      }]
    },
    tooltip: { theme: 'dark' }
  };

  const trendSeries = [{
    name: '실가동률',
    data: [82, 80, 83, 85, 87, 85, 84, 82, 81]
  }];

  // 3. Energy consumption bar chart
  const energyOptions = {
    chart: {
      toolbar: { show: false },
      fontFamily: 'Pretendard, sans-serif',
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        columnWidth: '58%',
        borderRadius: 4,
        colors: {
          ranges: [
            { from: 0, to: 100, color: '#f97316' } // default color
          ]
        }
      }
    },
    colors: ['#f97316'],
    dataLabels: { enabled: false },
    grid: { show: false },
    xaxis: {
      categories: ['일', '월', '화', '수', '목', '금', '토', '일'],
      labels: { style: { colors: '#94a3b8', fontSize: '10px' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { show: false },
    tooltip: { theme: 'dark' }
  };

  // We customize colors directly in the data series for Saturday and Sunday
  const energySeries = [
    {
      name: '사용량',
      data: [
        { x: '일', y: 350, fillColor: '#ea580c' },
        { x: '월', y: 360, fillColor: '#ea580c' },
        { x: '화', y: 380, fillColor: '#ea580c' },
        { x: '수', y: 375, fillColor: '#ea580c' },
        { x: '목', y: 370, fillColor: '#ea580c' },
        { x: '금', y: 350, fillColor: '#ea580c' },
        { x: '토', y: 110, fillColor: '#0284c7' },
        { x: '일', y: 90, fillColor: '#0369a1' }
      ]
    }
  ];

  return (
    <div className="space-y-4 text-slate-850 dark:text-slate-100 min-h-screen p-1">
      {/* 1. TOP ROW: KPI WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: 전체 등록 자산 */}
        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-[#1f2430] rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-500">
                <Box className="w-4 h-4" />
              </div>
              <span className="text-[13px] font-black text-slate-650 dark:text-slate-300">전체 등록 자산</span>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-[48px] font-black font-mono tracking-tight text-slate-850 dark:text-white leading-none">181</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-extrabold">대</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20">
                ▲ +3
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">신규 3대 · 폐기 0</p>
          </div>
          <div className="w-24 h-12 flex items-center justify-end">
            <svg className="w-full h-full text-orange-500 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round">
              <path d={orangeSpark} />
            </svg>
          </div>
        </div>

        {/* KPI 2: 가동 중 설비 */}
        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-[#1f2430] rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-500">
                <Tv className="w-4 h-4" />
              </div>
              <span className="text-[13px] font-black text-slate-650 dark:text-slate-300">가동 중 설비</span>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-[48px] font-black font-mono tracking-tight text-slate-850 dark:text-white leading-none">142</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-extrabold">/ 181</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold text-slate-500 bg-slate-100 dark:bg-slate-800">
                78.5%
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">평균 가동률 87.5%</p>
          </div>
          <div className="w-24 h-12 flex items-center justify-end">
            <svg className="w-full h-full text-emerald-500 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round">
              <path d={greenSpark} />
            </svg>
          </div>
        </div>

        {/* KPI 3: 실시간 장애 */}
        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-[#1f2430] rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-red-500">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="text-[13px] font-black text-slate-650 dark:text-slate-300">실시간 장애</span>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-[48px] font-black font-mono tracking-tight text-red-650 dark:text-red-500 leading-none">3</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-extrabold">건</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-extrabold text-red-600 bg-red-50 dark:bg-red-950/20">
                ▼ +2건
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">평균 해결 32분</p>
          </div>
          <div className="w-24 h-12 flex items-center justify-end">
            <svg className="w-full h-full text-red-500 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round">
              <path d={redSpark} />
            </svg>
          </div>
        </div>

        {/* Mended KPI 4: 당월 예정 정비 */}
        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-[#1f2430] rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950/40 flex items-center justify-center text-sky-500">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-[13px] font-black text-slate-650 dark:text-slate-300">당월 예정 정비</span>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-[48px] font-black font-mono tracking-tight text-slate-850 dark:text-white leading-none">46</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-extrabold">건</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20">
                ▲ 진행 14건
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">완료율 92%</p>
          </div>
          <div className="w-24 h-12 flex items-center justify-end">
            <svg className="w-full h-full text-sky-500 stroke-current" fill="none" strokeWidth="2" strokeLinecap="round">
              <path d={blueSpark} />
            </svg>
          </div>
        </div>
      </div>
      {/* 2. SECOND ROW: 설비 가동 현황 & 실시간 알람 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: 설비 가동 현황 (8 cols equivalent / 60% width) */}
        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-[#1f2430] rounded-2xl p-5 shadow-sm lg:col-span-7 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1f2430] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-850 dark:text-white">설비 가동 현황</h3>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-extrabold">전체 181대</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>LIVE</span>
              </span>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg text-xs border border-slate-200 dark:border-[#1f2430] font-bold">
              <button className="px-3.5 py-1 rounded bg-white dark:bg-slate-800 text-slate-850 dark:text-white font-extrabold shadow-sm">
                요약
              </button>
              <button className="px-3.5 py-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-350">
                설비별
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Donut Chart */}
            <div className="w-48 h-48 flex-shrink-0 flex items-center justify-center relative">
              <Chart
                options={donutOptions}
                series={donutSeries}
                type="donut"
                width={200}
              />
            </div>

            {/* Legend List */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 gap-2.5 w-full">
              {[
                { label: '정상 가동', count: 142, pct: '78.5%', color: 'bg-emerald-500' },
                { label: '대기', count: 18, pct: '9.9%', color: 'bg-blue-500' },
                { label: '주의', count: 6, pct: '3.3%', color: 'bg-amber-500' },
                { label: '장애', count: 3, pct: '1.7%', color: 'bg-red-500' },
                { label: '정지', count: 12, pct: '6.6%', color: 'bg-slate-400' },
              ].map((leg) => (
                <div key={leg.label} className="flex items-center justify-between text-[13.5px] text-slate-650 dark:text-slate-300 font-extrabold px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${leg.color}`}></span>
                    <span>{leg.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-slate-850 dark:text-white font-black">{leg.count}</span>
                    <span className="w-12 text-right font-mono text-slate-400 dark:text-slate-500">{leg.pct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Availability & Performance cards */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100 dark:border-[#1f2430]">
            <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-[#1f2430] rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-xs text-slate-450 dark:text-slate-400 font-extrabold">가동률 Availability</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-[22px] font-black font-mono text-slate-850 dark:text-white leading-none">94.2%</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-[#1f2430] rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-xs text-slate-450 dark:text-slate-400 font-extrabold">성능 효율 Performance</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-[22px] font-black font-mono text-slate-850 dark:text-white leading-none">87.5%</span>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: 실시간 알람 (4 cols equivalent / 40% width) */}
        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-[#1f2430] rounded-2xl p-5 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1f2430] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-850 dark:text-white">실시간 알람</h3>
              <span className="text-sm font-extrabold text-slate-400 dark:text-slate-500">7건</span>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-[#1f2430] rounded-lg transition-colors">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span>필터</span>
            </button>
          </div>

          {/* Alarm Filters Tabs */}
          <div className="flex gap-1.5 bg-slate-50 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-[#1f2430] text-[12px] mb-3 font-bold">
            <button className="flex-1 py-1 rounded bg-white dark:bg-slate-800 text-slate-850 dark:text-white font-extrabold shadow-sm">
              전체 <span className="ml-1 text-slate-400">7</span>
            </button>
            <button className="flex-1 py-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span>장애 2</span>
            </button>
            <button className="flex-1 py-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>경고 3</span>
            </button>
            <button className="flex-1 py-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-700 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>정보 2</span>
            </button>
          </div>

          {/* Alarm Items List */}
          <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1">
            {[
              { id: 'a1', title: 'AHU-02 필터 치압 상승 (점검 권장)', details: '2층 입배형 · AHU-02 · 13:42:11', time: '40분', icon: AlertTriangle, iconColor: 'text-amber-500 bg-amber-500/10' },
              { id: 'a2', title: '전력 사용량 피크 임박 (95% 도달)', details: '동관 전체 · SW-MAIN · 13:30:00', time: '52분', icon: Zap, iconColor: 'text-purple-500 bg-purple-500/10' },
              { id: 'a3', title: 'CWP-2 베어링 진동값 상승 추세', details: 'B1 기계실 · CWP-02 · 12:55:17', time: '1시간', icon: AlertTriangle, iconColor: 'text-orange-500 bg-orange-500/10' },
              { id: 'a4', title: 'GEN-01 정기 시험 가동 완료', details: 'B1 발전실 · GEN-01 · 12:00:00', time: '2시간', icon: Check, iconColor: 'text-blue-500 bg-blue-500/10' },
              { id: 'a5', title: 'UPS-A 배터리 자가진단 정상', details: 'EE룸 · UPS-A · 11:00:00', time: '3시간', icon: Check, iconColor: 'text-blue-500 bg-blue-500/10' }
            ].map((alm) => {
              const IconComp = alm.icon;
              return (
                <div key={alm.id} className="flex gap-3.5 p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all cursor-pointer">
                  <div className={`w-9 h-9 rounded-lg ${alm.iconColor} flex items-center justify-center flex-shrink-0`}>
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-extrabold text-slate-850 dark:text-white truncate">{alm.title}</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-1">{alm.details}</p>
                  </div>

                  <span className="text-xs font-bold text-slate-450 dark:text-slate-500 whitespace-nowrap pl-2">{alm.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. THIRD ROW: 가동률 추세 & 오늘의 정비 작업 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: 가동률 추세 (60% width) */}
        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-[#1f2430] rounded-2xl p-5 shadow-sm lg:col-span-7 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1f2430] pb-3 mb-4">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black text-slate-850 dark:text-white">가동률 추세</h3>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-extrabold">실제 vs 목표</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Legends */}
              <div className="flex items-center gap-3 text-xs font-bold">
                <div className="flex items-center gap-1 text-orange-500">
                  <span className="w-3.5 h-0.5 bg-orange-500 rounded"></span>
                  <span>실가동률</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
                  <span className="w-3.5 h-0.5 border-t border-dashed border-slate-400 dark:border-slate-500"></span>
                  <span>목표 90%</span>
                </div>
              </div>

              {/* Time toggles */}
              <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg text-xs border border-slate-200 dark:border-[#1f2430] font-bold">
                <button className="px-3 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-850 dark:text-white font-extrabold shadow-sm">24h</button>
                <button className="px-3 py-0.5 rounded text-slate-400 hover:text-slate-650 dark:hover:text-slate-350">7d</button>
                <button className="px-3 py-0.5 rounded text-slate-400 hover:text-slate-650 dark:hover:text-slate-350">30d</button>
              </div>
            </div>
          </div>

          <div className="w-full h-56">
            <Chart
              options={trendOptions}
              series={trendSeries}
              type="area"
              height="100%"
              width="100%"
            />
          </div>
        </div>

        {/* Right: 오늘의 정비 작업 (40% width) */}
        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-[#1f2430] rounded-2xl p-5 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1f2430] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-850 dark:text-white">오늘의 정비 작업</h3>
              <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500">잔여 4건 · 지연 1</span>
            </div>

            <button className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 px-3.5 py-1.5 text-xs font-bold border border-slate-200 dark:border-[#1f2430] rounded-lg transition-colors">
              <Plus className="w-4 h-4 text-slate-400" />
              <span>지시</span>
            </button>
          </div>

          {/* Checklist Area */}
          <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-slate-50/40 dark:bg-slate-900/30 border border-slate-100 dark:border-[#1f2430] rounded-xl hover:border-slate-200 dark:hover:border-slate-850 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  {/* Custom Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5.5 h-5.5 rounded-md flex items-center justify-center border transition-all ${task.checked
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950'
                      }`}
                  >
                    {task.checked && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div>
                    <h4 className={`text-[14px] font-extrabold ${task.checked ? 'text-slate-400 line-through font-semibold' : 'text-slate-850 dark:text-white'}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">{task.assignee}</span>
                      <span className="text-[10px] text-slate-300 dark:text-slate-750 font-bold">•</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10.5px] font-bold border ${task.typeColor}`}>
                        {task.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="text-right">
                    <p className={`text-xs font-bold ${task.type === '긴급수리' && !task.checked ? 'text-red-500 font-extrabold' : 'text-slate-400 dark:text-slate-500'}`}>오늘</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">{task.time.split(' ')[1]}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 text-xs font-bold border border-slate-200 dark:border-[#1f2430] rounded-lg">
                    열기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. FOURTH ROW: 에너지 사용량 & 구역별 실시간 상태 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: 에너지 사용량 (40% equivalent width / 5 cols) */}
        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-[#1f2430] rounded-2xl p-5 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1f2430] pb-3 mb-4">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black text-slate-850 dark:text-white">에너지 사용량</h3>
              <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500">최근 7일</span>
            </div>

            <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg text-xs border border-slate-200 dark:border-[#1f2430] font-bold">
              <button className="px-3.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-850 dark:text-white font-extrabold shadow-sm">전력</button>
              <button className="px-3.5 py-0.5 rounded text-slate-500 dark:text-slate-400 hover:text-slate-700">용수</button>
              <button className="px-3.5 py-0.5 rounded text-slate-500 dark:text-slate-400 hover:text-slate-700">가스</button>
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[48px] font-black font-mono tracking-tight text-slate-850 dark:text-white leading-none">518</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-extrabold">㎾</span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-extrabold text-emerald-650 bg-emerald-50 dark:bg-emerald-950/20 ml-2">
                  ▼ 4.2% 전주 대비
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-450 dark:text-slate-500 font-extrabold">예측 마감 518㎾h</span>
          </div>

          <div className="w-full h-44 mt-3">
            <Chart
              options={energyOptions}
              series={energySeries}
              type="bar"
              height="100%"
              width="100%"
            />
          </div>
        </div>

        {/* Right: 구역별 실시간 상태 (60% equivalent width / 7 cols) */}
        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-[#1f2430] rounded-2xl p-5 shadow-sm lg:col-span-7 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1f2430] pb-3 mb-4">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-black text-slate-850 dark:text-white">구역별 실시간 상태</h3>
              <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500">12개 구역</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg text-xs border border-slate-200 dark:border-[#1f2430] font-bold">
                <button className="px-3 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-850 dark:text-white font-extrabold shadow-sm">온도</button>
                <button className="px-3 py-0.5 rounded text-slate-500 dark:text-slate-400 hover:text-slate-700">습도</button>
                <button className="px-3 py-0.5 rounded text-slate-500 dark:text-slate-400 hover:text-slate-700">전력</button>
                <button className="px-3 py-0.5 rounded text-slate-500 dark:text-slate-400 hover:text-slate-700">재실</button>
              </div>

              <button className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-655 dark:text-slate-300 px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-[#1f2430] rounded-lg">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>도면 보기</span>
              </button>
            </div>
          </div>

          {/* Grid of 12 Colored Tiles */}
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { id: 1, name: '1F 로비', val: '22.4', color: 'bg-[#10b981] text-white' },
              { id: 2, name: '1F 카페테리아', val: '23.1', color: 'bg-[#10b981] text-white' },
              { id: 3, name: '2F 임대 A', val: '24.8', color: 'bg-[#84a92c] text-white' },
              { id: 4, name: '2F 임대 B', val: '22.0', color: 'bg-[#0f766e] text-white' },
              { id: 5, name: '3F 사무동 A', val: '26.5', color: 'bg-[#b45309] text-white' },
              { id: 6, name: '3F 사무동 B', val: '23.8', color: 'bg-[#84a92c] text-white' },
              { id: 7, name: '4F 공용', val: '22.6', color: 'bg-[#10b981] text-white' },
              { id: 8, name: '4F 회의실', val: '21.8', color: 'bg-[#10b981] text-white' },
              { id: 9, name: '5F 데이터룸', val: '19.2', color: 'bg-[#0284c7] text-white' },
              { id: 10, name: '5F 통신실', val: '20.1', color: 'bg-[#0284c7] text-white' },
              { id: 11, name: 'B1 기계실', val: '25.4', color: 'bg-[#84a92c] text-white' },
              { id: 12, name: '옥상 냉각탑', val: '28.1', color: 'bg-[#ea580c] text-white' }
            ].map((tile) => (
              <div key={tile.id} className={`${tile.color} rounded-xl p-3 flex flex-col justify-between h-20 shadow-sm transition-all duration-200 hover:scale-[1.02] cursor-pointer`}>
                <span className="text-xs font-bold opacity-95">{tile.name}</span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-black font-mono">{tile.val}</span>
                  <span className="text-xs font-bold">°C</span>
                </div>
              </div>
            ))}
          </div>

          {/* Temperature Range Scale Bar */}
          <div className="flex items-center justify-between text-xs text-slate-450 dark:text-slate-500 font-bold mt-4 pt-3 border-t border-slate-100 dark:border-[#1f2430]">
            <span>낮음</span>
            {/* Color spectrum gradient bar */}
            <div className="flex-1 mx-3 h-1.5 rounded-full bg-gradient-to-r from-sky-500 via-emerald-500 via-lime-500 via-amber-500 to-orange-600"></div>
            <span>높음 <span className="ml-1.5 text-slate-500 dark:text-slate-400 font-mono font-bold">18 - 30 °C</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
