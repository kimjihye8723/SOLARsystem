'use client';

import React from 'react';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageSquare, 
  Phone, 
  ChevronRight 
} from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Top Header */}
      <div className="text-center space-y-3 py-6">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto shadow-sm">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
          도움말 및 지원 센터
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          리앤FMS 시스템 사용법과 기술 지원에 관한 질문을 검색해 보세요.
        </p>

        {/* Search Box */}
        <div className="relative max-w-lg mx-auto pt-4">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-7" />
          <input
            type="text"
            placeholder="자주 묻는 질문, 설비 장애 매뉴얼 검색"
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-[#0b0d10] border border-slate-200 dark:border-slate-850 rounded-2xl focus:outline-none focus:border-slate-400/50 shadow-sm text-slate-850 dark:text-white text-sm"
          />
        </div>
      </div>

      {/* Main Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <BookOpen className="w-6 h-6 text-blue-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">시스템 가이드</h3>
          <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
            게이트웨이 연동, 권한 관리 및 통계 보고서 생성법을 확인합니다.
          </p>
          <button className="flex items-center gap-1 text-xs text-blue-500 font-semibold hover:underline pt-2">
            <span>바로가기</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <MessageSquare className="w-6 h-6 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">장애 대응 매뉴얼</h3>
          <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
            전력 피크, 소방 감지기 오류, HVAC 고장 시 비상 가이드를 제공합니다.
          </p>
          <button className="flex items-center gap-1 text-xs text-emerald-500 font-semibold hover:underline pt-2">
            <span>다운로드</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <Phone className="w-6 h-6 text-purple-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">기술 지원 문의</h3>
          <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
            24시간 운영되는 리앤FMS 엔지니어링 지원 센터에 직접 문의합니다.
          </p>
          <button className="flex items-center gap-1 text-xs text-purple-500 font-semibold hover:underline pt-2">
            <span>전화 연결</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* FAQ Accordion list */}
      <div className="bg-white dark:bg-[#191c1f] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">자주 묻는 질문 (FAQ)</h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-900">
          {[
            { q: 'IoT 게이트웨이가 오프라인일 때 대응 방법은 어떻게 되나요?', a: '먼저 메인 통신 허브의 전원 및 모뎀 LAN 링크 상태를 파악하세요. 이후 설정 페이지에서 "동기화 재시작"을 눌러 게이트웨이 핸드셰이크 세션을 초기화할 수 있습니다.' },
            { q: '새로운 현장 안전 점검 일정을 생성하고 작업자를 할당하려면?', a: '"정비·점검" 탭에서 우측 상단의 "점검 등록"을 눌러 세부 일정을 저장한 후 담당 주임/사원을 배치하여 작업 지시서를 출력할 수 있습니다.' },
            { q: '경보 알람 알림을 카카오톡이나 SMS로 전송할 수 있나요?', a: '네, "환경설정" 페이지의 알림 설정 탭에서 관리 등급이 "CRITICAL"인 알람에 대해 실시간 문자 비상 송출 활성화가 가능합니다.' }
          ].map((item, idx) => (
            <div key={idx} className="py-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="text-orange-500 font-mono">Q.</span>
                <span>{item.q}</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-5 leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
