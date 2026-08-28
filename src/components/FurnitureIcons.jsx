import React from 'react';

// 🎨 3D 모델과 100% 동일한 45도 아이소메트릭(Isometric) 고해상도 비품 썸네일 아이콘 컬렉션

// 1. 🪑 학생 책상 (화이트 상판 + 다크 슬레이트 엣지 + T자 스틸 레그 & 발굽 + 하부 서랍 트레이)
export function StudentDeskIcon() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm select-none">
      {/* 바닥 그림자 */}
      <polygon points="18,65 52,78 82,65 48,52" fill="rgba(0,0,0,0.06)" />
      
      {/* 좌측 T자형 화이트 스틸 레그 & 차콜 발굽 */}
      <polygon points="20,51 36,45 36,50 20,56" fill="#e2e8f0" />
      <polygon points="18,52 24,50 24,55 18,57" fill="#334155" />
      <polygon points="32,46 38,44 38,49 32,51" fill="#334155" />
      <rect x="26" y="32" width="4" height="20" rx="1" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />

      {/* 우측 T자형 화이트 스틸 레그 & 차콜 발굽 */}
      <polygon points="62,39 78,33 78,38 62,44" fill="#e2e8f0" />
      <polygon points="60,40 66,38 66,43 60,45" fill="#334155" />
      <polygon points="74,34 80,32 80,37 74,39" fill="#334155" />
      <rect x="68" y="24" width="4" height="19" rx="1" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />

      {/* 하단 좌우 연결 보강 바 */}
      <line x1="28" y1="46" x2="70" y2="33" stroke="#e2e8f0" strokeWidth="2.5" />

      {/* 하부 다크 서랍 트레이 */}
      <polygon points="50,30 78,39 50,49 22,40" fill="#1e293b" />
      <polygon points="22,40 50,49 50,54 22,45" fill="#0f172a" />
      <polygon points="50,49 78,39 78,44 50,54" fill="#1e293b" />

      {/* 책상 상판 (클린 화이트 상판 + 다크 슬레이트 엣지 몰딩) */}
      <polygon points="50,15 86,27 50,40 14,28" fill="#ffffff" stroke="#334155" strokeWidth="1.2" />
      <polygon points="14,28 50,40 50,43 14,31" fill="#334155" />
      <polygon points="50,40 86,27 86,30 50,43" fill="#475569" />
      {/* 상단 펜 홈 가이드 라인 */}
      <line x1="42" y1="20" x2="68" y2="28" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,2" />
    </svg>
  );
}

// 2. 💺 학생 의자 (화이트 스탠드 듀얼 기둥 + 로얄블루 2톤 좌판 & 등받이 + 하부 수납 바구니)
export function StudentChairIcon() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm select-none">
      {/* 바닥 그림자 */}
      <polygon points="26,66 50,76 74,66 50,56" fill="rgba(0,0,0,0.06)" />

      {/* 좌측 화이트 T자 베이스 & 차콜 풋캡 */}
      <polygon points="26,54 40,48 40,53 26,59" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />
      <polygon points="24,55 29,53 29,58 24,60" fill="#334155" />
      <polygon points="37,49 42,47 42,52 37,54" fill="#334155" />
      <rect x="30" y="42" width="3" height="13" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" rx="0.5" />
      <rect x="35" y="40" width="3" height="13" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" rx="0.5" />

      {/* 우측 화이트 T자 베이스 & 차콜 풋캡 */}
      <polygon points="60,42 74,36 74,41 60,47" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" />
      <polygon points="58,43 63,41 63,46 58,48" fill="#334155" />
      <polygon points="71,37 76,35 76,40 71,42" fill="#334155" />
      <rect x="64" y="30" width="3" height="13" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" rx="0.5" />
      <rect x="69" y="28" width="3" height="13" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.5" rx="0.5" />

      {/* 하단 연결 수평 빔 */}
      <line x1="33" y1="50" x2="67" y2="36" stroke="#f8fafc" strokeWidth="2.5" />

      {/* 좌판 하부 수납 바구니 */}
      <polygon points="50,37 68,44 50,52 32,45" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />

      {/* 등받이 지지 스틸 튜브 */}
      <line x1="38" y1="40" x2="38" y2="20" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="62" y1="30" x2="62" y2="10" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />

      {/* 화이트-로얄블루 2톤 좌판 */}
      <polygon points="50,32 74,39 50,47 26,40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      <polygon points="26,40 50,47 50,50 26,43" fill="#cbd5e1" />
      <polygon points="50,47 74,39 74,42 50,50" fill="#94a3b8" />
      <polygon points="50,33.5 70,39.5 50,45.5 30,40.5" fill="#2563eb" />

      {/* 화이트-로얄블루 2톤 등받이 */}
      <polygon points="40,10 60,10 64,28 36,28" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      <polygon points="42,12 58,12 61,26 39,26" fill="#2563eb" />
      <circle cx="38" cy="15" r="1" fill="#cbd5e1" />
      <circle cx="38" cy="23" r="1" fill="#cbd5e1" />
      <circle cx="62" cy="15" r="1" fill="#cbd5e1" />
      <circle cx="62" cy="23" r="1" fill="#cbd5e1" />
    </svg>
  );
}

