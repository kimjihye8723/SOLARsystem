'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Eye,
  AlertOctagon,
  RefreshCcw,
  SlidersHorizontal
} from 'lucide-react';

interface AlarmEvent {
  id: string;
  facility: string;
  code: string;
  message: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'acknowledged' | 'resolved';
}

const initialAlarms: AlarmEvent[] = [
  { id: 'ALM-101', facility: 'B1 공조설비 AHU-03', code: 'HVAC-ERR-005', message: '송풍기 기동 실패 (모터 제어 반넬 과전류 트립)', timestamp: '2026-05-20 15:32:12', severity: 'critical', status: 'active' },
  { id: 'ALM-102', facility: '3F 급탕펌프 PMP-02', code: 'PMP-WARN-012', message: '급탕 토출 배관 압력 한계치 임계값 초과 (4.8 bar)', timestamp: '2026-05-20 15:20:45', severity: 'warning', status: 'active' },
  { id: 'ALM-103', facility: '메인 수배전반 LBS-01', code: 'ELE-ERR-002', message: '정전 신호 입력 감지 및 보호계전기 동작', timestamp: '2026-05-20 14:42:01', severity: 'critical', status: 'acknowledged' },
  { id: 'ALM-104', facility: '2F 엘리베이터 EV-01', code: 'LIFT-INFO-001', message: '엘리베이터 카 도어 센서 통신 노이즈 발생', timestamp: '2026-05-20 13:10:00', severity: 'info', status: 'active' },
  { id: 'ALM-105', facility: 'B2 기계실 집수조 펌프 PMP-03', code: 'PMP-ERR-024', message: '집수조 수위 고수위 한계 센서 접점 작동', timestamp: '2026-05-20 11:22:15', severity: 'critical', status: 'resolved' },
  { id: 'ALM-106', facility: 'RF 실외기실 AC-04', code: 'HVAC-WARN-008', message: '냉매 압력 강하 감지 및 압축기 운전 제한 발생', timestamp: '2026-05-20 09:15:32', severity: 'warning', status: 'resolved' }
];

export default function AlarmsPage() {
  const [alarms, setAlarms] = useState<AlarmEvent[]>(initialAlarms);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleAcknowledge = (id: string) => {
    setAlarms(prev => 
      prev.map(a => a.id === id ? { ...a, status: 'acknowledged' } : a)
    );
  };

  const handleResolve = (id: string) => {
    setAlarms(prev => 
      prev.map(a => a.id === id ? { ...a, status: 'resolved' } : a)
    );
  };

  const filteredAlarms = alarms.filter(alarm => {
    const matchesSearch = alarm.facility.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          alarm.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alarm.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' ? true : alarm.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' ? true : alarm.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityBadge = (sev: AlarmEvent['severity']) => {
    const map = {
      critical: { bg: 'bg-red-500/10 text-red-500 border-red-500/20', icon: ShieldAlert, text: 'CRITICAL' },
      warning: { bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: AlertTriangle, text: 'WARNING' },
      info: { bg: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Info, text: 'INFO' }
    };
    const TargetIcon = map[sev].icon;
    return (
      <span className={`px-2 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 w-fit ${map[sev].bg}`}>
        <TargetIcon className="w-3.5 h-3.5" />
        <span>{map[sev].text}</span>
      </span>
    );
  };

  const getStatusBadge = (status: AlarmEvent['status']) => {
    const map = {
      active: { bg: 'bg-red-500/10 text-red-500 border-red-500/30 font-bold', text: '경보 발생' },
      acknowledged: { bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20', text: '인지 완료' },
      resolved: { bg: 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700', text: '조치 완료' }
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs border ${map[status].bg}`}>
        {map[status].text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            알람 및 이벤트 이력 조회
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            FMS 시스템 내에 설치된 IoT 센서 및 자산 기종으로부터 전송된 경보 로그 리스트입니다.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setAlarms(initialAlarms)} 
            className="flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>경보 초기화</span>
          </button>
        </div>
      </div>

      {/* Filter Options Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="자명, 에러코드, 경보메시지 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500/50"
          />
        </div>

        {/* Multi-Filters Grid */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Severity */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">등급:</span>
            <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800/80 text-xs">
              {['all', 'critical', 'warning', 'info'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    severityFilter === sev 
                      ? 'bg-white dark:bg-slate-850 shadow-sm text-blue-500 font-bold' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {sev === 'all' ? '전체' : sev.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">상태:</span>
            <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800/80 text-xs">
              {['all', 'active', 'acknowledged', 'resolved'].map((stat) => (
                <button
                  key={stat}
                  onClick={() => setStatusFilter(stat)}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    statusFilter === stat
                      ? 'bg-white dark:bg-slate-850 shadow-sm text-blue-500 font-bold' 
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {stat === 'all' ? '전체' : stat === 'active' ? '미해결' : stat === 'acknowledged' ? '인지' : '조치'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Alarms List Table */}
      <div className="glass-card rounded-2xl p-5 shadow-sm overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            이벤트 리스트 ({filteredAlarms.length}건)
          </h3>
        </div>

        <div className="overflow-x-auto border border-slate-100 dark:border-slate-800/60 rounded-xl">
          <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800/50">
            <thead className="bg-slate-50/80 dark:bg-slate-900/80">
              <tr className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="p-3 pl-4">이벤트 ID</th>
                <th className="p-3">발생 기기자산</th>
                <th className="p-3">알람 메시지</th>
                <th className="p-3">발생 일시</th>
                <th className="p-3">등급</th>
                <th className="p-3">조치상태</th>
                <th className="p-3 pr-4 text-right">관제</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm text-slate-700 dark:text-slate-300">
              {filteredAlarms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400 dark:text-slate-500 font-semibold">
                    조건에 일치하는 경보 알람 내역이 존재하지 않습니다.
                  </td>
                </tr>
              ) : (
                filteredAlarms.map((alarm) => (
                  <tr key={alarm.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-xs text-slate-500 dark:text-slate-400">
                      {alarm.id}
                    </td>
                    <td className="p-3 font-semibold text-slate-850 dark:text-slate-100">
                      {alarm.facility}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 leading-snug">
                      <span className="font-mono text-xs text-slate-400 dark:text-slate-500 mr-2">[{alarm.code}]</span>
                      {alarm.message}
                    </td>
                    <td className="p-3 text-xs text-slate-400 font-mono">
                      {alarm.timestamp}
                    </td>
                    <td className="p-3">
                      {getSeverityBadge(alarm.severity)}
                    </td>
                    <td className="p-3">
                      {getStatusBadge(alarm.status)}
                    </td>
                    <td className="p-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {alarm.status === 'active' && (
                          <button 
                            onClick={() => handleAcknowledge(alarm.id)}
                            className="text-xs bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white px-2.5 py-1 rounded transition-colors duration-150 font-semibold border border-amber-500/20"
                          >
                            인지함
                          </button>
                        )}
                        {alarm.status !== 'resolved' && (
                          <button 
                            onClick={() => handleResolve(alarm.id)}
                            className="text-xs bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white px-2.5 py-1 rounded transition-colors duration-150 font-semibold border border-emerald-500/20"
                          >
                            해결완료
                          </button>
                        )}
                        {alarm.status === 'resolved' && (
                          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
