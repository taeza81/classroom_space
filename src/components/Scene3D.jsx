import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, PivotControls, ContactShadows } from '@react-three/drei';
import getFurnitureComponent from './Furniture3D';
import * as THREE from 'three';
import { Eye, Home, ZoomIn, ZoomOut, Layers, Compass, Maximize2 } from 'lucide-react';
import { hasOverlapWithOthers, resolveOverlapPosition } from '../utils/collisionUtils';

function ItemWrapper({ item, classroomSize, isSelected, onSelect, onChange, wallMode = 'low', controlsRef, allItems = [] }) {
  const Component = getFurnitureComponent(item.type);
  const { raycaster } = useThree();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isColliding, setIsColliding] = useState(false);

  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef(new THREE.Vector3());
  const floorPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  // 2D 좌표 (0 ~ width, 0 ~ height)를 3D 중심 좌표 (-width/2 ~ width/2, -height/2 ~ height/2)로 변환
  let posX = item.x - classroomSize.width / 2;
  let posZ = item.y - classroomSize.height / 2;
  let rotY = item.rotation || 0;

  // 🚪 창문, 출입문, 전자칠판의 3D 벽체 최적화 자동 매립 (벽체 중심선에 완벽 자동 매립)
  if (item.type === '출입문' || item.type === '창문' || item.type?.includes('전자칠판')) {
    const W2 = classroomSize.width / 2;
    const H2 = classroomSize.height / 2;
    const wallSnapThreshold = 80;

    const dNorth = Math.abs(posZ - (-H2));
    const dSouth = Math.abs(posZ - H2);
    const dWest = Math.abs(posX - (-W2));
    const dEast = Math.abs(posX - W2);

    const minD = Math.min(dNorth, dSouth, dWest, dEast);
    if (minD <= wallSnapThreshold) {
      if (minD === dNorth) {
        posZ = -H2;
        rotY = 0;
      } else if (minD === dSouth) {
        posZ = H2;
        rotY = Math.PI;
      } else if (minD === dWest) {
        posX = -W2;
        rotY = Math.PI / 2;
      } else if (minD === dEast) {
        posX = W2;
        rotY = -Math.PI / 2;
      }
    }
  }

  const itemH = item.itemHeight || 75;
  const itemW = item.width || 60;
  const itemD = item.height || 45;

  // 🖱️ 3D 가구 마우스 좌클릭 드래그 시작 핸들러
  const handlePointerDown = (e) => {
    if (e.button !== 0) return; // 오직 좌클릭(0)만 가구 이동 드래그 (우클릭은 화면 이동/팬)
    e.stopPropagation();
    onSelect();

    // 드래그 중 3D 카메라 궤도 회전 일시 비활성화
    if (controlsRef?.current) {
      controlsRef.current.enabled = false;
    }

    isDraggingRef.current = true;
    setIsDragging(true);

    // 바닥 평면과의 레이캐스팅 교차점 계산
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(floorPlaneRef.current, intersection);
    if (intersection) {
      dragOffsetRef.current.set(posX - intersection.x, 0, posZ - intersection.z);
    }

    e.target.setPointerCapture?.(e.pointerId);
    document.body.style.cursor = 'grabbing';
  };

  // 🖱️ 3D 가구 마우스 이동 시 실시간 바닥 좌표 추적 및 가구 이동
  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();

    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(floorPlaneRef.current, intersection);
    if (!intersection) return;

    let new3DX = intersection.x + dragOffsetRef.current.x;
    let new3DZ = intersection.z + dragOffsetRef.current.z;

    // 교실 바닥 내부로 가구 이동 범위 제한 (Clamping)
    const halfW = classroomSize.width / 2;
    const halfH = classroomSize.height / 2;
    const marginW = (item.width || 60) / 2;
    const marginH = (item.height || 45) / 2;

    new3DX = Math.max(-halfW + marginW, Math.min(halfW - marginW, new3DX));
    new3DZ = Math.max(-halfH + marginH, Math.min(halfH - marginH, new3DZ));

    // 3D 중심 좌표를 2D 저장용 좌표로 변환
    const new2DX = Math.round(new3DX + classroomSize.width / 2);
    const new2DY = Math.round(new3DZ + classroomSize.height / 2);

    // 🚨 3D 실시간 다른 비품과의 겹침/충돌 검사
    const candidate = {
      ...item,
      x: new2DX,
      y: new2DY,
    };
    const colliding = hasOverlapWithOthers(candidate, allItems, 0);
    setIsColliding(colliding);

    onChange({
      ...item,
      x: new2DX,
      y: new2DY,
    });
  };

  // 🖱️ 3D 가구 마우스 드래그 종료 핸들러
  const handlePointerUp = (e) => {
    if (isDraggingRef.current) {
      e.stopPropagation();
      isDraggingRef.current = false;
      setIsDragging(false);
      setIsColliding(false);

      // 3D 카메라 궤도 회전 다시 활성화
      if (controlsRef?.current) {
        controlsRef.current.enabled = true;
      }

      // 🛡️ [핵심] 3D 비품 겹침 방지: 충돌 발생 시 최근접 비충돌 유효 위치로 자동 스냅 (0cm 밀착 허용)
      const candidate = {
        ...item,
        x: item.x,
        y: item.y,
      };
      const safePos = resolveOverlapPosition(candidate, allItems, classroomSize, 0);

      onChange({
        ...item,
        x: safePos.x,
        y: safePos.y,
      });

      e.target.releasePointerCapture?.(e.pointerId);
      document.body.style.cursor = isHovered ? 'grab' : 'auto';
    }
  };

  return (
    <group
      position={[posX, 0, posZ]}
      rotation={[0, rotY, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        if (!isDraggingRef.current) document.body.style.cursor = 'grab';
      }}
      onPointerOut={(e) => {
        setIsHovered(false);
        if (!isDraggingRef.current) document.body.style.cursor = 'auto';
      }}
    >
      <Component width={item.width} depth={item.height} height={item.itemHeight} type={item.type} wallMode={wallMode} />

      {/* 🌟 3D 선택/충돌 상태 명확한 시각적 피드백 */}
      {isSelected && (
        <group>
          {/* 1. 바닥 발광 선택/충돌 패널 (Ground Glow Halo) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
            <planeGeometry args={[itemW + 8, itemD + 8]} />
            <meshBasicMaterial 
              color={isColliding ? "#ef4444" : "#0284c7"} 
              transparent 
              opacity={isColliding ? 0.65 : isDragging ? 0.45 : 0.28} 
              depthWrite={false} 
            />
          </mesh>
          
          {/* 2. 바닥 외곽선 링 (Ground Border Ring) */}
          <lineSegments position={[0, 0.35, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(itemW + 8, 0.2, itemD + 8)]} />
            <lineBasicMaterial color={isColliding ? "#ef4444" : "#0284c7"} linewidth={isColliding ? 3 : 2.5} />
          </lineSegments>

          {/* 3. 3D 가구 입체 바운딩 박스 와이어프레임 (3D Bounding Wireframe Box) */}
          <lineSegments position={[0, itemH / 2, 0]}>
            <edgesGeometry args={[new THREE.BoxGeometry(itemW + 4, itemH + 2, itemD + 4)]} />
            <lineBasicMaterial 
              color={isColliding ? "#ef4444" : isDragging ? '#60a5fa' : '#38bdf8'} 
              linewidth={isColliding ? 3 : isDragging ? 2.5 : 1.8} 
            />
          </lineSegments>

          {/* 4. 바닥 4개 모서리 포인트 코너 마커 */}
          {[-1, 1].map(sx => [-1, 1].map(sz => (
            <mesh key={`${sx}-${sz}`} position={[sx * (itemW + 8) / 2, 0.45, sz * (itemD + 8) / 2]}>
              <boxGeometry args={[4, 0.5, 4]} />
              <meshBasicMaterial color={isColliding ? "#ef4444" : "#0284c7"} />
            </mesh>
          )))}
        </group>
      )}
    </group>
  );
}