// 3. 👨‍🏫 교사 책상 (원목 상판 + 우측 3단 서랍 & 실버 손잡이 + 전면 가림판)
export function TeacherDeskIcon() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm select-none">
      <defs>
        <linearGradient id="teacherWoodTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      {/* 그림자 */}
      <polygon points="12,68 50,80 88,68 50,54" fill="rgba(0,0,0,0.06)" />
      
      {/* 좌측 패널 다리 */}
      <polygon points="16,33 24,30 24,67 16,70" fill="#78350f" />

      {/* 전면 프라이버시 가림판 (Modesty Panel) */}
      <polygon points="24,35 60,25 60,60 24,70" fill="#92400e" stroke="#78350f" strokeWidth="0.5" />

      {/* 우측 3단 서랍장 바디 */}
      <polygon points="60,25 84,17 84,55 60,63" fill="#b45309" stroke="#78350f" strokeWidth="0.5" />
      <polygon points="44,31 60,25 60,63 44,69" fill="#d97706" stroke="#92400e" strokeWidth="0.5" />

      {/* 서랍 3단 분할선 & 실버 바 손잡이 */}
      <line x1="44" y1="43" x2="60" y2="37" stroke="#78350f" strokeWidth="1" />
      <line x1="44" y1="55" x2="60" y2="49" stroke="#78350f" strokeWidth="1" />
      
      {/* 1단 손잡이 */}
      <line x1="50" y1="36" x2="55" y2="34" stroke="#f8fafc" strokeWidth="1.8" strokeLinecap="round" />
      {/* 2단 손잡이 */}
      <line x1="50" y1="47" x2="55" y2="45" stroke="#f8fafc" strokeWidth="1.8" strokeLinecap="round" />
      {/* 3단 손잡이 */}
      <line x1="50" y1="59" x2="55" y2="57" stroke="#f8fafc" strokeWidth="1.8" strokeLinecap="round" />

      {/* 프리미엄 원목 상판 */}
      <polygon points="50,14 88,26 50,40 12,28" fill="url(#teacherWoodTop)" stroke="#78350f" strokeWidth="1" />
      <polygon points="12,28 50,40 50,43 12,31" fill="#78350f" />
      <polygon points="50,40 88,26 88,29 50,43" fill="#92400e" />
    </svg>
  );
}

// 4. 🗄️ 교구장(1단, 긴 문) (화이트 바디 + 옐로우/그린 2색 롱 도어 + 이름표 + 실버 손잡이)
export function CabinetSingleTallDoorIcon() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm select-none">
      <defs>
        <linearGradient id="tallWood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#facc15" />
        </linearGradient>
        <linearGradient id="tallGreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#bbf7d0" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
      </defs>
      <polygon points="16,68 50,78 84,68 50,58" fill="rgba(0,0,0,0.06)" />
      
      {/* 알루미늄 베이스 발굽 */}
      <rect x="22" y="62" width="4" height="6" rx="1" fill="#cbd5e1" />
      <rect x="44" y="67" width="4" height="6" rx="1" fill="#94a3b8" />
      <rect x="74" y="60" width="4" height="6" rx="1" fill="#cbd5e1" />

      {/* 상단 화이트 상판 */}
      <polygon points="50,14 84,24 50,34 16,24" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
      <polygon points="16,24 50,34 50,37 16,27" fill="#cbd5e1" />
      <polygon points="50,34 84,24 84,27 50,37" fill="#94a3b8" />
      
      {/* 좌측 옐로우 도어 */}
      <polygon points="18,28 34,32 34,68 18,63" fill="url(#tallWood)" stroke="#ca8a04" strokeWidth="0.8" />
      {/* 우측 연두색 도어 */}
      <polygon points="35,32 50,36 50,72 35,68" fill="url(#tallGreen)" stroke="#16a34a" strokeWidth="0.8" />
      {/* 우측 바디면 */}
      <polygon points="50,36 82,27 82,63 50,72" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />

      {/* 상단 이름표 */}
      <rect x="21" y="31" width="10" height="3" rx="0.5" fill="#38bdf8" transform="skewY(14)" />
      <rect x="38" y="35" width="10" height="3" rx="0.5" fill="#ffffff" stroke="#16a34a" strokeWidth="0.5" transform="skewY(14)" />

      {/* 실버 매립형 포켓 손잡이 */}
      <rect x="22" y="44" width="4.5" height="7" rx="0.8" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.6" transform="skewY(14)" />
      <rect x="23.5" y="45.5" width="2" height="4" fill="#334155" transform="skewY(14)" />
      <rect x="38" y="48" width="4.5" height="7" rx="0.8" fill="#ffffff" stroke="#16a34a" strokeWidth="0.6" transform="skewY(14)" />
      <rect x="39.5" y="49.5" width="2" height="4" fill="#1e293b" transform="skewY(14)" />

      {/* 1단 뱃지 */}
      <rect x="54" y="8" width="18" height="8" rx="2" fill="#84cc16" />
      <text x="63" y="14.5" fontSize="5.5" fontWeight="bold" fill="#ffffff" textAnchor="middle">1단 도어</text>
    </svg>
  );
}

