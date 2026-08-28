import React from 'react';
import { RoundedBox, Cylinder, Box } from '@react-three/drei';

// ============================================================================
// 🎨 최신 건축 설계 프로그램(Floorplanner / Planner 5D / Revit) 기준
// 고대비(High-Contrast) & 북유럽 감성 바이오필릭(Biophilic) 3D 교육 가구 디자인
// ============================================================================

// 1. 🎓 학생 책상 (첨부 이미지 일치: 화이트 상판 + 다크 그레이 엣지 & 서랍 트레이 + T자형 화이트 스틸 레그 & 차콜 풋캡)
export function DeskProcedural({ width, depth, height = 60 }) {
  const topThick = 2.4;
  const colW = 3.2;
  const colD = 4.0;
  const legOffset = 4.5;
  const baseH = 4.0;
  const baseD = depth * 0.82;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. 상판 (화이트 멜라민 표면 + 다크 슬레이트 완충 엣지 몰딩) */}
      {/* 하단 다크 슬레이트 엣지 몰딩 */}
      <RoundedBox 
        args={[width, topThick, depth]} 
        position={[0, height - topThick / 2, 0]} 
        radius={0.6} 
        smoothness={4}
      >
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </RoundedBox>
      {/* 상부 깨끗한 화이트 멜라민 표면 */}
      <RoundedBox 
        args={[width - 0.6, 0.4, depth - 0.6]} 
        position={[0, height - 0.1, 0]} 
        radius={0.4}
      >
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </RoundedBox>

      {/* 2. 상판 하부 다크 슬레이트 서랍 / 책받침 트레이 하우징 */}
      <RoundedBox 
        args={[width - 6, 6.5, depth - 8]} 
        position={[0, height - topThick - 3.2, 0]} 
        radius={0.5}
      >
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </RoundedBox>
      {/* 서랍 전면 수납 홈 (책 넣는 입구) */}
      <mesh position={[0, height - topThick - 3.2, depth / 2 - 3.8]}>
        <planeGeometry args={[width - 12, 4]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* 3. T자형 화이트 분체도장 스틸 스탠드 다리 (좌/우 세트) */}
      {/* 좌측 T자형 다리 기둥 & 바닥 베이스 */}
      <group position={[-width / 2 + legOffset, 0, 0]}>
        {/* 수직 사각 기둥 (White Column) */}
        <RoundedBox 
          args={[colW, height - topThick - 8, colD]} 
          position={[0, (height - topThick - 8) / 2 + baseH, 0]} 
          radius={0.3}
        >
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.2} />
        </RoundedBox>
        {/* 하부 수평 바닥 베이스 바 (Floor Base Bar) */}
        <RoundedBox 
          args={[colW + 0.6, baseH, baseD]} 
          position={[0, baseH / 2, 0]} 
          radius={0.4}
        >
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.2} />
        </RoundedBox>
        {/* 전면/후면 다크 차콜 미끄럼 방지 발굽 캡 (Rubber Foot Caps) */}
        <RoundedBox args={[colW + 1.2, baseH + 1, 4.5]} position={[0, baseH / 2, baseD / 2 - 1.5]} radius={0.4}>
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </RoundedBox>
        <RoundedBox args={[colW + 1.2, baseH + 1, 4.5]} position={[0, baseH / 2, -baseD / 2 + 1.5]} radius={0.4}>
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </RoundedBox>
      </group>

      {/* 우측 T자형 다리 기둥 & 바닥 베이스 */}
      <group position={[width / 2 - legOffset, 0, 0]}>
        {/* 수직 사각 기둥 */}
        <RoundedBox 
          args={[colW, height - topThick - 8, colD]} 
          position={[0, (height - topThick - 8) / 2 + baseH, 0]} 
          radius={0.3}
        >
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.2} />
        </RoundedBox>
        {/* 하부 수평 바닥 베이스 바 */}
        <RoundedBox 
          args={[colW + 0.6, baseH, baseD]} 
          position={[0, baseH / 2, 0]} 
          radius={0.4}
        >
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.2} />
        </RoundedBox>
        {/* 전면/후면 다크 차콜 미끄럼 방지 발굽 캡 */}
        <RoundedBox args={[colW + 1.2, baseH + 1, 4.5]} position={[0, baseH / 2, baseD / 2 - 1.5]} radius={0.4}>
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </RoundedBox>
        <RoundedBox args={[colW + 1.2, baseH + 1, 4.5]} position={[0, baseH / 2, -baseD / 2 + 1.5]} radius={0.4}>
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </RoundedBox>
      </group>

      {/* 4. 좌우 다리 연결 상단/하단 화이트 스틸 보강 프레임 */}
      {/* 상단 수평 빔 (Top Crossbeam) */}
      <RoundedBox 
        args={[width - legOffset * 2, 3, 2]} 
        position={[0, height - 12, 0]} 
        radius={0.3}
      >
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </RoundedBox>
      {/* 하단 수평 발받침 보강 파이프 (Lower Tie Bar) */}
      <RoundedBox 
        args={[width - legOffset * 2, 2.5, 2.5]} 
        position={[0, baseH + 3, 0]} 
        radius={0.3}
      >
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </RoundedBox>

      {/* 좌/우 가방걸이 고리 (Side Hooks) */}
      <Box args={[1.2, 2.5, 1.8]} position={[-width / 2 + legOffset - colW / 2 - 0.6, height - 12, 0]}>
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </Box>
      <Box args={[1.2, 2.5, 1.8]} position={[width / 2 - legOffset + colW / 2 + 0.6, height - 12, 0]}>
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </Box>
    </group>
  );
}

