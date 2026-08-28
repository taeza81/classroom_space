import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Download, Loader2, Camera, CheckCircle2, FolderOpen, Plus, Upload, ChevronDown, Check, User, ShieldCheck } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';

// 🎨 Canvas 2D 둥근 사각형 유틸리티
function drawRoundRect(ctx, x, y, w, h, r, fillColor, strokeColor, lineWidth = 1) {
  ctx.save();
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  if (strokeColor) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

function TopToolbar({ viewMode, setViewMode, className, classroomSize = { width: 800, height: 600, wallHeight: 260 }, items = [] }) {
  const { user, setIsAuthModalOpen, setIsProfileModalOpen } = useAuth();
  const { 
    activeProject, projects, saveStatus, switchProject, 
    setIsDashboardOpen, setIsNewProjectModalOpen, exportProjectToFile, importProjectFromFile 
  } = useProject();

  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // 외부 클릭 시 프로젝트 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 📸 도면/3D 화면을 고화질 PNG 이미지 파일로 1클릭 캡처 및 클립보드 복사
  const handleExportPNG = useCallback(() => {
    try {
      const sourceCanvas = viewMode === '2d'
        ? document.querySelector('.konvajs-content canvas')
        : document.querySelector('#canvas-container canvas');

      if (!sourceCanvas) {
        alert('도면 화면을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
        return;
      }

      // 1. 클립보드에 이미지 복사 (Ctrl + V로 한글/PPT/메신저에 즉시 붙여넣기 가능)
      if (sourceCanvas.toBlob) {
        sourceCanvas.toBlob(async (blob) => {
          if (blob && navigator.clipboard && window.ClipboardItem) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ]);
            } catch (err) {
              console.log('Clipboard write notice:', err);
            }
          }
        });
      }

      // 2. PNG 이미지 파일 다운로드
      const imgData = sourceCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${className ? `${className}_` : ''}교실_배치도_${viewMode.toUpperCase()}.png`;
      link.href = imgData;
      link.click();

      // 3. 토스트 알림 팝업
      setToastMessage(`📸 ${viewMode === '2d' ? '2D 평면 도면' : '3D 입체 화면'}이 캡처되었습니다! (클립보드 복사 & 저장 완료)`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e) {
      console.error('PNG Export Error:', e);
      alert('이미지 캡처 중 오류가 발생했습니다.');
    }
  }, [viewMode, className]);

  // 📊 비품 종류별 수량 집계
  const inventoryCounts = useMemo(() => {
    const counts = {};
    items.forEach(item => {
      counts[item.type] = (counts[item.type] || 0) + 1;
    });
    return counts;
  }, [items]);

  const handleExportPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      // 1. 현재 뷰 모드에 따른 캔버스 엘리먼트 캡처
      const sourceCanvas = viewMode === '2d'
        ? document.querySelector('.konvajs-content canvas')
        : document.querySelector('#canvas-container canvas');

      if (!sourceCanvas) {
        alert('도면 화면을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
        setIsExporting(false);
        return;
      }

      // 2. 도면 이미지 로드
      const captureDataUrl = sourceCanvas.toDataURL('image/png');
      const captureImg = new Image();
      captureImg.src = captureDataUrl;

      const logoImg = new Image();
      logoImg.src = '/logo.png';

      await Promise.all([
        new Promise((resolve, reject) => {
          captureImg.onload = resolve;
          captureImg.onerror = reject;
        }),
        new Promise((resolve) => {
          logoImg.onload = resolve;
          logoImg.onerror = resolve; // fallback safely
        }),
      ]);

      // 3. 고해상도 A4 가로 Canvas (2384 x 1684 px, 300DPI급) 생성
      const reportCanvas = document.createElement('canvas');
      reportCanvas.width = 2384;
      reportCanvas.height = 1684;
      const ctx = reportCanvas.getContext('2d');

      const fontSans = '"Pretendard", -apple-system, BlinkMacSystemFont, "Malgun Gothic", "Apple SD Gothic Neo", sans-serif';

      // 4. 배경 채우기 (화이트)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, reportCanvas.width, reportCanvas.height);

      // 5. 상단 헤더 영역
      // (1) 오쌤 INFO 로고 아이콘
      if (logoImg.complete && logoImg.naturalWidth) {
        ctx.save();
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(60, 50, 70, 70, 16);
        } else {
          ctx.rect(60, 50, 70, 70);
        }
        ctx.clip();
        ctx.drawImage(logoImg, 60, 50, 70, 70);
        ctx.restore();
      } else {
        drawRoundRect(ctx, 60, 50, 70, 70, 16, '#2563eb', null);
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold 38px ${fontSans}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('오', 95, 85);
      }

      // (2) 타이틀 및 서브타이틀
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#0f172a';
      ctx.font = `bold 34px ${fontSans}`;
      const titleText = className ? `${className} 교실 공간 배치도` : '교실 공간 구조화 배치 보고서';
      ctx.fillText(titleText, 145, 52);

      ctx.fillStyle = '#64748b';
      ctx.font = `500 18px ${fontSans}`;
      ctx.fillText('미래형 맞춤 교실 공간 재구조화 설계 리포트', 145, 96);

      // (3) 우측 메타데이터 뱃지 (출력 일자 & 뷰 모드)
      const currentDateStr = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      // 일자 뱃지
      drawRoundRect(ctx, 1920, 50, 180, 68, 12, '#f8fafc', '#e2e8f0', 2);
      ctx.fillStyle = '#64748b';
      ctx.font = `bold 13px ${fontSans}`;
      ctx.fillText('출력 일자', 1935, 62);
      ctx.fillStyle = '#0f172a';
      ctx.font = `bold 18px ${fontSans}`;
      ctx.fillText(currentDateStr, 1935, 86);

      // 모드 뱃지
      drawRoundRect(ctx, 2115, 50, 209, 68, 12, '#eff6ff', '#bfdbfe', 2);
      ctx.fillStyle = '#3b82f6';
      ctx.font = `bold 13px ${fontSans}`;
      ctx.fillText('출력 모드', 2130, 62);
      ctx.fillStyle = '#1d4ed8';
      ctx.font = `bold 18px ${fontSans}`;
      ctx.fillText(viewMode === '2d' ? '2D 평면 도면' : '3D 입체 조감도', 2130, 86);

      // 헤더 구분선 (블루 포인트)
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(60, 135, 2264, 4);

      // 6. 교실 제원 정보 바
      const roomWidthM = (classroomSize.width / 100).toFixed(1);
      const roomHeightM = (classroomSize.height / 100).toFixed(1);
      const roomCeilingM = ((classroomSize.wallHeight || 260) / 100).toFixed(1);
      const roomAreaM2 = ((classroomSize.width * classroomSize.height) / 10000).toFixed(1);
      const roomPyeong = (Number(roomAreaM2) * 0.3025).toFixed(1);

      drawRoundRect(ctx, 60, 155, 2264, 85, 14, '#f8fafc', '#e2e8f0', 2);

      const colX = [90, 630, 1200, 1780];
      const labels = ['교실명', '교실 실측 규격', '바닥 면적', '배치된 비품 수'];
      const values = [
        className || '미지정 (기본 교실)',
        `${roomWidthM}m × ${roomHeightM}m (천장고 ${roomCeilingM}m)`,
        `${roomAreaM2} ㎡ (약 ${roomPyeong}평)`,
        `총 ${items.length}개 비품 배치`,
      ];

      colX.forEach((cx, idx) => {
        ctx.fillStyle = '#64748b';
        ctx.font = `bold 14px ${fontSans}`;
        ctx.fillText(labels[idx], cx, 172);

        ctx.fillStyle = idx === 3 ? '#2563eb' : '#0f172a';
        ctx.font = `bold 20px ${fontSans}`;
        ctx.fillText(values[idx], cx, 198);
      });

      // 7. 메인 도면 / 3D 뷰 캡처 프레임 (하단 영역까지 확장하여 최대 크기 확보)
      const frameX = 60;
      const frameY = 260;
      const frameW = 2264;
      const frameH = 1320; // 하단 비품 목록 제거로 도면 프레임을 시원하게 확장

      drawRoundRect(ctx, frameX, frameY, frameW, frameH, 18, '#f1f5f9', '#cbd5e1', 2);

      // 도면 이미지를 프레임 내에 비율 유지하며 중앙에 렌더링
      const pad = 24;
      const availW = frameW - pad * 2;
      const availH = frameH - pad * 2;
      const imgAspect = captureImg.width / captureImg.height;
      const frameAspect = availW / availH;

      let drawW, drawH;
      if (imgAspect > frameAspect) {
        drawW = availW;
        drawH = availW / imgAspect;
      } else {
        drawH = availH;
        drawW = availH * imgAspect;
      }

      const drawX = frameX + (frameW - drawW) / 2;
      const drawY = frameY + (frameH - drawH) / 2;

      // 도면 뒷배경 흰색 카드
      drawRoundRect(ctx, drawX - 6, drawY - 6, drawW + 12, drawH + 12, 12, '#ffffff', '#e2e8f0', 2);
      ctx.drawImage(captureImg, drawX, drawY, drawW, drawH);

      // 8. 하단 푸터
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(60, 1600, 2264, 1.5);

      ctx.fillStyle = '#94a3b8';
      ctx.font = `14px ${fontSans}`;
      ctx.fillText('교실 공간 구조화 (Classroom Space Planner) | 미래형 학교 공간 재구조화 지원 솔루션', 60, 1625);

      ctx.textAlign = 'right';
      ctx.fillText('A4 Landscape • 1 / 1', 2324, 1625);

      // 10. A4 Landscape PDF 생성 및 다운로드 (초고화질 JPEG 0.95)
      const reportImgData = reportCanvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      pdf.addImage(reportImgData, 'JPEG', 0, 0, 297, 210);

      const safeFileName = `${className ? `${className}_` : ''}교실_공간_배치보고서_${viewMode.toUpperCase()}.pdf`;
      pdf.save(safeFileName);
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 select-none shrink-0 w-full">
      {/* 📁 [좌측] 프로젝트 스위처 드롭다운 & 자동 저장 상태 */}
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        {/* 숨겨진 도면 파일 업로드 인풋 */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              importProjectFromFile(file);
              e.target.value = '';
            }
          }}
          accept=".classroom,.json"
          className="hidden"
        />

        {/* 프로젝트 드롭다운 트리거 버튼 */}
        <button
          onClick={() => setIsProjectDropdownOpen(prev => !prev)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs transition-all border border-slate-200/80 shadow-2xs hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          title="클릭하여 프로젝트 목록 보기 및 전환"
        >
          <FolderOpen size={15} className="text-blue-600 shrink-0" />
          <span className="max-w-[180px] sm:max-w-[240px] truncate">
            {activeProject?.name || className || '교실 프로젝트'}
          </span>
          <ChevronDown size={14} className="text-slate-400 shrink-0" />
        </button>

        {/* 🟢 실시간 자동 저장 상태 뱃지 */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-500">
          {saveStatus === 'saving' ? (
            <>
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
              <span className="text-amber-600">저장 중...</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-emerald-700">저장 완료</span>
            </>
          )}
        </div>

        {/* 프로젝트 빠른 드롭다운 팝오버 */}
        {isProjectDropdownOpen && (
          <div className="absolute top-11 left-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                최근 프로젝트 빠른 전환
              </span>
            </div>

            {/* 최근 프로젝트 3개 목록 */}
            <div className="max-h-48 overflow-y-auto space-y-1 mb-2">
              {projects.slice(0, 4).map((p) => {
                const isCur = p.id === activeProject?.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchProject(p.id);
                      setIsProjectDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                      isCur
                        ? 'bg-blue-50 text-blue-700 font-black'
                        : 'hover:bg-slate-50 text-slate-700 font-bold'
                    }`}
                  >
                    <span className="truncate flex-1 mr-2">{p.name}</span>
                    {isCur && <Check size={14} className="text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-1.5 border-t border-slate-100 space-y-1">
              {/* 내 프로젝트 전체 관리 대시보드 */}
              <button
                onClick={() => {
                  setIsProjectDropdownOpen(false);
                  setIsDashboardOpen(true);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-all cursor-pointer"
              >
                <FolderOpen size={14} className="text-blue-600" />
                <span>내 프로젝트 전체 관리 ({projects.length})</span>
              </button>

              {/* 새 프로젝트 생성 */}
              <button
                onClick={() => {
                  setIsProjectDropdownOpen(false);
                  setIsNewProjectModalOpen(true);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus size={14} strokeWidth={3} />
                <span>새 교실 프로젝트 만들기</span>
              </button>

              {/* 도면 파일 내보내기 / 가져오기 */}
              <div className="grid grid-cols-2 gap-1 pt-1">
                <button
                  onClick={() => {
                    setIsProjectDropdownOpen(false);
                    exportProjectToFile(activeProject?.id);
                  }}
                  className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 border border-slate-200/60"
                  title="현재 도면을 .classroom 파일로 다운로드"
                >
                  <Download size={12} className="text-emerald-600" />
                  <span>도면 파일 저장</span>
                </button>
                <button
                  onClick={() => {
                    setIsProjectDropdownOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 border border-slate-200/60"
                  title="공유받은 .classroom 도면 파일 열기"
                >
                  <Upload size={12} className="text-blue-600" />
                  <span>도면 불러오기</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🌟 [우측] 2D/3D 모드 스위처 + 이미지/PDF 저장 + Google 계정 프로필 위젯 */}
      <div className="flex items-center gap-3 shrink-0">
        {/* 🌟 2D / 3D 보기 모드 세그먼트 캡슐 스위처 */}
        <div className="bg-slate-200/70 p-1 rounded-2xl flex items-center border border-slate-300/80 shadow-inner w-[124px] justify-between">
          <button
            onClick={() => setViewMode('2d')}
            className={`w-[56px] py-1.5 rounded-xl text-sm font-black tracking-wider transition-all flex items-center justify-center cursor-pointer ${
              viewMode === '2d'
                ? 'bg-white text-blue-600 shadow-md ring-1 ring-black/5'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 font-bold'
            }`}
            title="2D 평면 도면 편집 모드로 전환"
          >
            2D
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`w-[56px] py-1.5 rounded-xl text-sm font-black tracking-wider transition-all flex items-center justify-center cursor-pointer ${
              viewMode === '3d'
                ? 'bg-white text-blue-600 shadow-md ring-1 ring-black/5'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 font-bold'
            }`}
            title="3D 입체 뷰어 모드로 전환"
          >
            3D
          </button>
        </div>

        {/* 세로 구분선 */}
        <div className="w-px h-6 bg-slate-200 mx-0.5 shrink-0"></div>

        {/* 이미지(PNG) 저장 버튼 */}
        <button
          onClick={handleExportPNG}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 active:scale-95 border border-slate-200 shrink-0 cursor-pointer"
          title="도면을 고화질 PNG 이미지 파일로 즉시 저장"
        >
          <Camera size={14} />
          <span>이미지 저장</span>
        </button>

        {/* PDF 출력 버튼 */}
        <button
          onClick={handleExportPDF}
          disabled={isExporting}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer ${
            isExporting
              ? 'bg-blue-400 text-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-blue-600/20 hover:shadow-md'
          }`}
          title="고화질 PDF 배치 보고서로 저장"
        >
          {isExporting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>PDF 생성 중...</span>
            </>
          ) : (
            <>
              <Download size={15} />
              <span>PDF로 출력</span>
            </>
          )}
        </button>

        {/* 세로 구분선 */}
        <div className="w-px h-6 bg-slate-200 mx-0.5 shrink-0"></div>

        {/* 👤 사용자 계정 로그인 / 프로필 위젯 */}
        {user ? (
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl border border-slate-200/80 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs shrink-0"
            title="내 프로필 및 계정 설정"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden bg-blue-100 border border-blue-300 shrink-0">
              <img src={user.picture || '/logo.png'} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-black max-w-[100px] truncate">{user.name}</span>
          </button>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            title="로그인 및 회원가입"
          >
            <User size={14} className="shrink-0" />
            <span className="font-black">로그인 / 가입</span>
          </button>
        )}
      </div>

      {/* 🌟 화면 캡처 완료 토스트 팝업 */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold transition-all border border-slate-700/80 animate-in fade-in duration-200">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default TopToolbar;