// 5. 📚 교구장(3단, 문 없음) (3단 오픈 선반 + 파스텔 컬러 뒷판 + 3단 뱃지)
export function CabinetOpen3TierIcon() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm select-none">
      <polygon points="20,68 50,78 80,68 50,58" fill="rgba(0,0,0,0.06)" />
      
      {/* 화이트 곡면 측판 */}
      <path d="M 22,22 Q 22,14 26,14 L 46,21 L 46,67 L 22,60 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
      {/* 우측면 */}
      <polygon points="46,21 76,12 76,58 46,67" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
      
      {/* 3단 백패널 (옐로우, 오렌지, 블루) */}
      <polygon points="26,16 72,7 72,23 26,32" fill="#fef08a" />
      <polygon points="26,32 72,23 72,39 26,48" fill="#fed7aa" />
      <polygon points="26,48 72,39 72,55 26,64" fill="#bae6fd" />

      {/* 3단 선반들 */}
      <polygon points="24,32 74,23 74,25 24,34" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.5" />
      <polygon points="24,47 74,38 74,40 24,49" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.5" />
      <polygon points="24,62 74,53 74,55 24,64" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.5" />

      {/* 3단 뱃지 */}
      <rect x="52" y="2" width="16" height="8" rx="2" fill="#eab308" />
      <text x="60" y="8.5" fontSize="6" fontWeight="bold" fill="#ffffff" textAnchor="middle">3단</text>
    </svg>
  );
}

// 6. 📚 교구장(4단, 문 없음) (4단 오픈 선반 + 4색 파스텔 선반 + 4단 뱃지)
export function CabinetOpen4TierIcon() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm select-none">
      <polygon points="20,70 50,78 80,70 50,62" fill="rgba(0,0,0,0.06)" />
      
      {/* 좌측 측판 (화이트) */}
      <path d="M 22,18 Q 22,10 26,10 L 46,17 L 46,69 L 22,62 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
      {/* 우측면 */}
      <polygon points="46,17 76,8 76,60 46,69" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
      
      {/* 뒷판 화이트 */}
      <polygon points="26,12 72,3 72,55 26,64" fill="#ffffff" />
      
      {/* 4단 알록달록 선반 (노랑, 연두, 분홍, 민트) */}
      <polygon points="24,23 74,14 74,17 24,26" fill="#fde047" stroke="#eab308" strokeWidth="0.5" />
      <polygon points="24,37 74,28 74,31 24,40" fill="#86efac" stroke="#22c55e" strokeWidth="0.5" />
      <polygon points="24,51 74,42 74,45 24,54" fill="#f9a8d4" stroke="#ec4899" strokeWidth="0.5" />
      <polygon points="24,65 74,56 74,59 24,68" fill="#67e8f9" stroke="#06b6d4" strokeWidth="0.5" />

      {/* 4단 뱃지 */}
      <rect x="52" y="1" width="16" height="8" rx="2" fill="#3b82f6" />
      <text x="60" y="7.5" fontSize="6" fontWeight="bold" fill="#ffffff" textAnchor="middle">4단</text>
    </svg>
  );
}

