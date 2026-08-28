import React from 'react';

/**
 * 🏫 [Project 아이콘] 교실 공간 구조화 및 학교 프로젝트 아이콘
 * - 타 사이트와 완전히 구별되는 독창적인 학교/교실 건축 벡터 그래픽
 */
export function ProjectMenuIcon({ size = 26, className = '', strokeWidth = 2.2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-all duration-200 ${className}`}
    >
      {/* 교실/학교 지붕 삼각형 페디먼트 */}
      <path d="M2 10L12 3l10 7" />
      {/* 학교 건물 본체 */}
      <path d="M4 10v10a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5V10" />
      {/* 중앙 메인 출입문 */}
      <path d="M9.5 21.5v-6a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5v6" />
      {/* 상단 원형 시계/심볼 창문 */}
      <circle cx="12" cy="7.5" r="1.5" />
    </svg>
  );
}

/**
 * 🪑 [Objects 아이콘] 교실 책걸상 및 가구/비품 아이콘
 * - 타 사이트 큐브와 완전히 구별되는 세련된 교실 가구(책걸상/암체어) 벡터 그래픽
 */
export function ObjectsMenuIcon({ size = 26, className = '', strokeWidth = 2.2 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-all duration-200 ${className}`}
    >
      {/* 가구 다리 */}
      <path d="M6 19v2.5" />
      <path d="M18 19v2.5" />
      {/* 가구 본체 시트 & 팔걸이 */}
      <path d="M4 12a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v4.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V12z" />
      <path d="M4 13.5h16" />
      {/* 편안한 등받이 아치 */}
      <path d="M7.5 9V6a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v3" />
    </svg>
  );
}
