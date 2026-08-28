import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { CLASSROOM_TEMPLATES } from '../config/templatePresets';
import { X, Plus, LayoutTemplate, Sparkles, Check, ArrowRight } from 'lucide-react';

export default function NewProjectModal() {
  const { isNewProjectModalOpen, setIsNewProjectModalOpen, createProject } = useProject();

  const [selectedTemplateId, setSelectedTemplateId] = useState(CLASSROOM_TEMPLATES[0].id);
  const [projectName, setProjectName] = useState('');
  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(600);
  const [customWallHeight, setCustomWallHeight] = useState(260);

  // 🌟 모달이 새로 열릴 때마다 입력창을 항상 깨끗한 빈칸으로 초기화
  useEffect(() => {
    if (isNewProjectModalOpen) {
      setProjectName('');
      const defaultTmpl = CLASSROOM_TEMPLATES[0];
      setSelectedTemplateId(defaultTmpl.id);
      setCustomWidth(defaultTmpl.classroomSize.width);
      setCustomHeight(defaultTmpl.classroomSize.height);
      setCustomWallHeight(defaultTmpl.classroomSize.wallHeight);
    }
  }, [isNewProjectModalOpen]);

  if (!isNewProjectModalOpen) return null;

  const selectedTemplate = CLASSROOM_TEMPLATES.find(t => t.id === selectedTemplateId) || CLASSROOM_TEMPLATES[0];

  const handleSelectTemplate = (template) => {
    setSelectedTemplateId(template.id);
    setCustomWidth(template.classroomSize.width);
    setCustomHeight(template.classroomSize.height);
    setCustomWallHeight(template.classroomSize.wallHeight);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const finalName = projectName.trim() || '새 교실 프로젝트';
    const finalSize = {
      width: Number(customWidth) || 800,
      height: Number(customHeight) || 600,
      wallHeight: Number(customWallHeight) || 260,
    };

    createProject({
      name: finalName,
      classroomSize: finalSize,
      items: selectedTemplate.defaultItems || [],
      templateId: selectedTemplate.id,
      description: selectedTemplate.description,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => setIsNewProjectModalOpen(false)} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-100 z-10 animate-in zoom-in-95 duration-200 select-none max-h-[90vh] flex flex-col">
        {/* 닫기 버튼 */}
        <button
          onClick={() => setIsNewProjectModalOpen(false)}
          className="absolute top-5 right-5 w-8.5 h-8.5 bg-slate-100 hover:bg-slate-900 text-slate-500 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-115 hover:rotate-90 hover:shadow-md active:scale-95 border border-slate-200 hover:border-slate-900 cursor-pointer"
          title="닫기"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* 헤더 */}
        <div className="mb-5 shrink-0">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-wider mb-1">
            <LayoutTemplate size={15} />
            <span>새 교실 프로젝트 만들기</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">교실 템플릿 선택 및 생성</h2>
          <p className="text-xs text-slate-500">
            관리자가 준비한 표준 교실 템플릿을 선택하거나 크기를 직접 조절하여 시작하세요.
          </p>
        </div>

        {/* 본문 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5">
          {/* 1. 프로젝트 이름 입력 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              교실 / 학급 프로젝트 이름
            </label>
            <input
              type="text"
              placeholder=""
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
            />
          </div>

          {/* 2. 교실 템플릿 그리드 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              교실 시작 템플릿
            </label>
            <div className={`grid ${CLASSROOM_TEMPLATES.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-2.5`}>
              {CLASSROOM_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left relative ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/10'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                          {tmpl.name}
                        </span>
                        {tmpl.badge && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-md shrink-0">
                            {tmpl.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-snug">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>기본 공간 규격: <strong className="text-slate-700 font-bold">{(tmpl.classroomSize.width / 100).toFixed(1)}m × {(tmpl.classroomSize.height / 100).toFixed(1)}m</strong></span>
                      <span>기본 구조물: <strong className="text-slate-700 font-bold">{tmpl.defaultItems?.length || 0}개 (완전 빈 교실)</strong></span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-3.5 right-3.5 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-xs">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. 선택된 교실 크기 직접 조정 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 mb-2.5">
              교실 규격 세부 설정 (cm 단위)
            </h4>
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">가로 (W)</label>
                <input
                  type="number"
                  step="10"
                  min="200"
                  max="3000"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">세로 (D)</label>
                <input
                  type="number"
                  step="10"
                  min="200"
                  max="3000"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">천장고 (H)</label>
                <input
                  type="number"
                  step="10"
                  min="150"
                  max="600"
                  value={customWallHeight}
                  onChange={(e) => setCustomWallHeight(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 바 */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsNewProjectModalOpen(false)}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>교실 프로젝트 생성</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
