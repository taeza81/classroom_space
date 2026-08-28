import React, { useState, useRef } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, Plus, FolderOpen, Copy, Trash2, Edit3, Download, Upload, 
  Search, Check, Clock, Layers, Maximize2, HardDrive, Calendar 
} from 'lucide-react';

export default function ProjectDashboardModal() {
  const { 
    projects, activeProjectId, isDashboardOpen, setIsDashboardOpen,
    switchProject, duplicateProject, deleteProject, renameProject,
    exportProjectToFile, importProjectFromFile, setIsNewProjectModalOpen 
  } = useProject();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const fileInputRef = useRef(null);

  if (!isDashboardOpen) return null;

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartRename = (proj, e) => {
    e.stopPropagation();
    setEditingId(proj.id);
    setEditName(proj.name);
  };

  const handleSaveRename = (projId, e) => {
    e?.stopPropagation();
    if (editName.trim()) {
      renameProject(projId, editName.trim());
    }
    setEditingId(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      importProjectFromFile(file);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => setIsDashboardOpen(false)} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-100 z-10 animate-in zoom-in-95 duration-200 select-none max-h-[90vh] flex flex-col">
        {/* 닫기 버튼 */}
        <button
          onClick={() => setIsDashboardOpen(false)}
          className="absolute top-5 right-5 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-slate-200/60"
        >
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* 헤더 & 검색 & 액션 바 */}
        <div className="mb-6 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-wider mb-1">
                <FolderOpen size={16} />
                <span>내 교실 프로젝트 관리 ({projects.length})</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">
                {user ? `${user.name}의 교실 도면 대시보드` : '교실 도면 프로젝트 목록'}
              </h2>
            </div>

            {/* 상단 버튼군 */}
            <div className="flex items-center gap-2">
              {/* 숨겨진 파일 인풋 */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".classroom,.json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                title="다른 선생님이 공유한 도면 파일 열기"
              >
                <Upload size={14} className="text-blue-600" />
                <span>도면 파일 가져오기</span>
              </button>

              <button
                onClick={() => {
                  setIsDashboardOpen(false);
                  setIsNewProjectModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Plus size={15} strokeWidth={3} />
                <span>새 프로젝트</span>
              </button>
            </div>
          </div>

          {/* 검색창 */}
          <div className="relative mt-4">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="프로젝트 이름 또는 설명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* 프로젝트 카드 갤러리 그리드 */}
        <div className="flex-1 overflow-y-auto pr-1">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <FolderOpen size={40} className="mx-auto mb-2 opacity-50 text-slate-300" />
              <p className="text-sm font-bold text-slate-600">검색된 프로젝트가 없습니다.</p>
              <p className="text-xs text-slate-400 mt-1">새 프로젝트를 생성하거나 파일을 가져와 보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pb-2">
              {filteredProjects.map((proj) => {
                const isActive = proj.id === activeProjectId;
                const isEditing = editingId === proj.id;
                const dateStr = new Date(proj.updatedAt || proj.createdAt).toLocaleDateString('ko-KR', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={proj.id}
                    onClick={() => !isEditing && switchProject(proj.id)}
                    className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'border-blue-600 bg-blue-50/40 shadow-lg shadow-blue-500/10'
                        : 'border-slate-200/90 hover:border-blue-300 bg-white hover:bg-slate-50/70 shadow-sm hover:shadow'
                    }`}
                  >
                    {/* 상단 프로젝트 타이틀 & 상태 */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(proj.id, e)}
                              autoFocus
                              className="flex-1 px-2 py-1 bg-white border border-blue-500 rounded-lg text-xs font-bold focus:outline-none"
                            />
                            <button
                              onClick={(e) => handleSaveRename(proj.id, e)}
                              className="p-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              <Check size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 min-w-0">
                            <h3 className="text-sm font-black text-slate-900 truncate">
                              {proj.name}
                            </h3>
                            {isActive && (
                              <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-full shrink-0">
                                현재 작업중
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {proj.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                          {proj.description}
                        </p>
                      )}

                      {/* 메타데이터 정보 바 */}
                      <div className="space-y-1 my-2 py-2 border-y border-slate-100 text-[11px] text-slate-500 font-medium">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Maximize2 size={12} className="text-slate-400" />
                            <span>교실 크기:</span>
                          </span>
                          <strong className="text-slate-700">
                            {(proj.classroomSize?.width / 100).toFixed(1)}m × {(proj.classroomSize?.height / 100).toFixed(1)}m
                          </strong>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Layers size={12} className="text-slate-400" />
                            <span>배치된 비품:</span>
                          </span>
                          <strong className="text-slate-700">{proj.items?.length || 0}개</strong>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            <span>수정 일시:</span>
                          </span>
                          <span>{dateStr}</span>
                        </div>
                      </div>
                    </div>

                    {/* 카드 하단 액션 버튼 툴바 */}
                    <div className="pt-2 flex items-center justify-between gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => switchProject(proj.id)}
                        className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700'
                        }`}
                      >
                        <FolderOpen size={13} />
                        <span>{isActive ? '편집 중' : '열기'}</span>
                      </button>

                      {/* 이름 변경 */}
                      <button
                        onClick={(e) => handleStartRename(proj, e)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
                        title="이름 변경"
                      >
                        <Edit3 size={14} />
                      </button>

                      {/* 복제 */}
                      <button
                        onClick={() => duplicateProject(proj.id)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="프로젝트 복제"
                      >
                        <Copy size={14} />
                      </button>

                      {/* 도면 파일 내보내기 */}
                      <button
                        onClick={() => exportProjectToFile(proj.id)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="도면 파일(.classroom) 내보내기"
                      >
                        <Download size={14} />
                      </button>

                      {/* 삭제 */}
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="프로젝트 삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