// 7. 🚪 교구장(3단, 문 있음) (3단 수납장 + 화이트/스카이블루 도어 + 실버 손잡이 + 3단 뱃지)
export function CabinetClosed3TierIcon() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm select-none">
      <polygon points="20,68 50,78 80,68 50,58" fill="rgba(0,0,0,0.06)" />
      
      {/* 상판 */}
      <polygon points="50,16 78,24 50,34 22,24" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
      {/* 전면 도어 (스카이블루) */}
      <polygon points="22,24 50,34 50,70 22,60" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" />
      {/* 우측면 */}
      <polygon points="50,34 78,24 78,60 50,70" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
      
      {/* 양개형 도어 중앙 분할선 */}
      <line x1="36" y1="29" x2="36" y2="65" stroke="#0284c7" strokeWidth="1.5" />
      {/* 실버 바 손잡이 2개 */}
      <rect x="33" y="44" width="2" height="6" rx="0.8" fill="#1e293b" />
      <rect x="37" y="46" width="2" height="6" rx="0.8" fill="#1e293b" />

      {/* 3단 뱃지 */}
      <rect x="52" y="3" width="16" height="8" rx="2" fill="#0284c7" />
      <text x="60" y="9.5" fontSize="6" fontWeight="bold" fill="#ffffff" textAnchor="middle">3단</text>
    </svg>
  );
}

// 8. 🚪 교구장(4단, 문 있음) (4단 수납장 + 화이트/블루 도어 + 실버 손잡이 + 4단 뱃지)
export function CabinetClosed4TierIcon() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm select-none">
      <polygon points="20,70 50,78 80,70 50,62" fill="rgba(0,0,0,0.06)" />
      
      {/* 상판 */}
      <polygon points="50,10 78,18 50,28 22,18" fill="#ffffff" stroke="#94a3b8" strokeWidth="1" />
      {/* 전면 도어 (소프트 블루) */}
      <polygon points="22,18 50,28 50,72 22,62" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
      {/* 우측면 */}
      <polygon points="50,28 78,18 78,62 50,72" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
      
      {/* 중앙 분할선 */}
      <line x1="36" y1="23" x2="36" y2="67" stroke="#1d4ed8" strokeWidth="1.5" />
      {/* 실버 손잡이 2개 */}
      <rect x="33" y="42" width="2" height="8" rx="0.8" fill="#1e293b" />
      <rect x="37" y="44" width="2" height="8" rx="0.8" fill="#1e293b" />

      {/* 4단 뱃지 */}
      <rect x="52" y="1" width="16" height="8" rx="2" fill="#1d4ed8" />
      <text x="60" y="7.5" fontSize="6" fontWeight="bold" fill="#ffffff" textAnchor="middle">4단</text>
    </svg>
  );
}

// 9. 👟 신발장(2단) (2단 3열 = 6칸 오픈 수납 격자 + 원목 프레임 + 2단 뱃지)
export function ShoeRack2TierIcon() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm select-none">
      <defs>
        <linearGradient id="shoeWoodTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
      </defs>
      <polygon points="16,68 50,78 84,68 50,58" fill="rgba(0,0,0,0.06)" />
      
      {/* 다리발 */}
      <rect x="22" y="62" width="4" height="6" rx="1" fill="#cbd5e1" />
      <rect x="46" y="68" width="4" height="6" rx="1" fill="#94a3b8" />
      <rect x="74" y="60" width="4" height="6" rx="1" fill="#cbd5e1" />

      {/* 상판 */}
      <polygon points="50,18 84,26 50,36 16,26" fill="#ffffff" stroke="#d97706" strokeWidth="1" />
      
      {/* 2단 3열 오픈 수납 격자 바디 */}
      <polygon points="16,26 50,36 50,68 16,58" fill="#fef3c7" stroke="#ca8a04" strokeWidth="1" />
      <polygon points="50,36 84,26 84,58 50,68" fill="#ca8a04" />
      
      {/* 세로 격자 분할선 2개 (3열 형성) */}
      <line x1="27" y1="29" x2="27" y2="61" stroke="#a16207" strokeWidth="1.2" />
      <line x1="39" y1="33" x2="39" y2="65" stroke="#a16207" strokeWidth="1.2" />
      {/* 가로 격자 분할선 1개 (2단 형성) */}
      <line x1="16" y1="42" x2="50" y2="52" stroke="#a16207" strokeWidth="1.5" />

      {/* 내부 신발 실루엣 */}
      <ellipse cx="22" cy="38" rx="3" ry="1.5" fill="#3b82f6" />
      <ellipse cx="33" cy="42" rx="3" ry="1.5" fill="#ef4444" />
      <ellipse cx="44" cy="46" rx="3" ry="1.5" fill="#10b981" />
      <ellipse cx="22" cy="51" rx="3" ry="1.5" fill="#f59e0b" />
      <ellipse cx="33" cy="55" rx="3" ry="1.5" fill="#8b5cf6" />
      <ellipse cx="44" cy="59" rx="3" ry="1.5" fill="#06b6d4" />

      {/* 2단 뱃지 */}
      <rect x="54" y="6" width="16" height="8" rx="2" fill="#0284c7" />
      <text x="62" y="12.5" fontSize="6" fontWeight="bold" fill="#ffffff" textAnchor="middle">2단</text>
    </svg>
  );
}

