import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Group, Line, Arc, Circle } from 'react-konva';
import { ZoomIn, ZoomOut, Home } from 'lucide-react';
import { hasOverlapWithOthers, resolveOverlapPosition } from '../utils/collisionUtils';

const WALL_THICKNESS = 20;

function Item2D({ shapeProps, isSelected, onSelect, onChange, classroomSize, allItems = [] }) {
  const shapeRef = useRef();
  const [isColliding, setIsColliding] = useState(false);
  const { width: w, height: h, type } = shapeProps;

  // 2D 도면 그래픽 렌더링 함수
  const renderItemGraphic = () => {
    switch (type) {
      case '학생 책상':
        return (
          <Group>
            {/* 좌우 T자형 화이트 베이스 바 & 차콜 발굽 캡 */}
            <Rect x={-w / 2 + 3} y={-h / 2 + 2} width={4} height={h - 4} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={0.5} cornerRadius={1} />
            <Rect x={-w / 2 + 2.5} y={-h / 2 + 2} width={5} height={4} fill="#334155" cornerRadius={1} />
            <Rect x={-w / 2 + 2.5} y={h / 2 - 6} width={5} height={4} fill="#334155" cornerRadius={1} />

            <Rect x={w / 2 - 7} y={-h / 2 + 2} width={4} height={h - 4} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={0.5} cornerRadius={1} />
            <Rect x={w / 2 - 7.5} y={-h / 2 + 2} width={5} height={4} fill="#334155" cornerRadius={1} />
            <Rect x={w / 2 - 7.5} y={h / 2 - 6} width={5} height={4} fill="#334155" cornerRadius={1} />

            {/* 책상 상판 (클린 화이트 상판 + 다크 슬레이트 엣지 몰딩) */}
            <Rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              fill={isSelected ? "#e0f2fe" : "#ffffff"}
              stroke={isSelected ? "#0284c7" : "#334155"}
              strokeWidth={isSelected ? 2 : 1.5}
              cornerRadius={3}
              shadowColor="rgba(0,0,0,0.12)"
              shadowBlur={4}
              shadowOffsetY={2}
            />
            {/* 서랍/책받침 전면 트레이 라인 */}
            <Line
              points={[-w / 2 + 8, h / 2 - 5, w / 2 - 8, h / 2 - 5]}
              stroke="#64748b"
              strokeWidth={1.5}
              lineCap="round"
            />
            {/* 상단 펜/연필 홈 */}
            <Line
              points={[-w / 2 + 12, -h / 2 + 5, w / 2 - 12, -h / 2 + 5]}
              stroke="#94a3b8"
              strokeWidth={1.2}
              dash={[4, 2]}
            />
          </Group>
        );

      case '학생 의자':
        return (
          <Group>
            {/* 좌우 T자형 화이트 베이스 바 & 차콜 발굽 캡 */}
            <Rect x={-w / 2 + 3} y={-h / 2 + 2} width={3.5} height={h - 4} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={0.5} cornerRadius={1} />
            <Rect x={-w / 2 + 2.5} y={-h / 2 + 2} width={4.5} height={3.5} fill="#334155" cornerRadius={1} />
            <Rect x={-w / 2 + 2.5} y={h / 2 - 5.5} width={4.5} height={3.5} fill="#334155" cornerRadius={1} />

            <Rect x={w / 2 - 6.5} y={-h / 2 + 2} width={3.5} height={h - 4} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={0.5} cornerRadius={1} />
            <Rect x={w / 2 - 7} y={-h / 2 + 2} width={4.5} height={3.5} fill="#334155" cornerRadius={1} />
            <Rect x={w / 2 - 7} y={h / 2 - 5.5} width={4.5} height={3.5} fill="#334155" cornerRadius={1} />

            {/* 의자 좌판 (화이트 외곽 프레임) */}
            <Rect
              x={-w / 2 + 2}
              y={-h / 2 + 4}
              width={w - 4}
              height={h - 6}
              fill={isSelected ? "#e0f2fe" : "#ffffff"}
              stroke={isSelected ? "#0284c7" : "#3b82f6"}
              strokeWidth={1.5}
              cornerRadius={4}
              shadowColor="rgba(0,0,0,0.1)"
              shadowBlur={3}
            />
            {/* 좌판 중앙 소프트 스카이블루 패널 (텍스트 가독성 100% 확보) */}
            <Rect
              x={-w / 2 + 5}
              y={-h / 2 + 7}
              width={w - 10}
              height={h - 11}
              fill="#dbeafe"
              stroke="#93c5fd"
              strokeWidth={0.8}
              cornerRadius={2}
            />
            {/* 4개의 실버 결속 볼트 캡 */}
            <Circle x={-w / 2 + 7} y={-h / 2 + 9} radius={1.2} fill="#94a3b8" />
            <Circle x={w / 2 - 7} y={-h / 2 + 9} radius={1.2} fill="#94a3b8" />
            <Circle x={-w / 2 + 7} y={h / 2 - 7} radius={1.2} fill="#94a3b8" />
            <Circle x={w / 2 - 7} y={h / 2 - 7} radius={1.2} fill="#94a3b8" />

            {/* 등받이 상단 윤곽선 (화이트-로얄블루 2톤) */}
            <Rect
              x={-w / 2 + 5}
              y={-h / 2 + 2}
              width={w - 10}
              height={5.5}
              fill="#ffffff"
              stroke="#2563eb"
              strokeWidth={1}
              cornerRadius={2}
            />
            <Rect
              x={-w / 2 + 7}
              y={-h / 2 + 3}
              width={w - 14}
              height={3.5}
              fill="#3b82f6"
              cornerRadius={1}
            />
          </Group>
        );

      case '교사 책상':
        return (
          <Group>
            {/* 대형 원목 상판 */}
            <Rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              fill={isSelected ? "#e0f2fe" : "#fed7aa"}
              stroke={isSelected ? "#0284c7" : "#c2410c"}
              strokeWidth={1.5}
              cornerRadius={4}
              shadowColor="rgba(0,0,0,0.15)"
              shadowBlur={5}
              shadowOffsetY={3}
            />
            {/* 우측 3단 서랍장 박스 */}
            <Rect
              x={w / 2 - w * 0.35}
              y={-h / 2 + 3}
              width={w * 0.35 - 3}
              height={h - 6}
              fill="#ffedd5"
              stroke="#c2410c"
              strokeWidth={1}
            />
            <Line
              points={[w / 2 - w * 0.35 + 4, 0, w / 2 - 7, 0]}
              stroke="#9a3412"
              strokeWidth={2}
            />
            {/* 전선 정리홀 (Cable Grommet) */}
            <Circle x={-w / 2 + 15} y={-h / 2 + 12} radius={3.5} fill="#7c2d12" />
          </Group>
        );

      case '교구장(1단, 긴 문)':
      case '개인 사물함(1단, 긴 문)':
      case '사물함':
        return (
          <Group>
            <Rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              fill="#ffffff"
              stroke="#ca8a04"
              strokeWidth={1.5}
              cornerRadius={2}
              shadowColor="rgba(0,0,0,0.1)"
              shadowBlur={3}
            />
            {/* 세로 도어 분할선 */}
            <Line points={[0, -h / 2, 0, h / 2]} stroke="#ca8a04" strokeWidth={1.2} />
            {/* 1열: 자작나무 / 2열: 연두색 도어 상단 이름표 & 매립형 손잡이 */}
            {/* 1열 (좌측) */}
            <Group>
              <Rect x={-w / 2 + 2} y={-h / 2 + 2} width={w / 2 - 3} height={h - 4} fill="#fef9c3" stroke="#eab308" strokeWidth={0.5} cornerRadius={1} />
              <Rect x={-w * 0.35} y={-h / 2 + 4} width={w * 0.22} height={4} fill="#38bdf8" cornerRadius={0.8} />
              <Rect x={-w * 0.44} y={-3} width={3.5} height={6} fill="#ffffff" stroke="#94a3b8" strokeWidth={0.6} cornerRadius={0.6} />
            </Group>
            {/* 2열 (우측 - 연두색 도어) */}
            <Group>
              <Rect x={1} y={-h / 2 + 2} width={w / 2 - 3} height={h - 4} fill="#ecfccb" stroke="#84cc16" strokeWidth={0.5} cornerRadius={1} />
              <Rect x={w * 0.13} y={-h / 2 + 4} width={w * 0.22} height={4} fill="#ffffff" stroke="#65a30d" strokeWidth={0.5} cornerRadius={0.8} />
              <Rect x={w * 0.06} y={-3} width={3.5} height={6} fill="#ffffff" stroke="#65a30d" strokeWidth={0.6} cornerRadius={0.6} />
            </Group>
            <Text x={-w / 2 + 3} y={h / 2 - 10} text="1단 긴문" fontSize={6.5} fill="#4d7c0f" fontStyle="bold" />
          </Group>
        );

      case '교구장(3단, 문 있음)':
      case '교구장(문 있음)':
        return (
          <Group>
            <Rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              fill="#e0f2fe"
              stroke="#0284c7"
              strokeWidth={1.5}
              cornerRadius={2}
              shadowColor="rgba(0,0,0,0.1)"
              shadowBlur={3}
            />
            {/* 문짝 중앙 분할선 */}
            <Line points={[0, -h / 2, 0, h / 2]} stroke="#0284c7" strokeWidth={1.5} />
            {/* 손잡이 2개 */}
            <Rect x={-4} y={-3} width={2} height={6} fill="#1e293b" rx={0.5} />
            <Rect x={2} y={-3} width={2} height={6} fill="#1e293b" rx={0.5} />
            <Text x={-w / 2 + 3} y={-h / 2 + 2} text="3단 도어" fontSize={7} fill="#0369a1" fontStyle="bold" />
          </Group>
        );

      case '교구장(4단, 문 있음)':
        return (
          <Group>
            <Rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              fill="#dbeafe"
              stroke="#1d4ed8"
              strokeWidth={1.5}
              cornerRadius={2}
              shadowColor="rgba(0,0,0,0.1)"
              shadowBlur={3}
            />
            {/* 문짝 중앙 분할선 */}
            <Line points={[0, -h / 2, 0, h / 2]} stroke="#1d4ed8" strokeWidth={1.5} />
            {/* 손잡이 2개 */}
            <Rect x={-4} y={-4} width={2} height={8} fill="#1e293b" rx={0.5} />
            <Rect x={2} y={-4} width={2} height={8} fill="#1e293b" rx={0.5} />
            <Text x={-w / 2 + 3} y={-h / 2 + 2} text="4단 도어" fontSize={7} fill="#1d4ed8" fontStyle="bold" />
          </Group>
        );

      case '교구장(3단, 문 없음)':
      case '교구장(문 없음)':
        return (
          <Group>
            <Rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              fill="#fef08a"
              stroke="#eab308"
              strokeWidth={1.5}
              cornerRadius={2}
              shadowColor="rgba(0,0,0,0.1)"
              shadowBlur={3}
            />
            {/* 3단 오픈 선반 분할선 */}
            <Line points={[-w / 6, -h / 2 + 2, -w / 6, h / 2 - 2]} stroke="#ca8a04" strokeWidth={1} dash={[2, 2]} />
            <Line points={[w / 6, -h / 2 + 2, w / 6, h / 2 - 2]} stroke="#ca8a04" strokeWidth={1} dash={[2, 2]} />
            {/* 파스텔 옐로우 선반 디테일 */}
            <Rect x={-w / 2 + 4} y={-h / 2 + 3} width={6} height={h - 6} fill="#fde047" stroke="#ca8a04" strokeWidth={0.5} />
            <Rect x={-w / 2 + 12} y={-h / 2 + 3} width={5} height={h - 6} fill="#f472b6" />
            <Rect x={w / 2 - 14} y={-h / 2 + 3} width={8} height={h - 6} fill="#86efac" />
            <Text x={-w / 2 + 3} y={-h / 2 + 2} text="3단 오픈" fontSize={7} fill="#854d0e" fontStyle="bold" />
          </Group>
        );

      case '교구장(4단, 문 없음)':
        return (
          <Group>
            <Rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              fill="#ffffff"
              stroke="#94a3b8"
              strokeWidth={1.5}
              cornerRadius={2}
              shadowColor="rgba(0,0,0,0.1)"
              shadowBlur={3}
            />
            {/* 4단 알록달록 선반 엣지 (노랑, 연두, 분홍, 민트) */}
            <Rect x={-w / 2 + 3} y={-h / 2 + 3} width={w * 0.22} height={h - 6} fill="#fde047" cornerRadius={1} />
            <Rect x={-w / 2 + 3 + w * 0.23} y={-h / 2 + 3} width={w * 0.22} height={h - 6} fill="#86efac" cornerRadius={1} />
            <Rect x={-w / 2 + 3 + w * 0.46} y={-h / 2 + 3} width={w * 0.22} height={h - 6} fill="#f472b6" cornerRadius={1} />
            <Rect x={-w / 2 + 3 + w * 0.69} y={-h / 2 + 3} width={w * 0.22} height={h - 6} fill="#67e8f9" cornerRadius={1} />
            <Text x={-w / 2 + 3} y={-h / 2 + 2} text="4단 오픈" fontSize={7} fill="#1e293b" fontStyle="bold" />
          </Group>
        );

      case '신발장(2단)':
      case '신발장':
        return (
          <Group>
            <Rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              fill="#ffffff"
              stroke="#1e293b"
              strokeWidth={1.5}
              cornerRadius={2}
            />
            {/* 세로 도어 분할선 */}
            <Line points={[0, -h / 2, 0, h / 2]} stroke="#cbd5e1" strokeWidth={1} />
            {/* 2열 도어 투명 관찰창 & 손잡이 */}
            {[-w / 4, w / 4].map((xPos, idx) => (
              <Group key={idx}>
                <Rect x={xPos - 5} y={-4} width={10} height={8} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={0.8} cornerRadius={1} />
                <Circle x={xPos - 8} y={0} radius={1.2} fill="#1e293b" />
              </Group>
            ))}
            <Text x={-w / 2 + 3} y={-h / 2 + 2} text="2단 락커 신발장" fontSize={6.5} fill="#0284c7" fontStyle="bold" />
          </Group>
        );

      case '신발장(3단)':
        return (
          <Group>
            <Rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              fill="#ffffff"
              stroke="#1e293b"
              strokeWidth={1.5}
              cornerRadius={2}
            />
            {/* 세로 도어 분할선 */}
            <Line points={[0, -h / 2, 0, h / 2]} stroke="#cbd5e1" strokeWidth={1} />
            {/* 2열 도어 투명 관찰창 & 손잡이 */}
            {[-w / 4, w / 4].map((xPos, idx) => (
              <Group key={idx}>
                <Rect x={xPos - 5} y={-4} width={10} height={8} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={0.8} cornerRadius={1} />
                <Circle x={xPos - 8} y={0} radius={1.2} fill="#1e293b" />
              </Group>
            ))}
            <Text x={-w / 2 + 3} y={-h / 2 + 2} text="3단 락커 신발장" fontSize={6.5} fill="#0f766e" fontStyle="bold" />
          </Group>
        );

      case '옷장':
        return (
          <Group>
            <Rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              fill="#f8fafc"
              stroke="#1e293b"
              strokeWidth={1.5}
              cornerRadius={2}
              shadowColor="rgba(0,0,0,0.1)"
              shadowBlur={4}
            />
            {/* 문 분할선 & 옷걸이 봉 */}
            <Line points={[0, -h / 2, 0, h / 2]} stroke="#64748b" strokeWidth={1.5} />
            <Line points={[-w / 2 + 4, 0, w / 2 - 4, 0]} stroke="#94a3b8" strokeWidth={1} dash={[3, 3]} />
            {/* 손잡이 2개 */}
            <Rect x={-4} y={-4} width={2} height={8} fill="#1e293b" />
            <Rect x={2} y={-4} width={2} height={8} fill="#1e293b" />
          </Group>
        );

      case '전자칠판(벽부착형)':
      case '전자칠판': {
        const hasWings = w > 220;
        const centerScreenW = hasWings ? Math.min(Math.max(180, w * 0.54), w - 80) : w - 4;
        const sideWingW = hasWings ? (w - centerScreenW) / 2 : 0;
        return (
          <Group>
            {/* 1. 전체 실버 알루미늄 벽체 하우징 */}
            <Rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              fill="#cbd5e1"
              stroke="#64748b"
              strokeWidth={1.5}
              cornerRadius={2}
              shadowColor="rgba(0,0,0,0.15)"
              shadowBlur={4}
            />
            {/* 2. 가로 크기가 클 때만 표시되는 좌측 보조 화이트보드 날개 */}
            {hasWings && (
              <Group>
                <Rect
                  x={-w / 2 + 2}
                  y={-h / 2 + 2}
                  width={sideWingW - 3}
                  height={h - 4}
                  fill="#ffffff"
                  stroke="#94a3b8"
                  strokeWidth={0.8}
                  cornerRadius={1}
                />
                {/* 좌측 알림판 자석들 */}
                <Circle x={-w / 2 + sideWingW * 0.3} y={0} radius={2} fill="#facc15" />
                <Circle x={-w / 2 + sideWingW * 0.7} y={0} radius={2.5} fill="#38bdf8" />
              </Group>
            )}

            {/* 3. 중앙 대형 스마트 터치 전자칠판 화면 (꺼진 블랙 글래스) */}
            <Rect
              x={-centerScreenW / 2}
              y={-h / 2 + 1}
              width={centerScreenW}
              height={h - 2}
              fill="#0f172a"
              stroke="#334155"
              strokeWidth={1.2}
              cornerRadius={1}
            />
            <Rect
              x={-centerScreenW / 2 + 3}
              y={-h / 2 + 3}
              width={centerScreenW - 6}
              height={h - 6}
              fill="#1e293b"
              cornerRadius={1}
            />
            {/* 하단 스마트 전자펜 트레이 */}
            <Rect
              x={-centerScreenW * 0.3}
              y={h / 2 - 2}
              width={centerScreenW * 0.6}
              height={3}
              fill="#e2e8f0"
              stroke="#64748b"
              strokeWidth={0.5}
            />

            {/* 4. 가로 크기가 클 때만 표시되는 우측 보조 화이트보드 날개 (시간표) */}
            {hasWings && (
              <Group>
                <Rect
                  x={centerScreenW / 2 + 1}
                  y={-h / 2 + 2}
                  width={sideWingW - 3}
                  height={h - 4}
                  fill="#ffffff"
                  stroke="#94a3b8"
                  strokeWidth={0.8}
                  cornerRadius={1}
                />
                {/* 우측 시간표 컬러 바 */}
                <Rect x={centerScreenW / 2 + 3} y={-3} width={sideWingW * 0.7} height={2} fill="#ef4444" />
                <Rect x={centerScreenW / 2 + 3} y={1} width={sideWingW * 0.7} height={2} fill="#3b82f6" />
              </Group>
            )}

            <Text x={-centerScreenW / 2 + 5} y={-h / 2 + 4} text="스마트 전자칠판" fontSize={7} fill="#ffffff" fontStyle="bold" />
          </Group>
        );
      }

      case '이동식 칠판':
        return (
          <Group>
            {/* 녹색 칠판 판면 */}
            <Rect
              x={-w / 2}
              y={-h / 4}
              width={w}
              height={h / 2}
              fill="#0f766e"
              stroke="#134e4a"
              strokeWidth={1.5}
              cornerRadius={2}
              shadowColor="rgba(0,0,0,0.15)"
              shadowBlur={3}
            />
            {/* 분필 받침대 */}
            <Rect x={-w / 2 + 4} y={h / 4 - 2} width={w - 8} height={3} fill="#cbd5e1" stroke="#94a3b8" strokeWidth={0.5} />
            {/* 좌우 이동식 스탠드 바퀴 다리 */}
            <Line points={[-w / 2 + 4, -h / 2, -w / 2 + 4, h / 2]} stroke="#334155" strokeWidth={2.5} />
            <Line points={[w / 2 - 4, -h / 2, w / 2 - 4, h / 2]} stroke="#334155" strokeWidth={2.5} />
            <Circle x={-w / 2 + 4} y={-h / 2} radius={2.5} fill="#0f172a" />
            <Circle x={-w / 2 + 4} y={h / 2} radius={2.5} fill="#0f172a" />
            <Circle x={w / 2 - 4} y={-h / 2} radius={2.5} fill="#0f172a" />
            <Circle x={w / 2 - 4} y={h / 2} radius={2.5} fill="#0f172a" />
          </Group>
        );

      case '이동식 침대':
        return (
          <Group>
            {/* 외곽 화이트 베이스 프레임 */}
            <Rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              fill={isSelected ? "#e0f2fe" : "#f8fafc"}
              stroke={isSelected ? "#0284c7" : "#64748b"}
              strokeWidth={isSelected ? 2 : 1.5}
              cornerRadius={4}
              shadowColor="rgba(0,0,0,0.08)"
              shadowBlur={3}
            />
            {/* 딥 로얄블루 매트리스 */}
            <Rect
              x={-w / 2 + 6}
              y={-h / 2 + 4}
              width={w - 12}
              height={h - 8}
              fill="#1d4ed8"
              stroke="#1e40af"
              strokeWidth={1}
              cornerRadius={3}
            />
            {/* 화이트 소프트 헤드 베개 */}
            <Rect
              x={-w / 2 + 10}
              y={-h / 2 + 8}
              width={Math.min(35, w * 0.2)}
              height={h - 16}
              fill="#ffffff"
              stroke="#cbd5e1"
              strokeWidth={1}
              cornerRadius={3}
            />
            {/* 헤드보드 (좌측 라임그린 포인트) */}
            <Rect
              x={-w / 2}
              y={-h / 2}
              width={6}
              height={h}
              fill="#84cc16"
              stroke="#65a30d"
              strokeWidth={1}
              cornerRadius={[4, 0, 0, 4]}
            />
            {/* 풋보드 (우측 화이트 패널) */}
            <Rect
              x={w / 2 - 6}
              y={-h / 2}
              width={6}
              height={h}
              fill="#e2e8f0"
              stroke="#94a3b8"
              strokeWidth={1}
              cornerRadius={[0, 4, 4, 0]}
            />
            {/* 상/하 사이드 안전 가드 레일 */}
            <Line points={[-w / 2 + 35, -h / 2 + 2, w / 2 - 20, -h / 2 + 2]} stroke="#cbd5e1" strokeWidth={2.5} lineCap="round" />
            <Line points={[-w / 2 + 35, h / 2 - 2, w / 2 - 20, h / 2 - 2]} stroke="#cbd5e1" strokeWidth={2.5} lineCap="round" />
            {/* 4개의 360도 캐스터 바퀴 표시 */}
            <Circle x={-w / 2 + 8} y={-h / 2 + 2} radius={2.5} fill="#0284c7" />
            <Circle x={-w / 2 + 8} y={h / 2 - 2} radius={2.5} fill="#0284c7" />
            <Circle x={w / 2 - 8} y={-h / 2 + 2} radius={2.5} fill="#0284c7" />
            <Circle x={w / 2 - 8} y={h / 2 - 2} radius={2.5} fill="#0284c7" />
          </Group>
        );

      case '창문':
        return (
          <Group>
            {/* 창문 2D 도면 기호 (외곽 원목 프레임 + 2줄 유리선) */}
            <Rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              fill="#fef3c7"
              stroke="#d97706"
              strokeWidth={1.5}
            />
            {/* 2중 슬라이딩 유리선 */}
            <Line points={[-w / 2 + 2, -2, w / 2 - 2, -2]} stroke="#0284c7" strokeWidth={1.5} />
            <Line points={[-w / 2 + 2, 2, w / 2 - 2, 2]} stroke="#0284c7" strokeWidth={1.5} />
          </Group>
        );

      case '출입문':
        return (
          <Group>
            {/* 1. 벽체 개구부 */}
            <Rect
              x={-w / 2}
              y={-h / 2}
              width={w}
              height={h}
              fill="#ffffff"
              stroke="#94a3b8"
              strokeWidth={1}
            />
            {/* 문틀 좌/우 마감 기둥 */}
            <Rect x={-w / 2 - 2} y={-h / 2} width={4} height={h} fill="#1e293b" />
            <Rect x={w / 2 - 2} y={-h / 2} width={4} height={h} fill="#1e293b" />
            {/* 2. 문 열림 궤적 호 (Swing Arc) */}
            <Arc
              x={-w / 2}
              y={-h / 2}
              innerRadius={0}
              outerRadius={w}
              angle={90}
              rotation={-90}
              stroke="#0284c7"
              strokeWidth={1.5}
              dash={[4, 3]}
              fill="rgba(2, 132, 199, 0.08)"
            />
            {/* 3. 90도 열린 문짝 선 (Door Leaf) */}
            <Line
              points={[-w / 2, -h / 2, -w / 2, -h / 2 - w]}
              stroke="#0284c7"
              strokeWidth={3}
              lineCap="round"
            />
          </Group>
        );

      default:
        return (
          <Rect
            x={-w / 2}
            y={-h / 2}
            width={w}
            height={h}
            fill={isSelected ? "#e0f2fe" : "#f8fafc"}
            stroke={isSelected ? "#0284c7" : "#cbd5e1"}
            strokeWidth={isSelected ? 2 : 1}
            shadowColor="rgba(0,0,0,0.1)"
            shadowBlur={4}
            shadowOffsetY={2}
          />
        );
    }
  };

  return (
    <Group
      x={shapeProps.x}
      y={shapeProps.y}
      rotation={shapeProps.rotation ? (shapeProps.rotation * 180) / Math.PI : 0}
      onClick={onSelect}
      onTap={onSelect}
      ref={shapeRef}
      draggable
      onDragMove={(e) => {
        const curX = e.target.x();
        const curY = e.target.y();

        // 🚨 실시간 다른 비품과의 겹침/충돌 검사
        const candidate = {
          ...shapeProps,
          x: curX,
          y: curY,
          rotation: shapeProps.rotation || 0,
        };
        const colliding = hasOverlapWithOthers(candidate, allItems, 0);
        setIsColliding(colliding);

        // 🚪 창문, 출입문, 전자칠판 드래그 중 벽 근처 접근 시 실시간 회전각 프리뷰
        if ((type === '출입문' || type === '창문' || type?.includes('전자칠판')) && classroomSize) {
          const W = classroomSize.width;
          const H = classroomSize.height;
          const snapDist = 120;

          const dNorth = Math.abs(curY - 0);
          const dSouth = Math.abs(curY - H);
          const dWest = Math.abs(curX - 0);
          const dEast = Math.abs(curX - W);

          const minD = Math.min(dNorth, dSouth, dWest, dEast);
          if (minD <= snapDist) {
            if (minD === dNorth) {
              e.target.rotation(0);
            } else if (minD === dSouth) {
              e.target.rotation(180);
            } else if (minD === dWest) {
              e.target.rotation(90);
            } else if (minD === dEast) {
              e.target.rotation(-90);
            }
          }
        }
      }}
      onDragEnd={(e) => {
        setIsColliding(false);
        let newX = e.target.x();
        let newY = e.target.y();
        let newRot = shapeProps.rotation || 0;

        // 🚪 창문, 출입문, 전자칠판의 벽면 지능형 자동 스냅 (검정색 벽 영역에 놓으면 벽체에 완벽 흡착 및 방향 자동 정렬)
        if ((type === '출입문' || type === '창문' || type?.includes('전자칠판')) && classroomSize) {
          const snapDist = 120;
          const W = classroomSize.width;
          const H = classroomSize.height;

          const dNorth = Math.abs(newY - 0);
          const dSouth = Math.abs(newY - H);
          const dWest = Math.abs(newX - 0);
          const dEast = Math.abs(newX - W);

          const minD = Math.min(dNorth, dSouth, dWest, dEast);
          if (minD <= snapDist) {
            if (minD === dNorth) {
              newY = 0;
              newRot = 0; // 북쪽 벽 (교실 안쪽을 향함)
              newX = Math.max(w / 2, Math.min(W - w / 2, newX));
            } else if (minD === dSouth) {
              newY = H;
              newRot = Math.PI; // 남쪽 벽 (교실 안쪽을 향함)
              newX = Math.max(w / 2, Math.min(W - w / 2, newX));
            } else if (minD === dWest) {
              newX = 0;
              newRot = Math.PI / 2; // 서쪽 벽 (교실 안쪽을 향함)
              newY = Math.max(w / 2, Math.min(H - w / 2, newY));
            } else if (minD === dEast) {
              newX = W;
              newRot = -Math.PI / 2; // 동쪽 벽 (교실 안쪽을 향함)
              newY = Math.max(w / 2, Math.min(H - w / 2, newY));
            }
          }
        }

        // 🛡️ [핵심] 비품 간 겹침 방지: 충돌 발생 시 최근접 비충돌 유효 위치로 자동 스냅
        const candidate = {
          ...shapeProps,
          x: newX,
          y: newY,
          rotation: newRot,
        };
        const safePos = resolveOverlapPosition(candidate, allItems, classroomSize, 0);
        newX = safePos.x;
        newY = safePos.y;

        // ⚡ Konva 노드 자체의 위치와 회전을 즉시 스냅 위치로 강제 동기화 (화면 렌더링 즉시 반영)
        e.target.x(newX);
        e.target.y(newY);
        e.target.rotation((newRot * 180) / Math.PI);

        onChange({
          ...shapeProps,
          x: newX,
          y: newY,
          rotation: newRot,
        });
      }}
    >
      {/* 가구 2D 도면 그래픽 */}
      {renderItemGraphic()}

      {/* 가구 명칭 텍스트 레이블 (고대비 가독성 보장) */}
      <Text
        text={type}
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        align="center"
        verticalAlign="middle"
        fontSize={11}
        fontStyle="bold"
        fill={
          type === '이동식 칠판' || type?.includes('전자칠판') || type === '이동식 침대'
            ? '#ffffff'
            : type === '학생 의자'
            ? '#1e3a8a'
            : '#0f172a'
        }
        shadowColor={
          type === '이동식 침대' || type === '이동식 칠판' || type?.includes('전자칠판')
            ? 'rgba(0, 0, 0, 0.85)'
            : 'rgba(255, 255, 255, 0.8)'
        }
        shadowBlur={
          type === '이동식 침대' || type === '이동식 칠판' || type?.includes('전자칠판')
            ? 4
            : 0
        }
        shadowOffsetY={1}
        padding={2}
      />

      {/* 🚨 충돌(겹침) 시 실시간 붉은색 경고 하이라이트 및 뱃지 */}
      {isColliding && (
        <Group>
          <Rect
            x={-w / 2 - 6}
            y={-h / 2 - 6}
            width={w + 12}
            height={h + 12}
            fill="rgba(239, 68, 68, 0.25)"
            stroke="#ef4444"
            strokeWidth={2.5}
            cornerRadius={4}
            dash={[5, 3]}
          />
          <Rect
            x={-35}
            y={-h / 2 - 20}
            width={70}
            height={16}
            fill="#ef4444"
            cornerRadius={8}
            shadowColor="rgba(239, 68, 68, 0.4)"
            shadowBlur={4}
          />
          <Text
            text="🚨 겹침 방지"
            x={-35}
            y={-h / 2 - 18}
            width={70}
            align="center"
            fontSize={9}
            fontStyle="bold"
            fill="#ffffff"
          />
        </Group>
      )}

      {/* 선택 표시 테두리 (비충돌 시) */}
      {isSelected && !isColliding && (
        <Rect
          x={-w / 2 - 4}
          y={-h / 2 - 4}
          width={w + 8}
          height={h + 8}
          stroke="#0284c7"
          strokeWidth={1.8}
          dash={[4, 4]}
        />
      )}
    </Group>
  );
}

