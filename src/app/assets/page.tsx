'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  ChevronRight, 
  Folder, 
  FolderOpen, 
  Search, 
  Sliders, 
  Cpu, 
  Zap, 
  Activity, 
  Trash2, 
  Edit3,
  Calendar,
  User,
  Info
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  code: string;
  category: string;
  status: 'normal' | 'standby' | 'stop' | 'fault';
  location: string;
  installDate: string;
  inspector: string;
  spec: string;
}

const initialAssets: Asset[] = [
  { id: '1', name: '공조기 AHU-01', code: 'HVAC-AHU-01', category: '공조 설비', status: 'normal', location: 'B1F 공조실', installDate: '2023-04-12', inspector: '박정민 주임', spec: '풍량 15,000 CMH / 정압 50 mmAq' },
  { id: '2', name: '급탕순환펌프 PMP-01', code: 'PMP-HW-01', category: '위생 배관 설비', status: 'normal', location: 'B2F 기계실', installDate: '2022-09-18', inspector: '홍길동 대리', spec: '유량 300 LPM / 양정 45 m / 7.5 kW' },
  { id: '3', name: '비상 발전기 GEN-01', code: 'ELE-GEN-01', category: '전기 설비', status: 'standby', location: 'B1F 발전기실', installDate: '2021-11-05', inspector: '박정민 주임', spec: '출력 500 kW / 디젤 엔진 구동식' },
  { id: '4', name: '냉동기 CHL-01', code: 'HVAC-CHL-01', category: '공조 설비', status: 'stop', location: 'B2F 기계실', installDate: '2023-05-20', inspector: '홍길동 대리', spec: '냉방 용량 250 USRT / 터보 타입' },
  { id: '5', name: '배기휀 EF-03', code: 'HVAC-EF-03', category: '공조 설비', status: 'fault', location: 'RF 옥상', installDate: '2024-01-15', inspector: '최윤서 사원', spec: '풍량 3,200 CMH / 1.5 kW' },
  { id: '6', name: '메인 수배전반 M-DB', code: 'ELE-MDB-01', category: '전기 설비', status: 'normal', location: 'B1F 전기실', installDate: '2020-03-10', inspector: '홍길동 대리', spec: '특고압 22.9 kV / 1500 kVA 변압' },
  { id: '7', name: '엘리베이터 EV-01', code: 'LIFT-EV-01', category: '승강 설비', status: 'normal', location: 'A동 전층', installDate: '2022-05-15', inspector: '최윤서 사원', spec: '속도 120m/min / 적재하중 1150kg' }
];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(initialAssets[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'RD-Building': true,
    'Basement': true,
    'Floor1': false,
    'Roof': false
  });

  // Form values
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newCategory, setNewCategory] = useState('공조 설비');
  const [newLocation, setNewLocation] = useState('B1F 공조실');
  const [newSpec, setNewSpec] = useState('');

  const handleToggleNode = (node: string) => {
    setExpandedNodes(prev => ({ ...prev, [node]: !prev[node] }));
  };

  const handleSelectLocation = (loc: string) => {
    setSelectedLocation(loc);
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCode) return;

    const newAsset: Asset = {
      id: String(assets.length + 1),
      name: newName,
      code: newCode,
      category: newCategory,
      status: 'standby',
      location: newLocation,
      installDate: new Date().toISOString().split('T')[0],
      inspector: '로그인 관리자',
      spec: newSpec
    };

    setAssets([...assets, newAsset]);
    setSelectedAsset(newAsset);
    setIsModalOpen(false);

    // Clear form
    setNewName('');
    setNewCode('');
    setNewSpec('');
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.code.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedLocation === 'all') return matchesSearch;
    if (selectedLocation === 'basement') return matchesSearch && (asset.location.includes('B1') || asset.location.includes('B2'));
    if (selectedLocation === 'roof') return matchesSearch && asset.location.includes('RF');
    if (selectedLocation === 'floor1') return matchesSearch && asset.location.includes('1F');
    return matchesSearch && asset.location.includes(selectedLocation);
  });

  const getStatusBadge = (status: Asset['status']) => {
    const statusMap = {
      normal: { label: '정상 가동', class: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
      standby: { label: '대기 중', class: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
      stop: { label: '정지 상태', class: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
      fault: { label: '장애 발생', class: 'bg-red-500/10 text-red-500 border-red-500/20' }
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${statusMap[status].class}`}>
        {statusMap[status].label}
      </span>
    );
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      {/* Top Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            자산 및 설비 관리
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            건물 내 기계, 전기, 소방, 승강 등 주요 자산 리스트 및 상세 사양을 확인합니다.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 shadow-lg shadow-blue-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>신규 자산 등록</span>
        </button>
      </div>

      {/* Split Layout Container */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Left Side: Hierarchy Tree View */}
        <div className="w-72 glass-card rounded-2xl p-4 flex flex-col overflow-y-auto flex-shrink-0">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-2">
            설비 설치 공간 위계
          </h3>
          
          <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {/* Root Node */}
            <div>
              <button 
                onClick={() => handleToggleNode('RD-Building')}
                className="w-full flex items-center gap-2 py-1.5 px-2 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-lg text-left font-semibold text-slate-800 dark:text-white"
              >
                {expandedNodes['RD-Building'] ? <FolderOpen className="w-4 h-4 text-blue-500" /> : <Folder className="w-4 h-4 text-blue-500" />}
                <span>R&D 빌딩 A동</span>
              </button>
              
              {expandedNodes['RD-Building'] && (
                <div className="pl-4 border-l border-slate-200 dark:border-slate-800 ml-4 mt-1 space-y-1">
                  {/* Category level: all */}
                  <button 
                    onClick={() => handleSelectLocation('all')}
                    className={`w-full py-1.5 px-2 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-lg text-left flex justify-between items-center ${selectedLocation === 'all' ? 'text-blue-500 font-semibold bg-blue-50/50 dark:bg-slate-800/30' : ''}`}
                  >
                    <span>전체 공간</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono font-semibold">{assets.length}</span>
                  </button>

                  {/* Basement Node */}
                  <div>
                    <button 
                      onClick={() => handleToggleNode('Basement')}
                      className="w-full flex items-center justify-between py-1.5 px-2 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-lg text-left"
                    >
                      <span className="flex items-center gap-2">
                        {expandedNodes['Basement'] ? <ChevronRight className="w-3.5 h-3.5 rotate-90" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        <span>지하 기계실 구역</span>
                      </span>
                    </button>
                    {expandedNodes['Basement'] && (
                      <div className="pl-4 ml-2 mt-1 space-y-0.5 border-l border-dashed border-slate-200 dark:border-slate-800">
                        <button 
                          onClick={() => handleSelectLocation('B1F')}
                          className={`w-full py-1 px-2 text-xs rounded-lg text-left ${selectedLocation === 'B1F' ? 'text-blue-500 font-semibold bg-blue-50/40 dark:bg-slate-800/30' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        >
                          B1F 기계/전기실
                        </button>
                        <button 
                          onClick={() => handleSelectLocation('B2F')}
                          className={`w-full py-1 px-2 text-xs rounded-lg text-left ${selectedLocation === 'B2F' ? 'text-blue-500 font-semibold bg-blue-50/40 dark:bg-slate-800/30' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        >
                          B2F 물탱크실
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Ground Level */}
                  <div>
                    <button 
                      onClick={() => handleToggleNode('Floor1')}
                      className="w-full flex items-center justify-between py-1.5 px-2 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-lg text-left"
                    >
                      <span className="flex items-center gap-2">
                        {expandedNodes['Floor1'] ? <ChevronRight className="w-3.5 h-3.5 rotate-90" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        <span>지상층 구역</span>
                      </span>
                    </button>
                    {expandedNodes['Floor1'] && (
                      <div className="pl-4 ml-2 mt-1 space-y-0.5 border-l border-dashed border-slate-200 dark:border-slate-800">
                        <button 
                          onClick={() => handleSelectLocation('1F')}
                          className={`w-full py-1 px-2 text-xs rounded-lg text-left ${selectedLocation === '1F' ? 'text-blue-500 font-semibold bg-blue-50/40 dark:bg-slate-800/30' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        >
                          1F 로비/수배전반
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Roof Node */}
                  <div>
                    <button 
                      onClick={() => handleToggleNode('Roof')}
                      className="w-full flex items-center justify-between py-1.5 px-2 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-lg text-left"
                    >
                      <span className="flex items-center gap-2">
                        {expandedNodes['Roof'] ? <ChevronRight className="w-3.5 h-3.5 rotate-90" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        <span>옥상 구역</span>
                      </span>
                    </button>
                    {expandedNodes['Roof'] && (
                      <div className="pl-4 ml-2 mt-1 space-y-0.5 border-l border-dashed border-slate-200 dark:border-slate-800">
                        <button 
                          onClick={() => handleSelectLocation('RF')}
                          className={`w-full py-1 px-2 text-xs rounded-lg text-left ${selectedLocation === 'RF' ? 'text-blue-500 font-semibold bg-blue-50/40 dark:bg-slate-800/30' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                        >
                          RF 옥상 실외기실
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Side: Asset List Table */}
        <div className="flex-1 glass-card rounded-2xl p-5 flex flex-col overflow-hidden">
          {/* Search bar & statistics */}
          <div className="flex items-center gap-4 mb-4 flex-shrink-0">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="자산명 또는 설비코드 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500/50 dark:focus:border-blue-500/50 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <Sliders className="w-3.5 h-3.5 text-blue-500" />
              <span>필터 결과: {filteredAssets.length}건</span>
            </div>
          </div>

          {/* Table Area with fixed header */}
          <div className="flex-1 overflow-y-auto min-h-0 border border-slate-100 dark:border-slate-800/60 rounded-xl">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800/50 relative">
              <thead className="bg-slate-50/80 dark:bg-slate-900/80 sticky top-0 backdrop-blur-sm z-10">
                <tr className="text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="p-3 pl-4">설비명</th>
                  <th className="p-3">설비코드</th>
                  <th className="p-3">카테고리</th>
                  <th className="p-3">설치 공간</th>
                  <th className="p-3 pr-4">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm text-slate-700 dark:text-slate-300">
                {filteredAssets.map((asset) => (
                  <tr 
                    key={asset.id} 
                    onClick={() => setSelectedAsset(asset)}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/20 cursor-pointer transition-colors duration-150 ${selectedAsset.id === asset.id ? 'bg-blue-500/5 dark:bg-blue-500/10' : ''}`}
                  >
                    <td className="p-3 pl-4 font-semibold text-slate-800 dark:text-slate-100">
                      {asset.name}
                    </td>
                    <td className="p-3 font-mono text-xs">{asset.code}</td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">{asset.category}</td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">{asset.location}</td>
                    <td className="p-3 pr-4">{getStatusBadge(asset.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Detailed Card View */}
        <div className="w-80 glass-card rounded-2xl p-5 flex flex-col justify-between overflow-y-auto flex-shrink-0">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                자산 상세 정보
              </span>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-500 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Asset card header */}
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                  {selectedAsset.name}
                </h4>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500 block mt-1">
                  ID: {selectedAsset.code}
                </span>
              </div>

              {/* Status bar */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-3 rounded-xl">
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">현재 운영 상태</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                    {selectedAsset.status === 'normal' && '원활한 정상 작동 중'}
                    {selectedAsset.status === 'standby' && '예비 대기 동작 상태'}
                    {selectedAsset.status === 'stop' && '점검을 위한 임시 정지'}
                    {selectedAsset.status === 'fault' && '부품 교체 필요 (경보)'}
                  </p>
                </div>
                {getStatusBadge(selectedAsset.status)}
              </div>

              {/* Meta details list */}
              <div className="space-y-3.5 pt-3">
                <div className="flex items-start gap-3">
                  <Sliders className="w-4.5 h-4.5 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold block">기기 상세 사양</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      {selectedAsset.spec}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-4.5 h-4.5 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold block">최초 설치 일자</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {selectedAsset.installDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-4.5 h-4.5 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold block">지정 담당 점검자</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {selectedAsset.inspector}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Info className="w-4.5 h-4.5 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold block">자산 대분류</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {selectedAsset.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-200">
              <Activity className="w-4 h-4" />
              <span>가동 히스토리/로그 분석</span>
            </button>
          </div>
        </div>
      </div>

      {/* Asset registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">
              신규 설비 자산 등록
            </h3>
            
            <form onSubmit={handleAddAsset} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-1.5">설비 자산 명칭</label>
                <input
                  type="text"
                  required
                  placeholder="예: 공조기 AHU-02"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-[#0b0d10] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-1.5">설비 식별 코드</label>
                  <input
                    type="text"
                    required
                    placeholder="예: HVAC-AHU-02"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-[#0b0d10] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-1.5">자산 카테고리</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-[#0b0d10] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="공조 설비">공조 설비</option>
                    <option value="위생 배관 설비">위생 배관 설비</option>
                    <option value="전기 설비">전기 설비</option>
                    <option value="승강 설비">승강 설비</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-1.5">설치 위치 공간</label>
                <input
                  type="text"
                  required
                  placeholder="예: B1F 공조실, RF 옥상"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-[#0b0d10] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-1.5">기기 세부 사양 (스펙)</label>
                <textarea
                  placeholder="예: 풍량, 용량, 제조원, 전력 정보 등"
                  value={newSpec}
                  onChange={(e) => setNewSpec(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-[#0b0d10] border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500/50 h-20 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 rounded-xl transition-colors shadow-md shadow-blue-500/10"
                >
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