// 10. 👟 신발장(3단) (3단 3열 = 9칸 오픈 수납 격자 + 원목 프레임 + 3단 뱃지)
export function ShoeRack3TierIcon() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm select-none">
      <polygon points="16,70 50,78 84,70 50,62" fill="rgba(0,0,0,0.06)" />
      
      {/* 다리발 */}
      <rect x="22" y="64" width="4" height="6" rx="1" fill="#cbd5e1" />
      <rect x="46" y="70" width="4" height="6" rx="1" fill="#94a3b8" />
      <rect x="74" y="62" width="4" height="6" rx="1" fill="#cbd5e1" />

      {/* 상판 */}
      <polygon points="50,10 84,18 50,28 16,18" fill="#ffffff" stroke="#d97706" strokeWidth="1" />
      
      {/* 3단 3열 오픈 수납 격자 바디 */}
      <polygon points="16,18 50,28 50,70 16,60" fill="#fef3c7" stroke="#ca8a04" strokeWidth="1" />
      <polygon points="50,28 84,18 84,60 50,70" fill="#ca8a04" />
      
      {/* 세로 격자 분할선 2개 */}
      <line x1="27" y1="21" x2="27" y2="63" stroke="#a16207" strokeWidth="1.2" />
      <line x1="39" y1="25" x2="39" y2="67" stroke="#a16207" strokeWidth="1.2" />
      
      {/* 가로 격자 분할선 2개 (3단 형성) */}
      <line x1="16" y1="32" x2="50" y2="42" stroke="#a16207" strokeWidth="1.2" />
      <line x1="16" y1="46" x2="50" y2="56" stroke="#a16207" strokeWidth="1.2" />

      {/* 내부 신발 실루엣 */}
      <ellipse cx="22" cy="27" rx="2.5" ry="1.2" fill="#3b82f6" />
      <ellipse cx="33" cy="31" rx="2.5" ry="1.2" fill="#ef4444" />
      <ellipse cx="44" cy="35" rx="2.5" ry="1.2" fill="#10b981" />
      <ellipse cx="22" cy="41" rx="2.5" ry="1.2" fill="#f59e0b" />
      <ellipse cx="33" cy="45" rx="2.5" ry="1.2" fill="#8b5cf6" />
      <ellipse cx="44" cy="49" rx="2.5" ry="1.2" fill="#06b6d4" />
      <ellipse cx="22" cy="55" rx="2.5" ry="1.2" fill="#ec4899" />
      <ellipse cx="33" cy="59" rx="2.5" ry="1.2" fill="#14b8a6" />
      <ellipse cx="44" cy="63" rx="2.5" ry="1.2" fill="#eab308" />

      {/* 3단 뱃지 */}
      <rect x="54" y="2" width="16" height="8" rx="2" fill="#0f766e" />
      <text x="62" y="8.5" fontSize="6" fontWeight="bold" fill="#ffffff" textAnchor="middle">3단</text>
    </svg>
  );
}

// 11. 🚪 옷장 (화이트 롱 듀얼 도어 + 실버 롱 손잡이 + 상단 환기 그릴)
export function WardrobeIcon() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm select-none">
      <defs>
        <linearGradient id="wardrobeDoor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
      <polygon points="26,72 50,78 74,72 50,66" fill="rgba(0,0,0,0.06)" />
      
      {/* 상판 */}
      <polygon points="50,6 74,14 50,22 26,14" fill="#ffffff" stroke="#1e293b" strokeWidth="1" />
      {/* 전면 도어 바디 */}
      <polygon points="26,14 50,22 50,74 26,66" fill="url(#wardrobeDoor)" stroke="#94a3b8" strokeWidth="1" />
      {/* 우측면 */}
      <polygon points="50,22 74,14 74,66 50,74" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
      
      {/* 상단 통풍 루버 슬릿 */}
      <line x1="32" y1="19" x2="44" y2="23" stroke="#94a3b8" strokeWidth="1" />
      <line x1="32" y1="22" x2="44" y2="26" stroke="#94a3b8" strokeWidth="1" />

      {/* 중앙 분할선 */}
      <line x1="38" y1="18" x2="38" y2="70" stroke="#64748b" strokeWidth="1.5" />
      {/* 롱 실버 핸들 2개 */}
      <rect x="35" y="38" width="2" height="12" rx="1" fill="#1e293b" />
      <rect x="39" y="40" width="2" height="12" rx="1" fill="#1e293b" />
    </svg>
  );
}