// 📐 건축 도면 표준 가로 치수선
function DimensionLineHorizontal({ startX, endX, y = 0, text, offset = 40 }) {
  const lineY = y - offset;
  return (
    <Group>
      {/* 주 치수선 (Horizontal Main Line) */}
      <Line points={[startX, lineY, endX, lineY]} stroke="#475569" strokeWidth={1.2} />
      {/* 좌/우 인출선 (Extension Lines) */}
      <Line points={[startX, y, startX, lineY - 6]} stroke="#94a3b8" strokeWidth={1} />
      <Line points={[endX, y, endX, lineY - 6]} stroke="#94a3b8" strokeWidth={1} />
      {/* 45도 건축 눈금 틱 (Architectural 45° Slashes) */}
      <Line points={[startX - 4, lineY + 4, startX + 4, lineY - 4]} stroke="#0f172a" strokeWidth={1.8} />
      <Line points={[endX - 4, lineY + 4, endX + 4, lineY - 4]} stroke="#0f172a" strokeWidth={1.8} />
      {/* 치수 텍스트 */}
      <Text
        x={(startX + endX) / 2 - 40}
        y={lineY - 18}
        width={80}
        align="center"
        text={text}
        fill="#1e293b"
        fontSize={12}
        fontStyle="bold"
      />
    </Group>
  );
}