// 2. 🪑 학생 의자 (첨부 이미지 일치: 화이트-로얄블루 2톤 시트 & 등받이 + 하부 수납 바구니 + 화이트 T자 조절 다리 & 차콜 풋캡)
export function ChairProcedural({ width, depth, height = 75 }) {
  const seatH = height * 0.52; // 좌판 높이 (약 39cm)
  const backH = height * 0.48; // 등받이 높이 (약 36cm)
  const chairW = Math.min(width || 42, 42);
  const chairD = Math.min(depth || 42, 42);

  const whiteFrame = "#f8fafc"; // 깨끗한 화이트 우레탄 / 분체도장 스틸
  const whiteMat = "#f1f5f9";
  const royalBlue = "#2563eb"; // 선명하고 산뜻한 로얄 블루
  const darkBlue = "#1d4ed8";
  const silverBolt = "#cbd5e1";
  const charcoalCap = "#334155";

  const legOffset = chairW * 0.28;
  const baseD = chairD * 0.85;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. 화이트-로얄블루 2톤 좌판 (Seat Pan) */}
      <group position={[0, seatH, 0]}>
        {/* 외곽 화이트 라운드 몰딩 프레임 */}
        <RoundedBox 
          args={[chairW, 2.6, chairD]} 
          position={[0, 0, 0]} 
          radius={0.8} 
          smoothness={4}
        >
          <meshStandardMaterial color={whiteFrame} roughness={0.3} />
        </RoundedBox>

        {/* 중앙 로얄 블루 인체공학 안장형 쿠션 패널 */}
        <RoundedBox 
          args={[chairW - 4.5, 0.5, chairD - 4.5]} 
          position={[0, 1.2, 0]} 
          radius={0.6}
        >
          <meshStandardMaterial color={royalBlue} roughness={0.4} />
        </RoundedBox>

        {/* 좌판 4개의 실버 리벳 / 결속 볼트 캡 */}
        {[
          [-chairW * 0.26, -chairD * 0.24],
          [ chairW * 0.26, -chairD * 0.24],
          [-chairW * 0.26,  chairD * 0.22],
          [ chairW * 0.26,  chairD * 0.22],
        ].map((pos, idx) => (
          <mesh key={idx} position={[pos[0], 1.5, pos[1]]}>
            <circleGeometry args={[0.75, 16]} />
            <meshStandardMaterial color={silverBolt} metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* 2. 화이트-로얄블루 2톤 등받이 & L자형 후면 지지 스틸 튜브 (Backrest) */}
      <group position={[0, 0, 0]}>
        {/* L자형 화이트 등받이 지지 사각 튜브 2개 (좌/우) */}
        {[-chairW * 0.28, chairW * 0.28].map((xPos, idx) => (
          <group key={idx} position={[xPos, 0, 0]}>
            {/* 좌판 밑 수평 연결 바 */}
            <RoundedBox args={[2.0, 2.0, 10]} position={[0, seatH - 1.8, -chairD * 0.25]} radius={0.3}>
              <meshStandardMaterial color={whiteFrame} roughness={0.3} />
            </RoundedBox>
            {/* 수직 상승 스틸 파이프 */}
            <RoundedBox args={[2.0, backH * 0.75, 2.0]} position={[0, seatH + backH * 0.38, -chairD / 2 + 1.2]} radius={0.3}>
              <meshStandardMaterial color={whiteFrame} roughness={0.3} />
            </RoundedBox>
            {/* 등받이 뒷면 결속 볼트 너트 (상/하 2개씩) */}
            <Cylinder args={[0.5, 0.5, 1.2, 12]} rotation={[Math.PI / 2, 0, 0]} position={[0, seatH + backH * 0.55, -chairD / 2 + 2.4]}>
              <meshStandardMaterial color={silverBolt} metalness={0.9} roughness={0.2} />
            </Cylinder>
            <Cylinder args={[0.5, 0.5, 1.2, 12]} rotation={[Math.PI / 2, 0, 0]} position={[0, seatH + backH * 0.25, -chairD / 2 + 2.4]}>
              <meshStandardMaterial color={silverBolt} metalness={0.9} roughness={0.2} />
            </Cylinder>
          </group>
        ))}

        {/* 등받이 본체 (화이트 웨이브 외곽 프레임 + 로얄 블루 패널) */}
        <group position={[0, seatH + backH * 0.42, -chairD / 2 + 2.2]} rotation={[-0.04, 0, 0]}>
          {/* 화이트 외곽 프레임 */}
          <RoundedBox 
            args={[chairW * 0.88, backH * 0.54, 2.2]} 
            position={[0, 0, 0]} 
            radius={0.8} 
            smoothness={4}
          >
            <meshStandardMaterial color={whiteFrame} roughness={0.3} />
          </RoundedBox>

          {/* 중앙 로얄 블루 패널 */}
          <RoundedBox 
            args={[chairW * 0.88 - 3.2, backH * 0.54 - 3.0, 2.3]} 
            position={[0, 0, 0.1]} 
            radius={0.6}
          >
            <meshStandardMaterial color={royalBlue} roughness={0.4} />
          </RoundedBox>
        </group>
      </group>

      {/* 3. 좌판 하부 화이트 수납 바구니 / 사이드 통풍 격자 패널 (Under-Seat Storage) */}
      <group position={[0, seatH - 5.5, 0]}>
        {/* 중앙 수납 박스 */}
        <RoundedBox args={[chairW * 0.68, 8.5, chairD * 0.62]} position={[0, 0, 0]} radius={0.4}>
          <meshStandardMaterial color={whiteMat} roughness={0.4} />
        </RoundedBox>
        {/* 좌측/우측 사이드 격자 음각 디테일 */}
        <mesh position={[-chairW * 0.34 - 0.05, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[chairD * 0.45, 6.5]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        <mesh position={[chairW * 0.34 + 0.05, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[chairD * 0.45, 6.5]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      </group>

      {/* 4. 화이트 T자형 높낮이 조절 스탠드 다리 & 다크 차콜 풋캡 (Dual Column Legs) */}
      <group position={[0, 0, 0]}>
        {/* 좌측 다리 (듀얼 수직 기둥 + 바닥 베이스 + 풋캡) */}
        <group position={[-legOffset, 0, 0]}>
          {/* 전/후 듀얼 수직 스틸 파이프 기둥 */}
          <RoundedBox args={[2.8, seatH - 12, 2.8]} position={[0, (seatH - 12) / 2 + 4.2, 3.5]} radius={0.3}>
            <meshStandardMaterial color={whiteFrame} roughness={0.3} />
          </RoundedBox>
          <RoundedBox args={[2.8, seatH - 12, 2.8]} position={[0, (seatH - 12) / 2 + 4.2, -3.5]} radius={0.3}>
            <meshStandardMaterial color={whiteFrame} roughness={0.3} />
          </RoundedBox>
          {/* 기둥 높이 조절 볼트 핀 */}
          <mesh position={[-1.45, seatH * 0.32, 3.5]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.45, 12]} />
            <meshStandardMaterial color={silverBolt} metalness={0.9} />
          </mesh>
          <mesh position={[-1.45, seatH * 0.2, 3.5]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.45, 12]} />
            <meshStandardMaterial color={silverBolt} metalness={0.9} />
          </mesh>

          {/* 바닥 수평 역T자형 베이스 바 */}
          <RoundedBox args={[3.4, 4.2, baseD]} position={[0, 2.1, 0]} radius={0.4}>
            <meshStandardMaterial color={whiteFrame} roughness={0.3} />
          </RoundedBox>
          {/* 전면/후면 다크 차콜 고무 보호 풋캡 (Rubber Foot Caps) */}
          <RoundedBox args={[4.0, 5.0, 4.2]} position={[0, 2.1, baseD / 2 - 1.5]} radius={0.4}>
            <meshStandardMaterial color={charcoalCap} roughness={0.7} />
          </RoundedBox>
          <RoundedBox args={[4.0, 5.0, 4.2]} position={[0, 2.1, -baseD / 2 + 1.5]} radius={0.4}>
            <meshStandardMaterial color={charcoalCap} roughness={0.7} />
          </RoundedBox>
        </group>

        {/* 우측 다리 (듀얼 수직 기둥 + 바닥 베이스 + 풋캡) */}
        <group position={[legOffset, 0, 0]}>
          {/* 전/후 듀얼 수직 스틸 파이프 기둥 */}
          <RoundedBox args={[2.8, seatH - 12, 2.8]} position={[0, (seatH - 12) / 2 + 4.2, 3.5]} radius={0.3}>
            <meshStandardMaterial color={whiteFrame} roughness={0.3} />
          </RoundedBox>
          <RoundedBox args={[2.8, seatH - 12, 2.8]} position={[0, (seatH - 12) / 2 + 4.2, -3.5]} radius={0.3}>
            <meshStandardMaterial color={whiteFrame} roughness={0.3} />
          </RoundedBox>
          {/* 기둥 높이 조절 볼트 핀 */}
          <mesh position={[1.45, seatH * 0.32, 3.5]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.45, 12]} />
            <meshStandardMaterial color={silverBolt} metalness={0.9} />
          </mesh>
          <mesh position={[1.45, seatH * 0.2, 3.5]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.45, 12]} />
            <meshStandardMaterial color={silverBolt} metalness={0.9} />
          </mesh>

          {/* 바닥 수평 역T자형 베이스 바 */}
          <RoundedBox args={[3.4, 4.2, baseD]} position={[0, 2.1, 0]} radius={0.4}>
            <meshStandardMaterial color={whiteFrame} roughness={0.3} />
          </RoundedBox>
          {/* 전면/후면 다크 차콜 고무 보호 풋캡 */}
          <RoundedBox args={[4.0, 5.0, 4.2]} position={[0, 2.1, baseD / 2 - 1.5]} radius={0.4}>
            <meshStandardMaterial color={charcoalCap} roughness={0.7} />
          </RoundedBox>
          <RoundedBox args={[4.0, 5.0, 4.2]} position={[0, 2.1, -baseD / 2 + 1.5]} radius={0.4}>
            <meshStandardMaterial color={charcoalCap} roughness={0.7} />
          </RoundedBox>
        </group>

        {/* 좌우 다리 연결 하단 수평 화이트 빔 */}
        <RoundedBox args={[chairW * 0.58, 3.6, 3.0]} position={[0, 8.5, 0]} radius={0.3}>
          <meshStandardMaterial color={whiteFrame} roughness={0.3} />
        </RoundedBox>
      </group>
    </group>
  );
}

// 3. 👩‍🏫 교사 책상 (모던 화이트 & 오크 2톤 와이드 상판 + 화이트 서랍장)
export function TeacherDeskProcedural({ width, depth, height = 75 }) {
  const topThick = 3.6;
  const pedestalW = width * 0.34;
  const pedestalH = height - topThick;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. 와이드 프리미엄 모던 상판 (화이트 메인 + 다크 슬레이트 엣지 몰딩) */}
      <RoundedBox 
        args={[width, topThick, depth]} 
        position={[0, height - topThick / 2, 0]} 
        radius={1.2} 
        smoothness={4}
      >
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </RoundedBox>
      {/* 상판 표면 화이트 레이어 */}
      <RoundedBox 
        args={[width - 0.8, 0.4, depth - 0.8]} 
        position={[0, height - 0.1, 0]} 
        radius={0.8}
      >
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </RoundedBox>
      {/* 우측 서랍 데스크 패드 영역 (고급스러운 가죽/펠트 데스크 매트) */}
      <RoundedBox 
        args={[width * 0.42, 0.2, depth * 0.65]} 
        position={[-width * 0.18, height - 0.05, 0]} 
        radius={0.5}
      >
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </RoundedBox>

      {/* 전선 배선 캡 (Grommet) */}
      <Cylinder args={[2.5, 2.5, topThick + 0.5, 16]} position={[-width * 0.38, height - topThick / 2, -depth * 0.35]}>
        <meshStandardMaterial color="#0f172a" roughness={0.5} />
      </Cylinder>

      {/* 2. 우측 3단 서랍장 바디 (매트 화이트) */}
      <group position={[width / 2 - pedestalW / 2 - 2, pedestalH / 2, 0]}>
        {/* 서랍장 메인 박스 */}
        <RoundedBox args={[pedestalW, pedestalH, depth * 0.9]} radius={0.8}>
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </RoundedBox>
        {/* 3단 서랍 전면 패널 */}
        {[0.28, 0, -0.28].map((offsetRatio, idx) => (
          <group key={idx} position={[0, pedestalH * offsetRatio, depth * 0.45 + 0.4]}>
            <RoundedBox args={[pedestalW - 2, pedestalH * 0.28, 1]} radius={0.3}>
              <meshStandardMaterial color="#ffffff" roughness={0.2} />
            </RoundedBox>
            {/* 알루미늄 일자 바 손잡이 */}
            <RoundedBox args={[pedestalW * 0.4, 1, 1]} position={[0, 0, 0.8]} radius={0.2}>
              <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
            </RoundedBox>
          </group>
        ))}
      </group>

      {/* 3. 좌측 모던 아키텍처 스틸 프레임 다리 */}
      <group position={[-width / 2 + 4, pedestalH / 2, 0]}>
        <RoundedBox args={[4, pedestalH, 4]} position={[0, 0, -depth * 0.4 + 2]} radius={0.5}>
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[4, pedestalH, 4]} position={[0, 0, depth * 0.4 - 2]} radius={0.5}>
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[4, 4, depth * 0.8]} position={[0, -pedestalH / 2 + 2, 0]} radius={0.5}>
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </RoundedBox>
      </group>

      {/* 4. 전면 슬레이트 가림판 (Modesty Panel) */}
      <RoundedBox 
        args={[width * 0.58, pedestalH * 0.65, 2]} 
        position={[-width * 0.15, pedestalH * 0.55, -depth * 0.38]} 
        radius={0.5}
      >
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </RoundedBox>
    </group>
  );
}

