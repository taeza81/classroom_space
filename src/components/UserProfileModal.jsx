import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { X, LogOut, HardDrive, UserCheck, ShieldCheck, School, Mail, Check } from 'lucide-react';

export default function UserProfileModal() {
  const { user, isProfileModalOpen, setIsProfileModalOpen, logout, updateProfile, isDriveSyncEnabled, toggleDriveSync } = useAuth();
  const { projects } = useProject();

  const [name, setName] = useState(user?.name || '');
  const [schoolName, setSchoolName] = useState(user?.schoolName || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isProfileModalOpen || !user) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name, schoolName });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => setIsProfileModalOpen(false)} />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-100 z-10 animate-in zoom-in-95 duration-200 select-none">
        {/* 닫기 버튼 */}
        <button
          onClick={() => setIsProfileModalOpen(false)}
          className="absolute top-5 right-5 w-8.5 h-8.5 bg-slate-100 hover:bg-slate-900 text-slate-500 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-115 hover:rotate-90 hover:shadow-md active:scale-95 border border-slate-200 hover:border-slate-900 cursor-pointer"
          title="닫기"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* 프로필 헤더 */}
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border-2 border-blue-200 p-1 flex items-center justify-center shadow-md shrink-0 overflow-hidden">
            <img src={user.picture || '/logo.png'} alt={user.name} className="w-full h-full object-cover rounded-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-black text-slate-900 truncate">{user.name}</h2>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">인증 완료</span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
              <Mail size={12} /> {user.email}
            </p>
          </div>
        </div>

        {/* 개인 정보 수정 폼 */}
        <form onSubmit={handleSave} className="space-y-4 mb-6">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">선생님 성함 / 닉네임</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">소속 학교명</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all text-slate-800"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            {savedSuccess ? <><Check size={14} className="text-emerald-400" /> 프로필 저장 완료</> : '프로필 정보 수정하기'}
          </button>
        </form>

        {/* 개인 Google 드라이브 연동 상태 카드 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 p-4 rounded-2xl border border-blue-100 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <HardDrive size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">개인 클라우드 자동 동기화</h4>
                <p className="text-[11px] text-slate-500">내 계정 전용 공간에 도면 자동 보관</p>
              </div>
            </div>
            <button
              onClick={() => setIsDriveSyncEnabled(prev => !prev)}
              className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                isDriveSyncEnabled ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${
                  isDriveSyncEnabled ? 'translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-blue-100/80 flex items-center justify-between text-[11px] text-slate-600">
            <span>보유 프로젝트: <strong className="text-blue-700 font-bold">{projects.length}개</strong></span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck size={12} /> 암호화 저장 활성화
            </span>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <button
          onClick={logout}
          className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
        >
          <LogOut size={15} />
          <span>계정 로그아웃</span>
        </button>
      </div>
    </div>
  );
}
