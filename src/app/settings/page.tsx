'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  ShieldCheck, 
  BellRing, 
  Save, 
  Plus, 
  UserPlus, 
  Key, 
  AlertCircle 
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  role: 'super' | 'operator' | 'viewer';
  email: string;
  lastLogin: string;
}

export default function SettingsPage() {
  const [syncInterval, setSyncInterval] = useState('5');
  const [tempUpperLimit, setTempUpperLimit] = useState('28');
  const [tempLowerLimit, setTempLowerLimit] = useState('16');
  const [pressUpperLimit, setPressUpperLimit] = useState('6.5');
  
  // Notification toggles
  const [smsNotify, setSmsNotify] = useState(true);
  const [emailNotify, setEmailNotify] = useState(false);
  const [webhookNotify, setWebhookNotify] = useState(true);

  // Success message state
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Admin users list
  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: '1', name: '김지혜 관리자', role: 'super', email: 'jihye.kim@fms-hq.com', lastLogin: '방금 전' },
    { id: '2', name: '홍길동 대리', role: 'operator', email: 'gildong.hong@fms-hq.com', lastLogin: '3시간 전' },
    { id: '3', name: '박정민 주임', role: 'operator', email: 'jungmin.park@fms-hq.com', lastLogin: '어제' },
    { id: '4', name: '최윤서 사원', role: 'viewer', email: 'yunseo.choi@fms-hq.com', lastLogin: '3일 전' }
  ]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getRoleLabel = (role: AdminUser['role']) => {
    const roles = {
      super: { label: '최고 관리자', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
      operator: { label: '현장 관제사', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
      viewer: { label: '모니터링 관람자', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20' }
    };
    return (
      <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${roles[role].color}`}>
        {roles[role].label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            시스템 통합 설정
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            IoT 게이트웨이 동기화 주기 설정, 설비 임계값 경보 기준선 및 계정 권한 관리를 제어합니다.
          </p>
        </div>
      </div>

      {/* Grid: Left Configurations Form, Right User Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Settings Config Panel */}
        <form onSubmit={handleSaveSettings} className="glass-card rounded-2xl p-6 lg:col-span-7 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Save indicator alert */}
            {saveSuccess && (
              <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs flex items-center gap-2 font-bold animate-fadeIn">
                <ShieldCheck className="w-4 h-4" />
                <span>시스템 동기화 임계치 설정이 즉각 반영 및 저장되었습니다.</span>
              </div>
            )}

            {/* Section 1: IoT syncing */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <Database className="w-4.5 h-4.5 text-blue-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">IoT 데이터 동기화</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 dark:text-slate-500 font-semibold block mb-1.5">서버 동기화 빈도 주기</label>
                  <select 
                    value={syncInterval} 
                    onChange={(e) => setSyncInterval(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                  >
                    <option value="1">1초 (실시간 고성능)</option>
                    <option value="3">3초 (표준 권장)</option>
                    <option value="5">5초 (서버 부하 감소)</option>
                    <option value="10">10초 (저대역 대기모드)</option>
                  </select>
                </div>
                <div className="flex items-center text-xs text-slate-400 pt-6 leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mr-1.5" />
                  <span>실시간 차트 및 상태 갱신 주기를 제어합니다.</span>
                </div>
              </div>
            </div>

            {/* Section 2: Sensor Limits */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <Settings className="w-4.5 h-4.5 text-blue-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">환경 센서 이상 감지 기준선</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 dark:text-slate-500 font-semibold block mb-1.5">온도 상한 임계치 (°C)</label>
                  <input
                    type="number"
                    value={tempUpperLimit}
                    onChange={(e) => setTempUpperLimit(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 dark:text-slate-500 font-semibold block mb-1.5">온도 하한 임계치 (°C)</label>
                  <input
                    type="number"
                    value={tempLowerLimit}
                    onChange={(e) => setTempLowerLimit(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 dark:text-slate-500 font-semibold block mb-1.5">배관 압력 상한 안전 기준 (bar)</label>
                <input
                  type="number"
                  step="0.1"
                  value={pressUpperLimit}
                  onChange={(e) => setPressUpperLimit(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            {/* Section 3: Notification Toggles */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <BellRing className="w-4.5 h-4.5 text-blue-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">경보 알림 전송 채널</h3>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer select-none">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">긴급 SMS 문자 전송 활성화</span>
                  <input
                    type="checkbox"
                    checked={smsNotify}
                    onChange={(e) => setSmsNotify(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer select-none">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">일일 종합 이력 리포트 이메일 전송</span>
                  <input
                    type="checkbox"
                    checked={emailNotify}
                    onChange={(e) => setEmailNotify(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 cursor-pointer select-none">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Slack/Microsoft Teams 웹훅 연동</span>
                  <input
                    type="checkbox"
                    checked={webhookNotify}
                    onChange={(e) => setWebhookNotify(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800/60 mt-6">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/10"
            >
              <Save className="w-4 h-4" />
              <span>설정값 통합 저장 및 동기화</span>
            </button>
          </div>
        </form>

        {/* User Management Panel */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-5 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/60 flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-blue-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">관제 권한 계정 관리</h3>
              </div>
              <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-blue-500 transition-colors">
                <UserPlus className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Accounts list */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
              {admins.map((adm) => (
                <div 
                  key={adm.id}
                  className="border border-slate-200 dark:border-slate-850/60 p-4 rounded-xl space-y-2 bg-slate-50/40 dark:bg-slate-900/30 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{adm.name}</span>
                    {getRoleLabel(adm.role)}
                  </div>
                  
                  <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500">{adm.email}</p>
                  
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Key className="w-3 h-3" />
                      <span>최종 로그인: {adm.lastLogin}</span>
                    </span>
                    <button className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-semibold">
                      권한 수정
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-4 flex-shrink-0">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed">
              *최고 관리자(super) 권한만 임계값 변경 및 계정 생성/제거 권한을 실행할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