// 4-A. 🗄️ 3단 오픈 교구장 (첨부 이미지 1: 부드러운 곡면 측판 + 3단 파스텔 선반 + 낙하방지 뒷턱)
export function CabinetOpen3TierProcedural({ width, depth, height = 85 }) {
  const sideThick = 2.2;
  const shelfThick = 2.0;
  const kickH = 6;
  const backstopH = 5;
  const usableH = height - kickH - backstopH;
  const shelfSpacing = usableH / 3;

  // 파스텔 옐로우 & 내추럴 톤 (이미지 1 노랑 교구장 기반)
  const bodyColor = "#fef08a"; // 은은한 파스텔 옐로우
  const shelfColor = "#fde047"; // 선명한 옐로우 선반
  const backColor = "#ffffff";  // 깨끗한 화이트 백보드
  const trimColor = "#eab308";  // 엣지 포인트

  return (
    <group position={[0, 0, 0]}>
      {/* 1. 좌/우 안전 곡면 측판 (Side Panels with Rounded Top Safety Curve) */}
      {/* 좌측 측판 */}
      <group position={[-width / 2 + sideThick / 2, height / 2, 0]}>
        <RoundedBox args={[sideThick, height, depth]} radius={0.8} smoothness={4}>
          <meshStandardMaterial color={bodyColor} roughness={0.3} />
        </RoundedBox>
        {/* 상단 곡면 라운딩 엣지 포인트 */}
        <RoundedBox args={[sideThick + 0.2, 2, depth]} position={[0, height / 2 - 1, 0]} radius={0.6}>
          <meshStandardMaterial color={trimColor} roughness={0.4} />
        </RoundedBox>
      </group>

      {/* 우측 측판 */}
      <group position={[width / 2 - sideThick / 2, height / 2, 0]}>
        <RoundedBox args={[sideThick, height, depth]} radius={0.8} smoothness={4}>
          <meshStandardMaterial color={bodyColor} roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[sideThick + 0.2, 2, depth]} position={[0, height / 2 - 1, 0]} radius={0.6}>
          <meshStandardMaterial color={trimColor} roughness={0.4} />
        </RoundedBox>
      </group>

      {/* 2. 후면 백보드 (White Backboard) */}
      <mesh position={[0, height / 2, -depth / 2 + 0.8]}>
        <boxGeometry args={[width - sideThick * 2, height - 2, 1.2]} />
        <meshStandardMaterial color={backColor} roughness={0.4} />
      </mesh>

      {/* 3. 상단 낙하방지 뒷턱 (Top Backstop Ridge) */}
      <RoundedBox 
        args={[width - sideThick * 2, backstopH, 1.8]} 
        position={[0, height - backstopH / 2, -depth / 2 + 1.2]} 
        radius={0.4}
      >
        <meshStandardMaterial color={bodyColor} roughness={0.3} />
      </RoundedBox>

      {/* 4. 최상단 마감 선반판 (Top Shelf) */}
      <RoundedBox 
        args={[width - sideThick * 2, shelfThick, depth - 1]} 
        position={[0, height - backstopH - shelfThick / 2, 0.4]} 
        radius={0.4}
      >
        <meshStandardMaterial color={shelfColor} roughness={0.3} />
      </RoundedBox>

      {/* 5. 중간 선반 2개 (3개 수납 공간 형성) */}
      {[1, 2].map((idx) => {
        const yPos = kickH + shelfSpacing * idx;
        return (
          <group key={idx} position={[0, yPos, 0.4]}>
            <RoundedBox args={[width - sideThick * 2, shelfThick, depth - 1]} radius={0.4}>
              <meshStandardMaterial color={shelfColor} roughness={0.3} />
            </RoundedBox>
            {/* 전면 안전 둥근 엣지 몰딩 */}
            <RoundedBox args={[width - sideThick * 2, shelfThick + 0.4, 1.2]} position={[0, 0, depth / 2 - 0.6]} radius={0.3}>
              <meshStandardMaterial color={trimColor} roughness={0.4} />
            </RoundedBox>
          </group>
        );
      })}

      {/* 6. 최하단 바닥 선반판 */}
      <RoundedBox 
        args={[width - sideThick * 2, shelfThick, depth - 1]} 
        position={[0, kickH + shelfThick / 2, 0.4]} 
        radius={0.4}
      >
        <meshStandardMaterial color={shelfColor} roughness={0.3} />
      </RoundedBox>

      {/* 7. 하단 걸레받이 킥플레이트 (Kickplate) */}
      <RoundedBox 
        args={[width - sideThick * 2, kickH, 1.8]} 
        position={[0, kickH / 2, depth / 2 - 2]} 
        radius={0.3}
      >
        <meshStandardMaterial color={bodyColor} roughness={0.3} />
      </RoundedBox>
    </group>
  );
}

// 4-B. 🗄️ 4단 오픈 교구장 (첨부 이미지 2: 화이트 바디 + 4단 알록달록 파스텔 컬러 엣지 선반)
export function CabinetOpen4TierProcedural({ width, depth, height = 115 }) {
  const sideThick = 2.2;
  const shelfThick = 2.2;
  const kickH = 6;
  const backstopH = 5;
  const usableH = height - kickH - backstopH;
  const shelfSpacing = usableH / 4;

  // 이미지 2의 4단 컬러 팔레트 (A타입: 노랑, 연두, 분홍, 노랑 / 멀티 파스텔)
  const tierColors = ['#fde047', '#86efac', '#f472b6', '#67e8f9']; // 상단부터 하단까지

  return (
    <group position={[0, 0, 0]}>
      {/* 1. 좌/우 클린 화이트 안전 곡면 측판 */}
      {[-width / 2 + sideThick / 2, width / 2 - sideThick / 2].map((xPos, idx) => (
        <group key={idx} position={[xPos, height / 2, 0]}>
          <RoundedBox args={[sideThick, height, depth]} radius={0.8} smoothness={4}>
            <meshStandardMaterial color="#ffffff" roughness={0.25} />
          </RoundedBox>
          {/* 상단 모던 그레이 엣지 트림 */}
          <RoundedBox args={[sideThick + 0.2, 1.6, depth]} position={[0, height / 2 - 0.8, 0]} radius={0.5}>
            <meshStandardMaterial color="#cbd5e1" roughness={0.4} />
          </RoundedBox>
        </group>
      ))}

      {/* 2. 후면 순백색 백보드 */}
      <mesh position={[0, height / 2, -depth / 2 + 0.8]}>
        <boxGeometry args={[width - sideThick * 2, height - 2, 1.2]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>

      {/* 3. 상단 낙하방지 화이트 뒷턱 */}
      <RoundedBox 
        args={[width - sideThick * 2, backstopH, 1.8]} 
        position={[0, height - backstopH / 2, -depth / 2 + 1.2]} 
        radius={0.4}
      >
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </RoundedBox>

      {/* 4. 4개의 알록달록 파스텔 컬러 엣지 선반 (상단부터 4개) */}
      {[0, 1, 2, 3].map((idx) => {
        const yPos = height - backstopH - shelfThick / 2 - shelfSpacing * idx;
        const color = tierColors[idx % tierColors.length];

        return (
          <group key={idx} position={[0, yPos, 0.4]}>
            {/* 선반 메인 베이스 화이트 판 */}
            <RoundedBox args={[width - sideThick * 2, shelfThick, depth - 1]} radius={0.4}>
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </RoundedBox>
            {/* 전면 둥근 파스텔 컬러 엣지 (첨부 이미지 2의 핵심 특징!) */}
            <RoundedBox 
              args={[width - sideThick * 2, shelfThick + 0.6, depth * 0.45]} 
              position={[0, 0.2, depth * 0.25]} 
              radius={0.5}
            >
              <meshStandardMaterial color={color} roughness={0.35} />
            </RoundedBox>
          </group>
        );
      })}

      {/* 5. 최하단 바닥 선반판 */}
      <group position={[0, kickH + shelfThick / 2, 0.4]}>
        <RoundedBox args={[width - sideThick * 2, shelfThick, depth - 1]} radius={0.4}>
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </RoundedBox>
        <RoundedBox 
          args={[width - sideThick * 2, shelfThick + 0.6, depth * 0.45]} 
          position={[0, 0.2, depth * 0.25]} 
          radius={0.5}
        >
          <meshStandardMaterial color={tierColors[0]} roughness={0.35} />
        </RoundedBox>
      </group>

      {/* 6. 하단 걸레받이 킥플레이트 */}
      <RoundedBox 
        args={[width - sideThick * 2, kickH, 1.8]} 
        position={[0, kickH / 2, depth / 2 - 2]} 
        radius={0.3}
      >
        <meshStandardMaterial color="#ffffff" roughness={0.25} />
      </RoundedBox>
    </group>
  );
}

// 4-C. 🗄️ 3단 교구장 (문 있음)
export function CabinetClosed3TierProcedural({ width, depth, height = 85 }) {
  const topThick = 2.4;
  const bodyH = height - topThick;

  return (
    <group position={[0, 0, 0]}>
      {/* 상단 마감 상판 (클린 화이트 + 차콜 엣지 테두리) */}
      <RoundedBox args={[width + 1, topThick, depth + 1]} position={[0, height - topThick / 2, 0]} radius={0.6}>
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </RoundedBox>
      <RoundedBox args={[width + 1.2, 0.4, depth + 1.2]} position={[0, height - topThick + 0.2, 0]} radius={0.6}>
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </RoundedBox>

      {/* 메인 본체 */}
      <RoundedBox args={[width, bodyH, depth]} position={[0, bodyH / 2, 0]} radius={0.8}>
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </RoundedBox>

      {/* 3단 높이의 소프트 스카이블루 양문형 도어 */}
      <group position={[0, bodyH / 2, depth / 2 + 0.5]}>
        <RoundedBox args={[width / 2 - 1.5, bodyH - 4, 1.8]} position={[-width / 4, 0, 0]} radius={0.4}>
          <meshStandardMaterial color="#bae6fd" roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[width / 2 - 1.5, bodyH - 4, 1.8]} position={[width / 4, 0, 0]} radius={0.4}>
          <meshStandardMaterial color="#bae6fd" roughness={0.3} />
        </RoundedBox>
        {/* 알루미늄 슬림 세로 핸들 */}
        <Cylinder args={[0.5, 0.5, bodyH * 0.35, 16]} position={[-3, 0, 1.6]}>
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.5, 0.5, bodyH * 0.35, 16]} position={[3, 0, 1.6]}>
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </Cylinder>
      </group>

      {/* 바닥 스틸 다리 받침대 */}
      {[-width/2 + 4, width/2 - 4].map((xPos, idx) => (
        <RoundedBox key={idx} args={[4, 2, depth - 4]} position={[xPos, 1, 0]} radius={0.2}>
          <meshStandardMaterial color="#0f172a" />
        </RoundedBox>
      ))}
    </group>
  );
}

