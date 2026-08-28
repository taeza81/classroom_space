import React, { useState, useEffect } from 'react';
import { Search, Plus, SlidersHorizontal, ChevronUp, ChevronDown, FolderOpen, Download, Upload } from 'lucide-react';
import getFurnitureThumbnail from './FurnitureIcons';
import { FurnitureThumbnail3D } from './ThumbnailGenerator3D';
import { findEmptySpaceForNewItem } from '../utils/collisionUtils';
import { useProject } from '../context/ProjectContext';

const FURNITURE_CATALOG = [
  { type: '학생 책상', defaultW: 65, defaultD: 45, defaultH: 60, category: '책상/의자' },
  { type: '학생 의자', defaultW: 40, defaultD: 40, defaultH: 75, category: '책상/의자' },
  { type: '교사 책상', defaultW: 120, defaultD: 70, defaultH: 75, category: '책상/의자' },
  { type: '교구장(1단, 긴 문)', defaultW: 80, defaultD: 42, defaultH: 88, category: '수납장' },
  { type: '교구장(3단, 문 없음)', defaultW: 90, defaultD: 32, defaultH: 85, category: '수납장' },
  { type: '교구장(4단, 문 없음)', defaultW: 95, defaultD: 32, defaultH: 115, category: '수납장' },
  { type: '교구장(3단, 문 있음)', defaultW: 90, defaultD: 38, defaultH: 85, category: '수납장' },
  { type: '교구장(4단, 문 있음)', defaultW: 95, defaultD: 38, defaultH: 115, category: '수납장' },
  { type: '신발장(2단)', defaultW: 65, defaultD: 35, defaultH: 70, category: '수납장' },
  { type: '신발장(3단)', defaultW: 65, defaultD: 35, defaultH: 95, category: '수납장' },
  { type: '옷장', defaultW: 60, defaultD: 50, defaultH: 180, category: '수납장' },
  { type: '전자칠판(벽부착형)', defaultW: 200, defaultD: 15, defaultH: 120, category: '학습교구' },
  { type: '이동식 칠판', defaultW: 150, defaultD: 50, defaultH: 180, category: '학습교구' },
  { type: '이동식 침대', defaultW: 210, defaultD: 95, defaultH: 85, category: '보건/휴게' },
  { type: '출입문', defaultW: 90, defaultD: 15, defaultH: 210, category: '구조물' },
  { type: '창문', defaultW: 120, defaultD: 15, defaultH: 120, category: '구조물' },
];

