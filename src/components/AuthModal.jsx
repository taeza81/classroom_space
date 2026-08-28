import React, { useState, useEffect } from 'react';
import { useAuth, validatePassword } from '../context/AuthContext';
import { 
  X, Mail, Lock, User, School, Eye, EyeOff, Check, 
  AlertCircle, CheckCircle2, ArrowLeft 
} from 'lucide-react';

export default function AuthModal() {
  const { 
    isAuthModalOpen, setIsAuthModalOpen, 
    authMode, setAuthMode, 
    signInWithEmail, signUpWithEmail, sendResetPasswordEmail, 
    isLoading 
  } = useAuth();

  // 폼 입력 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 모달이 열릴 때마다 폼 상태 초기화
  useEffect(() => {
    if (isAuthModalOpen) {
      setErrorMessage('');
      setSuccessMessage('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isAuthModalOpen, authMode]);

  if (!isAuthModalOpen) return null;

  // 비밀번호 실시간 유효성 체크
  const pwdValidation = validatePassword(password);
  const isPasswordMatch = confirmPassword.length > 0 && password === confirmPassword;

  // 1. 🔐 로그인 제출
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('이메일 주소를 입력해 주세요.');
      return;
    }
    if (!password) {
      setErrorMessage('비밀번호를 입력해 주세요.');
      return;
    }

    try {
      await signInWithEmail(email, password);
    } catch (err) {
      setErrorMessage(err.message || '로그인에 실패했습니다.');
    }
  };

  // 2. ✨ 회원가입 제출
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('이메일 주소를 입력해 주세요.');
      return;
    }
    if (!pwdValidation.isMinLength) {
      setErrorMessage('비밀번호는 최소 6자리 이상이어야 합니다.');
      return;
    }
    if (!pwdValidation.hasSpecialChar) {
      setErrorMessage('비밀번호에 특수문자(!@#$%^&*~)가 1개 이상 포함되어야 합니다.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      await signUpWithEmail(email, password);
    } catch (err) {
      setErrorMessage(err.message || '회원가입에 실패했습니다.');
    }
  };

  // 3. ✉️ 비밀번호 재설정 메일 발송 제출
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('가입 시 등록한 이메일 주소를 입력해 주세요.');
      return;
    }

    try {
      await sendResetPasswordEmail(email);
      setSuccessMessage(`${email} 주소로 비밀번호 재설정 링크가 발송되었습니다. 메일함을 확인해 주세요.`);
    } catch (err) {
      setErrorMessage(err.message || '비밀번호 재설정 메일 발송에 실패했습니다.');
    }
  };

  // 4. ⚙️ Firebase 설정 저장
  const handleSaveFirebaseConfig = (e) => {
    e.preventDefault();
    if (!customApiKey.trim() || !customProjectId.trim()) {
      alert('API Key와 Project ID는 필수 입력값입니다.');
      return;
    }
    saveCustomFirebaseConfig({
      apiKey: customApiKey.trim(),
      authDomain: customAuthDomain.trim() || `${customProjectId.trim()}.firebaseapp.com`,
      projectId: customProjectId.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => setIsAuthModalOpen(false)} />

      <div className="relative w-full max-w-[440px] bg-white rounded-3xl shadow-2xl p-7 md:p-8 border border-slate-200 z-10 animate-in zoom-in-95 duration-200 select-none max-h-[94vh] flex flex-col">
        {/* 닫기 버튼 */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 w-8.5 h-8.5 bg-slate-100 hover:bg-slate-900 text-slate-500 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-115 hover:rotate-90 hover:shadow-md active:scale-95 border border-slate-200 hover:border-slate-900 cursor-pointer"
          title="닫기"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* 상단 브랜딩 & 타이틀 */}
        <div className="text-center mb-5 shrink-0">
          <div className="w-24 h-24 mx-auto mb-3 rounded-3xl bg-white border-2 border-slate-200/90 p-2 flex items-center justify-center shadow-lg hover:scale-105 transition-all">
            <img src="/logo.png" alt="오쌤 INFO" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {authMode === 'login' && '로그인'}
            {authMode === 'signup' && '회원가입'}
            {authMode === 'forgot' && '비밀번호 찾기'}
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            {authMode === 'login' && '교실 공간 구조화 시뮬레이터에 로그인하세요.'}
            {authMode === 'signup' && '새 계정을 만들고 교실 도면을 안전하게 보관하세요.'}
            {authMode === 'forgot' && '가입하신 이메일로 비밀번호 재설정 링크를 보내드립니다.'}
          </p>
        </div>

        {/* 🌟 세그먼트 캡슐 탭 (로그인 / 회원가입 전환) - 고대비 선명한 스타일 */}
        {authMode !== 'forgot' && (
          <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center border border-slate-200/90 mb-5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-blue-600 shadow-md border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-blue-600 shadow-md border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              회원가입
            </button>
          </div>
        )}

        {/* 에러 및 성공 알림 배너 */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-bold flex items-start gap-2 animate-in fade-in duration-150 shrink-0 shadow-2xs">
            <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-start gap-2 animate-in fade-in duration-150 shrink-0 shadow-2xs">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{successMessage}</span>
          </div>
        )}

        {/* 폼 본문 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* ========================================================= */}
          {/* 1. [로그인 폼] */}
          {/* ========================================================= */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  이메일 주소 (ID)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    placeholder="example@school.kr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    비밀번호
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot');
                      setErrorMessage('');
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    비밀번호를 잊으셨나요?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력해 주세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* 로그인 전용 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-2xl text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center disabled:bg-blue-400"
              >
                <span>{isLoading ? '로그인 중...' : '로그인'}</span>
              </button>

              <div className="pt-2 text-center">
                <span className="text-xs text-slate-500 font-medium">아직 계정이 없으신가요? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMessage('');
                  }}
                  className="text-xs font-black text-blue-600 hover:underline cursor-pointer ml-1"
                >
                  회원가입
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* 2. [회원가입 폼] */}
          {/* ========================================================= */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  이메일 주소 (ID) <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    placeholder="example@school.kr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>



              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  비밀번호 <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="6자 이상 + 특수문자(!@#$%^&*~)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  비밀번호 확인 <span className="text-rose-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 다시 입력하세요"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* 🌟 실시간 비밀번호 조건 충족 뱃지 (선명한 고대비 스타일) */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                  pwdValidation.isMinLength 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-400 shadow-2xs' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  <Check size={12} strokeWidth={pwdValidation.isMinLength ? 3 : 2} className={pwdValidation.isMinLength ? 'text-emerald-600' : 'text-slate-400'} />
                  <span>6자리 이상</span>
                </div>

                <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                  pwdValidation.hasSpecialChar 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-400 shadow-2xs' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  <Check size={12} strokeWidth={pwdValidation.hasSpecialChar ? 3 : 2} className={pwdValidation.hasSpecialChar ? 'text-emerald-600' : 'text-slate-400'} />
                  <span>특수문자(!@#$%^&*~)</span>
                </div>

                <div className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                  isPasswordMatch 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-400 shadow-2xs' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  <Check size={12} strokeWidth={isPasswordMatch ? 3 : 2} className={isPasswordMatch ? 'text-emerald-600' : 'text-slate-400'} />
                  <span>비밀번호 일치</span>
                </div>
              </div>

              {/* 회원가입 전용 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-2xl text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center disabled:bg-blue-400"
              >
                <span>{isLoading ? '가입 처리 중...' : '회원가입'}</span>
              </button>

              <div className="pt-1.5 text-center">
                <span className="text-xs text-slate-500 font-medium">이미 계정이 있으신가요? </span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage('');
                  }}
                  className="text-xs font-black text-blue-600 hover:underline cursor-pointer ml-1"
                >
                  로그인
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* 3. [비밀번호 찾기 폼] */}
          {/* ========================================================= */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  가입 시 등록한 이메일 주소
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    placeholder="example@school.kr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-500/15 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200 text-xs text-blue-900 leading-relaxed font-medium">
                • 입력하신 이메일로 안전한 비밀번호 재설정 링크가 포함된 메일이 발송됩니다.<br />
                • 메일함에서 링크를 클릭하여 새 비밀번호로 변경하세요.
              </div>

              {/* 비밀번호 재설정 발송 전용 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold rounded-2xl text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center disabled:bg-blue-400"
              >
                <span>{isLoading ? '발송 중...' : '비밀번호 재설정 링크 발송'}</span>
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-xs font-bold text-slate-700 hover:text-slate-950 flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>로그인으로 돌아가기</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
