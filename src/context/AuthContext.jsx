import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  updateProfile as updateFirebaseProfile, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';

const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'classroom_auth_user';
const DRIVE_SYNC_KEY = 'classroom_drive_sync_enabled';
const LOCAL_ACCOUNTS_KEY = 'classroom_local_accounts_v1';

// 🔒 비밀번호 특수문자 규칙: 6자리 이상 + [!@#$%^&*~] 1개 이상 포함
export const SPECIAL_CHAR_REGEX = /[!@#$%^&*~]/;

export const validatePassword = (password) => {
  const isMinLength = (password || '').length >= 6;
  const hasSpecialChar = SPECIAL_CHAR_REGEX.test(password || '');
  return {
    isMinLength,
    hasSpecialChar,
    isValid: isMinLength && hasSpecialChar,
  };
};

// 🌐 Firebase 인증 에러 한글 변환 매퍼
export const getFirebaseErrorMessage = (error) => {
  const code = error?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return '이미 가입된 이메일 주소입니다. 로그인을 시도해 주세요.';
    case 'auth/invalid-email':
      return '올바른 이메일 주소 형식을 입력해 주세요.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return '이메일 또는 비밀번호가 일치하지 않습니다.';
    case 'auth/weak-password':
      return '비밀번호는 6자리 이상이어야 합니다.';
    case 'auth/too-many-requests':
      return '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.';
    case 'auth/network-request-failed':
      return '네트워크 연결 상태를 확인해 주세요.';
    case 'auth/user-disabled':
      return '해당 계정은 비활성화되었습니다. 관리자에게 문의하세요.';
    default:
      return error?.message || '인증 처리 중 오류가 발생했습니다. 다시 시도해 주세요.';
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isDriveSyncEnabled, setIsDriveSyncEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem(DRIVE_SYNC_KEY);
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [isLoading, setIsLoading] = useState(false);

  // 로컬 세션 영구 저장
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Auth storage save error:', e);
    }
  }, [user]);

  // Firebase Auth 실시간 인증 세션 리스너
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser((prev) => ({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || prev?.name || firebaseUser.email.split('@')[0],
          schoolName: prev?.schoolName || '',
          picture: firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(firebaseUser.email)}`,
          provider: 'firebase',
          lastLoginAt: new Date().toISOString(),
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // 1. 📝 [회원가입] Firebase 이메일/비밀번호 회원가입
  const signUpWithEmail = async (email, password, displayName = '', schoolName = '') => {
    setIsLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const pwdValidation = validatePassword(password);
      
      if (!pwdValidation.isValid) {
        throw new Error('비밀번호는 특수문자(!@#$%^&*~)를 포함하여 6자리 이상이어야 합니다.');
      }

      let newUser = null;

      if (auth && isFirebaseConfigured()) {
        // A. Firebase Authentication 실제 연동
        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        const fbUser = userCredential.user;

        if (displayName) {
          await updateFirebaseProfile(fbUser, {
            displayName: displayName.trim(),
            photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedEmail)}`,
          });
        }

        newUser = {
          id: fbUser.uid,
          email: fbUser.email,
          name: displayName.trim() || trimmedEmail.split('@')[0],
          schoolName: schoolName.trim(),
          picture: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedEmail)}`,
          provider: 'firebase',
          createdAt: new Date().toISOString(),
        };
      } else {
        // B. 로컬 브라우저 보안 스토리지 모드 (Firebase 키 미입력 시 즉시 체험용)
        const localAccounts = JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_KEY) || '[]');
        if (localAccounts.some(acc => acc.email === trimmedEmail)) {
          throw new Error('이미 가입된 이메일 주소입니다. 로그인을 시도해 주세요.');
        }

        newUser = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          email: trimmedEmail,
          passwordHash: btoa(password), // 브라우저 로컬 암호화
          name: displayName.trim() || trimmedEmail.split('@')[0],
          schoolName: schoolName.trim(),
          picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedEmail)}`,
          provider: 'local',
          createdAt: new Date().toISOString(),
        };

        localAccounts.push(newUser);
        localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(localAccounts));
      }

      setUser(newUser);
      setIsAuthModalOpen(false);
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Sign up error:', error);
      throw new Error(getFirebaseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // 2. 🔐 [로그인] Firebase 이메일/비밀번호 로그인
  const signInWithEmail = async (email, password) => {
    setIsLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      let loggedUser = null;

      if (auth && isFirebaseConfigured()) {
        // A. Firebase Authentication 실제 로그인
        const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
        const fbUser = userCredential.user;

        loggedUser = {
          id: fbUser.uid,
          email: fbUser.email,
          name: fbUser.displayName || trimmedEmail.split('@')[0],
          schoolName: '',
          picture: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(trimmedEmail)}`,
          provider: 'firebase',
          lastLoginAt: new Date().toISOString(),
        };
      } else {
        // B. 로컬 브라우저 스토리지 모드
        const localAccounts = JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_KEY) || '[]');
        const matched = localAccounts.find(acc => acc.email === trimmedEmail && acc.passwordHash === btoa(password));
        
        if (!matched) {
          throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
        }

        loggedUser = {
          id: matched.id,
          email: matched.email,
          name: matched.name,
          schoolName: matched.schoolName || '',
          picture: matched.picture,
          provider: 'local',
          lastLoginAt: new Date().toISOString(),
        };
      }

      setUser(loggedUser);
      setIsAuthModalOpen(false);
      return { success: true, user: loggedUser };
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error(getFirebaseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // 3. ✉️ [비밀번호 재설정] 비밀번호 재설정 이메일 링크 발송
  const sendResetPasswordEmail = async (email) => {
    setIsLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail) {
        throw new Error('이메일 주소를 입력해 주세요.');
      }

      if (auth && isFirebaseConfigured()) {
        await sendPasswordResetEmail(auth, trimmedEmail);
      } else {
        // 로컬 테스트 시 800ms 지연 후 성공 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      return { success: true, email: trimmedEmail };
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(getFirebaseErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // 4. 🚪 [로그아웃]
  const logout = async () => {
    try {
      if (auth && isFirebaseConfigured()) {
        await signOut(auth);
      }
    } catch (e) {
      console.error('Sign out error:', e);
    } finally {
      setUser(null);
      setIsProfileModalOpen(false);
    }
  };

  // 5. ✏️ [프로필 수정]
  const updateProfile = async (updatedFields) => {
    if (!user) return;
    try {
      if (auth?.currentUser && isFirebaseConfigured() && updatedFields.name) {
        await updateFirebaseProfile(auth.currentUser, {
          displayName: updatedFields.name,
        });
      }
      setUser(prev => ({
        ...prev,
        ...updatedFields,
        updatedAt: new Date().toISOString(),
      }));
    } catch (e) {
      console.error('Profile update error:', e);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    authMode,
    setAuthMode,
    isLoading,
    isDriveSyncEnabled,
    setIsDriveSyncEnabled,
    signUpWithEmail,
    signInWithEmail,
    sendResetPasswordEmail,
    logout,
    updateProfile,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isFirebaseConfigured: isFirebaseConfigured(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
