import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import getFurnitureComponent from './Furniture3D';

export const FURNITURE_CATALOG = [
  { type: '학생 책상', defaultW: 65, defaultD: 45, defaultH: 60, category: '책상/의자' },
  { type: '학생 의자', defaultW: 40, defaultD: 40, defaultH: 75, category: '책상/의자' },
  { type: '교사 책상', defaultW: 120, defaultD: 70, defaultH: 75, category: '책상/의자' },
  { type: '교구장(1단, 긴 문)', defaultW: 80, defaultD: 42, defaultH: 88, category: '수납장' },
  { type: '교구장(3단, 문 없음)', defaultW: 90, defaultD: 32, defaultH: 85, category: '수납장' },
  { type: '교구장(4단, 문 없음)', defaultW: 95, defaultD: 32, defaultH: 115, category: '수납장' },
  { type: '교구장(3단, 문 있음)', defaultW: 90, defaultD: 38, defaultH: 85, category: '수납장' },
  { type: '교구장(4단, 문 있음)', defaultW: 95, defaultD: 38, defaultH: 115, category: '수납장' },
  { type: '신발장(2단)', defaultW: 65, defaultD: 35, defaultH: 70, category: '수납장' },
  { type: '신발장(3단)', defaultW: 65, defaultD: 35, defaultH: 95, category: '수납장' },
  { type: '옷장', defaultW: 60, defaultD: 50, defaultH: 180, category: '수납장' },
  { type: '전자칠판(벽부착형)', defaultW: 200, defaultD: 15, defaultH: 120, category: '학습교구' },
  { type: '이동식 칠판', defaultW: 150, defaultD: 50, defaultH: 180, category: '학습교구' },
  { type: '출입문', defaultW: 90, defaultD: 15, defaultH: 210, category: '구조물' },
  { type: '창문', defaultW: 120, defaultD: 15, defaultH: 120, category: '구조물' },
];

// 메모리 캐시
let globalThumbnailsCache = {};

try {
  const saved = localStorage.getItem('classroom_3d_thumbnails_v2');
  if (saved) {
    globalThumbnailsCache = JSON.parse(saved);
  }
} catch (e) {
  console.warn('LocalStorage thumbnail cache load error:', e);
}

// 📸 오프스크린 3D 캡처 씬
function CaptureScene({ model, onCapture }) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    if (!model) return;

    // 가구 크기에 따른 최적 45도 카메라 앵글 계산
    const w = model.defaultW || 80;
    const d = model.defaultD || 50;
    const h = model.defaultH || 80;

    let targetY = h * 0.48;
    let maxDim = Math.max(w, d, h);

    if (model.type === '창문') {
      targetY = 0;
      maxDim = Math.max(w, h);
    } else if (model.type.includes('전자칠판')) {
      targetY = 0;
      maxDim = Math.max(w * 0.85, h);
    } else if (model.type === '출입문') {
      targetY = h * 0.48;
      maxDim = Math.max(w, h * 0.9);
    }

    const dist = maxDim * 1.55;

    // 45도 아이소메트릭 스튜디오 시야각 설정
    camera.position.set(dist * 1.15, dist * 0.82, dist * 1.15);
    camera.lookAt(0, targetY, 0);
    camera.updateProjectionMatrix();

    // 2프레임 렌더 후 캡처 (지오메트리 & 텍스처 완전 로드 보장)
    const timer = setTimeout(() => {
      gl.render(scene, camera);
      const dataUrl = gl.domElement.toDataURL('image/png');
      onCapture(model.type, dataUrl);
    }, 45);

    return () => clearTimeout(timer);
  }, [model, gl, scene, camera, onCapture]);

  if (!model) return null;

  const Component = getFurnitureComponent(model.type);
  const w = model.defaultW || 80;
  const d = model.defaultD || 50;
  const h = model.defaultH || 80;

  // 벽 부착 아이템들의 Y-Offset 보정 (원점 중심으로 정렬)
  let groupOffsetY = 0;
  if (model.type === '창문') {
    groupOffsetY = -(80 + h / 2);
  } else if (model.type.includes('전자칠판')) {
    groupOffsetY = -(85 + h / 2);
  }

  return (
    <>
      {/* 🌟 3D 스튜디오 소프트 라이팅 */}
      <ambientLight intensity={1.6} />
      <directionalLight position={[180, 240, 180]} intensity={2.2} />
      <directionalLight position={[-180, 120, -120]} intensity={1.2} />
      <directionalLight position={[0, 150, -180]} intensity={0.8} />

      {/* 부드러운 원형 바닥 그림자 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[w * 1.5 + 20, d * 1.5 + 20]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.06} />
      </mesh>

      <group position={[0, groupOffsetY, 0]}>
        <Component width={w} depth={d} height={h} type={model.type} wallMode="high" />
      </group>
    </>
  );
}

// 🏭 3D 썸네일 백그라운드 캡처 엔진
export function ThumbnailGenerator3D({ onThumbnailsReady }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [captured, setCaptured] = useState({ ...globalThumbnailsCache });
  const isDoneRef = useRef(false);

  // 모든 썸네일이 이미 캐시되어 있는지 확인
  const allCached = FURNITURE_CATALOG.every(m => globalThumbnailsCache[m.type]);

  useEffect(() => {
    if (allCached && !isDoneRef.current) {
      isDoneRef.current = true;
      onThumbnailsReady?.(globalThumbnailsCache);
    }
  }, [allCached, onThumbnailsReady]);

  const handleCapture = (type, dataUrl) => {
    const updated = { ...captured, [type]: dataUrl };
    setCaptured(updated);
    globalThumbnailsCache = updated;

    if (currentIndex < FURNITURE_CATALOG.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      isDoneRef.current = true;
      try {
        localStorage.setItem('classroom_3d_thumbnails_v2', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
      window.dispatchEvent(new CustomEvent('thumbnails-updated'));
      onThumbnailsReady?.(updated);
    }
  };

  if (allCached) return null;

  const currentModel = FURNITURE_CATALOG[currentIndex];

  return (
    <div style={{ position: 'fixed', left: -9999, top: -9999, width: 220, height: 180, pointerEvents: 'none', opacity: 0 }}>
      <Canvas
        gl={{ preserveDrawingBuffer: true, alpha: true, antialias: true }}
        camera={{ fov: 30, near: 1, far: 2000 }}
      >
        <CaptureScene model={currentModel} onCapture={handleCapture} />
      </Canvas>
    </div>
  );
}

// 🖼️ 3D 썸네일 표시 컴포넌트
export function FurnitureThumbnail3D({ type, fallback }) {
  const [src, setSrc] = useState(globalThumbnailsCache[type] || null);

  useEffect(() => {
    if (!src && globalThumbnailsCache[type]) {
      setSrc(globalThumbnailsCache[type]);
    }
  }, [type, src]);

  // 커스텀 이벤트 리스너로 썸네일 완성 시 즉시 리렌더링
  useEffect(() => {
    const handleUpdate = () => {
      if (globalThumbnailsCache[type]) {
        setSrc(globalThumbnailsCache[type]);
      }
    };
    window.addEventListener('thumbnails-updated', handleUpdate);
    return () => window.removeEventListener('thumbnails-updated', handleUpdate);
  }, [type]);

  if (src) {
    return (
      <img
        src={src}
        alt={type}
        className="w-full h-full object-contain drop-shadow-sm select-none transition-transform duration-200"
        loading="eager"
      />
    );
  }

  return fallback || null;
}