// 12. 📺 전자칠판(벽부착형) (중앙 대형 스마트 블랙 글래스 디스플레이 + 좌/우 슬라이딩 화이트보드 날개 & 시간표)
export function ElectronicBoardIcon() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm select-none">
      <defs>
        <linearGradient id="smartScreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      {/* 바닥 그림자 */}
      <polygon points="10,68 50,78 90,68 50,58" fill="rgba(0,0,0,0.06)" />
      
      {/* 전체 실버 백플레이트 프레임 */}
      <polygon points="12,18 88,6 88,54 12,66" fill="#64748b" />
      <polygon points="13,19 87,7 87,53 13,65" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />

      {/* 좌측 보조 화이트보드 날개 (날짜 자석, 타이머) */}
      <polygon points="15,22 36,19 36,59 15,62" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.5" />
      <circle cx="21" cy="27" r="2" fill="#facc15" />
      <circle cx="28" cy="30" r="2.5" fill="#f1f5f9" stroke="#64748b" strokeWidth="0.5" />
      <line x1="17" y1="36" x2="33" y2="34" stroke="#94a3b8" strokeWidth="0.8" />
      <line x1="17" y1="40" x2="31" y2="38" stroke="#94a3b8" strokeWidth="0.8" />

      {/* 중앙 스마트 블랙 글래스 디스플레이 */}
      <polygon points="38,18 68,13 68,54 38,59" fill="url(#smartScreen)" stroke="#334155" strokeWidth="1" />
      <polygon points="40,20 66,15 66,50 40,55" fill="#0f172a" stroke="#1e293b" strokeWidth="0.5" />
      <circle cx="53" cy="35" r="1.2" fill="#475569" />

      {/* 우측 보조 화이트보드 날개 (시간표 블록) */}
      <polygon points="70,13 85,10 85,50 70,53" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.5" />
      <rect x="72" y="15" width="10" height="2.2" fill="#ef4444" transform="skewY(-12)" />
      <rect x="72" y="19" width="10" height="2.2" fill="#f97316" transform="skewY(-12)" />
      <rect x="72" y="23" width="10" height="2.2" fill="#eab308" transform="skewY(-12)" />
      <rect x="72" y="27" width="10" height="2.2" fill="#10b981" transform="skewY(-12)" />
      <rect x="72" y="31" width="10" height="2.2" fill="#3b82f6" transform="skewY(-12)" />
      <rect x="72" y="35" width="10" height="2.2" fill="#8b5cf6" transform="skewY(-12)" />

      {/* 하단 전자펜 트레이 & 터치펜 2개 */}
      <polygon points="12,65 88,53 88,56 12,68" fill="#94a3b8" />
      <line x1="44" y1="60" x2="52" y2="58" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="54" y1="58" x2="62" y2="56" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// 13. 📋 이동식 칠판 (스틸 스탠드 바퀴 + 양면 그린보드 + 분필 받침대)
export function WhiteboardIcon() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm select-none">
      <defs>
        <linearGradient id="boardGreen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#065f46" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
      </defs>
      <polygon points="16,68 50,78 84,68 50,58" fill="rgba(0,0,0,0.06)" />
      
      {/* 좌/우 H자형 화이트 스탠드 & 바퀴 4개 */}
      <line x1="26" y1="26" x2="26" y2="70" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round" />
      <line x1="74" y1="12" x2="74" y2="56" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round" />
      <line x1="18" y1="68" x2="34" y2="74" stroke="#f1f5f9" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="66" y1="54" x2="82" y2="60" stroke="#f1f5f9" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="18" cy="70" r="2.2" fill="#0f172a" />
      <circle cx="34" cy="76" r="2.2" fill="#0f172a" />
      <circle cx="66" cy="56" r="2.2" fill="#0f172a" />
      <circle cx="82" cy="62" r="2.2" fill="#0f172a" />

      {/* 하단 보강 바 */}
      <line x1="26" y1="60" x2="74" y2="46" stroke="#e2e8f0" strokeWidth="2.5" />

      {/* 그린 마그네틱 보드판 */}
      <polygon points="26,18 74,4 74,42 26,56" fill="url(#boardGreen)" stroke="#e2e8f0" strokeWidth="2" />
      {/* 분필/지우개 트레이 */}
      <polygon points="24,56 74,42 74,45 24,59" fill="#94a3b8" />
    </svg>
  );
}