// 4-D. 🗄️ 4단 교구장 (문 있음)
export function CabinetClosed4TierProcedural({ width, depth, height = 115 }) {
  const topThick = 2.4;
  const bodyH = height - topThick;

  return (
    <group position={[0, 0, 0]}>
      {/* 상단 마감 상판 */}
      <RoundedBox args={[width + 1, topThick, depth + 1]} position={[0, height - topThick / 2, 0]} radius={0.6}>
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </RoundedBox>
      <RoundedBox args={[width + 1.2, 0.4, depth + 1.2]} position={[0, height - topThick + 0.2, 0]} radius={0.6}>
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </RoundedBox>

      {/* 메인 본체 */}
      <RoundedBox args={[width, bodyH, depth]} position={[0, bodyH / 2, 0]} radius={0.8}>
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </RoundedBox>

      {/* 4단 높이의 소프트 세이지/블루 양문형 도어 */}
      <group position={[0, bodyH / 2, depth / 2 + 0.5]}>
        <RoundedBox args={[width / 2 - 1.5, bodyH - 4, 1.8]} position={[-width / 4, 0, 0]} radius={0.4}>
          <meshStandardMaterial color="#bfdbfe" roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[width / 2 - 1.5, bodyH - 4, 1.8]} position={[width / 4, 0, 0]} radius={0.4}>
          <meshStandardMaterial color="#bfdbfe" roughness={0.3} />
        </RoundedBox>
        {/* 알루미늄 슬림 세로 핸들 */}
        <Cylinder args={[0.5, 0.5, bodyH * 0.4, 16]} position={[-3, 0, 1.6]}>
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.5, 0.5, bodyH * 0.4, 16]} position={[3, 0, 1.6]}>
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </Cylinder>
      </group>

      {/* 바닥 스틸 다리 받침대 */}
      {[-width/2 + 4, width/2 - 4].map((xPos, idx) => (
        <RoundedBox key={idx} args={[4, 2, depth - 4]} position={[xPos, 1, 0]} radius={0.2}>
          <meshStandardMaterial color="#0f172a" />
        </RoundedBox>
      ))}
    </group>
  );
}

// 4-E. 🗄️ 1단 세로 긴 도어형 사물함/교구장 (첨부 사진: 화이트 상판 + 1단 긴 자작나무/연두색 도어 + 상단 이름표 + 매립형 손잡이)
export function CabinetSingleTallDoorProcedural({ width, depth, height = 88 }) {
  const topThick = 2.4;
  const kickH = 3.5;
  const bodyH = height - topThick - kickH;
  const cols = Math.max(1, Math.round(width / 38));
  const colW = width / cols;

  // 사진 속 알록달록한 파스텔 이름표 & 도어 컬러들
  const doorThemes = [
    { wood: '#fde68a', tagBg: '#bae6fd', tagText: '#0369a1' }, // 이유리 (자작/스카이)
    { wood: '#fde68a', tagBg: '#60a5fa', tagText: '#ffffff' }, // 이한서 (블루)
    { wood: '#a3e635', tagBg: '#fef08a', tagText: '#3f6212' }, // 채다솜 (연두 도어!)
    { wood: '#fde68a', tagBg: '#c084fc', tagText: '#ffffff' }, // 한송빈 (라벤더)
    { wood: '#fde68a', tagBg: '#fed7aa', tagText: '#9a3412' }  // 주황
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* 1. 상단 연속 화이트 카운터 상판 (상단에 화분/교구 진열 가능) */}
      <RoundedBox 
        args={[width + 1.2, topThick, depth + 1.2]} 
        position={[0, height - topThick / 2, 0]} 
        radius={0.6}
      >
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </RoundedBox>
      <RoundedBox 
        args={[width + 1.4, 0.4, depth + 1.4]} 
        position={[0, height - topThick + 0.2, 0]} 
        radius={0.6}
      >
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </RoundedBox>

      {/* 2. 메인 사물함 본체 케이싱 */}
      <RoundedBox 
        args={[width, bodyH, depth]} 
        position={[0, kickH + bodyH / 2, 0]} 
        radius={0.6}
      >
        <meshStandardMaterial color="#fef3c7" roughness={0.4} />
      </RoundedBox>

      {/* 3. 1단 세로 긴 도어들 (N열) */}
      {Array.from({ length: cols }).map((_, idx) => {
        const xPos = -width / 2 + colW / 2 + colW * idx;
        const theme = doorThemes[idx % doorThemes.length];
        const doorH = bodyH - 1.2;

        return (
          <group key={idx} position={[xPos, kickH + bodyH / 2, depth / 2 + 0.6]}>
            {/* 세로 긴 도어 패널 */}
            <RoundedBox args={[colW - 0.8, doorH, 1.8]} radius={0.3} smoothness={4}>
              <meshStandardMaterial color={theme.wood} roughness={0.4} />
            </RoundedBox>

            {/* 상단 이름표 (Nameplate) */}
            <RoundedBox 
              args={[Math.min(colW * 0.55, 20), 5.5, 0.4]} 
              position={[0, doorH * 0.38, 1.0]} 
              radius={0.4}
            >
              <meshStandardMaterial color={theme.tagBg} roughness={0.3} />
            </RoundedBox>

            {/* 매립형 화이트 사각 포켓 손잡이 (Recessed Flush Handle Bezel) */}
            <group position={[-colW * 0.32, -doorH * 0.06, 1.0]}>
              {/* 화이트 외곽 베젤 */}
              <RoundedBox args={[7, 12, 0.6]} radius={0.4}>
                <meshStandardMaterial color="#ffffff" roughness={0.2} />
              </RoundedBox>
              {/* 내부 오목한 포켓 홈 */}
              <RoundedBox args={[4.5, 9, 0.8]} position={[0, 0, -0.2]} radius={0.2}>
                <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
              </RoundedBox>
              {/* 세로 래치 레버 / 키락 바 */}
              <RoundedBox args={[1.2, 6, 0.4]} position={[-0.8, 0, 0.1]} radius={0.2}>
                <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
              </RoundedBox>
            </group>

            {/* 상/하 크롬 코너 경첩 브라켓 */}
            <group position={[colW * 0.42, doorH * 0.45, 0.9]}>
              <RoundedBox args={[2.4, 1.2, 0.5]} radius={0.2}>
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </RoundedBox>
            </group>
            <group position={[colW * 0.42, -doorH * 0.45, 0.9]}>
              <RoundedBox args={[2.4, 1.2, 0.5]} radius={0.2}>
                <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
              </RoundedBox>
            </group>
          </group>
        );
      })}

      {/* 4. 하단 레벨링 글라이드 (Floor Glides) */}
      {[-width / 2 + 4, width / 2 - 4].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0, 0]}>
          <Cylinder args={[2.5, 2.5, kickH, 16]} position={[0, kickH / 2, -depth * 0.35]}>
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </Cylinder>
          <Cylinder args={[2.5, 2.5, kickH, 16]} position={[0, kickH / 2, depth * 0.35]}>
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </Cylinder>
        </group>
      ))}
    </group>
  );
}

// 5. 👟 개인 도어형 락커 신발장 도어 유닛 (첨부 이미지: 투명 확인창 + 네임텍 + 화이트 손잡이 + 크롬 경첩)
function LockerShoeDoor({ doorW, doorH }) {
  const windowW = Math.min(doorW * 0.44, 15);
  const windowH = Math.min(doorH * 0.46, 17);
  const tagW = Math.min(doorW * 0.52, 18);
  const tagH = 3.8;

  return (
    <group>
      {/* 1. 도어 전면 메이플/자작 원목 패널 */}
      <RoundedBox args={[doorW - 0.8, doorH - 0.8, 1.8]} radius={0.4} smoothness={4}>
        <meshStandardMaterial color="#fde68a" roughness={0.4} />
      </RoundedBox>

      {/* 2. 상단 네임텍 / 이름표 꽂이 (Translucent Name Tag Slot) */}
      <RoundedBox args={[tagW, tagH, 0.4]} position={[0, doorH * 0.32, 1.0]} radius={0.2}>
        <meshStandardMaterial color="#ffffff" roughness={0.2} transparent opacity={0.85} />
      </RoundedBox>

      {/* 3. 중앙 사각 투명 확인창 (White Bezel Frame + Tinted Window Pane) */}
      <group position={[0, -doorH * 0.05, 1.0]}>
        {/* 볼록한 화이트 테두리 베젤 */}
        <RoundedBox args={[windowW + 2.2, windowH + 2.2, 0.6]} radius={0.5} smoothness={4}>
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </RoundedBox>
        {/* 내부 투명창 (신발/실내화 확인용) */}
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[windowW, windowH, 0.3]} />
          <meshStandardMaterial color="#1e293b" transparent opacity={0.7} roughness={0.1} />
        </mesh>
      </group>

      {/* 4. 화이트 원형 손잡이 (White Round Knob) & 실버 키락(Keyhole) */}
      <group position={[-doorW * 0.36, 0, 1.2]}>
        <Cylinder args={[1.2, 1.2, 1.4, 16]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </Cylinder>
        {/* 손잡이 아래 열쇠 구멍 */}
        <Cylinder args={[0.5, 0.5, 0.6, 12]} rotation={[Math.PI / 2, 0, 0]} position={[0.3, -2.8, -0.3]}>
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </Cylinder>
      </group>

      {/* 5. 상/하 크롬 코너 경첩 브라켓 (Chrome Hinges) */}
      <group position={[doorW * 0.42, doorH * 0.42, 0.9]}>
        <RoundedBox args={[2.4, 1.4, 0.5]} radius={0.2}>
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
        </RoundedBox>
      </group>
      <group position={[doorW * 0.42, -doorH * 0.42, 0.9]}>
        <RoundedBox args={[2.4, 1.4, 0.5]} radius={0.2}>
          <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
        </RoundedBox>
      </group>
    </group>
  );
}

