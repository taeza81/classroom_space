/**
 * 🏫 교실 공간 구조화 - 관리자 확장형 교실 템플릿 레지스트리
 * 
 * 💡 [관리자 안내]
 * 현재는 기본적으로 "자유 구성 (빈 교실)"(기본 구조물 없는 완전 빈 교실)만 제공됩니다.
 * 추후 새로운 교실 템플릿을 추가하고 싶으실 때 아래 CLASSROOM_TEMPLATES 배열에 새로운 템플릿 객체를 추가하시면 됩니다!
 */

export const CLASSROOM_TEMPLATES = [
  {
    id: 'empty-custom',
    name: '자유 구성 (빈 교실)',
    description: '가로 8.0m × 세로 6.0m (기본 구조물 및 비품이 없는 깨끗한 빈 교실에서 자유롭게 배치)',
    category: '기본',
    badge: '기본 템플릿',
    classroomSize: { width: 800, height: 600, wallHeight: 260 },
    defaultItems: [] // 🌟 기본 구조물 없는 완전 빈 교실
  }
  // ➕ [추후 관리자 템플릿 추가 예시]:
  // {
  //   id: 'sample-template',
  //   name: '초등 일반 교실 (모둠형)',
  //   description: '가로 8.0m × 세로 6.0m',
  //   category: '일반교실',
  //   classroomSize: { width: 800, height: 600, wallHeight: 260 },
  //   defaultItems: [ ... ]
  // }
];
