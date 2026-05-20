'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Grid,
  Box,
  Tv,
  Wrench,
  Bell,
  BarChart2,
  HelpCircle,
  Settings
} from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
}

const mainMenuItems: MenuItem[] = [
  { name: '대시보드', href: '/dashboard', icon: Grid },
  { name: '자산·설비 관리', href: '/assets', icon: Box },
  { name: '실시간 모니터링', href: '/monitoring', icon: Tv },
  { name: '정비·점검', href: '/maintenance', icon: Wrench },
  { name: '알람·이벤트', href: '/alarms', icon: Bell, badge: '2' },
  { name: '통계·리포트', href: '/reports', icon: BarChart2 },
];

const bottomMenuItems: MenuItem[] = [
  { name: '도움말', href: '/help', icon: HelpCircle },
  { name: '환경설정', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

    return (
      <Link
        key={item.name}
        href={item.href}
        className={`group flex items-center justify-between px-3.5 py-3.5 text-[15.5px] rounded-xl transition-all duration-200 ${isActive
            ? 'bg-orange-500/10 text-orange-650 dark:text-orange-400 shadow-sm border-l-4 border-orange-500 pl-3'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'
          }`}
      >
        <div className="flex items-center">
          <Icon
            className={`mr-3.5 h-5.5 w-5.5 flex-shrink-0 transition-colors duration-200 ${isActive
                ? 'text-orange-500'
                : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400'
              }`}
            aria-hidden="true"
          />
          <span>{item.name}</span>
        </div>
        {item.badge && (
          <span className="w-5.5 h-5.5 rounded-full bg-red-650 text-white flex items-center justify-center text-xs font-extrabold">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="w-60 h-screen border-r border-slate-200 dark:border-[#1f2430] bg-white dark:bg-[#131518] flex flex-col justify-between transition-colors duration-300">
      <div className="flex-1 flex flex-col pt-4 pb-4 overflow-y-auto">
        {/* LOGO (Orange Square + Text) */}
        <div className="flex items-center flex-shrink-0 px-6 mb-6 gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20">
            <span className="text-white font-extrabold text-sm font-sans tracking-tighter">리</span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-extrabold text-sm leading-none text-slate-800 dark:text-white tracking-tight">
              리앤FMS
            </h1>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
              스마트빌딩 관리
            </span>
          </div>
        </div>

        {/* Separator line */}
        <div className="px-4 mb-4">
          <div className="h-px bg-slate-100 dark:bg-[#1f2430]"></div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 space-y-6">
          <div>
            <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-4 block mb-2">
              메뉴
            </span>
            <nav className="space-y-1.5">
              {mainMenuItems.map(renderMenuItem)}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Menu Items */}
      <div className="px-3 pb-6 border-t border-slate-100 dark:border-[#1f2430] pt-4 space-y-1.5">
        {bottomMenuItems.map(renderMenuItem)}
      </div>
    </aside>
  );
}
