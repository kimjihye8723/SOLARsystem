'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  BarChart2, 
  Calendar, 
  Download, 
  Filter, 
  TrendingUp, 
  Zap, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('2028.05');

  // Chart 1: Monthly energy consumption trend
  const energyOptions = {
    chart: {
      toolbar: { show: false },
      fontFamily: 'Pretendard, sans-serif',
      background: 'transparent'
    },
    colors: ['#f97316', '#0ea5e9'],
    stroke: { curve: 'smooth' as const, width: 3 },
    xaxis: {
      categories: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      labels: { style: { colors: '#94a3b8', fontSize: '10px' } }
    },
    yaxis: {
      labels: { style: { colors: '#94a3b8', fontSize: '10px' } }
    },
    grid: { borderColor: 'rgba(148, 163, 184, 0.1)', strokeDashArray: 3 },
    tooltip: { theme: 'dark' }
  };

  const energySeries = [
    { name: '금년 전력 (MWh)', data: [45, 42, 48, 51, 55, 62, 70, 72, 65, 52, 46, 44] },
    { name: '전년 전력 (MWh)', data: [47, 43, 45, 49, 53, 58, 68, 70, 61, 50, 44, 43] }
  ];

  // Chart 2: Failure type analysis
  const failureOptions = {
    chart: {
      toolbar: { show: false },
      fontFamily: 'Pretendard, sans-serif',
      background: 'transparent'
    },
    labels: ['공조 (HVAC)', '전력/전기', '급수/소방', '승강기', '조명/기타'],
    colors: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#6b7280'],
    legend: { position: 'bottom' as const, labels: { colors: '#94a3b8' } },
    theme: { mode: 'light' as const },
    tooltip: { theme: 'dark' }
  };

  const failureSeries = [35, 25, 20, 12, 8];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            통계 및 운영 리포트
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            주요 설비 가동 효율 및 에너지 소비 현황에 대한 누적 통계 분석입니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>2028년 5월</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/10 transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span>PDF 다운로드</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">누적 에너지 절감량</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-slate-850 dark:text-white">12,450</span>
            <span className="text-xs text-slate-400 font-semibold">kWh</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>전월 대비 5.8% 추가 절감</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">평균 복구 시간 (MTTR)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-slate-850 dark:text-white">28</span>
            <span className="text-xs text-slate-400 font-semibold">분</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold mt-2">
            <Clock className="w-3.5 h-3.5" />
            <span>전 분기 대비 12% 단축</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">설비 가동 효율지수</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-slate-850 dark:text-white">96.8</span>
            <span className="text-xs text-slate-400 font-semibold">%</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>최적화 조치로 1.2% 향상</span>
          </div>
        </div>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Energy Trend */}
        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:col-span-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">월별 전력 소비량 트렌드</h3>
              <p className="text-xs text-slate-400">금년과 전년 동기간 대비 비교 누적 전력량</p>
            </div>
          </div>
          <div className="w-full h-80">
            <Chart
              options={energyOptions}
              series={energySeries}
              type="line"
              height="100%"
              width="100%"
            />
          </div>
        </div>

        {/* Failure Breakdown */}
        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:col-span-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">설비 고장 유형 통계</h3>
            <p className="text-xs text-slate-400 mb-6">누적 발생 건수 기준 분배율</p>
          </div>
          <div className="w-full flex justify-center py-4">
            <Chart
              options={failureOptions}
              series={failureSeries}
              type="donut"
              width={260}
            />
          </div>
          <div className="text-[11px] text-center text-slate-400 bg-slate-50 dark:bg-slate-900 py-2 rounded-xl mt-4 border border-slate-100 dark:border-slate-900">
            공조(HVAC) 설비의 정기 모터 교체가 시급합니다.
          </div>
        </div>
      </div>
    </div>
  );
}
