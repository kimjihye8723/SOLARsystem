'use client';

import React, { useState } from 'react';
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Wrench,
  Bookmark
} from 'lucide-react';

interface WorkOrder {
  id: string;
  title: string;
  facility: string;
  date: number; // day of month in May 2026
  status: 'completed' | 'pending' | 'delayed';
  inspector: string;
  type: '정기점검' | '예방보수' | '긴급정비';
}

const initialOrders: WorkOrder[] = [
  { id: 'wo-1', title: '1F 변전실 고압수배전반 절연 저항 측정', facility: '메인 수배전반 M-DB', date: 3, status: 'completed', inspector: '홍길동 대리', type: '정기점검' },
  { id: 'wo-2', title: 'B1F 공조기 AHU-01 필터 세척 및 교체', facility: '공조기 AHU-01', date: 8, status: 'completed', inspector: '박정민 주임', type: '예방보수' },
  { id: 'wo-3', title: 'B2F 급탕순환펌프 베어링 그리스 주입', facility: '급탕순환펌프 PMP-01', date: 15, status: 'completed', inspector: '박정민 주임', type: '예방보수' },
  { id: 'wo-4', title: 'RF 배기휀 EF-03 모터 베어링 과부하 점검', facility: '배기휀 EF-03', date: 20, status: 'delayed', inspector: '최윤서 사원', type: '긴급정비' },
  { id: 'wo-5', title: '비상발전기 GEN-01 무부하 시험 가동 및 연료 체크', facility: '비상 발전기 GEN-01', date: 24, status: 'pending', inspector: '홍길동 대리', type: '정기점검' },
  { id: 'wo-6', title: 'A동 전층 엘리베이터 로프 장력 및 도어 센서 정밀 검사', facility: '엘리베이터 EV-01', date: 28, status: 'pending', inspector: '최윤서 사원', type: '정기점검' }
];

