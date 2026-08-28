/**
 * 📐 교실 비품 충돌 감지 및 겹침 방지 유틸리티 (Collision & Overlap Prevention Engine)
 * - 0cm 밀착 배치(딱 붙여서 배치) 지원: 변과 변이 맞닿아 있는 상태(0 간격)는 완전 허용
 * - 오직 가구끼리 내부로 파고들어 겹칠 때만 정밀 충돌 감지
 * - 충돌 시 인접 가구의 변에 딱 붙는 최근접 외곽선 스냅(Flush Edge Snap) 지원
 * - 새 가구 추가 시 짝꿍 책상 및 모둠 배치가 가능하도록 밀착 격자 탐색
 */

// 🚪 벽체 부착물 여부 확인
export function isWallFixture(item) {
  if (!item || !item.type) return false;
  return item.type === '출입문' || item.type === '창문' || item.type?.includes('전자칠판');
}

/**
 * 가구의 회전 각도(rad)와 가로(width), 세로(height)를 반영한 4개 꼭짓점 다각형 좌표 계산
 */
export function getItemPolygon(item, padding = 0) {
  const w = (item.width || 60) + padding * 2;
  const h = (item.height || 45) + padding * 2;
  const cx = item.x;
  const cy = item.y;
  const rot = item.rotation || 0;

  const cos = Math.cos(rot);
  const sin = Math.sin(rot);

  const hw = w / 2;
  const hh = h / 2;

  // 4개 코너 (로컬 중심 기준 -> 회전 변환 -> 월드 좌표)
  const localCorners = [
    { x: -hw, y: -hh },
    { x: hw, y: -hh },
    { x: hw, y: hh },
    { x: -hw, y: hh },
  ];

  return localCorners.map(corner => ({
    x: cx + (corner.x * cos - corner.y * sin),
    y: cy + (corner.x * sin + corner.y * cos),
  }));
}

/**
 * SAT (Separating Axis Theorem) 알고리즘을 이용한 두 볼록 다각형 간 충돌 검사
 * - 0.5px의 미세 여유(epsilon)를 주어 변이 서로 딱 붙어있는 상태(0mm 접촉)는 겹침으로 보지 않음!
 */
function polygonsIntersect(polyA, polyB, epsilon = 0.5) {
  const polygons = [polyA, polyB];

  for (let i = 0; i < polygons.length; i++) {
    const polygon = polygons[i];
    for (let i1 = 0; i1 < polygon.length; i1++) {
      const i2 = (i1 + 1) % polygon.length;
      const p1 = polygon[i1];
      const p2 = polygon[i2];

      // 법선 벡터 (분리축) 계산
      const normal = { x: -(p2.y - p1.y), y: p2.x - p1.x };

      // 정규화
      const length = Math.hypot(normal.x, normal.y);
      if (length === 0) continue;
      const axis = { x: normal.x / length, y: normal.y / length };

      // polyA 투영
      let minA = Infinity;
      let maxA = -Infinity;
      for (const p of polyA) {
        const dot = p.x * axis.x + p.y * axis.y;
        if (dot < minA) minA = dot;
        if (dot > maxA) maxA = dot;
      }

      // polyB 투영
      let minB = Infinity;
      let maxB = -Infinity;
      for (const p of polyB) {
        const dot = p.x * axis.x + p.y * axis.y;
        if (dot < minB) minB = dot;
        if (dot > maxB) maxB = dot;
      }

      // 투영 구간이 맞닿아 있거나 떨어져 있으면 분리축 존재 (0.5px 미만 접촉은 비충돌)
      if (maxA <= minB + epsilon || maxB <= minA + epsilon) {
        return false;
      }
    }
  }

  // 모든 축에서 0.5px 이상 실질적으로 파고들어 겹칠 때만 충돌
  return true;
}

/**
 * 두 비품 간의 충돌/겹침 여부 정밀 검사
 * - padding 기본값을 0으로 설정하여 딱 붙여서 배치(0cm 간격) 허용
 */
export function checkItemsOverlap(itemA, itemB, padding = 0) {
  if (!itemA || !itemB || itemA.id === itemB.id) return false;

  const isWallA = isWallFixture(itemA);
  const isWallB = isWallFixture(itemB);

  // 규칙 1: 일반 바닥 가구와 벽체 부착물은 서로 겹침 검사를 하지 않음
  if (isWallA !== isWallB) return false;

  // 규칙 2: AABB 1차 고속 필터링
  const maxDimA = Math.max(itemA.width || 60, itemA.height || 45);
  const maxDimB = Math.max(itemB.width || 60, itemB.height || 45);
  const dx = itemA.x - itemB.x;
  const dy = itemA.y - itemB.y;
  if (dx * dx + dy * dy > (maxDimA + maxDimB) * (maxDimA + maxDimB)) {
    return false;
  }

  // 규칙 3: SAT 정밀 다각형 충돌 검사
  const polyA = getItemPolygon(itemA, padding);
  const polyB = getItemPolygon(itemB, padding);

  return polygonsIntersect(polyA, polyB, 0.5);
}