// 5-A. 👟 2단 개인 도어형 신발장 (투명 확인창 + 네임텍 + 다리발)
export function ShoeRack2TierProcedural({ width, depth, height = 70 }) {
  const legH = 6;
  const topThick = 2.4;
  const bodyH = height - legH - topThick;
  const cols = Math.max(2, Math.round(width / 32));
  const rows = 2;

  const colW = width / cols;
  const rowH = bodyH / rows;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. 상단 마감 상판 (클린 화이트 + 차콜 엣지 테두리로 탑뷰에서 100% 선명) */}
      <RoundedBox 
        args={[width + 1.2, topThick, depth + 1.2]} 
        position={[0, height - topThick / 2, 0]} 
        radius={0.6}
      >
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </RoundedBox>
      <RoundedBox 
        args={[width + 1.4, 0.4, depth + 1.4]} 
        position={[0, height - topThick + 0.2, 0]} 
        radius={0.6}
      >
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </RoundedBox>

      {/* 2. 신발장 메인 자작/메이플 외벽 케이싱 */}
      <RoundedBox 
        args={[width, bodyH, depth]} 
        position={[0, legH + bodyH / 2, 0]} 
        radius={0.8}
      >
        <meshStandardMaterial color="#fef3c7" roughness={0.4} />
      </RoundedBox>

      {/* 3. 개별 도어 그리드 (2단 x N열) */}
      {Array.from({ length: rows }).map((_, rIdx) => {
        const yPos = legH + bodyH - rowH / 2 - rowH * rIdx;
        return Array.from({ length: cols }).map((_, cIdx) => {
          const xPos = -width / 2 + colW / 2 + colW * cIdx;
          return (
            <group key={`${rIdx}-${cIdx}`} position={[xPos, yPos, depth / 2 + 0.5]}>
              <LockerShoeDoor doorW={colW} doorH={rowH} />
            </group>
          );
        });
      })}

      {/* 4. 4개의 원통형 화이트/실버 다리발 (Elevated Feet) */}
      {[
        [-width / 2 + 5, -depth / 2 + 5],
        [ width / 2 - 5, -depth / 2 + 5],
        [-width / 2 + 5,  depth / 2 - 5],
        [ width / 2 - 5,  depth / 2 - 5]
      ].map((pos, idx) => (
        <group key={idx} position={[pos[0], 0, pos[1]]}>
          <Cylinder args={[2.2, 2.0, legH, 16]} position={[0, legH / 2, 0]}>
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </Cylinder>
          <Cylinder args={[2.5, 2.5, 1.2, 16]} position={[0, 0.6, 0]}>
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
          </Cylinder>
        </group>
      ))}
    </group>
  );
}

// 5-B. 👟 3단 개인 도어형 신발장 (첨부 사진 완벽 일치: 3단 2열 투명 확인창 락커 신발장)
export function ShoeRack3TierProcedural({ width, depth, height = 95 }) {
  const legH = 6;
  const topThick = 2.4;
  const bodyH = height - legH - topThick;
  const cols = Math.max(2, Math.round(width / 32));
  const rows = 3;

  const colW = width / cols;
  const rowH = bodyH / rows;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. 상단 마감 상판 (클린 화이트 + 차콜 엣지 테두리) */}
      <RoundedBox 
        args={[width + 1.2, topThick, depth + 1.2]} 
        position={[0, height - topThick / 2, 0]} 
        radius={0.6}
      >
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </RoundedBox>
      <RoundedBox 
        args={[width + 1.4, 0.4, depth + 1.4]} 
        position={[0, height - topThick + 0.2, 0]} 
        radius={0.6}
      >
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </RoundedBox>

      {/* 2. 신발장 메인 자작/메이플 외벽 케이싱 */}
      <RoundedBox 
        args={[width, bodyH, depth]} 
        position={[0, legH + bodyH / 2, 0]} 
        radius={0.8}
      >
        <meshStandardMaterial color="#fef3c7" roughness={0.4} />
      </RoundedBox>

      {/* 3. 개별 도어 그리드 (3단 x N열 = 첨부 사진의 6도어 락커 완벽 재현!) */}
      {Array.from({ length: rows }).map((_, rIdx) => {
        const yPos = legH + bodyH - rowH / 2 - rowH * rIdx;
        return Array.from({ length: cols }).map((_, cIdx) => {
          const xPos = -width / 2 + colW / 2 + colW * cIdx;
          return (
            <group key={`${rIdx}-${cIdx}`} position={[xPos, yPos, depth / 2 + 0.5]}>
              <LockerShoeDoor doorW={colW} doorH={rowH} />
            </group>
          );
        });
      })}

      {/* 4. 4개의 원통형 화이트/실버 다리발 (Elevated Feet) */}
      {[
        [-width / 2 + 5, -depth / 2 + 5],
        [ width / 2 - 5, -depth / 2 + 5],
        [-width / 2 + 5,  depth / 2 - 5],
        [ width / 2 - 5,  depth / 2 - 5]
      ].map((pos, idx) => (
        <group key={idx} position={[pos[0], 0, pos[1]]}>
          <Cylinder args={[2.2, 2.0, legH, 16]} position={[0, legH / 2, 0]}>
            <meshStandardMaterial color="#ffffff" roughness={0.3} />
          </Cylinder>
          <Cylinder args={[2.5, 2.5, 1.2, 16]} position={[0, 0.6, 0]}>
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
          </Cylinder>
        </group>
      ))}
    </group>
  );
}

// 5-C. 👗 키 큰 옷장 (Tall Wardrobe)
export function WardrobeProcedural({ width, depth, height = 180 }) {
  const topThick = 2.4;
  const bodyH = height - topThick;

  return (
    <group position={[0, 0, 0]}>
      <RoundedBox args={[width + 1, topThick, depth + 1]} position={[0, height - topThick / 2, 0]} radius={0.6}>
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </RoundedBox>
      <RoundedBox args={[width + 1.2, 0.4, depth + 1.2]} position={[0, height - topThick + 0.2, 0]} radius={0.6}>
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </RoundedBox>
      <RoundedBox args={[width, bodyH, depth]} position={[0, bodyH / 2, 0]} radius={0.8}>
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </RoundedBox>
      <group position={[0, bodyH / 2, depth / 2 + 0.5]}>
        <RoundedBox args={[width / 2 - 1.5, bodyH - 4, 1.8]} position={[-width / 4, 0, 0]} radius={0.4}>
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[width / 2 - 1.5, bodyH - 4, 1.8]} position={[width / 4, 0, 0]} radius={0.4}>
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
        </RoundedBox>
        <Cylinder args={[0.5, 0.5, bodyH * 0.3, 16]} position={[-3, 0, 1.6]}>
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.5, 0.5, bodyH * 0.3, 16]} position={[3, 0, 1.6]}>
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </Cylinder>
      </group>
      {[-width/2 + 4, width/2 - 4].map((xPos, idx) => (
        <RoundedBox key={idx} args={[4, 2, depth - 4]} position={[xPos, 1, 0]} radius={0.2}>
          <meshStandardMaterial color="#0f172a" />
        </RoundedBox>
      ))}
    </group>
  );
}

// 6. 📱 이동식 자석 칠판 (딥 포레스트 그린 칠판면 + 알루미늄 프레임 + 펜받침 + 캐스터 바퀴)
export function BoardProcedural({ width, depth, height = 180 }) {
  const boardHeight = Math.min(115, height * 0.65);
  const boardThickness = 4.5;
  const standH = height;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. 딥 그린 매트 칠판 보드면 (눈의 피로를 덜어주는 고급 분필/마커 칠판) */}
      <RoundedBox 
        args={[width, boardHeight, boardThickness]} 
        position={[0, standH * 0.58, 0]} 
        radius={1.2} 
        smoothness={2}
      >
        <meshStandardMaterial color="#064e3b" roughness={0.8} />
      </RoundedBox>

      {/* 2. 양극산화 처리된 실버 알루미늄 보더 프레임 */}
      <RoundedBox 
        args={[width + 3, boardHeight + 3, boardThickness - 0.8]} 
        position={[0, standH * 0.58, -0.4]} 
        radius={0.8}
      >
        <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.25} />
      </RoundedBox>

      {/* 3. 하단 알루미늄 펜/지우개 받침대 (Marker Tray) */}
      <RoundedBox 
        args={[width - 6, 2.5, 7]} 
        position={[0, standH * 0.58 - boardHeight / 2 - 1.2, 2.5]} 
        radius={0.4}
      >
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* 분필/지우개 디테일 소품 */}
      <Box args={[12, 2, 4]} position={[-width * 0.25, standH * 0.58 - boardHeight / 2 + 1, 2.5]}>
        <meshStandardMaterial color="#38bdf8" />
      </Box>
      <Cylinder args={[0.6, 0.6, 6, 12]} rotation={[0, 0, Math.PI / 2]} position={[width * 0.25, standH * 0.58 - boardHeight / 2 + 0.8, 2.5]}>
        <meshStandardMaterial color="#ffffff" />
      </Cylinder>

      {/* 4. 견고한 차콜 스틸 A-프레임 스탠드 기둥 */}
      <Cylinder args={[2, 2, standH * 0.95, 16]} position={[-width / 2 + 5, standH * 0.48, 0]}>
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[2, 2, standH * 0.95, 16]} position={[width / 2 - 5, standH * 0.48, 0]}>
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </Cylinder>

      {/* 5. 하단 이동식 바퀴 다리 (Caster Legs) */}
      {[-width / 2 + 5, width / 2 - 5].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0, 0]}>
          <RoundedBox args={[4.5, 3.5, depth]} position={[0, 4, 0]} radius={0.6}>
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </RoundedBox>
          {/* 바퀴 2개 */}
          <Cylinder args={[2.2, 2.2, 2, 16]} rotation={[0, 0, Math.PI / 2]} position={[0, 2.2, -depth * 0.38]}>
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </Cylinder>
          <Cylinder args={[2.2, 2.2, 2, 16]} rotation={[0, 0, Math.PI / 2]} position={[0, 2.2, depth * 0.38]}>
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </Cylinder>
        </group>
      ))}
    </group>
  );
}

