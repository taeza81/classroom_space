import React, { useState, useEffect, useCallback, useRef } from 'react';
import SidebarPrimary from './components/SidebarPrimary';
import SidebarSecondary from './components/SidebarSecondary';
import TopToolbar from './components/TopToolbar';
import Editor2D from './components/Editor2D';
import Scene3D from './components/Scene3D';
import { RotateCw, Trash2, CheckCircle2 } from 'lucide-react';
import { ThumbnailGenerator3D } from './components/ThumbnailGenerator3D';
import { resolveOverlapPosition } from './utils/collisionUtils';
import { useProject } from './context/ProjectContext';
import { useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import NewProjectModal from './components/NewProjectModal';
import ProjectDashboardModal from './components/ProjectDashboardModal';

function App() {
  const { user } = useAuth();
  const { activeProject, updateActiveProject, toastMessage } = useProject();

  const [selectedId, setSelectedId] = useState(null);
  // 🌟 사용자가 최초 접속하거나 시작할 때 'Project' 메뉴부터 기본 활성화
  const [activeMenu, setActiveMenu] = useState('project'); // 'project', 'objects'
  const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'

  const prevUserRef = useRef(user);

  // 🌟 사용자가 로그인할 경우 즉시 'Project' 메뉴 탭 활성화
  useEffect(() => {
    if (user && !prevUserRef.current) {
      setActiveMenu('project');
    }
    prevUserRef.current = user;
  }, [user]);

  // 활성 프로젝트 데이터 바인딩
  const classroomSize = activeProject?.classroomSize || { width: 800, height: 600, wallHeight: 260 };
  const items = activeProject?.items || [];
  const className = activeProject?.name || '';

  const setClassroomSize = useCallback((updater) => {
    const nextVal = typeof updater === 'function' ? updater(classroomSize) : updater;
    updateActiveProject({ classroomSize: nextVal });
  }, [classroomSize, updateActiveProject]);

  const setItems = useCallback((updater) => {
    const nextVal = typeof updater === 'function' ? updater(items) : updater;
    updateActiveProject({ items: nextVal });
  }, [items, updateActiveProject]);

  const setClassName = useCallback((newName) => {
    updateActiveProject({ name: newName });
  }, [updateActiveProject]);

  // 🛡️ 윈도우 캡처 도구(Win + Shift + S) 사용 후 브라우저 복귀 시 키 고착 방지
  useEffect(() => {
    const handleResetKeys = () => {
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Shift' }));
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Meta' }));
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Control' }));
      window.dispatchEvent(new KeyboardEvent('keyup', { key: 's' }));
    };

    window.addEventListener('focus', handleResetKeys);
    window.addEventListener('blur', handleResetKeys);
    return () => {
      window.removeEventListener('focus', handleResetKeys);
      window.removeEventListener('blur', handleResetKeys);
    };
  }, []);

  const selectedItem = items.find(i => i.id === selectedId);

  // 🔄 45도 회전 핸들러 (2D/3D 공통 & 0cm 밀착 허용)
  const handleRotate = () => {
    if (!selectedId) return;
    const newItems = items.map(item => {
      if (item.id !== selectedId) return item;
      const newRot = (item.rotation || 0) + Math.PI / 4;
      const candidate = {
        ...item,
        rotation: newRot,
      };
      const safePos = resolveOverlapPosition(candidate, items, classroomSize, 0);
      return {
        ...item,
        x: safePos.x,
        y: safePos.y,
        rotation: newRot,
      };
    });
    setItems(newItems);
  };

  // 🗑️ 비품 삭제 핸들러 (2D/3D 공통)
  const handleDelete = () => {
    if (!selectedId) return;
    setItems(items.filter(item => item.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-800">
      {/* 📸 실제 3D 모델 45도 아이소메트릭 썸네일 실시간 캡처 엔진 */}
      <ThumbnailGenerator3D />

      {/* 1. 좌측 좁은 Primary Sidebar */}
      <SidebarPrimary activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      {/* 2. 좌측 넓은 Secondary Sidebar */}
      <SidebarSecondary 
        activeMenu={activeMenu}
        classroomSize={classroomSize} 
        setClassroomSize={setClassroomSize} 
        items={items}
        setItems={setItems} 
        className={className}
        setClassName={setClassName}
      />
      
      {/* 3. 우측 메인 캔버스 영역 */}
      <div className="flex-1 flex flex-col relative min-w-0 h-full overflow-hidden">
        <TopToolbar 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          className={className} 
          classroomSize={classroomSize}
          items={items}
        />
        
        <div id="canvas-container" className="flex-1 bg-white relative overflow-hidden min-w-0 min-h-0 w-full h-full">
          {viewMode === '2d' ? (
            <Editor2D 
              classroomSize={classroomSize} 
              items={items} 
              setItems={setItems} 
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          ) : (
            <Scene3D 
              classroomSize={classroomSize} 
              items={items} 
              setItems={setItems} 
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          )}

          {/* 🌟 2D / 3D 공통 하단 플로팅 선택 비품 툴바 */}
          {selectedItem && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-2xl border border-gray-200 text-sm flex gap-3.5 items-center select-none z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center gap-1.5 text-gray-700 font-medium text-xs">
                <span className="text-gray-500">선택된 비품</span>
                <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                  {selectedItem.type}
                </span>
              </div>
              
              <div className="w-px h-4 bg-gray-200"></div>

              {/* 회전하기(45도) 버튼 */}
              <button
                onClick={handleRotate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold transition-all text-xs active:scale-95 cursor-pointer shadow-xs"
                title="시계 방향 45도 회전"
              >
                <RotateCw size={13} strokeWidth={2.5} />
                <span>회전하기(45도)</span>
              </button>

              {/* 삭제하기 버튼 */}
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold transition-all text-xs active:scale-95 cursor-pointer shadow-md"
                title="선택된 비품 삭제"
              >
                <Trash2 size={13} strokeWidth={2.5} />
                <span>삭제하기</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🌟 프로젝트 관련 전역 토스트 알림 */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold transition-all border border-slate-700/80 animate-in fade-in duration-200 select-none">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 🌟 다중 프로젝트 및 사용자 계정 모달 */}
      <AuthModal />
      <UserProfileModal />
      <NewProjectModal />
      <ProjectDashboardModal />
    </div>
  );
}

export default App;