// 14. 🚪 출입문 (다크 포털 프레임 + 원목 도어 패널 + 투명 유리창 + 실버 레버 핸들)
export function DoorIcon() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm select-none">
      <defs>
        <linearGradient id="doorWood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <polygon points="20,70 50,78 80,70 50,62" fill="rgba(0,0,0,0.06)" />
      
      {/* 1. 다크 포털 몰딩 외곽 프레임 */}
      <polygon points="26,8 34,9 34,70 26,68" fill="#0f172a" />
      <polygon points="68,18 76,19 76,80 68,78" fill="#0f172a" />
      <polygon points="26,8 76,19 76,24 26,13" fill="#0f172a" />
      
      {/* 2. 원목 도어 바디 패널 */}
      <polygon points="34,13 68,22 68,74 34,65" fill="url(#doorWood)" stroke="#92400e" strokeWidth="0.8" />
      
      {/* 3. 중앙 상단 시야 유리창 (Vision Glass) */}
      <polygon points="44,22 58,26 58,42 44,38" fill="#bae6fd" stroke="#0284c7" strokeWidth="0.8" opacity="0.85" />
      <line x1="44" y1="30" x2="58" y2="34" stroke="#ffffff" strokeWidth="0.8" opacity="0.7" />

      {/* 4. 실버 레버 핸들 & 키홀 */}
      <circle cx="62" cy="52" r="1.5" fill="#f8fafc" stroke="#64748b" strokeWidth="0.5" />
      <line x1="58" y1="52" x2="63" y2="53" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />

      {/* 5. 바닥 스테인리스 문턱 */}
      <polygon points="30,66 72,76 72,78 30,68" fill="#cbd5e1" />
    </svg>
  );
}

// 15. 🪟 창문 (클래식 원목 케이싱 & 와이드 창문턱 선반 + 2중 슬라이딩 유리 샷시 + 황동 잠금장치)
export function WindowIcon() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm select-none">
      <defs>
        <linearGradient id="schoolWood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="schoolGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
      </defs>
      <polygon points="12,68 50,78 88,68 50,58" fill="rgba(0,0,0,0.06)" />
      
      {/* 1. 짙은 원목 외부 케이싱 프레임 */}
      <polygon points="16,22 84,8 84,58 16,72" fill="#b45309" />
      
      {/* 2. 하단 와이드 창문턱 선반 (Rain Sill) */}
      <polygon points="14,68 86,54 86,58 14,72" fill="#92400e" stroke="#78350f" strokeWidth="0.5" />

      {/* 3. 내부 미서기 샷시 프레임 */}
      <polygon points="18,24 82,10 82,56 18,70" fill="url(#schoolWood)" stroke="#92400e" strokeWidth="0.8" />
      {/* 중앙 분할 원목 기둥 */}
      <polygon points="48,17 52,16 52,63 48,64" fill="#92400e" />

      {/* 4. 좌측 베이 2중 유리 (상단 고정창 / 하단 대형 슬라이딩창) */}
      <polygon points="22,27 46,22 46,36 22,41" fill="url(#schoolGlass)" stroke="#d97706" strokeWidth="1" />
      <polygon points="22,43 46,38 46,65 22,70" fill="url(#schoolGlass)" stroke="#d97706" strokeWidth="1" />
      <line x1="22" y1="42" x2="46" y2="37" stroke="#92400e" strokeWidth="1.5" />

      {/* 5. 우측 베이 2중 유리 */}
      <polygon points="54,20 78,15 78,29 54,34" fill="url(#schoolGlass)" stroke="#d97706" strokeWidth="1" />
      <polygon points="54,36 78,31 78,58 54,63" fill="url(#schoolGlass)" stroke="#d97706" strokeWidth="1" />
      <line x1="54" y1="35" x2="78" y2="30" stroke="#92400e" strokeWidth="1.5" />

      {/* 6. 황동 크리센트 잠금장치 */}
      <circle cx="49" cy="51" r="1.5" fill="#facc15" stroke="#a16207" strokeWidth="0.5" />
      <circle cx="53" cy="48" r="1.5" fill="#facc15" stroke="#a16207" strokeWidth="0.5" />
    </svg>
  );
}