// 📐 건축 도면 표준 세로 치수선
function DimensionLineVertical({ startY, endY, x = 0, text, offset = 40 }) {
  const lineX = x - offset;
  return (
    <Group>
      {/* 주 치수선 (Vertical Main Line) */}
      <Line points={[lineX, startY, lineX, endY]} stroke="#475569" strokeWidth={1.2} />
      {/* 상/하 인출선 (Extension Lines) */}
      <Line points={[x, startY, lineX - 6, startY]} stroke="#94a3b8" strokeWidth={1} />
      <Line points={[x, endY, lineX - 6, endY]} stroke="#94a3b8" strokeWidth={1} />
      {/* 45도 건축 눈금 틱 (Architectural 45° Slashes) */}
      <Line points={[lineX - 4, startY + 4, lineX + 4, startY - 4]} stroke="#0f172a" strokeWidth={1.8} />
      <Line points={[lineX - 4, endY + 4, lineX + 4, endY - 4]} stroke="#0f172a" strokeWidth={1.8} />
      {/* 치수 텍스트 */}
      <Text
        x={lineX - 50}
        y={(startY + endY) / 2 - 8}
        width={45}
        align="right"
        text={text}
        fill="#1e293b"
        fontSize={12}
        fontStyle="bold"
      />
    </Group>
  );
}

