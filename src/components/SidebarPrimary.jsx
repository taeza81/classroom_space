import React, { useState } from 'react';
import { HelpCircle, X, Mail, Copy, Check } from 'lucide-react';
import { ProjectMenuIcon, ObjectsMenuIcon } from './icons/MenuIcons';

const MENU_ITEMS = [
  { id: 'project', icon: ProjectMenuIcon, label: 'Project' },
  { id: 'objects', icon: ObjectsMenuIcon, label: 'Objects' },
];

function HelpModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const email = 'taeza81@gmail.com';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      {/* 배경 클릭 시 닫기 */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* 모달 카드 */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 z-10 animate-in zoom-in-95 duration-200">
        {/* 상단 둥근 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8.5 h-8.5 bg-slate-100 hover:bg-slate-900 text-slate-500 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-115 hover:rotate-90 hover:shadow-md active:scale-95 border border-slate-200 hover:border-slate-900 cursor-pointer"
          title="닫기"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* 헤더 아이콘 & 타이틀 */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 p-0.5 flex items-center justify-center shadow-md overflow-hidden shrink-0">
            <img src="/logo.png" alt="오쌤 INFO 로고" className="w-full h-full object-contain rounded-xl" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">도움말 및 문의 안내</h3>
            <p className="text-xs text-blue-600 font-bold">오쌤 INFO • 교실 공간 구조화</p>
          </div>
        </div>

        {/* 안내 내용 본문 */}
        <div className="space-y-2.5 mb-4 text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="font-semibold text-slate-800">
            교실 공간 구조화 앱을 이용해 주셔서 감사합니다! 😊
          </p>
          <p className="text-xs text-slate-600">
            사용 중 발견하신 <span className="font-bold text-red-500">오류 사항</span>이나 <span className="font-bold text-blue-600">수정 및 개선 요청 사항</span>이 있으시면 언제든지 아래 이메일로 편하게 보내주세요. 신속히 검토하여 반영하겠습니다!
          </p>
        </div>

        {/* 이메일 주소 카드 & 1클릭 복사 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 rounded-2xl p-4">
          <span className="text-[11px] font-bold text-blue-600 block mb-1.5 uppercase tracking-wider">
            문의 및 요청 이메일 주소
          </span>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono font-bold text-slate-900 text-base select-all">
              {email}
            </span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                copied
                  ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                  : 'bg-white hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 hover:border-transparent'
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} strokeWidth={2.5} />
                  <span>복사됨!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>복사하기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarPrimary({ activeMenu, setActiveMenu }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4 z-20 shrink-0 select-none">
        {/* 🌟 1번 이미지 (오쌤 INFO) 파비콘/로고 크게 적용 */}
        <div className="mb-6 flex flex-col items-center group cursor-pointer" title="교실 공간 구조화 | 오쌤 INFO">
          <div className="w-13 h-13 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-0.5 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
            <img 
              src="/logo.png" 
              alt="오쌤 INFO 로고" 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col w-full">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`flex flex-col items-center justify-center w-full py-4 transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-500' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Help 버튼 클릭 시 모달 열기 */}
        <button
          onClick={() => setIsHelpOpen(true)}
          className="flex flex-col items-center justify-center w-full py-4 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors mt-auto group"
        >
          <HelpCircle size={24} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] mt-1 font-medium">Help</span>
        </button>
      </div>

      {/* 도움말 & 피드백 팝업 모달 */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}

export default SidebarPrimary;

