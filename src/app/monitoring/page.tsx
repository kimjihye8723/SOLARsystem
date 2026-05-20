'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Activity, 
  Thermometer, 
  Wind, 
  Gauge, 
  AlertTriangle,
  RefreshCw,
  Cpu
} from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface SensorSpot {
  id: string;
  name: string;
  type: 'temp' | 'air' | 'pressure' | 'power';
  x: number;
  y: number;
  status: 'normal' | 'fault' | 'standby';
  value: string;
  history: number[];
}

const initialSpots: SensorSpot[] = [
  { id: 'spot-1', name: 'B1F 공조실 온도센서 TS-01', type: 'temp', x: 220, y: 180, status: 'normal', value: '21.8 °C', history: [22.1, 21.9, 21.8, 21.8, 22.0, 21.7, 21.8] },
  { id: 'spot-2', name: '공조설비 배기 팬 EF-03', type: 'air', x: 480, y: 80, status: 'fault', value: '0 RPM (경보)', history: [1200, 1180, 1190, 850, 0, 0, 0] },
  { id: 'spot-3', name: '급탕탱크 압력계 PS-02', type: 'pressure', x: 120, y: 320, status: 'standby', value: '4.8 bar', history: [4.1, 4.3, 4.5, 4.7, 4.8, 4.8, 4.8] },
  { id: 'spot-4', name: '메인 분전반 파워메터 PM-01', type: 'power', x: 620, y: 280, status: 'normal', value: '142 kW', history: [138, 140, 145, 141, 142, 143, 142] }
];