// 🧱 출입문과 창문 위치에 맞게 자동으로 벽을 뚫어주는 지능형 벽체 컴포넌트
function SmartWall({ axis, wallLength, wallHeight, wallThickness = 12, wallOffset, openings }) {
  // axis: 'x' (가로벽: 북/남) 또는 'z' (세로벽: 서/동)
  const segments = useMemo(() => {
    // 조감도(낮게, wallHeight <= 100) 모드에서는 창문 개구부를 생략하여 깔끔한 60cm 벽체로 유지하고 출입문만 시원하게 뚫어줌
    const activeOpenings = wallHeight <= 100 
      ? openings.filter(op => op.type === '출입문') 
      : openings;

    // 벽체 범위: -wallLength/2 ~ wallLength/2
    const sorted = [...activeOpenings]
      .map(op => ({
        ...op,
        start: Math.max(-wallLength / 2, op.center - op.width / 2),
        end: Math.min(wallLength / 2, op.center + op.width / 2),
      }))
      .filter(op => op.end > op.start)
      .sort((a, b) => a.start - b.start);

    const segs = [];
    let cur = -wallLength / 2;

    sorted.forEach(op => {
      // 1. 개구부 이전의 온전한 벽체
      if (op.start > cur) {
        segs.push({
          center: (cur + op.start) / 2,
          length: op.start - cur,
          bottomY: 0,
          height: wallHeight,
        });
      }

      // 2. 개구부 (문 / 창문) 영역 벽체 분할
      if (op.type === '출입문') {
        const doorH = 210;
        // 문 위쪽 인방벽 (벽 높이가 문 높이 210cm보다 높을 때만 생성)
        if (wallHeight > doorH) {
          segs.push({
            center: (op.start + op.end) / 2,
            length: op.end - op.start,
            bottomY: doorH,
            height: wallHeight - doorH,
          });
        }
        // 문 아래쪽은 아무런 벽체도 생성하지 않아 완전히 뚫린 입구가 됨!
      } else if (op.type === '창문') {
        const isLow = wallHeight <= 100;
        const sillH = isLow ? 20 : 80;
        const winTopH = isLow ? 60 : 190;
        // 창문 아래 턱벽
        segs.push({
          center: (op.start + op.end) / 2,
          length: op.end - op.start,
          bottomY: 0,
          height: Math.min(wallHeight, sillH),
        });
        // 창문 위 인방벽 (벽 높이가 창문 상단보다 높을 때만 생성)
        if (wallHeight > winTopH) {
          segs.push({
            center: (op.start + op.end) / 2,
            length: op.end - op.start,
            bottomY: winTopH,
            height: wallHeight - winTopH,
          });
        }
        // 창문 영역은 뚫린 공간!
      }

      cur = Math.max(cur, op.end);
    });

    // 3. 마지막 개구부 이후의 온전한 벽체
    if (cur < wallLength / 2) {
      segs.push({
        center: (cur + wallLength / 2) / 2,
        length: wallLength / 2 - cur,
        bottomY: 0,
        height: wallHeight,
      });
    }

    return segs;
  }, [axis, wallLength, wallHeight, openings]);

  return (
    <group>
      {segments.map((seg, idx) => {
        if (seg.length <= 0 || seg.height <= 0) return null;

        const segSize = axis === 'x' 
          ? [seg.length, seg.height, wallThickness] 
          : [wallThickness, seg.height, seg.length];
        
        const segPos = axis === 'x'
          ? [seg.center, seg.bottomY + seg.height / 2, wallOffset]
          : [wallOffset, seg.bottomY + seg.height / 2, seg.center];

        const capSize = axis === 'x'
          ? [seg.length, 2, wallThickness + 1]
          : [wallThickness + 1, 2, seg.length];
        
        const capPos = axis === 'x'
          ? [seg.center, seg.bottomY + seg.height + 1, wallOffset]
          : [wallOffset, seg.bottomY + seg.height + 1, seg.center];

        return (
          <group key={idx}>
            {/* 흰색 벽면 블록 */}
            <mesh position={segPos} castShadow receiveShadow>
              <boxGeometry args={segSize} />
              <meshStandardMaterial color="#f8fafc" roughness={0.8} />
            </mesh>
            {/* 상단 블랙 마감 캡 */}
            <mesh position={capPos}>
              <boxGeometry args={capSize} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// 카메라 뷰 변경을 지원하는 내부 컨트롤러
function CameraManager({ controlsRef, cameraPreset, classroomSize }) {
  const { camera } = useThree();

  useEffect(() => {
    if (!controlsRef.current) return;
    const maxDim = Math.max(classroomSize.width, classroomSize.height);
    const dist = maxDim * 2.1;

    if (cameraPreset === 'isometric') {
      camera.position.set(dist * 0.75, dist * 0.85, dist * 0.75);
      controlsRef.current.target.set(0, 0, 0);
    } else if (cameraPreset === 'top') {
      camera.position.set(0, dist * 1.35, 0.001);
      controlsRef.current.target.set(0, 0, 0);
    } else if (cameraPreset === 'front') {
      camera.position.set(0, dist * 0.55, dist * 1.35);
      controlsRef.current.target.set(0, 0, 0);
    }
    controlsRef.current.update();
  }, [cameraPreset, classroomSize]);

  return null;
}

// 한국 학교 교실 원목 마루 바닥 텍스처 생성기
function useWoodFloorTexture(width, height) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 1. 따뜻한 베이스 오크 우드 톤
    ctx.fillStyle = '#e8d3b9';
    ctx.fillRect(0, 0, 512, 512);

    const plankHeight = 32; // 플랭크 너비
    const plankWidth = 128; // 플랭크 길이
    const plankColors = ['#e8d3b9', '#f0deca', '#e2cbb0', '#f3e3ce', '#dec6a9', '#ebd7c0'];

    for (let y = 0; y < 512; y += plankHeight) {
      const rowIdx = Math.floor(y / plankHeight);
      const offsetX = (rowIdx % 3) * (plankWidth / 3);

      for (let x = -plankWidth; x < 512 + plankWidth; x += plankWidth) {
        const plankX = x + offsetX;
        const colorIdx = Math.abs((rowIdx * 5 + Math.floor(plankX / 30)) % plankColors.length);

        // 개별 플랭크 색상
        ctx.fillStyle = plankColors[colorIdx];
        ctx.fillRect(plankX, y, plankWidth, plankHeight);

        // 은은한 원목 나뭇결 웨이브 선 (Wood Grain)
        ctx.strokeStyle = 'rgba(140, 85, 30, 0.09)';
        ctx.lineWidth = 1;
        for (let g = y + 4; g < y + plankHeight; g += 6) {
          ctx.beginPath();
          ctx.moveTo(plankX, g + Math.sin(plankX * 0.08) * 2);
          ctx.bezierCurveTo(
            plankX + plankWidth * 0.35, g + Math.sin(plankX * 0.05) * 3,
            plankX + plankWidth * 0.65, g - Math.sin(plankX * 0.05) * 2,
            plankX + plankWidth, g
          );
          ctx.stroke();
        }

        // 플랭크 이음새 V홈 (Seam line)
        ctx.strokeStyle = 'rgba(110, 65, 20, 0.25)';
        ctx.lineWidth = 1;
        ctx.strokeRect(plankX + 0.5, y + 0.5, plankWidth, plankHeight);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(width / 160, height / 160);
    texture.needsUpdate = true;
    return texture;
  }, [width, height]);
}

export default function Scene3D({ classroomSize, items, setItems, selectedId, setSelectedId }) {
  const [cameraPreset, setCameraPreset] = useState('isometric');
  const [wallMode, setWallMode] = useState('low'); // 'low' (조감도 60cm) or 'high' (실제 250cm)
  const controlsRef = useRef();

  const maxDim = Math.max(classroomSize.width, classroomSize.height);
  const initialDist = maxDim * 2.1;
  const wallHeight = wallMode === 'low' ? 60 : (classroomSize.wallHeight || 260);

  // 원목 마루 텍스처
  const woodFloorTexture = useWoodFloorTexture(classroomSize.width, classroomSize.height);

  const handlePointerMissed = () => {
    setSelectedId?.(null);
  };

  // 🔍 3D 화면 확대 / 축소 핸들러 (초점 기준 정밀 줌)
  const handleZoom = (delta) => {
    if (!controlsRef.current) return;
    const camera = controlsRef.current.object;
    const target = controlsRef.current.target || new THREE.Vector3(0, 0, 0);
    const factor = delta > 0 ? 0.82 : 1.22;

    const offset = new THREE.Vector3().subVectors(camera.position, target);
    offset.multiplyScalar(factor);
    camera.position.copy(target).add(offset);
    controlsRef.current.update();
  };

  // 🏠 3D 카메라 기본 시점(초기화) 핸들러 (즉시 원점 타겟 및 45도 초기 뷰 복귀)
  const handleResetCamera = () => {
    if (!controlsRef.current) return;
    const maxDim = Math.max(classroomSize.width, classroomSize.height);
    const dist = maxDim * 2.1;
    const camera = controlsRef.current.object;

    // 타겟을 교실 원점(0,0,0)으로 초기화
    controlsRef.current.target.set(0, 0, 0);
    // 45도 조감도 최적 위치로 카메라 이동
    camera.position.set(dist * 0.75, dist * 0.85, dist * 0.75);
    camera.lookAt(0, 0, 0);
    controlsRef.current.update();
    setCameraPreset('isometric');
  };

  // 4면의 벽체에 부착된 문 / 창문 개구부 자동 계산
  const wallOpenings = useMemo(() => {
    const W2 = classroomSize.width / 2;
    const H2 = classroomSize.height / 2;
    const wallThreshold = 80; // 벽 근처 또는 검정 벽 영역에 걸쳐진 경우 자동 개구부 생성(cm)

    const openings = {
      north: [], // 상단 벽 (z = -H2)
      south: [], // 하단 벽 (z = H2)
      west: [],  // 좌측 벽 (x = -W2)
      east: []   // 우측 벽 (x = W2)
    };

    items.forEach(item => {
      if (item.type !== '출입문' && item.type !== '창문') return;

      const posX = item.x - W2;
      const posZ = item.y - H2;

      const dNorth = Math.abs(posZ - (-H2));
      const dSouth = Math.abs(posZ - H2);
      const dWest = Math.abs(posX - (-W2));
      const dEast = Math.abs(posX - W2);

      const minD = Math.min(dNorth, dSouth, dWest, dEast);
      if (minD <= wallThreshold) {
        if (minD === dNorth) {
          openings.north.push({ center: posX, width: item.width, type: item.type });
        } else if (minD === dSouth) {
          openings.south.push({ center: posX, width: item.width, type: item.type });
        } else if (minD === dWest) {
          openings.west.push({ center: posZ, width: item.width, type: item.type });
        } else if (minD === dEast) {
          openings.east.push({ center: posZ, width: item.width, type: item.type });
        }
      }
    });

    return openings;
  }, [items, classroomSize]);

  return (
    <div className="w-full h-full relative bg-slate-100 select-none overflow-hidden">
      <Canvas 
        shadows 
        camera={{ 
          position: [initialDist * 0.75, initialDist * 0.85, initialDist * 0.75], 
          fov: 38,
          near: 5,
          far: 40000 
        }}
        onPointerMissed={handlePointerMissed}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <color attach="background" args={['#f1f5f9']} />
        <ambientLight intensity={0.85} />
        <directionalLight 
          position={[maxDim * 1.2, maxDim * 1.8, maxDim * 1.2]} 
          castShadow 
          intensity={1.4} 
          shadow-mapSize={[2048, 2048]} 
          shadow-camera-left={-maxDim * 1.5} 
          shadow-camera-right={maxDim * 1.5} 
          shadow-camera-top={maxDim * 1.5} 
          shadow-camera-bottom={-maxDim * 1.5} 
          shadow-camera-near={10}
          shadow-camera-far={maxDim * 5} 
        />
        
        <OrbitControls 
          ref={controlsRef}
          makeDefault 
          target={[0, 0, 0]}
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2.05} 
          minDistance={80} 
          maxDistance={maxDim * 6} 
        />

        <CameraManager 
          controlsRef={controlsRef} 
          cameraPreset={cameraPreset} 
          classroomSize={classroomSize}
        />

        {/* 교실 공간 (중심 0,0,0 기준) */}
        <group position={[0, 0, 0]}>
          {/* 바닥 (한국 학교 원목 마루 텍스처) */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.1, 0]}>
            <planeGeometry args={[classroomSize.width, classroomSize.height]} />
            <meshStandardMaterial 
              map={woodFloorTexture} 
              roughness={0.42} 
              metalness={0.04} 
            />
          </mesh>
          
          {/* 🌟 사실적인 접촉 그림자 (Contact Shadows) - 가구가 바닥에 착 달라붙는 깊이감 형성 */}
          <ContactShadows 
            position={[0, 0.05, 0]} 
            opacity={0.55} 
            scale={Math.max(classroomSize.width, classroomSize.height) * 1.2} 
            blur={1.2} 
            far={90} 
          />
          
          {/* 은은한 50cm 배치 가이드 그리드 */}
          <Grid 
            infiniteGrid={false} 
            args={[classroomSize.width, classroomSize.height]} 
            sectionSize={100} 
            cellSize={50} 
            sectionColor="#c49767" 
            cellColor="#deb887" 
            position={[0, 0.05, 0]} 
          />
          
          {/* 🚪 4면의 지능형 벽체 (문과 창문이 있는 곳을 실제로 뚫어줌) */}
          {/* 북쪽 (상단) 벽 */}
          <SmartWall 
            axis="x" 
            wallLength={classroomSize.width + 12} 
            wallHeight={wallHeight} 
            wallOffset={-classroomSize.height / 2 - 6} 
            openings={wallOpenings.north} 
          />
          {/* 남쪽 (하단) 벽 */}
          <SmartWall 
            axis="x" 
            wallLength={classroomSize.width + 12} 
            wallHeight={wallHeight} 
            wallOffset={classroomSize.height / 2 + 6} 
            openings={wallOpenings.south} 
          />
          {/* 서쪽 (좌측) 벽 */}
          <SmartWall 
            axis="z" 
            wallLength={classroomSize.height} 
            wallHeight={wallHeight} 
            wallOffset={-classroomSize.width / 2 - 6} 
            openings={wallOpenings.west} 
          />
          {/* 동쪽 (우측) 벽 */}
          <SmartWall 
            axis="z" 
            wallLength={classroomSize.height} 
            wallHeight={wallHeight} 
            wallOffset={classroomSize.width / 2 + 6} 
            openings={wallOpenings.east} 
          />
        </group>

        {/* 비품들 (3D 모델) */}
        {items.map((item, i) => (
          <ItemWrapper
            key={item.id}
            item={item}
            classroomSize={classroomSize}
            wallMode={wallMode}
            allItems={items}
            isSelected={item.id === selectedId}
            onSelect={() => setSelectedId?.(item.id)}
            controlsRef={controlsRef}
            onChange={(newAttrs) => {
              const newItems = items.slice();
              newItems[i] = newAttrs;
              setItems(newItems);
            }}
          />
        ))}
      </Canvas>

      {/* 🎮 [제안 2] 정돈된 단일 일체형 3D 뷰어 컨트롤러 패널 */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl p-3 flex flex-col gap-2.5 z-10 select-none min-w-[310px]">
        {/* 1. 시점 프리셋 */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-500 w-14 shrink-0 flex items-center gap-1">
            <Compass size={13} className="text-blue-500" /> 시점
          </span>
          <div className="flex-1 bg-slate-100/90 p-0.5 rounded-xl flex items-center gap-0.5">
            <button
              onClick={() => setCameraPreset('isometric')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                cameraPreset === 'isometric'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
              title="대각선 45도 입체 조감도 뷰"
            >
              입체뷰
            </button>
            <button
              onClick={() => setCameraPreset('top')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                cameraPreset === 'top'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
              title="위에서 바로 내려다보기"
            >
              상단뷰
            </button>
            <button
              onClick={() => setCameraPreset('front')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                cameraPreset === 'front'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
              title="정면에서 수평으로 보기"
            >
              정면뷰
            </button>
          </div>
        </div>

        {/* 2. 벽 높이 모드 */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-500 w-14 shrink-0 flex items-center gap-1">
            <Layers size={13} className="text-blue-500" /> 벽 높이
          </span>
          <div className="flex-1 bg-slate-100/90 p-0.5 rounded-xl flex items-center gap-0.5">
            <button
              onClick={() => setWallMode('low')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                wallMode === 'low'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
              title="벽 높이를 낮게 설정하여 내부 가구 조망"
            >
              조감도 (낮게)
            </button>
            <button
              onClick={() => setWallMode('high')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                wallMode === 'high'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
              title="실제 교실 벽 높이로 룸 공간 확인"
            >
              실제 높이
            </button>
          </div>
        </div>

        <div className="h-px bg-slate-100 my-0.5"></div>

        {/* 3. 화면 조작 (확대 / 축소 / 초기값) */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-slate-500 w-14 shrink-0 flex items-center gap-1">
            <Maximize2 size={13} className="text-blue-500" /> 조작
          </span>
          <div className="flex-1 flex items-center gap-1.5">
            <button
              onClick={() => handleZoom(1)}
              className="flex-1 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-xl flex items-center justify-center gap-1 text-[11px] font-bold transition-all shadow-2xs active:scale-95"
              title="화면 확대 (+)"
            >
              <ZoomIn size={14} />
              <span>확대</span>
            </button>
            <button
              onClick={() => handleZoom(-1)}
              className="flex-1 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 rounded-xl flex items-center justify-center gap-1 text-[11px] font-bold transition-all shadow-2xs active:scale-95"
              title="화면 축소 (-)"
            >
              <ZoomOut size={14} />
              <span>축소</span>
            </button>
            <button
              onClick={handleResetCamera}
              className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl flex items-center justify-center gap-1 text-[11px] font-bold transition-all shadow-2xs active:scale-95 border border-blue-200/60 hover:border-transparent"
              title="45도 기본 시점으로 초기화"
            >
              <Home size={14} />
              <span>초기값</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🖱️ 3D 마우스 컨트롤러 시각적 인터랙티브 안내 패널 (우측 하단 안전 여백 넉넉히 확보) */}
      <div className="absolute bottom-8 right-10 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/90 shadow-2xl flex items-center gap-3.5 text-xs select-none z-30 transition-all hover:shadow-2xl">
        {/* 1. 좌클릭: 360° 회전 */}
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
            <span className="text-[11px] font-bold text-slate-800 leading-none">비품 이동 · 360° 회전</span>
          </div>
        </div>

        <div className="w-px h-6 bg-slate-200"></div>

        {/* 2. 우클릭: 화면 이동 */}
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
            <span className="text-[11px] font-bold text-slate-800 leading-none">화면 이동 (팬)</span>
          </div>
        </div>

        <div className="w-px h-6 bg-slate-200"></div>

        {/* 3. 휠 스크롤: 줌 */}
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
            <span className="text-[11px] font-bold text-slate-800 leading-none">확대 / 축소</span>
          </div>
        </div>
      </div>
    </div>
  );
}