export default function MaintenancePage() {
  const [orders, setOrders] = useState<WorkOrder[]>(initialOrders);
  const [selectedDay, setSelectedDay] = useState<number>(20); // default selected day is 20th
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form values
  const [formTitle, setFormTitle] = useState('');
  const [formFacility, setFormFacility] = useState('공조기 AHU-01');
  const [formDate, setFormDate] = useState(20);
  const [formInspector, setFormInspector] = useState('홍길동 대리');
  const [formType, setFormType] = useState<'정기점검' | '예방보수' | '긴급정비'>('정기점검');

  const daysInMonth = 31;
  const startOffset = 5; // May 1st 2026 starts on Friday (5 empty cells: Sun, Mon, Tue, Wed, Thu)
  
  const getOrdersForDay = (day: number) => {
    return orders.filter(o => o.date === day);
  };

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;

    const newWO: WorkOrder = {
      id: `wo-${orders.length + 1}`,
      title: formTitle,
      facility: formFacility,
      date: Number(formDate),
      status: 'pending',
      inspector: formInspector,
      type: formType
    };

    setOrders([...orders, newWO]);
    setIsAddModalOpen(false);
    setFormTitle('');
  };

  // Calendar rendering helper
  const calendarCells = [];
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-20 bg-slate-50/20 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800/40 opacity-40"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayOrders = getOrdersForDay(day);
    const isSelected = selectedDay === day;
    
    calendarCells.push(
      <div 
        key={`day-${day}`}
        onClick={() => handleDayClick(day)}
        className={`h-20 border border-slate-100 dark:border-slate-800/40 p-1.5 flex flex-col justify-between cursor-pointer transition-all duration-150 ${
          isSelected 
            ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/60 z-10 shadow-inner' 
            : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/20 bg-white dark:bg-slate-900/40'
        }`}
      >
        <span className={`text-xs font-semibold font-mono ${isSelected ? 'text-blue-500' : 'text-slate-500 dark:text-slate-400'}`}>
          {day}
        </span>
        <div className="flex flex-wrap gap-1 mt-1 overflow-hidden max-h-[36px]">
          {dayOrders.map((o) => {
            const colorClass = 
              o.status === 'completed' ? 'bg-emerald-500' : 
              o.status === 'delayed' ? 'bg-red-500' : 
              'bg-amber-500';
            return (
              <span 
                key={o.id}
                title={o.title}
                className={`w-2 h-2 rounded-full ${colorClass}`}
              ></span>
            );
          })}
        </div>
      </div>
    );
  }

  const selectedDayOrders = getOrdersForDay(selectedDay);

  return (
    <div className="space-y-6">
      {/* Top Title Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            정비 및 점검 일정 관리
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            주요 기계/전기 설비의 예방 보수 정비 이력 및 연간 오더 일정을 관리합니다.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 shadow-lg shadow-blue-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>점검 오더 등록</span>
        </button>
      </div>

      {/* Main Grid: Left Calendar, Right Work Orders List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Body */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-500" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                점검 일정표
              </h3>
            </div>
            
            {/* Month Controller (Mock) */}
            <div className="flex items-center gap-4">
              <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-bold text-slate-800 dark:text-white font-mono">2026년 5월</span>
              <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0.5 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
            {/* Days of week */}
            {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
              <div 
                key={d} 
                className={`py-2 text-center text-xs font-bold bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-800 ${
                  i === 0 ? 'text-red-400 dark:text-red-500/70' : i === 6 ? 'text-blue-400 dark:text-blue-500/70' : ''
                }`}
              >
                {d}
              </div>
            ))}
            {/* Calendar numbers */}
            {calendarCells}
          </div>
        </div>

        {/* Selected Day Work Orders List */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-4 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                점검 오더 현황
              </span>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                5월 {selectedDay}일 상세 작업 리스트
              </h3>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 min-h-0">
              {selectedDayOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500 space-y-3">
                  <Bookmark className="w-8 h-8 mx-auto stroke-[1.5]" />
                  <p className="text-xs">이날 등록된 점검 정비 작업이 없습니다.</p>
                </div>
              ) : (
                selectedDayOrders.map((wo) => {
                  const stateColors = {
                    completed: { bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: CheckCircle2, text: '완료' },
                    pending: { bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: Clock, text: '예정' },
                    delayed: { bg: 'bg-red-500/10 text-red-500 border-red-500/20', icon: AlertCircle, text: '지연' }
                  };
                  const StatusIcon = stateColors[wo.status].icon;

                  return (
                    <div 
                      key={wo.id}
                      className="border border-slate-200 dark:border-slate-850/60 p-4 rounded-xl space-y-3 bg-slate-50/50 dark:bg-slate-900/30"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          wo.type === '긴급정비' ? 'bg-red-500/10 text-red-500' :
                          wo.type === '예방보수' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-slate-500/10 text-slate-500'
                        }`}>
                          {wo.type}
                        </span>
                        
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border flex items-center gap-1 ${stateColors[wo.status].bg}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{stateColors[wo.status].text}</span>
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-snug">
                        {wo.title}
                      </h4>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <Wrench className="w-3.5 h-3.5" />
                          <span className="font-semibold text-slate-500 dark:text-slate-400">{wo.facility}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>{wo.inspector}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4">
            <button className="w-full text-center text-xs text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-semibold py-2">
              당월 작업 통계서 다운로드
            </button>
          </div>
        </div>
      </div>

      {/* Add Order Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">
              새 작업 오더 등록
            </h3>
            
            <form onSubmit={handleAddOrder} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-1.5">작업 제목</label>
                <input
                  type="text"
                  required
                  placeholder="예: 공조기 필터 보수 교체 작업"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-[#0b0d10] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-1.5">설비명</label>
                  <select
                    value={formFacility}
                    onChange={(e) => setFormFacility(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-[#0b0d10] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                  >
                    <option value="공조기 AHU-01">공조기 AHU-01</option>
                    <option value="급탕순환펌프 PMP-01">급탕순환펌프 PMP-01</option>
                    <option value="비상 발전기 GEN-01">비상 발전기 GEN-01</option>
                    <option value="배기휀 EF-03">배기휀 EF-03</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-1.5">작업구분</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-[#0b0d10] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                  >
                    <option value="정기점검">정기점검</option>
                    <option value="예방보수">예방보수</option>
                    <option value="긴급정비">긴급정비</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-1.5">날짜 (5월 중)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formDate}
                    onChange={(e) => setFormDate(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-[#0b0d10] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-1.5">점검 책임자</label>
                  <input
                    type="text"
                    required
                    value={formInspector}
                    onChange={(e) => setFormInspector(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-[#0b0d10] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 rounded-xl transition-colors shadow-md shadow-blue-500/10"
                >
                  오더 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