export default function Editor2D({ classroomSize, items, setItems, selectedId, setSelectedId }) {
  const [scale, setScale] = useState(1);
  const stageRef = useRef();
  const containerRef = useRef(null);
  const [stageDimensions, setStageDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth - 80 - 288 : 800,
    height: typeof window !== 'undefined' ? window.innerHeight - 56 : 600
  });
  const isDraggingStageRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0, stageX: 0, stageY: 0 });

  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    const clickedOnBg = e.target.name() === 'bg-rect' || e.target.name()?.startsWith('wall');
    if (clickedOnEmpty || clickedOnBg) {
      setSelectedId?.(null);
    }
  };

  const handleMouseDown = (e) => {
    if (e.evt.button === 2 || e.evt.button === 1) {
      e.evt.preventDefault();
      isDraggingStageRef.current = true;
      dragStartPosRef.current = {
        x: e.evt.clientX,
        y: e.evt.clientY,
        stageX: stageRef.current ? stageRef.current.x() : 0,
        stageY: stageRef.current ? stageRef.current.y() : 0,
      };
      return;
    }
    checkDeselect(e);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingStageRef.current || !stageRef.current) return;
    const dx = e.evt.clientX - dragStartPosRef.current.x;
    const dy = e.evt.clientY - dragStartPosRef.current.y;
    stageRef.current.position({
      x: dragStartPosRef.current.stageX + dx,
      y: dragStartPosRef.current.stageY + dy,
    });
    stageRef.current.batchDraw();
  };

  const handleMouseUp = () => {
    isDraggingStageRef.current = false;
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.08;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.min(Math.max(newScale, 0.2), 4);
    setScale(clampedScale);

    stage.scale({ x: clampedScale, y: clampedScale });
    stage.position({
      x: -(mousePointTo.x - stage.getPointerPosition().x / clampedScale) * clampedScale,
      y: -(mousePointTo.y - stage.getPointerPosition().y / clampedScale) * clampedScale,
    });
    stage.batchDraw();
  };

  const handleResetView = () => {
    if (!stageRef.current) return;
    const stage = stageRef.current;
    const container = stage.container();
    stage.scale({ x: 1, y: 1 });
    setScale(1);
    stage.x((container.offsetWidth - classroomSize.width) / 2);
    stage.y((container.offsetHeight - classroomSize.height) / 2);
    stage.batchDraw();
  };

  const handleZoomBtn = (direction) => {
    if (!stageRef.current) return;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const factor = direction > 0 ? 1.2 : 0.83;
    const newScale = Math.min(Math.max(oldScale * factor, 0.2), 4);
    setScale(newScale);

    const center = {
      x: stage.width() / 2,
      y: stage.height() / 2,
    };

    const mousePointTo = {
      x: center.x / oldScale - stage.x() / oldScale,
      y: center.y / oldScale - stage.y() / oldScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position({
      x: -(mousePointTo.x - center.x / newScale) * newScale,
      y: -(mousePointTo.y - center.y / newScale) * newScale,
    });
    stage.batchDraw();
  };

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    if (stageRef.current && containerRef.current) {
      const stage = stageRef.current;
      const container = containerRef.current;
      stage.x((container.offsetWidth - classroomSize.width) / 2);
      stage.y((container.offsetHeight - classroomSize.height) / 2);
      stage.batchDraw();
    }

    const handleWindowBlur = () => {
      isDraggingStageRef.current = false;
    };
    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [classroomSize]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative bg-gray-50 overflow-hidden select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 🔍 2D 줌 및 기본 위치(초기화) 도구 (좌측 상단 안전 여백) */}
      <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl p-1.5 flex items-center gap-1 z-30 select-none">
        <button
          onClick={() => handleZoomBtn(1)}
          className="p-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-xl flex items-center justify-center gap-1 text-xs font-bold transition-all shadow-2xs active:scale-95 px-2.5"
          title="도면 화면 확대 (+)"
        >
          <ZoomIn size={14} />
          <span>확대</span>
        </button>
        <button
          onClick={() => handleZoomBtn(-1)}
          className="p-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-xl flex items-center justify-center gap-1 text-xs font-bold transition-all shadow-2xs active:scale-95 px-2.5"
          title="도면 화면 축소 (-)"
        >
          <ZoomOut size={14} />
          <span>축소</span>
        </button>
        <div className="w-px h-5 bg-slate-200 mx-0.5"></div>
        <button
          onClick={handleResetView}
          className="p-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl flex items-center justify-center gap-1 text-xs font-bold transition-all shadow-2xs active:scale-95 px-2.5 border border-blue-200/60 hover:border-transparent"
          title="도면을 화면 중앙 기본 위치로 리셋"
        >
          <Home size={14} />
          <span>초기값</span>
        </button>
      </div>

      <Stage
        width={stageDimensions.width}
        height={stageDimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={checkDeselect}
        onWheel={handleWheel}
        ref={stageRef}
      >
        <Layer>
           <Group>
            <Rect
              x={0}
              y={0}
              width={classroomSize.width}
              height={classroomSize.height}
              fill="#fefcf8"
              name="bg-rect"
              shadowColor="rgba(0,0,0,0.06)"
              shadowBlur={15}
              shadowOffsetY={6}
            />
            {Array.from({ length: Math.ceil(classroomSize.height / 25) }).map((_, idx) => (
              <Line
                key={idx}
                points={[0, idx * 25, classroomSize.width, idx * 25]}
                stroke="rgba(180, 120, 60, 0.12)"
                strokeWidth={1}
              />
            ))}
            
            <Rect x={-WALL_THICKNESS/2} y={-WALL_THICKNESS/2} width={classroomSize.width + WALL_THICKNESS} height={WALL_THICKNESS} fill="#1e293b" name="wall" />
            <Rect x={-WALL_THICKNESS/2} y={classroomSize.height - WALL_THICKNESS/2} width={classroomSize.width + WALL_THICKNESS} height={WALL_THICKNESS} fill="#1e293b" name="wall" />
            <Rect x={-WALL_THICKNESS/2} y={-WALL_THICKNESS/2} width={WALL_THICKNESS} height={classroomSize.height + WALL_THICKNESS} fill="#1e293b" name="wall" />
            <Rect x={classroomSize.width - WALL_THICKNESS/2} y={-WALL_THICKNESS/2} width={WALL_THICKNESS} height={classroomSize.height + WALL_THICKNESS} fill="#1e293b" name="wall" />

            <DimensionLineHorizontal 
              startX={0} 
              endX={classroomSize.width} 
              y={0} 
              text={`${(classroomSize.width / 100).toFixed(1)} m`} 
              offset={40} 
            />
            <DimensionLineVertical 
              startY={0} 
              endY={classroomSize.height} 
              x={0} 
              text={`${(classroomSize.height / 100).toFixed(1)} m`} 
              offset={40} 
            />
            
            {items.map((item, i) => (
              <Item2D
                key={item.id}
                shapeProps={item}
                classroomSize={classroomSize}
                allItems={items}
                isSelected={item.id === selectedId}
                onSelect={() => setSelectedId?.(item.id)}
                onChange={(newAttrs) => {
                  const newItems = items.slice();
                  newItems[i] = newAttrs;
                  setItems(newItems);
                }}
              />
            ))}
          </Group>
        </Layer>
      </Stage>
      
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        opacity: 0.5
      }}></div>

      {/* 🖱️ 2D 마우스 조작 인터랙티브 안내 패널 (우측 하단 안전 여백 넉넉히 확보) */}
      <div className="absolute bottom-8 right-10 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-2xl flex items-center gap-3.5 text-xs select-none z-30 transition-all hover:shadow-2xl">
        {/* 1. 좌클릭 드래그: 비품 선택 · 이동 */}
        <div className="flex items-center gap-2">
          <div className="p-1 bg-slate-100/90 rounded-lg flex items-center justify-center shadow-2xs">
            <svg viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-4.5">
              <rect x="0.75" y="0.75" width="14.5" height="20.5" rx="7.25" stroke="#94a3b8" strokeWidth="1.5" fill="#f8fafc" />
              <path d="M1.5 8C1.5 4.41015 4.41015 1.5 8 1.5V9H1.5V8Z" fill="#2563eb" />
              <line x1="8" y1="1.5" x2="8" y2="9" stroke="#94a3b8" strokeWidth="1" />
              <line x1="1.5" y1="9" x2="14.5" y2="9" stroke="#94a3b8" strokeWidth="1" />
              <rect x="6.75" y="3.5" width="2.5" height="4.5" rx="1.25" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.8" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[9.5px] font-bold text-blue-600 leading-none mb-0.5">좌클릭 드래그</span>
            <span className="text-[11px] font-bold text-slate-800 leading-none">비품 선택 · 이동</span>
          </div>
        </div>

        <div className="w-px h-6 bg-slate-200"></div>

        {/* 2. 우클릭 드래그: 도면 화면 이동 (팬) */}
        <div className="flex items-center gap-2">
          <div className="p-1 bg-slate-100/90 rounded-lg flex items-center justify-center shadow-2xs">
            <svg viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-4.5">
              <rect x="0.75" y="0.75" width="14.5" height="20.5" rx="7.25" stroke="#94a3b8" strokeWidth="1.5" fill="#f8fafc" />
              <path d="M8 1.5C11.5899 1.5 14.5 4.41015 14.5 8V9H8V1.5Z" fill="#2563eb" />
              <line x1="8" y1="1.5" x2="8" y2="9" stroke="#94a3b8" strokeWidth="1" />
              <line x1="1.5" y1="9" x2="14.5" y2="9" stroke="#94a3b8" strokeWidth="1" />
              <rect x="6.75" y="3.5" width="2.5" height="4.5" rx="1.25" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.8" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[9.5px] font-bold text-blue-600 leading-none mb-0.5">우클릭 드래그</span>
            <span className="text-[11px] font-bold text-slate-800 leading-none">도면 화면 이동</span>
          </div>
        </div>

        <div className="w-px h-6 bg-slate-200"></div>

        {/* 3. 마우스 휠: 화면 확대 / 축소 */}
        <div className="flex items-center gap-2">
          <div className="p-1 bg-slate-100/90 rounded-lg flex items-center justify-center shadow-2xs">
            <svg viewBox="0 0 16 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-4.5">
              <rect x="0.75" y="0.75" width="14.5" height="20.5" rx="7.25" stroke="#94a3b8" strokeWidth="1.5" fill="#f8fafc" />
              <line x1="8" y1="1.5" x2="8" y2="9" stroke="#94a3b8" strokeWidth="1" />
              <line x1="1.5" y1="9" x2="14.5" y2="9" stroke="#94a3b8" strokeWidth="1" />
              <rect x="6.25" y="3" width="3.5" height="5.5" rx="1.75" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.8" />
              <line x1="8" y1="4.2" x2="8" y2="7.2" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[9.5px] font-bold text-blue-600 leading-none mb-0.5">마우스 휠</span>
            <span className="text-[11px] font-bold text-slate-800 leading-none">화면 확대 · 축소</span>
          </div>
        </div>
      </div>
    </div>
  );
}