// 6-B. 🖥️ 벽 부착형 전자칠판 시스템 (교실 실내 벽면 Z=0에 밀착하여 교실 안쪽으로만 3~4cm 돌출)
export function ElectronicBoardProcedural({ width = 200, depth = 12, height = 120, wallMode = 'high' }) {
  if (wallMode === 'low') return null;

  const mountY = 85 + (height || 120) / 2;
  const screenH = (height || 120) - 6;

  // 가로 크기가 220cm 초과일 때만 좌/우 슬라이딩 보조 화이트보드 날개 표시!
  const hasWings = width > 220;

  // 전자칠판 자체의 가로 폭
  const centerW = hasWings ? Math.min(Math.max(180, width * 0.54), width - 80) : width - 4;
  const wingW = hasWings ? (width - centerW - 6) / 2 : 0;

  // 실내 벽면 표면은 Z = 0 (교실 내부는 Z > 0)
  return (
    <group position={[0, mountY, 0]}>
      {/* 1. 벽면 마운트 백플레이트 (실내 벽면 Z=0에 밀착) */}
      <RoundedBox args={[width, height || 120, 0.8]} position={[0, 0, 0.4]} radius={0.3}>
        <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* 날개가 있을 때 상/하단 더블 슬라이딩 알루미늄 레일 트랙 */}
      {hasWings && (
        <>
          <RoundedBox args={[width, 2.5, 1.6]} position={[0, (height || 120) / 2 - 1.5, 1.2]} radius={0.3}>
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </RoundedBox>
          <RoundedBox args={[width, 2.5, 1.6]} position={[0, -(height || 120) / 2 + 1.5, 1.2]} radius={0.3}>
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </RoundedBox>
        </>
      )}

      {/* 2. 중앙 대형 스마트 인터랙티브 전자칠판 디스플레이 본체 (교실 내부로 돌출) */}
      <group position={[0, 0, 1.8]}>
        {/* 전자칠판 외곽 티타늄 다크 베젤 */}
        <RoundedBox args={[centerW, screenH, 2.0]} radius={0.5}>
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </RoundedBox>
        {/* 내부 화이트 슬림 라인 테두리 */}
        <RoundedBox args={[centerW - 1.6, screenH - 1.6, 2.1]} position={[0, 0, 0.1]} radius={0.4}>
          <meshStandardMaterial color="#f8fafc" roughness={0.2} />
        </RoundedBox>

        {/* 📺 프리미엄 딥 블랙 글래스 디스플레이 스크린 (화면 꺼진 슬릭 블랙 글래스) */}
        <mesh position={[0, 2, 1.15]}>
          <planeGeometry args={[centerW - 6, screenH - 16]} />
          <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.85} />
        </mesh>

        {/* 16:9 액티브 디스플레이 안티글레어 내부 영역 */}
        <mesh position={[0, 2, 1.17]}>
          <planeGeometry args={[centerW - 10, screenH - 20]} />
          <meshStandardMaterial color="#1e293b" roughness={0.25} metalness={0.7} />
        </mesh>

        {/* 중앙 하단 은은한 스마트보드 로고 / 대기 표시 */}
        <mesh position={[0, -screenH * 0.28, 1.19]}>
          <circleGeometry args={[1.2, 16]} />
          <meshStandardMaterial color="#475569" roughness={0.3} />
        </mesh>

        {/* 📷 상단 스마트 센서 / 웹캠 / 마이크 바 */}
        <RoundedBox args={[Math.min(centerW * 0.25, 30), 2, 1.0]} position={[0, screenH / 2 - 2, 1.2]} radius={0.4}>
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </RoundedBox>
        <mesh position={[0, screenH / 2 - 2, 1.75]}>
          <circleGeometry args={[0.6, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* 🔊 하단 전면 스테레오 스피커 바 & 전원 컨트롤 패널 */}
        <RoundedBox args={[centerW - 4, 5.5, 1.2]} position={[0, -screenH / 2 + 4, 1.2]} radius={0.3}>
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
        </RoundedBox>
        {/* 스피커 그릴 천공 스트라이프 */}
        <mesh position={[-centerW * 0.28, -screenH / 2 + 4, 1.85]}>
          <planeGeometry args={[centerW * 0.35, 3]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        <mesh position={[centerW * 0.28, -screenH / 2 + 4, 1.85]}>
          <planeGeometry args={[centerW * 0.35, 3]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
        {/* 전원 LED 버튼 */}
        <mesh position={[0, -screenH / 2 + 4, 1.85]}>
          <circleGeometry args={[0.9, 16]} />
          <meshStandardMaterial color="#38bdf8" />
        </mesh>

        {/* 🖊️ 하단 스마트 전자펜 마그네틱 트레이 & 터치펜 2개 */}
        <RoundedBox args={[Math.min(centerW * 0.45, 55), 2.0, 2.5]} position={[0, -screenH / 2 - 0.6, 1.5]} radius={0.4}>
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
        </RoundedBox>
        <Cylinder args={[0.4, 0.4, 14, 12]} rotation={[0, 0, Math.PI / 2]} position={[-centerW * 0.08, -screenH / 2 + 0.6, 2.5]}>
          <meshStandardMaterial color="#3b82f6" roughness={0.3} />
        </Cylinder>
        <Cylinder args={[0.4, 0.4, 14, 12]} rotation={[0, 0, Math.PI / 2]} position={[centerW * 0.08, -screenH / 2 + 0.6, 2.5]}>
          <meshStandardMaterial color="#ef4444" roughness={0.3} />
        </Cylinder>
      </group>

      {/* 3. 📋 가로 크기가 클 때만 표시되는 좌측 슬라이딩 화이트보드 날개 */}
      {hasWings && (
        <group position={[-width / 2 + wingW / 2 + 2, 0, 2.4]}>
          <RoundedBox args={[wingW, screenH, 1.5]} radius={0.4}>
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
          </RoundedBox>
          <mesh position={[0, 0, 0.8]}>
            <planeGeometry args={[wingW - 3, screenH - 3]} />
            <meshStandardMaterial color="#ffffff" roughness={0.15} />
          </mesh>

          {/* 🟡 노란색 날짜 자석 */}
          <group position={[-wingW * 0.22, screenH * 0.36, 0.85]}>
            <mesh position={[-6, 0, 0]}>
              <circleGeometry args={[3.2, 20]} />
              <meshStandardMaterial color="#facc15" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <circleGeometry args={[3.2, 20]} />
              <meshStandardMaterial color="#facc15" />
            </mesh>
            <mesh position={[6, 0, 0]}>
              <circleGeometry args={[3.2, 20]} />
              <meshStandardMaterial color="#facc15" />
            </mesh>
          </group>

          {/* ⏱️ 원형 아날로그 타이머 시계 */}
          <group position={[wingW * 0.24, screenH * 0.22, 0.85]}>
            <mesh position={[0, 0, 0]}>
              <circleGeometry args={[6.5, 32]} />
              <meshStandardMaterial color="#f8fafc" />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <circleGeometry args={[4.5, 32]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
          </group>

          {/* 📝 학습 목표 카드 */}
          <mesh position={[-wingW * 0.15, -screenH * 0.05, 0.85]}>
            <planeGeometry args={[wingW * 0.6, 7]} />
            <meshStandardMaterial color="#fed7aa" />
          </mesh>
          <mesh position={[-wingW * 0.15, -screenH * 0.22, 0.85]}>
            <planeGeometry args={[wingW * 0.6, 9]} />
            <meshStandardMaterial color="#e0f2fe" />
          </mesh>
        </group>
      )}

      {/* 4. 📅 가로 크기가 클 때만 표시되는 우측 슬라이딩 화이트보드 날개 */}
      {hasWings && (
        <group position={[width / 2 - wingW / 2 - 2, 0, 2.7]}>
          <RoundedBox args={[wingW, screenH, 1.5]} radius={0.4}>
            <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
          </RoundedBox>
          <mesh position={[0, 0, 0.8]}>
            <planeGeometry args={[wingW - 3, screenH - 3]} />
            <meshStandardMaterial color="#ffffff" roughness={0.15} />
          </mesh>

          {/* 🌈 시간표 블록 */}
          {[
            { color: '#ef4444', text: '1. 원예' },
            { color: '#f97316', text: '2. 동아리' },
            { color: '#eab308', text: '3. 국어' },
            { color: '#10b981', text: '점심시간' },
            { color: '#0284c7', text: '4. 과학' },
            { color: '#3b82f6', text: '5. 특기' },
            { color: '#8b5cf6', text: '6. 적성' }
          ].map((item, idx) => {
            const yPos = screenH * 0.36 - idx * (screenH * 0.105);
            return (
              <group key={idx} position={[-wingW * 0.08, yPos, 0.85]}>
                <mesh position={[-wingW * 0.22, 0, 0]}>
                  <planeGeometry args={[7, 6.5]} />
                  <meshStandardMaterial color={item.color} />
                </mesh>
                <mesh position={[wingW * 0.14, 0, 0]}>
                  <planeGeometry args={[wingW * 0.52, 6.5]} />
                  <meshStandardMaterial color="#f8fafc" />
                </mesh>
              </group>
            );
          })}

          {/* 🚌 하단 노란 스쿨버스 자석 스티커 */}
          <mesh position={[0, -screenH * 0.42, 0.85]}>
            <planeGeometry args={[wingW * 0.55, 6]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>

          {/* ➡️ 현재 교시를 가리키는 노란 화살표 스티커 */}
          <mesh position={[-wingW / 2 + 1, screenH * 0.045, 0.88]}>
            <planeGeometry args={[5, 5]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>
        </group>
      )}
    </group>
  );
}

// 7. 🚪 출입문 (벽체 Z=-12~0 관통 + 교실 밖 복도 Z<-12 측으로 3.5cm 튀어나온 입체 포털 프레임)
export function DoorProcedural({ width, depth, height = 210, wallMode = 'high' }) {
  if (wallMode === 'low') return null;

  const frameThick = 5.0;
  const wallThick = 12; // 벽체 두께 12cm (실외 Z=-12 ~ 실내 Z=0)

  return (
    <group position={[0, 0, 0]}>
      {/* 1. 벽체 내부 관통 문틀 잼 (Z = -6 중심, Z = -12 ~ 0) */}
      <mesh position={[-width / 2 + frameThick / 2, height / 2, -6]}>
        <boxGeometry args={[frameThick, height, wallThick]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      <mesh position={[width / 2 - frameThick / 2, height / 2, -6]}>
        <boxGeometry args={[frameThick, height, wallThick]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>
      <mesh position={[0, height - frameThick / 2, -6]}>
        <boxGeometry args={[width, frameThick, wallThick]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>

      {/* 2. 교실 밖(외부 복도 측: Z <= -12)으로 확실히 튀어나온 입체 포털 몰딩 프레임 */}
      <RoundedBox args={[frameThick + 2, height + 2, 3.5]} position={[-width / 2 + frameThick / 2, (height + 2) / 2, -13.5]} radius={0.5}>
        <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.2} />
      </RoundedBox>
      <RoundedBox args={[frameThick + 2, height + 2, 3.5]} position={[width / 2 - frameThick / 2, (height + 2) / 2, -13.5]} radius={0.5}>
        <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.2} />
      </RoundedBox>
      <RoundedBox args={[width + 6, frameThick + 2, 4.0]} position={[0, height + 1, -13.5]} radius={0.5}>
        <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.2} />
      </RoundedBox>

      {/* 3. 교실 안쪽(실내 측: Z = 0) 깔끔한 슬림 트림 (0.8cm 미세 마감) */}
      <RoundedBox args={[width + 2, frameThick, 0.8]} position={[0, height - frameThick / 2, 0.4]} radius={0.2}>
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[frameThick, height, 0.8]} position={[-width / 2 + frameThick / 2, height / 2, 0.4]} radius={0.2}>
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </RoundedBox>
      <RoundedBox args={[frameThick, height, 0.8]} position={[width / 2 - frameThick / 2, height / 2, 0.4]} radius={0.2}>
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </RoundedBox>

      {/* 4. 바닥 스테인리스 문턱 마감선 (Floor Threshold: Z=-12 ~ 0) */}
      <mesh position={[0, 0.4, -6]}>
        <boxGeometry args={[width - frameThick * 2, 0.8, wallThick]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

// 8. 🪟 2중 슬라이딩 원목 미서기 창문 (벽체 Z=-12~0 관통 + 교실 밖 외벽 Z<-12 측으로 튀어나온 원목 케이싱 & 와이드 선반)
function WindowSash({ width, height, transomRatio = 0.3, isFront = true }) {
  const border = 3.2; // 샷시 테두리 두께(cm)
  const depth = 2.8; // 샷시 앞뒤 두께(cm)
  const transomY = height / 2 - height * transomRatio;
  
  const innerW = width - border * 2;
  const topGlassH = height * transomRatio - border * 1.5;
  const bottomGlassH = height * (1 - transomRatio) - border * 1.5;

  const frameColor = "#fcd34d"; // 따뜻한 자작/소나무 원목 톤
  const darkWood = "#d97706";

  return (
    <group>
      {/* 상단 가로대 */}
      <RoundedBox args={[width, border, depth]} position={[0, height / 2 - border / 2, 0]} radius={0.3}>
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </RoundedBox>
      {/* 하단 가로대 */}
      <RoundedBox args={[width, border, depth]} position={[0, -height / 2 + border / 2, 0]} radius={0.3}>
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </RoundedBox>
      {/* 좌측 세로대 */}
      <RoundedBox args={[border, height, depth]} position={[-width / 2 + border / 2, 0, 0]} radius={0.3}>
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </RoundedBox>
      {/* 우측 세로대 */}
      <RoundedBox args={[border, height, depth]} position={[width / 2 - border / 2, 0, 0]} radius={0.3}>
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </RoundedBox>

      {/* 중간 분할 원목 가로대 (Transom Bar) */}
      <RoundedBox args={[innerW, border * 0.8, depth]} position={[0, transomY, 0]} radius={0.2}>
        <meshStandardMaterial color={darkWood} roughness={0.6} />
      </RoundedBox>

      {/* 상부 투명 유리창 */}
      <mesh position={[0, height / 2 - (height * transomRatio) / 2, 0]}>
        <boxGeometry args={[innerW, topGlassH, 0.6]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.3} roughness={0.02} metalness={0.1} />
      </mesh>

      {/* 하부 대형 투명 유리창 */}
      <mesh position={[0, -height / 2 + (height * (1 - transomRatio)) / 2, 0]}>
        <boxGeometry args={[innerW, bottomGlassH, 0.6]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.3} roughness={0.02} metalness={0.1} />
      </mesh>

      {/* 황동 크리센트 잠금장치 */}
      {isFront && (
        <group position={[width / 2 - border - 1, -4, depth / 2 + 1]}>
          <Cylinder args={[0.9, 0.9, 2.5, 16]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
          </Cylinder>
          <Box args={[1.5, 3.5, 0.5]} position={[-0.5, 0, 0]}>
            <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
          </Box>
        </group>
      )}
    </group>
  );
}

export function WindowProcedural({ width, depth, height = 120, wallMode = 'high' }) {
  if (wallMode === 'low') return null;

  const wallThick = 12; // 벽체 두께 12cm (실외 Z=-12 ~ 실내 Z=0)
  const outerBorder = 4.5;
  const centerPillarW = 6;
  
  const innerW = width - outerBorder * 2;
  const innerH = height - outerBorder * 2;
  const bayW = (innerW - centerPillarW) / 2;

  const casingWood = "#b45309"; // 짙은 클래식 원목 케이싱

  return (
    <group position={[0, 80 + height / 2, 0]}>
      {/* 1. 벽체 관통 내부 잼 프레임 (Z = -6 중심, Z = -12 ~ 0) */}
      <mesh position={[-width / 2 + outerBorder / 2, 0, -6]}>
        <boxGeometry args={[outerBorder, innerH, wallThick]} />
        <meshStandardMaterial color={casingWood} roughness={0.6} />
      </mesh>
      <mesh position={[width / 2 - outerBorder / 2, 0, -6]}>
        <boxGeometry args={[outerBorder, innerH, wallThick]} />
        <meshStandardMaterial color={casingWood} roughness={0.6} />
      </mesh>
      <mesh position={[0, height / 2 - outerBorder / 2, -6]}>
        <boxGeometry args={[width, outerBorder, wallThick]} />
        <meshStandardMaterial color={casingWood} roughness={0.6} />
      </mesh>
      <mesh position={[0, -height / 2 + outerBorder / 2, -6]}>
        <boxGeometry args={[width, outerBorder, wallThick]} />
        <meshStandardMaterial color={casingWood} roughness={0.6} />
      </mesh>
      {/* 중앙 분할 원목 기둥 */}
      <mesh position={[0, 0, -6]}>
        <boxGeometry args={[centerPillarW, innerH, wallThick]} />
        <meshStandardMaterial color={casingWood} roughness={0.6} />
      </mesh>

      {/* 2. 교실 밖(외부 측: Z <= -12)으로 확연히 튀어나온 원목 케이싱 & 하단 와이드 선반 */}
      <RoundedBox args={[width + 6, outerBorder + 1, 3.5]} position={[0, height / 2 - outerBorder / 2, -13.5]} radius={0.5}>
        <meshStandardMaterial color={casingWood} roughness={0.6} />
      </RoundedBox>
      {/* 외측 하단 와이드 창문턱 선반 (Rain Sill: 바깥으로 크게 돌출) */}
      <RoundedBox args={[width + 10, outerBorder + 2.5, 5.5]} position={[0, -height / 2 + (outerBorder + 2.5) / 2, -14.5]} radius={0.6}>
        <meshStandardMaterial color="#92400e" roughness={0.5} />
      </RoundedBox>
      {/* 외측 좌측 케이싱 기둥 */}
      <RoundedBox args={[outerBorder + 1, innerH, 3.5]} position={[-width / 2 + outerBorder / 2, 0, -13.5]} radius={0.5}>
        <meshStandardMaterial color={casingWood} roughness={0.6} />
      </RoundedBox>
      {/* 외측 우측 케이싱 기둥 */}
      <RoundedBox args={[outerBorder + 1, innerH, 3.5]} position={[width / 2 - outerBorder / 2, 0, -13.5]} radius={0.5}>
        <meshStandardMaterial color={casingWood} roughness={0.6} />
      </RoundedBox>

      {/* 3. 2중 슬라이딩 창문 샷시들 (벽체 내부 Z = -12 ~ 0 사이에서 슬라이딩) */}
      {/* 좌측 베이 */}
      <group position={[-width / 4 + outerBorder / 4, 0, 0]}>
        <group position={[-bayW * 0.23, 0, -8.5]}>
          <WindowSash width={bayW * 0.54} height={innerH} isFront={true} />
        </group>
        <group position={[bayW * 0.23, 0, -4.0]}>
          <WindowSash width={bayW * 0.54} height={innerH} isFront={false} />
        </group>
      </group>

      {/* 우측 베이 */}
      <group position={[width / 4 - outerBorder / 4, 0, 0]}>
        <group position={[-bayW * 0.23, 0, -8.5]}>
          <WindowSash width={bayW * 0.54} height={innerH} isFront={true} />
        </group>
        <group position={[bayW * 0.23, 0, -4.0]}>
          <WindowSash width={bayW * 0.54} height={innerH} isFront={false} />
        </group>
      </group>

      {/* 4. 교실 안쪽(실내 측: Z = 0) 창문턱 슬림 마감 (0.8cm 미세 마감) */}
      <RoundedBox args={[width + 2, outerBorder, 0.8]} position={[0, -height / 2 + outerBorder / 2, 0.4]} radius={0.2}>
        <meshStandardMaterial color={casingWood} roughness={0.6} />
      </RoundedBox>
    </group>
  );
}

// 8-1. 🛏️ 이동식 침대 (화이트 튜브 섀시 + 딥블루 매트리스 + 라임그린 헤드보드 + 사이드 안전가드 레일 + 4개 브레이크 캐스터 바퀴)
export function MobileBedProcedural({ width, depth, height = 85 }) {
  const wheelR = 4.0;
  const wheelThick = 2.4;
  const chassisH = 12.0;
  const deckY = 40.0;
  const mattressH = 12.0;
  const railH = 22.0;

  // 4개 바퀴 위치
  const wheelPositions = [
    [-width / 2 + 14, -depth / 2 + 10],
    [-width / 2 + 14, depth / 2 - 10],
    [width / 2 - 14, -depth / 2 + 10],
    [width / 2 - 14, depth / 2 - 10],
  ];

  // 사이드 안전 레일 수직 기둥 X 위치들 (6개)
  const railBarXOffsets = [-0.28, -0.17, -0.06, 0.06, 0.17, 0.28].map(r => r * width);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. 바닥 4개 360도 회전 캐스터 바퀴 & 블루 풋 브레이크 */}
      {wheelPositions.map(([wx, wz], idx) => (
        <group key={idx} position={[wx, 0, wz]}>
          {/* 바퀴 휠 (다크 고무 타이어) */}
          <group position={[0, wheelR, 0]} rotation={[0, 0, Math.PI / 2]}>
            <Cylinder args={[wheelR, wheelR, wheelThick, 16]}>
              <meshStandardMaterial color="#334155" roughness={0.7} />
            </Cylinder>
            {/* 휠 중심 실버 캡 */}
            <Cylinder args={[wheelR * 0.5, wheelR * 0.5, wheelThick + 0.2, 16]}>
              <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
            </Cylinder>
          </group>
          {/* 바퀴 스위블 회전 포크 브라켓 */}
          <RoundedBox args={[3.2, 4.5, 3.2]} position={[0, wheelR + 2.5, 0]} radius={0.4}>
            <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.3} />
          </RoundedBox>
          {/* 블루 잠금 브레이크 페달 */}
          <RoundedBox args={[1.5, 1.2, 3.8]} position={[1.5, wheelR + 1.2, 1.2]} radius={0.3}>
            <meshStandardMaterial color="#0284c7" roughness={0.4} />
          </RoundedBox>
        </group>
      ))}

      {/* 2. 하단 화이트 튜브 섀시 베이스 프레임 */}
      <group position={[0, chassisH, 0]}>
        {/* 가로 롱 빔 2개 */}
        <RoundedBox args={[width - 24, 3.5, 3.5]} position={[0, 0, -depth / 2 + 10]} radius={0.5}>
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.15} />
        </RoundedBox>
        <RoundedBox args={[width - 24, 3.5, 3.5]} position={[0, 0, depth / 2 - 10]} radius={0.5}>
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.15} />
        </RoundedBox>
        {/* 세로 크로스 빔 3개 */}
        <RoundedBox args={[3.5, 3.5, depth - 20]} position={[-width / 2 + 14, 0, 0]} radius={0.5}>
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.15} />
        </RoundedBox>
        <RoundedBox args={[3.5, 3.5, depth - 20]} position={[0, 0, 0]} radius={0.5}>
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.15} />
        </RoundedBox>
        <RoundedBox args={[3.5, 3.5, depth - 20]} position={[width / 2 - 14, 0, 0]} radius={0.5}>
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.15} />
        </RoundedBox>
        {/* 중앙 전동 액추에이터 모터 박스 */}
        <RoundedBox args={[24, 7, 14]} position={[0, 4, 0]} radius={0.8}>
          <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.5} />
        </RoundedBox>
      </group>

      {/* 3. 4개의 수직 서포트 리프트 기둥 (섀시 -> 상부 침대 프레임) */}
      {wheelPositions.map(([wx, wz], idx) => (
        <RoundedBox key={`col-${idx}`} args={[4.2, deckY - chassisH, 4.2]} position={[wx, (deckY + chassisH) / 2, wz]} radius={0.4}>
          <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.15} />
        </RoundedBox>
      ))}

      {/* 4. 상부 매트리스 데크 프레임 */}
      <RoundedBox args={[width - 8, 3.5, depth - 4]} position={[0, deckY, 0]} radius={0.6}>
        <meshStandardMaterial color="#f8fafc" roughness={0.25} metalness={0.15} />
      </RoundedBox>

      {/* 5. 딥 로얄블루 고밀도 방수 레더 매트리스 */}
      <group position={[0, deckY + 1.75 + mattressH / 2, 0]}>
        <RoundedBox args={[width - 16, mattressH, depth - 8]} radius={1.8} smoothness={4}>
          <meshStandardMaterial color="#1e3a8a" roughness={0.3} />
        </RoundedBox>
        {/* 화이트 소프트 헤드 베개 */}
        <RoundedBox args={[32, 4.2, depth - 24]} position={[-width / 2 + 24, mattressH / 2 + 1.8, 0]} radius={1.6}>
          <meshStandardMaterial color="#ffffff" roughness={0.7} />
        </RoundedBox>
      </group>

      {/* 6. 🛋️ 헤드보드 (좌측 X = -width/2 + 2.5: 화이트 몰딩 + 라임그린 포인트 인서트 + 상단 손잡이 홀) */}
      <group position={[-width / 2 + 2.5, 0, 0]}>
        {/* 화이트 메인 패널 */}
        <RoundedBox args={[5.0, 44, depth]} position={[0, 49, 0]} radius={2.5} smoothness={4}>
          <meshStandardMaterial color="#f8fafc" roughness={0.25} />
        </RoundedBox>
        {/* 라임 그린 액센트 컬러 플레이트 */}
        <RoundedBox args={[5.5, 15, depth - 18]} position={[0, 52, 0]} radius={1.2}>
          <meshStandardMaterial color="#84cc16" roughness={0.3} />
        </RoundedBox>
        {/* 상단 듀얼 그립 컷아웃 홀 시각화 */}
        <RoundedBox args={[5.6, 5, 24]} position={[0, 64, -depth / 4]} radius={1.0}>
          <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
        </RoundedBox>
        <RoundedBox args={[5.6, 5, 24]} position={[0, 64, depth / 4]} radius={1.0}>
          <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
        </RoundedBox>
      </group>

      {/* 7. 🛋️ 풋보드 (우측 X = width/2 - 2.5: 화이트 몰딩 + 상단 손잡이 컷아웃) */}
      <group position={[width / 2 - 2.5, 0, 0]}>
        <RoundedBox args={[5.0, 38, depth]} position={[0, 46, 0]} radius={2.5} smoothness={4}>
          <meshStandardMaterial color="#f8fafc" roughness={0.25} />
        </RoundedBox>
        {/* 중앙 라운드 손잡이 슬롯 */}
        <RoundedBox args={[5.6, 5, depth - 24]} position={[0, 58, 0]} radius={1.0}>
          <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
        </RoundedBox>
      </group>

      {/* 8. 🛡️ 사이드 안전 가드 레일 (전면 및 후면 2세트) */}
      {/* A. 전면 안전 가드 레일 (Z = depth/2 - 1.5) */}
      <group position={[0, 0, depth / 2 - 1.5]}>
        {/* 상단 화이트 롱 가드 핸드레일 */}
        <RoundedBox args={[width * 0.68, 3.2, 2.5]} position={[0, deckY + railH, 0]} radius={0.8}>
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.2} />
        </RoundedBox>
        {/* 수직 스테인리스 스틸 기둥들 */}
        {railBarXOffsets.map((rx, idx) => (
          <group key={`front-bar-${idx}`} position={[rx, deckY + railH / 2, 0]}>
            <Cylinder args={[0.7, 0.7, railH - 2, 12]}>
              <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.2} />
            </Cylinder>
          </group>
        ))}
        {/* 좌/우 레일 락킹 힌지 브라켓 */}
        <RoundedBox args={[4.5, 6.0, 3.5]} position={[-width * 0.34 + 2, deckY + 4, 0]} radius={0.5}>
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[4.5, 6.0, 3.5]} position={[width * 0.34 - 2, deckY + 4, 0]} radius={0.5}>
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
        </RoundedBox>
      </group>

      {/* B. 후면 안전 가드 레일 (Z = -depth/2 + 1.5) */}
      <group position={[0, 0, -depth / 2 + 1.5]}>
        <RoundedBox args={[width * 0.68, 3.2, 2.5]} position={[0, deckY + railH, 0]} radius={0.8}>
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.2} />
        </RoundedBox>
        {railBarXOffsets.map((rx, idx) => (
          <group key={`back-bar-${idx}`} position={[rx, deckY + railH / 2, 0]}>
            <Cylinder args={[0.7, 0.7, railH - 2, 12]}>
              <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.2} />
            </Cylinder>
          </group>
        ))}
        <RoundedBox args={[4.5, 6.0, 3.5]} position={[-width * 0.34 + 2, deckY + 4, 0]} radius={0.5}>
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
        </RoundedBox>
        <RoundedBox args={[4.5, 6.0, 3.5]} position={[width * 0.34 - 2, deckY + 4, 0]} radius={0.5}>
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
        </RoundedBox>
      </group>

      {/* 9. 📱 유선 전동 리모컨 유닛 (사이드 레일에 걸려있는 핸드셋) */}
      <group position={[width * 0.14, deckY + railH - 1, depth / 2 + 1.2]}>
        <RoundedBox args={[4.5, 9.0, 1.8]} position={[0, -3.5, 0]} radius={0.5}>
          <meshStandardMaterial color="#e0f2fe" roughness={0.3} />
        </RoundedBox>
        {/* 리모컨 조작 버튼 2개 (상/하) */}
        <RoundedBox args={[2.8, 2.0, 0.4]} position={[0, -2.2, 1.0]} radius={0.2}>
          <meshStandardMaterial color="#0284c7" />
        </RoundedBox>
        <RoundedBox args={[2.8, 2.0, 0.4]} position={[0, -5.0, 1.0]} radius={0.2}>
          <meshStandardMaterial color="#0284c7" />
        </RoundedBox>
      </group>
    </group>
  );
}

