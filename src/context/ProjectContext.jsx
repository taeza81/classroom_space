import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { CLASSROOM_TEMPLATES } from '../config/templatePresets';

const ProjectContext = createContext();

const PROJECTS_STORAGE_KEY = 'classroom_projects_list_v1';
const ACTIVE_ID_KEY = 'classroom_active_project_id_v1';

export function ProjectProvider({ children }) {
  const { user, isDriveSyncEnabled } = useAuth();

  // 1. 저장된 프로젝트 목록 불러오기 (없으면 기본 표준 교실 1개 자동 생성)
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading projects:', e);
    }

    // 초기 기본 프로젝트 1개 생성 (깨끗한 빈 교실)
    const defaultTemplate = CLASSROOM_TEMPLATES[0];
    const initialProject = {
      id: crypto.randomUUID(),
      userEmail: 'guest',
      name: '새 교실 공간 구조화',
      description: '자유 구성 기본 교실',
      templateId: defaultTemplate.id,
      classroomSize: defaultTemplate.classroomSize,
      items: defaultTemplate.defaultItems || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return [initialProject];
  });

  // 2. 현재 활성화된 프로젝트 ID
  const [activeProjectId, setActiveProjectId] = useState(() => {
    try {
      const savedId = localStorage.getItem(ACTIVE_ID_KEY);
      if (savedId && projects.some(p => p.id === savedId)) return savedId;
    } catch {}
    return projects[0]?.id || null;
  });

  // 실시간 저장 상태 ('saved' | 'saving')
  const [saveStatus, setSaveStatus] = useState('saved');
  const [toastMessage, setToastMessage] = useState(null);

  // 모달 상태 관리
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const saveTimerRef = useRef(null);

  // 토스트 메시지 도우미
  const showToast = useCallback((msg, duration = 2500) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), duration);
  }, []);

  // 현재 활성 프로젝트 객체
  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || null;

  // 프로젝트 목록 로컬 영구 스토리지 저장
  useEffect(() => {
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage:', e);
    }
  }, [projects]);

  // 활성 프로젝트 ID 저장
  useEffect(() => {
    try {
      if (activeProjectId) {
        localStorage.setItem(ACTIVE_ID_KEY, activeProjectId);
      }
    } catch (e) {
      console.error('Failed to save activeProjectId:', e);
    }
  }, [activeProjectId]);

  // 🔄 활성 프로젝트 내용 실시간 자동 업데이트 (비품 이동, 크기 변경 등)
  const updateActiveProject = useCallback((updates) => {
    if (!activeProjectId) return;
    setSaveStatus('saving');

    setProjects(prev => prev.map(proj => {
      if (proj.id !== activeProjectId) return proj;
      return {
        ...proj,
        ...updates,
        updatedAt: new Date().toISOString(),
        userEmail: user?.email || proj.userEmail || 'guest',
      };
    }));

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSaveStatus('saved');
    }, 400);
  }, [activeProjectId, user]);

  // ➕ [1] 새 프로젝트 생성
  const createProject = useCallback(({ name, classroomSize, items = [], templateId = 'custom', description = '' }) => {
    const newId = crypto.randomUUID();
    const newProj = {
      id: newId,
      userEmail: user?.email || 'guest',
      name: name.trim() || '새 교실 프로젝트',
      description: description,
      templateId,
      classroomSize: classroomSize || { width: 800, height: 600, wallHeight: 260 },
      items: items.map(it => ({ ...it, id: crypto.randomUUID() })), // 고유 ID 부여
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newId);
    setIsNewProjectModalOpen(false);
    setIsDashboardOpen(false);
    showToast(`✨ 새 프로젝트 '${newProj.name}'이(가) 생성되었습니다.`);
    return newProj;
  }, [user, showToast]);

  // 🔀 [2] 프로젝트 전환
  const switchProject = useCallback((projectId) => {
    if (projects.some(p => p.id === projectId)) {
      setActiveProjectId(projectId);
      setIsDashboardOpen(false);
      const target = projects.find(p => p.id === projectId);
      showToast(`📁 '${target?.name}' 프로젝트를 열었습니다.`);
    }
  }, [projects, showToast]);

  // 📋 [3] 프로젝트 복제 (Duplicate)
  const duplicateProject = useCallback((projectId) => {
    const original = projects.find(p => p.id === projectId);
    if (!original) return;

    const dupId = crypto.randomUUID();
    const duplicated = {
      ...original,
      id: dupId,
      name: `${original.name} (복사본)`,
      items: original.items.map(it => ({ ...it, id: crypto.randomUUID() })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects(prev => [duplicated, ...prev]);
    setActiveProjectId(dupId);
    showToast(`📋 '${duplicated.name}'으로 복제되었습니다.`);
    return duplicated;
  }, [projects, showToast]);

  // 🗑️ [4] 프로젝트 삭제
  const deleteProject = useCallback((projectId) => {
    if (projects.length <= 1) {
      alert('최소 1개의 프로젝트는 유지되어야 합니다.');
      return;
    }

    const target = projects.find(p => p.id === projectId);
    const confirmDelete = window.confirm(`'${target?.name}' 프로젝트를 정말 삭제하시겠습니까?`);
    if (!confirmDelete) return;

    const remaining = projects.filter(p => p.id !== projectId);
    setProjects(remaining);

    if (activeProjectId === projectId) {
      setActiveProjectId(remaining[0].id);
    }
    showToast(`🗑️ 프로젝트가 삭제되었습니다.`);
  }, [projects, activeProjectId, showToast]);

  // ✏️ [5] 프로젝트 이름 변경
  const renameProject = useCallback((projectId, newName) => {
    if (!newName?.trim()) return;
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, name: newName.trim(), updatedAt: new Date().toISOString() } : p
    ));
    showToast(`✏️ 프로젝트 이름이 '${newName.trim()}'(으)로 변경되었습니다.`);
  }, [showToast]);

  // 📤 [6] 도면 파일 1클릭 내보내기 (JSON / .classroom 파일 다운로드)
  const exportProjectToFile = useCallback((projectId) => {
    const proj = projects.find(p => p.id === projectId) || activeProject;
    if (!proj) return;

    const exportData = {
      app: 'ClassroomSpatialPlanner',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      author: user?.name || '오쌤 INFO 교사',
      project: {
        name: proj.name,
        description: proj.description,
        classroomSize: proj.classroomSize,
        items: proj.items,
      }
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = proj.name.replace(/[/\\?%*:|"<>]/g, '_');
    a.href = url;
    a.download = `${safeName}_도면.classroom`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`📤 '${proj.name}' 도면 파일이 다운로드되었습니다.`);
  }, [projects, activeProject, user, showToast]);

  // 📥 [7] 다른 선생님이 공유해 준 도면 파일 1초 가져오기 (Import)
  const importProjectFromFile = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const parsed = JSON.parse(content);

        const projectData = parsed.project || parsed;
        if (!projectData.classroomSize || !Array.isArray(projectData.items)) {
          alert('올바른 교실 도면 파일(.classroom 또는 .json) 형식이 아닙니다.');
          return;
        }

        const newId = crypto.randomUUID();
        const importedProject = {
          id: newId,
          userEmail: user?.email || 'guest',
          name: `${projectData.name || '가져온 교실 도면'} (공유받음)`,
          description: projectData.description || '선생님으로부터 공유받은 도면 파일',
          classroomSize: projectData.classroomSize,
          items: projectData.items.map(it => ({ ...it, id: crypto.randomUUID() })),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setProjects(prev => [importedProject, ...prev]);
        setActiveProjectId(newId);
        setIsDashboardOpen(false);
        showToast(`🎉 공유 도면 '${importedProject.name}'을(를) 성공적으로 불러왔습니다!`);
      } catch (err) {
        console.error('Import error:', err);
        alert('도면 파일을 읽는 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
  }, [user, showToast]);

  const value = {
    projects,
    activeProjectId,
    activeProject,
    saveStatus,
    toastMessage,
    isDashboardOpen,
    setIsDashboardOpen,
    isNewProjectModalOpen,
    setIsNewProjectModalOpen,
    createProject,
    switchProject,
    updateActiveProject,
    duplicateProject,
    deleteProject,
    renameProject,
    exportProjectToFile,
    importProjectFromFile,
    showToast,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