/**
 * 특정 가구가 교실 내의 다른 가구들과 겹치는지 검사
 */
export function hasOverlapWithOthers(targetItem, allItems, padding = 0) {
  if (!targetItem || !allItems || allItems.length <= 1) return false;

  return allItems.some(other => 
    other.id !== targetItem.id && checkItemsOverlap(targetItem, other, padding)
  );
}

/**
 * 🧭 가구가 교실 벽면 안쪽에 들어오는지 검사
 */
export function isWithinClassroomBounds(item, classroomSize, margin = 0) {
  if (!item || !classroomSize) return true;
  if (isWallFixture(item)) return true;

  const w = item.width || 60;
  const h = item.height || 45;
  const rot = item.rotation || 0;

  const cos = Math.abs(Math.cos(rot));
  const sin = Math.abs(Math.sin(rot));
  const boundW = w * cos + h * sin;
  const boundH = w * sin + h * cos;

  const minX = boundW / 2 + margin;
  const maxX = classroomSize.width - boundW / 2 - margin;
  const minY = boundH / 2 + margin;
  const maxY = classroomSize.height - boundH / 2 - margin;

  return item.x >= minX - 0.5 && item.x <= maxX + 0.5 && item.y >= minY - 0.5 && item.y <= maxY + 0.5;
}

/**
 * 🌟 [핵심] 충돌 발생 시 딱 붙는 최근접 비충돌 유효 위치(Flush Edge Snap) 자동 계산
 * 1. 겹친 상대 가구의 상/하/좌/우 외곽선에 '0cm 간격으로 딱 붙는 위치'를 1순위로 탐색
 * 2. 촘촘한 2cm 격자 방사형 탐색으로 가장 가까운 최적 밀착 위치 결정
 */
export function resolveOverlapPosition(targetItem, allItems, classroomSize, padding = 0) {
  // 이미 충돌하지 않고 교실 범위 내라면 현재 위치 그대로 유지 (딱 붙어있는 상태 100% 보존)
  if (!hasOverlapWithOthers(targetItem, allItems, padding) && isWithinClassroomBounds(targetItem, classroomSize)) {
    return { x: targetItem.x, y: targetItem.y };
  }

  // 벽체 부착물인 경우 벽면 축을 따라 좌우로만 슬라이드 탐색
  if (isWallFixture(targetItem)) {
    const W = classroomSize.width;
    const H = classroomSize.height;
    const isHorizontalWall = targetItem.y <= 60 || targetItem.y >= H - 60;
    
    for (let step = 5; step <= 500; step += 5) {
      for (const sign of [1, -1]) {
        const candidate = {
          ...targetItem,
          x: isHorizontalWall ? targetItem.x + step * sign : targetItem.x,
          y: !isHorizontalWall ? targetItem.y + step * sign : targetItem.y,
        };
        if (!hasOverlapWithOthers(candidate, allItems, padding)) {
          return { x: candidate.x, y: candidate.y };
        }
      }
    }
    return { x: targetItem.x, y: targetItem.y };
  }

  // 1단계: 겹치고 있는 상대 가구들의 외곽 모서리에 "딱 붙는 0cm 밀착 위치" 1순위 탐색
  const targetW = targetItem.width || 60;
  const targetH = targetItem.height || 45;

  const collidingObstacles = allItems.filter(other => 
    other.id !== targetItem.id && checkItemsOverlap(targetItem, other, 0)
  );

  const edgeCandidates = [];

  for (const obs of collidingObstacles) {
    const obsW = obs.width || 60;
    const obsH = obs.height || 45;

    // 우측에 딱 붙이기
    edgeCandidates.push({ x: obs.x + (obsW + targetW) / 2, y: targetItem.y });
    // 좌측에 딱 붙이기
    edgeCandidates.push({ x: obs.x - (obsW + targetW) / 2, y: targetItem.y });
    // 하단에 딱 붙이기
    edgeCandidates.push({ x: targetItem.x, y: obs.y + (obsH + targetH) / 2 });
    // 상단에 딱 붙이기
    edgeCandidates.push({ x: targetItem.x, y: obs.y - (obsH + targetH) / 2 });

    // Y축 정렬 및 X축 밀착 (나란히 정렬)
    edgeCandidates.push({ x: obs.x + (obsW + targetW) / 2, y: obs.y });
    edgeCandidates.push({ x: obs.x - (obsW + targetW) / 2, y: obs.y });
    // X축 정렬 및 Y축 밀착 (앞뒤로 정렬)
    edgeCandidates.push({ x: obs.x, y: obs.y + (obsH + targetH) / 2 });
    edgeCandidates.push({ x: obs.x, y: obs.y - (obsH + targetH) / 2 });
  }

  // 원래 위치와의 거리 순으로 정렬하여 가장 가까운 밀착 위치 선택
  edgeCandidates.sort((a, b) => {
    const distA = Math.hypot(a.x - targetItem.x, a.y - targetItem.y);
    const distB = Math.hypot(b.x - targetItem.x, b.y - targetItem.y);
    return distA - distB;
  });

  for (const candPos of edgeCandidates) {
    const candidate = {
      ...targetItem,
      x: Math.round(candPos.x),
      y: Math.round(candPos.y),
    };
    if (isWithinClassroomBounds(candidate, classroomSize) && !hasOverlapWithOthers(candidate, allItems, 0)) {
      return { x: candidate.x, y: candidate.y };
    }
  }

  // 2단계: 촘촘한 2cm 격자 방사형 탐색 (가장 가까운 빈틈으로 밀착)
  const stepSize = 2; // 2cm 초정밀 밀착 단위
  const maxRadius = Math.max(classroomSize.width, classroomSize.height);

  for (let r = stepSize; r <= maxRadius; r += stepSize) {
    const angleCount = Math.max(12, Math.floor((2 * Math.PI * r) / stepSize));
    for (let i = 0; i < angleCount; i++) {
      const angle = (i * 2 * Math.PI) / angleCount;
      const testX = Math.round(targetItem.x + r * Math.cos(angle));
      const testY = Math.round(targetItem.y + r * Math.sin(angle));

      const candidate = {
        ...targetItem,
        x: testX,
        y: testY,
      };

      if (isWithinClassroomBounds(candidate, classroomSize) && !hasOverlapWithOthers(candidate, allItems, 0)) {
        return { x: testX, y: testY };
      }
    }
  }

  return { x: targetItem.x, y: targetItem.y };
}