// 9. 타입에 따라 최신 아키텍처 3D 모델 매핑
export default function getFurnitureComponent(type) {
  if (type === '학생 책상') return DeskProcedural;
  if (type === '교사 책상') return TeacherDeskProcedural;
  if (type === '학생 의자') return ChairProcedural;
  if (type === '전자칠판(벽부착형)' || type === '전자칠판' || type === '스마트 전자칠판') return ElectronicBoardProcedural;
  if (type === '교구장(1단, 긴 문)' || type === '개인 사물함(1단, 긴 문)' || type === '개인 사물함' || type === '사물함') return CabinetSingleTallDoorProcedural;
  if (type === '교구장(3단, 문 있음)') return CabinetClosed3TierProcedural;
  if (type === '교구장(4단, 문 있음)') return CabinetClosed4TierProcedural;
  if (type === '교구장(3단, 문 없음)') return CabinetOpen3TierProcedural;
  if (type === '교구장(4단, 문 없음)') return CabinetOpen4TierProcedural;
  if (type === '신발장(2단)') return ShoeRack2TierProcedural;
  if (type === '신발장(3단)') return ShoeRack3TierProcedural;
  if (type === '옷장') return WardrobeProcedural;
  if (type === '이동식 칠판') return BoardProcedural;
  if (type === '이동식 침대' || type === '침대' || type === '환자용 침대') return MobileBedProcedural;
  if (type === '출입문') return DoorProcedural;
  if (type === '창문') return WindowProcedural;
  
  // 구버전 및 서브스트링 호환 매핑
  if (type === '교구장(문 있음)') return CabinetClosed3TierProcedural;
  if (type === '교구장(문 없음)') return CabinetOpen3TierProcedural;
  if (type === '신발장') return ShoeRack2TierProcedural;
  if (type.includes('전자칠판')) return ElectronicBoardProcedural;
  if (type.includes('침대')) return MobileBedProcedural;
  if (type.includes('책상')) return DeskProcedural;
  if (type.includes('의자')) return ChairProcedural;
  if (type.includes('1단') || type.includes('사물함')) return CabinetSingleTallDoorProcedural;
  if (type.includes('교구장') && type.includes('4단')) return CabinetOpen4TierProcedural;
  if (type.includes('교구장')) return CabinetOpen3TierProcedural;
  if (type.includes('신발장') && type.includes('3단')) return ShoeRack3TierProcedural;
  if (type.includes('신발장')) return ShoeRack2TierProcedural;
  return DeskProcedural;
}