export default function MonitoringPage() {
  const [spots, setSpots] = useState<SensorSpot[]>(initialSpots);
  const [selectedSpot, setSelectedSpot] = useState<SensorSpot>(initialSpots[1]); // select the fault one by default
  const [realtimeData, setRealtimeData] = useState<number[]>(selectedSpot.history);

  // Auto-update values mock
  useEffect(() => {
    const interval = setInterval(() => {
      setSpots(prev => 
        prev.map(spot => {
          if (spot.status === 'fault') return spot; // keep fault stopped
          
          let newVal = parseFloat(spot.value);
          let change = (Math.random() - 0.5) * 0.4;
          let finalVal = '';
          
          if (spot.type === 'temp') {
            newVal = parseFloat((newVal + change).toFixed(1));
            finalVal = `${newVal} °C`;
          } else if (spot.type === 'pressure') {
            newVal = parseFloat((newVal + (Math.random() - 0.5) * 0.1).toFixed(2));
            finalVal = `${newVal} bar`;
          } else if (spot.type === 'power') {
            newVal = Math.round(newVal + (Math.random() - 0.5) * 6);
            finalVal = `${newVal} kW`;
          }
          
          const newHistory = [...spot.history.slice(1), newVal];
          
          return {
            ...spot,
            value: finalVal || spot.value,
            history: newHistory
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update selected spot chart data when selection changes or is updated
  useEffect(() => {
    const updated = spots.find(s => s.id === selectedSpot.id);
    if (updated) {
      setRealtimeData(updated.history);
    }
  }, [spots, selectedSpot.id]);

  const handleSelectSpot = (spot: SensorSpot) => {
    setSelectedSpot(spot);
    setRealtimeData(spot.history);
  };

  // Chart configuration
  const chartOptions = {
    chart: {
      id: 'realtime-sensor',
      toolbar: { show: false },
      fontFamily: 'Pretendard, sans-serif',
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'linear' as const,
        dynamicAnimation: { speed: 500 }
      }
    },
    colors: [selectedSpot.status === 'fault' ? '#ef4444' : selectedSpot.status === 'standby' ? '#f5a623' : '#10b981'],
    stroke: { curve: 'smooth' as const, width: 3 },
    xaxis: {
      categories: ['10분 전', '8분 전', '6분 전', '4분 전', '2분 전', '1분 전', '현재'],
      labels: { style: { colors: '#9ca3af' } }
    },
    yaxis: {
      labels: { style: { colors: '#9ca3af' } }
    },
    grid: { borderColor: 'rgba(156, 163, 175, 0.1)' },
    theme: { mode: 'dark' as const },
    tooltip: { theme: 'dark' }
  };

  const chartSeries = [
    {
      name: '센서 수치',
      data: realtimeData
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            실시간 설비 모니터링 (IoT 뷰포트)
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            건물 지하 1층 기계 및 전력 전원 배치 평면도와 IoT 센서 연동 맵입니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 dark:text-slate-500">실시간 데이터 갱신 중...</span>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
          </button>
        </div>
      </div>

      {/* Main content Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Floorplan Drawing Area */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-8 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              B1F 공조 및 기계설비 평면도
            </h3>
            <span className="text-xs bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-1 rounded">
              A동 지하1층 평면도.dwg
            </span>
          </div>

          {/* SVG Floorplan with interactive hotspots */}
          <div className="relative w-full aspect-[4/2.5] bg-slate-100 dark:bg-[#0b0d10]/60 rounded-xl border border-slate-200 dark:border-slate-850 flex items-center justify-center p-4">
            <svg 
              viewBox="0 0 800 400" 
              className="w-full h-full text-slate-300 dark:text-slate-800"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer walls */}
              <rect x="50" y="30" width="700" height="340" rx="12" fill="none" stroke="currentColor" strokeWidth="3" />
              
              {/* Room partitions */}
              <line x1="280" y1="30" x2="280" y2="370" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
              <line x1="560" y1="30" x2="560" y2="370" stroke="currentColor" strokeWidth="2" strokeDasharray="4" />
              <line x1="50" y1="220" x2="280" y2="220" stroke="currentColor" strokeWidth="2" />
              <line x1="560" y1="200" x2="750" y2="200" stroke="currentColor" strokeWidth="2" />
              
              {/* Room Text Labels */}
              <text x="160" y="110" textAnchor="middle" fill="#6b7280" className="text-xs font-semibold select-none">공조기기 및 환기실</text>
              <text x="160" y="300" textAnchor="middle" fill="#6b7280" className="text-xs font-semibold select-none">급탕/급수 펌프실</text>
              <text x="420" y="200" textAnchor="middle" fill="#6b7280" className="text-xs font-semibold select-none">메인 수배전 제어실</text>
              <text x="650" y="110" textAnchor="middle" fill="#6b7280" className="text-xs font-semibold select-none">통합 보안 센터</text>
              <text x="650" y="300" textAnchor="middle" fill="#6b7280" className="text-xs font-semibold select-none">정비 장비 창고</text>

              {/* Draw Doorways */}
              <rect x="278" y="100" width="4" height="30" fill="#3b82f6" />
              <rect x="278" y="280" width="4" height="30" fill="#3b82f6" />
              <rect x="558" y="150" width="4" height="30" fill="#3b82f6" />

              {/* Sensor Hotspot dots rendering */}
              {spots.map((spot) => {
                const colorMap = {
                  normal: 'text-emerald-500',
                  standby: 'text-amber-500',
                  fault: 'text-red-500'
                };
                const bgMap = {
                  normal: 'bg-emerald-500',
                  standby: 'bg-amber-500',
                  fault: 'bg-red-500'
                };
                const isSelected = selectedSpot.id === spot.id;

                return (
                  <g 
                    key={spot.id} 
                    transform={`translate(${spot.x}, ${spot.y})`}
                    className="cursor-pointer group"
                    onClick={() => handleSelectSpot(spot)}
                  >
                    {/* Pulsing ring animation for alerts or selection */}
                    {(spot.status === 'fault' || isSelected) && (
                      <circle 
                        r="20" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        className={`animate-ping opacity-60 ${colorMap[spot.status]}`}
                      />
                    )}
                    {/* Hotspot background glow */}
                    <circle 
                      r="12" 
                      fill="currentColor" 
                      className={`opacity-20 group-hover:opacity-30 transition-opacity ${colorMap[spot.status]}`} 
                    />
                    {/* Core Point Dot */}
                    <circle 
                      r="6" 
                      fill="currentColor" 
                      className={`transition-all duration-300 ${colorMap[spot.status]} ${isSelected ? 'scale-125' : ''}`}
                    />
                    {/* Tooltip Hover Tag (Custom SVG text box) */}
                    <rect 
                      x="-50" 
                      y="-35" 
                      width="100" 
                      height="20" 
                      rx="4" 
                      fill="#1f2937" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" 
                    />
                    <text 
                      x="0" 
                      y="-21" 
                      textAnchor="middle" 
                      fill="#ffffff" 
                      fontSize="9" 
                      fontWeight="bold"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none font-mono"
                    >
                      {spot.value}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Sensor Data Detailed Feed Card */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-4 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                실시간 센서 텔레메트리
              </span>
              <h3 className="text-base font-bold text-slate-800 dark:text-white leading-snug">
                {selectedSpot.name}
              </h3>
            </div>

            {/* Sensor Live Stat Display */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">현재 측정 감지값</p>
                <p className="text-2xl font-bold font-mono tracking-tight mt-1 text-slate-800 dark:text-white">
                  {selectedSpot.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedSpot.type === 'temp' ? 'bg-blue-500/10 text-blue-500' :
                selectedSpot.type === 'air' ? 'bg-violet-500/10 text-violet-500' :
                selectedSpot.type === 'pressure' ? 'bg-amber-500/10 text-amber-500' :
                'bg-emerald-500/10 text-emerald-500'
              }`}>
                {selectedSpot.type === 'temp' && <Thermometer className="w-6 h-6" />}
                {selectedSpot.type === 'air' && <Wind className="w-6 h-6" />}
                {selectedSpot.type === 'pressure' && <Gauge className="w-6 h-6" />}
                {selectedSpot.type === 'power' && <Activity className="w-6 h-6" />}
              </div>
            </div>

            {/* Alarm block for warning states */}
            {selectedSpot.status !== 'normal' && (
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                selectedSpot.status === 'fault' 
                  ? 'bg-red-500/5 text-red-600 border-red-500/20' 
                  : 'bg-amber-500/5 text-amber-600 border-amber-500/20'
              }`}>
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold">설비 기기 동작 이상 발생</p>
                  <p className="opacity-80 mt-1 leading-relaxed">
                    {selectedSpot.status === 'fault' 
                      ? '과부하 보호 릴레이가 트립되었습니다. 현장 점검자 확인 및 정비 작업이 즉각 요구됩니다.'
                      : '운영 허용 상한 압력 한계선에 근접하였습니다. 예비 점검을 권장합니다.'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Live Chart Line Section */}
            <div className="space-y-2">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold block">센서 텔레메트리 10분 변동 추이</span>
              <div className="w-full h-44 bg-slate-100/40 dark:bg-[#0b0d10]/20 rounded-xl p-2">
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type="line"
                  height="100%"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button className="w-full flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-2.5 rounded-xl text-xs font-semibold transition-colors duration-200 shadow-md shadow-blue-500/10">
              <Cpu className="w-4 h-4" />
              <span>원격 명령 제어 신호 송신</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