// 16. 🛏️ 이동식 침대 (화이트 프레임 + 딥블루 매트리스 + 라임그린 헤드보드 + 사이드 안전가드 레일 + 4개 바퀴)
export function MobileBedIcon() {
  return (
    <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-sm select-none">
      <defs>
        <linearGradient id="mattressBlue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>
      {/* 바닥 그림자 */}
      <polygon points="10,68 50,78 90,68 50,58" fill="rgba(0,0,0,0.06)" />

      {/* 4개의 360도 회전 캐스터 바퀴 */}
      <circle cx="16" cy="65" r="3" fill="#cbd5e1" stroke="#334155" strokeWidth="0.8" />
      <circle cx="16" cy="65" r="1.5" fill="#0284c7" />
      <circle cx="28" cy="71" r="3" fill="#cbd5e1" stroke="#334155" strokeWidth="0.8" />
      <circle cx="28" cy="71" r="1.5" fill="#0284c7" />
      <circle cx="72" cy="57" r="3" fill="#cbd5e1" stroke="#334155" strokeWidth="0.8" />
      <circle cx="72" cy="57" r="1.5" fill="#0284c7" />
      <circle cx="84" cy="63" r="3" fill="#cbd5e1" stroke="#334155" strokeWidth="0.8" />
      <circle cx="84" cy="63" r="1.5" fill="#0284c7" />

      {/* 화이트 스틸 레그 기둥 4개 */}
      <line x1="16" y1="62" x2="16" y2="44" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="68" x2="28" y2="50" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="72" y1="54" x2="72" y2="36" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="84" y1="60" x2="84" y2="42" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />

      {/* 하단 화이트 튜브 섀시 프레임 연결 바 */}
      <line x1="16" y1="56" x2="72" y2="42" stroke="#e2e8f0" strokeWidth="2.5" />
      <line x1="28" y1="62" x2="84" y2="48" stroke="#e2e8f0" strokeWidth="2.5" />

      {/* 딥 네이비 블루 매트리스 */}
      <polygon points="18,36 74,22 86,40 30,54" fill="url(#mattressBlue)" stroke="#1e40af" strokeWidth="1" />
      <polygon points="30,54 86,40 86,45 30,59" fill="#1e3a8a" />
      <polygon points="18,36 30,54 30,59 18,41" fill="#172554" />

      {/* 헤드보드 (좌측 화이트 하우징 + 라임 그린 액센트 + 손잡이 홀) */}
      <polygon points="14,24 24,38 24,54 14,40" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      <polygon points="15,26 23,38 23,46 15,34" fill="#84cc16" stroke="#65a30d" strokeWidth="0.5" />
      <line x1="17" y1="28" x2="21" y2="34" stroke="#ffffff" strokeWidth="1" />

      {/* 풋보드 (우측 화이트 라운드 패널 + 상단 핸들 바) */}
      <polygon points="76,14 88,28 88,44 76,30" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="79" y="19" width="6" height="3" rx="1" fill="#cbd5e1" transform="skewY(42)" />

      {/* 전면 안전 가드 레일 (사이드 바 + 4개의 수직 봉 + 리모컨) */}
      <line x1="32" y1="36" x2="78" y2="25" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
      <line x1="40" y1="34" x2="40" y2="48" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="50" y1="31.5" x2="50" y2="45.5" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="60" y1="29" x2="60" y2="43" stroke="#cbd5e1" strokeWidth="1.5" />
      <line x1="70" y1="26.5" x2="70" y2="40.5" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* 리모컨 유닛 (스위치 & 코일 전선) */}
      <rect x="58" y="29" width="3.5" height="7" rx="1" fill="#93c5fd" stroke="#2563eb" strokeWidth="0.5" transform="skewY(-14)" />
      <path d="M60,37 Q58,45 62,50" fill="none" stroke="#64748b" strokeWidth="0.8" />
    </svg>
  );
}

// 📦 카탈로그 썸네일 매핑 디스패처
export default function getFurnitureThumbnail(type) {
  if (type === '학생 책상') return <StudentDeskIcon />;
  if (type === '학생 의자') return <StudentChairIcon />;
  if (type === '교사 책상') return <TeacherDeskIcon />;
  if (type === '전자칠판(벽부착형)' || type === '전자칠판' || type === '스마트 전자칠판') return <ElectronicBoardIcon />;
  if (type === '교구장(1단, 긴 문)' || type === '개인 사물함(1단, 긴 문)' || type === '사물함') return <CabinetSingleTallDoorIcon />;
  if (type === '교구장(3단, 문 있음)' || type === '교구장(문 있음)') return <CabinetClosed3TierIcon />;
  if (type === '교구장(4단, 문 있음)') return <CabinetClosed4TierIcon />;
  if (type === '교구장(3단, 문 없음)' || type === '교구장(문 없음)') return <CabinetOpen3TierIcon />;
  if (type === '교구장(4단, 문 없음)') return <CabinetOpen4TierIcon />;
  if (type === '신발장(2단)' || type === '신발장') return <ShoeRack2TierIcon />;
  if (type === '신발장(3단)') return <ShoeRack3TierIcon />;
  if (type === '옷장') return <WardrobeIcon />;
  if (type === '이동식 칠판') return <WhiteboardIcon />;
  if (type === '이동식 침대' || type === '침대' || type === '환자용 침대') return <MobileBedIcon />;
  if (type === '출입문') return <DoorIcon />;
  if (type === '창문') return <WindowIcon />;
  return <StudentDeskIcon />;
}