/**
 * 📦 사이드바에서 새 비품 추가 시 겹치지 않고 자연스럽게 밀착 배치되는 위치 탐색
 */
export function findEmptySpaceForNewItem(newItemTemplate, existingItems, classroomSize) {
  if (isWallFixture(newItemTemplate)) {
    const candidate = {
      ...newItemTemplate,
      id: crypto.randomUUID(),
    };
    const resolved = resolveOverlapPosition(candidate, existingItems, classroomSize, 0);
    return resolved;
  }

  const itemW = newItemTemplate.width || 60;
  const itemD = newItemTemplate.height || 45;

  // 교실 중앙 책상 구역 시작점
  const startX = Math.round(classroomSize.width * 0.35);
  const startY = Math.round(classroomSize.height * 0.4);

  const candidate = {
    ...newItemTemplate,
    id: crypto.randomUUID(),
    x: startX,
    y: startY,
    rotation: 0,
  };

  // 1. 기본 위치가 비어있으면 즉시 배치
  if (!hasOverlapWithOthers(candidate, existingItems, 0) && isWithinClassroomBounds(candidate, classroomSize)) {
    return { x: startX, y: startY };
  }

  // 2. 책상/의자 등은 짝꿍 배치(가로 0cm 밀착, 2인 1조 모둠형)로 촘촘히 탐색
  const isDeskOrChair = newItemTemplate.type?.includes('책상') || newItemTemplate.type?.includes('의자');
  const stepX = isDeskOrChair ? itemW : itemW + 10;
  const stepY = isDeskOrChair ? itemD + 15 : itemD + 15;

  const cols = Math.floor((classroomSize.width * 0.75) / stepX);
  const rows = Math.floor((classroomSize.height * 0.75) / stepY);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const posX = Math.round(classroomSize.width * 0.2 + col * stepX);
      const posY = Math.round(classroomSize.height * 0.25 + row * stepY);

      candidate.x = posX;
      candidate.y = posY;

      if (!hasOverlapWithOthers(candidate, existingItems, 0) && isWithinClassroomBounds(candidate, classroomSize)) {
        return { x: posX, y: posY };
      }
    }
  }

  // 3. 최근접 밀착 위치로 자동 스냅
  return resolveOverlapPosition(candidate, existingItems, classroomSize, 0);
}