// 🔢 키보드 자유 입력(Numpad 지원), 백스페이스 완전 초기화, 마우스 상/하 스피너 버튼을 지원하는 고성능 숫자 입력기
function NumberInput({
  label,
  value,
  onChange,
  min = 0,
  max = 5000,
  step = 5,
  unit = 'cm',
  className = '',
  placeholder = '0',
}) {
  const [text, setText] = useState(value === 0 || value ? String(value) : '');

  useEffect(() => {
    setText(value === 0 || value ? String(value) : '');
  }, [value]);

  const handleInputChange = (e) => {
    const raw = e.target.value;
    // 숫자 또는 빈칸만 허용
    if (raw === '' || /^\d+$/.test(raw)) {
      // 0으로 시작하는 다자리 숫자 정돈 (예: '05' -> '5')
      let cleanVal = raw;
      if (raw.length > 1 && raw.startsWith('0')) {
        cleanVal = String(Number(raw));
      }
      setText(cleanVal);
      if (cleanVal !== '') {
        const num = Math.min(max, Number(cleanVal));
        onChange(num);
      }
    }
  };

  const handleBlur = () => {
    if (text === '' || isNaN(Number(text))) {
      setText(String(min));
      onChange(min);
    } else {
      const num = Math.max(min, Math.min(max, Number(text)));
      setText(String(num));
      onChange(num);
    }
  };

  const handleStep = (delta) => {
    const current = Number(text) || 0;
    const next = Math.max(min, Math.min(max, current + delta));
    setText(String(next));
    onChange(next);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleStep(step);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleStep(-step);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="block text-[10px] font-bold text-gray-500 mb-0.5">{label}</label>}
      <div className="flex items-center bg-white rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all px-2 py-1 shadow-xs">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={text}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onFocus={(e) => e.target.select()} // 클릭 시 텍스트 전체 자동 선택 (한 번에 덮어쓰기 가능)
          placeholder={placeholder}
          className="w-full font-bold text-xs text-gray-800 focus:outline-none bg-transparent"
        />
        {unit && <span className="text-[10px] text-gray-400 font-semibold mr-1.5 select-none">{unit}</span>}
        {/* 마우스 스피너 버튼 (Up/Down) */}
        <div className="flex flex-col border-l border-gray-200 pl-1 select-none shrink-0">
          <button
            type="button"
            tabIndex={-1}
            onClick={() => handleStep(step)}
            className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-0.5 rounded transition-colors"
            title={`+${step}${unit}`}
          >
            <ChevronUp size={10} strokeWidth={3} />
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => handleStep(-step)}
            className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-0.5 rounded transition-colors"
            title={`-${step}${unit}`}
          >
            <ChevronDown size={10} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SidebarSecondary({ activeMenu, classroomSize, setClassroomSize, items, setItems, className, setClassName }) {
  const { projects, setIsDashboardOpen, setIsNewProjectModalOpen, exportProjectToFile, activeProject } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  
  // 현재 선택/조절 중인 가구 종류 및 치수 (가로, 세로, 높이)
  const [selectedType, setSelectedType] = useState('학생 책상');
  const [itemWidth, setItemWidth] = useState(65);
  const [itemDepth, setItemDepth] = useState(45);
  const [itemHeight, setItemHeight] = useState(75);

  const categories = ['전체', '책상/의자', '수납장', '학습교구', '구조물'];

  const handleSelectItem = (item) => {
    setSelectedType(item.type);
    setItemWidth(item.defaultW);
    setItemDepth(item.defaultD);
    setItemHeight(item.defaultH);
  };

  const handleAddItem = (model) => {
    const width = selectedType === model.type ? itemWidth : model.defaultW;
    const depth = selectedType === model.type ? itemDepth : model.defaultD;
    const height = selectedType === model.type ? itemHeight : model.defaultH;

    // 🚪 창문, 출입문, 전자칠판은 추가 시 최적의 벽체 위치와 방향으로 자동 초기 배치
    let initialX = classroomSize.width / 2;
    let initialY = classroomSize.height / 2;
    let initialRot = 0;

    if (model.type === '전자칠판(벽부착형)' || model.type?.includes('전자칠판')) {
      initialX = classroomSize.width / 2;
      initialY = 0; // 북쪽 벽 중앙
      initialRot = 0;
    } else if (model.type === '창문') {
      initialX = Math.max(width / 2, classroomSize.width * 0.35);
      initialY = 0; // 북쪽 창문 위치
      initialRot = 0;
    } else if (model.type === '출입문') {
      initialX = Math.min(classroomSize.width - width / 2, classroomSize.width * 0.85);
      initialY = classroomSize.height; // 남쪽(복도 측) 출입문 위치
      initialRot = Math.PI;
    }

    const newItemTemplate = {
      type: model.type,
      x: initialX,
      y: initialY,
      width: width,
      height: depth,
      itemHeight: height,
      rotation: initialRot,
    };

    // 🛡️ [핵심] 교실 내 기존 비품과 겹치지 않는 최적의 빈 공간 자동 탐색
    const emptySpot = findEmptySpaceForNewItem(newItemTemplate, items, classroomSize);

    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: model.type,
        x: emptySpot.x,
        y: emptySpot.y,
        width: width,
        height: depth, // 2D footprint depth (Y축)
        itemHeight: height, // 3D 높이 (Height)
        rotation: initialRot,
      }
    ]);
  };

  const filteredCatalog = FURNITURE_CATALOG.filter(item => {
    const matchesSearch = item.type.includes(searchTerm);
    const matchesCat = selectedCategory === '전체' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const classroomWallHeight = classroomSize.wallHeight || 260;

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full flex flex-col shadow-[4px_0_15px_rgba(0,0,0,0.03)] z-10 shrink-0 select-none">
      {activeMenu === 'project' && (
        <div className="p-5 flex flex-col gap-5 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">프로젝트 설정</h2>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-md">
              총 {projects.length}개 프로젝트
            </span>
          </div>

          {/* 📂 프로젝트 빠른 관리 액션 버튼군 */}
          <div className="space-y-2">
            <button
              onClick={() => setIsDashboardOpen(true)}
              className="w-full py-2.5 px-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center justify-between transition-all border border-blue-200/80 shadow-2xs hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FolderOpen size={15} className="text-blue-600" />
                <span>내 프로젝트 전체 관리</span>
              </div>
              <span className="text-[10px] bg-blue-600 text-white font-black px-1.5 py-0.5 rounded-full">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="w-full py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 transition-all border border-slate-200 shadow-2xs hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Plus size={15} className="text-blue-600" strokeWidth={3} />
              <span>새 프로젝트 생성</span>
            </button>

            <button
              onClick={() => exportProjectToFile(activeProject?.id)}
              className="w-full py-2 px-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl text-xs flex items-center gap-2 transition-all border border-slate-200/60 cursor-pointer"
              title="도면을 .classroom 파일로 내 컴퓨터에 다운로드"
            >
              <Download size={14} className="text-emerald-600" />
              <span>현재 도면 파일(.classroom) 저장</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs text-slate-500 mb-1 uppercase font-bold">현재 교실명</label>
            <input 
              type="text" 
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="교실명을 입력해 주세요"
              className="w-full text-base font-bold text-slate-800 border-b border-gray-200 focus:border-blue-500 focus:outline-none py-1.5 placeholder:text-gray-400 placeholder:font-normal"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-800 mb-3">교실 크기 직접 조정 (cm)</h3>
            <div className="flex flex-col gap-2.5">
              <div className="flex gap-2">
                <NumberInput
                  label="가로 (cm)"
                  value={classroomSize.width}
                  onChange={(val) => setClassroomSize(p => ({ ...p, width: val }))}
                  min={100}
                  step={10}
                  className="flex-1"
                />
                <NumberInput
                  label="세로 (cm)"
                  value={classroomSize.height}
                  onChange={(val) => setClassroomSize(p => ({ ...p, height: val }))}
                  min={100}
                  step={10}
                  className="flex-1"
                />
              </div>
              <div>
                <NumberInput
                  label="높이 / 천장고 (cm)"
                  value={classroomWallHeight}
                  onChange={(val) => setClassroomSize(p => ({ ...p, wallHeight: val }))}
                  min={150}
                  step={10}
                  placeholder="260"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <p>• 공간 크기: {(classroomSize.width/100).toFixed(1)}m(가로) × {(classroomSize.height/100).toFixed(1)}m(세로) × {(classroomWallHeight/100).toFixed(1)}m(높이)</p>
            <p>• 배치된 비품: <strong className="text-blue-600 font-bold">{items.length}개</strong></p>
          </div>
        </div>
      )}

      {activeMenu === 'objects' && (
        <div className="flex flex-col h-full overflow-hidden">
          {/* 상단 검색 & 카테고리 필터 */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">비품 라이브러리</h2>
                <p className="text-xs text-gray-500">교실에 배치할 3D 가구를 선택하세요.</p>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={15} />
              <input 
                type="text" 
                placeholder="비품 검색 (책상, 의자, 칠판 등)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              />
            </div>

            {/* 카테고리 탭 */}
            <div className="flex gap-1 overflow-x-auto pb-1 text-xs scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          {/* 가구 치수(가로/세로/높이) 미세조정 박스 */}
          <div className="p-3 bg-blue-50/70 border-b border-blue-100 z-10">
             <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1">
                  <SlidersHorizontal size={12} />
                  [{selectedType}] 실제 치수 입력 (cm)
                </span>
             </div>
             <div className="grid grid-cols-3 gap-1.5">
                <NumberInput
                  label="가로 (Width)"
                  value={itemWidth}
                  onChange={val => setItemWidth(val)}
                  min={10}
                  step={5}
                />
                <NumberInput
                  label="세로 (Depth)"
                  value={itemDepth}
                  onChange={val => setItemDepth(val)}
                  min={10}
                  step={5}
                />
                <NumberInput
                  label="높이 (Height)"
                  value={itemHeight}
                  onChange={val => setItemHeight(val)}
                  min={10}
                  step={5}
                />
             </div>
          </div>

          {/* 비품 그리드 리스트 */}
          <div className="flex-1 overflow-y-auto p-3.5 bg-slate-50">
            <div className="grid grid-cols-2 gap-2.5">
              {filteredCatalog.map((model) => {
                const isCurrent = selectedType === model.type;
                return (
                  <div 
                    key={model.type}
                    onClick={() => handleSelectItem(model)}
                    className={`group relative flex flex-col items-center bg-white border rounded-xl p-2.5 cursor-pointer transition-all ${
                      isCurrent 
                        ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' 
                        : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    {/* 3D 썸네일 이미지 영역 (실제 3D 모델 45도 렌더링) */}
                    <div className="w-full h-20 bg-slate-50 rounded-lg mb-2 flex items-center justify-center p-1 group-hover:scale-105 transition-transform duration-200">
                      <FurnitureThumbnail3D type={model.type} fallback={getFurnitureThumbnail(model.type)} />
                    </div>
                    
                    {/* 비품 명칭 */}
                    <div className="w-full text-center mb-2">
                      <span className="text-xs font-bold text-slate-800 block truncate">{model.type}</span>
                    </div>

                    {/* 추가 버튼 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddItem(model);
                      }}
                      className={`w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600'
                      }`}
                    >
                      <Plus size={13} strokeWidth={3} /> 배치하기
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SidebarSecondary;
