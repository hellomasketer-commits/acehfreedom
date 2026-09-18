import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EXHIBITS, MUSEUM_WINGS } from '../data/exhibits';
import { audioGuide } from '../services/audioGuide';
import { GraphicQuality, initMuseumScene, MuseumSceneSetup } from '../services/museum3d';
import { Exhibit, VRMode } from '../types/museum';
import { Compass, Eye, Headphones, Sparkles, Volume2, VolumeX, Move, Glasses, BookOpen, Layers, Zap, Gauge } from 'lucide-react';

interface MuseumViewportProps {
  onSelectExhibit: (exhibitId: string) => void;
  onOpenInspector: (exhibitId: string) => void;
  activeExhibitId: string | null;
  vrMode: VRMode;
  onToggleVR: () => void;
  ambientSoundEnabled: boolean;
  onToggleAmbientSound: () => void;
  teleportTarget?: { pos: [number, number, number]; lookAt?: [number, number, number] } | null;
}

export const MuseumViewport: React.FC<MuseumViewportProps> = ({
  onSelectExhibit,
  onOpenInspector,
  activeExhibitId,
  vrMode,
  onToggleVR,
  ambientSoundEnabled,
  onToggleAmbientSound,
  teleportTarget,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneSetupRef = useRef<MuseumSceneSetup | null>(null);

  // Movement & Camera State
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraRotation = useRef({ yaw: 0, pitch: 0 });
  const playerPosition = useRef<[number, number, number]>([0, 1.6, 0]);

  // UI / HUD state
  const [nearbyExhibit, setNearbyExhibit] = useState<Exhibit | null>(null);
  const [hoveredExhibit, setHoveredExhibit] = useState<Exhibit | null>(null);
  const [currentWingName, setCurrentWingName] = useState('Meuligoe Agung & Monumen Halimon');
  const [supportsWebXR, setSupportsWebXR] = useState(false);
  const [graphicQuality, setGraphicQuality] = useState<GraphicQuality>('balanced');

  // Cinematic Fade and Slide Transition State
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'fade-in' | 'fade-out'>('idle');
  const [transitionData, setTransitionData] = useState<{
    badge: string;
    title: string;
    subtitle: string;
    category: string;
    accentColor: string;
    direction: 'left' | 'right';
  } | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const triggerTransitionRef = useRef<((pos: [number, number, number], lookAt?: [number, number, number]) => void) | null>(null);

  // Transition trigger callback
  const triggerCinematicTransition = useCallback(
    (pos: [number, number, number], lookAt?: [number, number, number]) => {
      // Determine what exhibit or wing is being switched to
      let matchedExhibit: Exhibit | null = null;
      for (const exh of EXHIBITS) {
        const dx = pos[0] - exh.pedestalPosition[0];
        const dz = pos[2] - exh.pedestalPosition[2];
        if (Math.hypot(dx, dz) < 3.8) {
          matchedExhibit = exh;
          break;
        }
      }

      let matchedWing: (typeof MUSEUM_WINGS)[0] | null = null;
      if (!matchedExhibit) {
        for (const wing of MUSEUM_WINGS) {
          const dx = pos[0] - wing.entrancePosition[0];
          const dz = pos[2] - wing.entrancePosition[2];
          if (Math.hypot(dx, dz) < 4.0) {
            matchedWing = wing;
            break;
          }
        }
      }

      const isCenter = Math.hypot(pos[0], pos[2]) < 2.5;

      let badge = 'BERPINDAH LOKASI';
      let title = 'Museum Kemerdekaan';
      let subtitle = 'Eksplorasi Sejarah Aceh';
      let category = 'Navigasi Museum';
      let accentColor = '#f59e0b';

      if (matchedExhibit) {
        badge = `ARTEFAK • ${matchedExhibit.era}`;
        title = matchedExhibit.name;
        subtitle = `${matchedExhibit.year} — ${matchedExhibit.nativeTitle || matchedExhibit.provenance}`;
        category = 'Koleksi Pusaka';
        accentColor = matchedExhibit.accentColor;
      } else if (matchedWing) {
        badge = `SAYAP GALERI • ${matchedWing.eraPeriod}`;
        title = matchedWing.name;
        subtitle = matchedWing.subtitle;
        category = 'Lorong Waktu Sejarah';
        accentColor = matchedWing.bannerColor || '#f59e0b';
      } else if (isCenter) {
        badge = 'ROTUNDA UTAMA';
        title = 'Meuligoe Agung & Monumen Halimon';
        subtitle = 'Titik Temu Kedaulatan & Persatuan 4 Era';
        category = 'Aula Pusat';
        accentColor = '#fbbf24';
      }

      // Determine slide direction based on target position relative to current player position
      const currX = playerPosition.current[0];
      const direction: 'left' | 'right' = pos[0] >= currX ? 'right' : 'left';

      setTransitionData({
        badge,
        title,
        subtitle,
        category,
        accentColor,
        direction,
      });

      // Synchronize lookAt camera rotation ref so subsequent mouse/touch drag continues seamlessly
      if (lookAt) {
        const dx = lookAt[0] - pos[0];
        const dz = lookAt[2] - pos[2];
        const targetYaw = Math.atan2(-dx, -dz);
        cameraRotation.current.yaw = targetYaw;
        cameraRotation.current.pitch = 0;
      }

      // Play cinematic harmonic swoosh
      audioGuide.playCinematicSwoosh();

      // Trigger phase 1: Fade-in & subtle slide
      setTransitionPhase('fade-in');

      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }

      // Phase 2: Start slide-away and fade-out at 380ms
      transitionTimerRef.current = window.setTimeout(() => {
        setTransitionPhase('fade-out');

        // Phase 3: Complete transition at 760ms
        transitionTimerRef.current = window.setTimeout(() => {
          setTransitionPhase('idle');
        }, 380);
      }, 380);
    },
    []
  );

  useEffect(() => {
    triggerTransitionRef.current = triggerCinematicTransition;
  }, [triggerCinematicTransition]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  // Check WebXR support
  useEffect(() => {
    if (
      typeof navigator !== 'undefined' &&
      'xr' in navigator &&
      (navigator as unknown as { xr: { isSessionSupported?: (mode: string) => Promise<boolean> } }).xr?.isSessionSupported
    ) {
      (navigator as unknown as { xr: { isSessionSupported: (mode: string) => Promise<boolean> } }).xr
        .isSessionSupported('immersive-vr')
        .then((supported) => setSupportsWebXR(supported))
        .catch(() => setSupportsWebXR(false));
    }
  }, []);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const setup = initMuseumScene(
      containerRef.current,
      EXHIBITS,
      (exhibitId) => {
        onSelectExhibit(exhibitId);
        onOpenInspector(exhibitId);
        audioGuide.playAcousticChime(659.25);
      },
      (hoveredId) => {
        if (hoveredId) {
          const found = EXHIBITS.find((e) => e.id === hoveredId) || null;
          setHoveredExhibit(found);
        } else {
          setHoveredExhibit(null);
        }
      },
      (pos, lookAt) => {
        triggerTransitionRef.current?.(pos, lookAt);
      }
    );

    sceneSetupRef.current = setup;

    // Movement controls loop
    let lastTime = performance.now();
    let animationFrameId: number;

    const gameLoop = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      setup.update(delta);

      // Handle WASD Keyboard walking (pause manual walking during automated camera teleportation)
      const camera = setup.camera;
      const speed = 6.5 * delta;

      const isWalking =
        keysPressed.current['KeyW'] || keysPressed.current['ArrowUp'] ||
        keysPressed.current['KeyS'] || keysPressed.current['ArrowDown'] ||
        keysPressed.current['KeyA'] || keysPressed.current['ArrowLeft'] ||
        keysPressed.current['KeyD'] || keysPressed.current['ArrowRight'];

      if (isWalking && !setup.isTeleporting()) {
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(camera.up, forward).normalize().negate();

        if (keysPressed.current['KeyW'] || keysPressed.current['ArrowUp']) {
          camera.position.addScaledVector(forward, speed);
        }
        if (keysPressed.current['KeyS'] || keysPressed.current['ArrowDown']) {
          camera.position.addScaledVector(forward, -speed);
        }
        if (keysPressed.current['KeyA'] || keysPressed.current['ArrowLeft']) {
          camera.position.addScaledVector(right, -speed);
        }
        if (keysPressed.current['KeyD'] || keysPressed.current['ArrowRight']) {
          camera.position.addScaledVector(right, speed);
        }
      }

      // Keep player eye height and clamp within museum perimeter (-28 to +28)
      camera.position.y = 1.6;
      camera.position.x = Math.max(-27, Math.min(27, camera.position.x));
      camera.position.z = Math.max(-27, Math.min(27, camera.position.z));
      playerPosition.current = [camera.position.x, camera.position.y, camera.position.z];

      // Proximity check to exhibits
      let closest: Exhibit | null = null;
      let minDistance = 4.5;

      for (const exhibit of EXHIBITS) {
        const dx = camera.position.x - exhibit.pedestalPosition[0];
        const dz = camera.position.z - exhibit.pedestalPosition[2];
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < minDistance) {
          minDistance = dist;
          closest = exhibit;
        }
      }
      setNearbyExhibit(closest);

      // Determine current wing in Aceh Institute Museum
      const px = camera.position.x;
      const pz = camera.position.z;
      if (Math.abs(px) < 8 && Math.abs(pz) < 8) {
        setCurrentWingName('Meuligoe Agung & Monumen Halimon');
      } else if (px < 0 && pz < 0) {
        setCurrentWingName('Sayap Daulat Kesultanan Aceh');
      } else if (px > 0 && pz < 0) {
        setCurrentWingName('Sayap Perang Semesta 1873-1911');
      } else if (px < 0 && pz > 0) {
        setCurrentWingName('Sayap Acheh Institute & Deklarasi 1976');
      } else {
        setCurrentWingName('Sayap Belantara & The Price of Freedom');
      }

      // Render stereoscopic or standard
      if (vrMode === 'stereoscopic') {
        const w = containerRef.current?.clientWidth || window.innerWidth;
        const h = containerRef.current?.clientHeight || window.innerHeight;
        const halfW = Math.floor(w / 2);

        setup.renderer.setScissorTest(true);

        // Left eye
        setup.renderer.setScissor(0, 0, halfW, h);
        setup.renderer.setViewport(0, 0, halfW, h);
        camera.position.x -= 0.035; // IPD pupil offset
        setup.renderer.render(setup.scene, camera);
        camera.position.x += 0.035;

        // Right eye
        setup.renderer.setScissor(halfW, 0, halfW, h);
        setup.renderer.setViewport(halfW, 0, halfW, h);
        camera.position.x += 0.035;
        setup.renderer.render(setup.scene, camera);
        camera.position.x -= 0.035;

        setup.renderer.setScissorTest(false);
      } else {
        setup.renderer.render(setup.scene, camera);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    // Keyboard handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = true;
      if (e.code === 'KeyE' && nearbyExhibit) {
        onSelectExhibit(nearbyExhibit.id);
        onOpenInspector(nearbyExhibit.id);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      setup.cleanup();
    };
  }, [vrMode, nearbyExhibit, onOpenInspector, onSelectExhibit]);

  // Handle external teleport requests
  useEffect(() => {
    if (teleportTarget && sceneSetupRef.current) {
      sceneSetupRef.current.teleportTo(teleportTarget.pos, teleportTarget.lookAt);
    }
  }, [teleportTarget]);

  // Mouse drag-to-look handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !sceneSetupRef.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };

    const sensitivity = 0.003;
    cameraRotation.current.yaw -= deltaX * sensitivity;
    cameraRotation.current.pitch -= deltaY * sensitivity;

    // Clamp pitch
    cameraRotation.current.pitch = Math.max(
      -Math.PI / 2.5,
      Math.min(Math.PI / 2.5, cameraRotation.current.pitch)
    );

    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.x = cameraRotation.current.pitch;
    euler.y = cameraRotation.current.yaw;
    sceneSetupRef.current.camera.quaternion.setFromEuler(euler);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Mobile Touch Drag-to-Look Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      const touch = e.touches[0];
      previousMousePosition.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !sceneSetupRef.current || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - previousMousePosition.current.x;
    const deltaY = touch.clientY - previousMousePosition.current.y;
    previousMousePosition.current = { x: touch.clientX, y: touch.clientY };

    const sensitivity = 0.0035;
    cameraRotation.current.yaw -= deltaX * sensitivity;
    cameraRotation.current.pitch -= deltaY * sensitivity;

    cameraRotation.current.pitch = Math.max(
      -Math.PI / 2.5,
      Math.min(Math.PI / 2.5, cameraRotation.current.pitch)
    );

    const euler = new THREE.Euler(0, 0, 0, 'YXZ');
    euler.x = cameraRotation.current.pitch;
    euler.y = cameraRotation.current.yaw;
    sceneSetupRef.current.camera.quaternion.setFromEuler(euler);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Virtual on-screen touch movement controls (for mobile exploration)
  const setVirtualMovement = (dir: 'forward' | 'backward' | 'left' | 'right', active: boolean) => {
    const keyMap = {
      forward: 'KeyW',
      backward: 'KeyS',
      left: 'KeyA',
      right: 'KeyD',
    };
    keysPressed.current[keyMap[dir]] = active;
  };

  return (
    <div
      id="museum-viewport-container"
      className="relative w-full h-full overflow-hidden select-none touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* 3D WebGL Canvas Injection with subtle cinematic slide & scale */}
      <div
        ref={containerRef}
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-all duration-700 ease-out ${
          transitionPhase === 'fade-in'
            ? transitionData?.direction === 'right'
              ? 'scale-[1.02] -translate-x-3 filter brightness-105'
              : 'scale-[1.02] translate-x-3 filter brightness-105'
            : transitionPhase === 'fade-out'
            ? 'scale-100 translate-x-0 filter brightness-100'
            : 'scale-100 translate-x-0 filter brightness-100'
        }`}
      />

      {/* Cinematic Fade and Slide Transition Layer */}
      <div
        id="museum-cinematic-transition-overlay"
        className={`absolute inset-0 z-40 pointer-events-none flex flex-col justify-between overflow-hidden transition-opacity duration-300 ease-in-out ${
          transitionPhase !== 'idle' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            transitionPhase !== 'idle'
              ? 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.45) 0%, rgba(10, 10, 15, 0.78) 100%)'
              : 'transparent',
          backdropFilter: transitionPhase !== 'idle' ? 'blur(3px)' : 'none',
          WebkitBackdropFilter: transitionPhase !== 'idle' ? 'blur(3px)' : 'none',
        }}
      >
        {/* Top Cinematic Letterbox Bar */}
        <div
          className={`w-full h-8 sm:h-12 bg-neutral-950/90 border-b border-amber-500/25 flex items-center justify-between px-4 sm:px-8 transition-transform duration-500 ease-out ${
            transitionPhase === 'fade-in' ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="flex items-center gap-2 text-[10px] sm:text-xs tracking-widest text-amber-400 font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>TRANSISI LORONG WAKTU</span>
          </div>
          <div className="text-[10px] sm:text-xs text-neutral-400 tracking-wider font-mono">
            ACEH INSTITUTE ARCHIVE
          </div>
        </div>

        {/* Center Cinematic Title Card & Sliding Light Streak */}
        <div className="flex-1 flex items-center justify-center p-4">
          {transitionData && (
            <div
              className={`relative max-w-md w-full bg-neutral-950/90 backdrop-blur-2xl border border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl text-center overflow-hidden transition-all duration-500 ${
                transitionPhase === 'fade-in'
                  ? 'opacity-100 scale-100 translate-y-0 translate-x-0'
                  : transitionPhase === 'fade-out'
                  ? transitionData.direction === 'right'
                    ? 'opacity-0 scale-95 translate-x-12 translate-y-1'
                    : 'opacity-0 scale-95 -translate-x-12 translate-y-1'
                  : 'opacity-0 scale-95 -translate-x-6'
              }`}
            >
              {/* Animated Anamorphic Light Streak Beam */}
              <div
                className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent transition-all duration-700 ${
                  transitionPhase === 'fade-in' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
              />

              {/* Badge & Category */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm"
                  style={{
                    backgroundColor: `${transitionData.accentColor}25`,
                    color: transitionData.accentColor,
                    border: `1px solid ${transitionData.accentColor}60`,
                  }}
                >
                  <Sparkles className="w-3 h-3 animate-spin" />
                  {transitionData.badge}
                </span>
              </div>

              {/* Destination Name */}
              <h2 className="text-lg sm:text-2xl font-bold text-white font-serif tracking-tight mb-1.5">
                {transitionData.title}
              </h2>

              {/* Subtitle / Era Description */}
              <p className="text-xs sm:text-sm text-neutral-300 font-medium max-w-sm mx-auto line-clamp-2">
                {transitionData.subtitle}
              </p>

              {/* Subtle sliding indicator dot stream */}
              <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] text-amber-200/80 font-mono tracking-wider">
                  Menuju Titik Eksplorasi...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Cinematic Letterbox Bar */}
        <div
          className={`w-full h-8 sm:h-12 bg-neutral-950/90 border-t border-amber-500/25 flex items-center justify-center px-4 sm:px-8 transition-transform duration-500 ease-out ${
            transitionPhase === 'fade-in' ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="text-[10px] sm:text-xs text-neutral-400 tracking-wider font-mono">
            GERAKAN KAMERA KINEMATIK • MENJELAJAHI BUKTI SEJARAH
          </div>
        </div>
      </div>

      {/* VR Stereoscopic Center Divider */}
      {vrMode === 'stereoscopic' && (
        <div className="absolute inset-0 pointer-events-none flex">
          <div className="w-1/2 h-full border-r-2 border-black/80 flex items-center justify-center">
            {/* Left eye reticle */}
            <div className="w-2.5 h-2.5 rounded-full border border-amber-400/80 bg-amber-500/30" />
          </div>
          <div className="w-1/2 h-full flex items-center justify-center">
            {/* Right eye reticle */}
            <div className="w-2.5 h-2.5 rounded-full border border-amber-400/80 bg-amber-500/30" />
          </div>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-neutral-900/90 text-amber-300 font-mono text-[11px] sm:text-xs border border-amber-500/40 text-center max-w-[90vw]">
            Mode Stereoskopik VR (Gunakan Headset / Cardboard)
          </div>
        </div>
      )}

      {/* Top Header HUD: Museum Title & Current Hall */}
      <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 z-20 pointer-events-none flex items-center gap-2 sm:gap-3 max-w-[calc(100vw-110px)] sm:max-w-none">
        <div className="bg-neutral-950/85 backdrop-blur-md px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-xl flex items-center gap-2 sm:gap-3 pointer-events-auto min-w-0">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-neutral-950 shadow-md shrink-0">
            <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] tracking-wider uppercase font-bold text-amber-400 truncate">
              Aceh Institute Archive
            </div>
            <h1 className="text-xs sm:text-base font-bold text-neutral-100 font-serif truncate">
              Museum Kemerdekaan
            </h1>
          </div>
        </div>

        {/* Current Wing Badge */}
        <div className="hidden md:flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-medium text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="truncate max-w-[200px]">{currentWingName}</span>
        </div>

        {/* Lorong Waktu Chronos Badge */}
        <div className="hidden lg:flex items-center gap-1.5 bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-400/40 text-xs font-semibold text-amber-200 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>Lorong Waktu 4 Era</span>
        </div>
      </div>

      {/* Top Right Controls: Graphic Quality, VR Mode & Soundscape Toggle */}
      <div className="absolute top-2.5 sm:top-4 right-2.5 sm:right-4 z-20 flex items-center gap-1.5 sm:gap-2">
        {/* Graphics Performance Switcher */}
        <button
          id="btn-toggle-quality"
          onClick={() => {
            const nextQ: GraphicQuality = graphicQuality === 'balanced' ? 'fast' : graphicQuality === 'fast' ? 'high' : 'balanced';
            setGraphicQuality(nextQ);
            sceneSetupRef.current?.setQuality(nextQ);
          }}
          title="Ubah Mode Kualitas Grafis (Cepat / Seimbang / Tinggi)"
          className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-all border min-h-[38px] sm:min-h-[40px] ${
            graphicQuality === 'fast'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : graphicQuality === 'balanced'
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
              : 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline font-mono">
            {graphicQuality === 'fast' ? 'Cepat (60 FPS)' : graphicQuality === 'balanced' ? 'Seimbang' : 'Ultra'}
          </span>
        </button>

        <button
          id="btn-toggle-ambience"
          onClick={onToggleAmbientSound}
          title="Nyalakan / Matikan Suara Lingkungan Rimba & Tradisional"
          className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 sm:gap-2 backdrop-blur-md transition-all border min-h-[38px] sm:min-h-[40px] ${
            ambientSoundEnabled
              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
              : 'bg-neutral-900/80 border-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          {ambientSoundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden md:inline">
            {ambientSoundEnabled ? 'Akustik Aktif' : 'Akustik Hening'}
          </span>
        </button>

        <button
          id="btn-toggle-vr"
          onClick={onToggleVR}
          title="Aktifkan Mode Realitas Virtual (Dual Lens VR)"
          className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 sm:gap-2 backdrop-blur-md transition-all border min-h-[38px] sm:min-h-[40px] ${
            vrMode === 'stereoscopic'
              ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/20'
              : 'bg-neutral-900/80 border-white/10 text-neutral-300 hover:text-white hover:border-amber-400'
          }`}
        >
          <Glasses className="w-4 h-4 text-amber-400" />
          <span className="hidden xs:inline">{vrMode === 'stereoscopic' ? 'Keluar VR' : 'Mode VR'}</span>
        </button>
      </div>

      {/* Mobile Virtual Touch Walking D-Pad (Visible on small screens / touch devices) */}
      <div className="absolute bottom-20 sm:bottom-24 right-3 sm:right-6 z-20 flex flex-col items-center gap-1 pointer-events-auto md:hidden select-none opacity-90 hover:opacity-100 transition-opacity">
        {/* Forward */}
        <button
          id="btn-touch-walk-forward"
          onTouchStart={(e) => {
            e.stopPropagation();
            setVirtualMovement('forward', true);
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            setVirtualMovement('forward', false);
          }}
          onMouseDown={() => setVirtualMovement('forward', true)}
          onMouseUp={() => setVirtualMovement('forward', false)}
          className="w-10 h-10 rounded-xl bg-neutral-900/80 active:bg-amber-500/60 border border-neutral-700 active:border-amber-400 text-amber-400 flex items-center justify-center backdrop-blur-md shadow-lg transition-all"
          title="Maju ke depan"
        >
          <span className="text-xs font-bold">▲</span>
        </button>

        {/* Middle row: Left & Right */}
        <div className="flex items-center gap-1">
          <button
            id="btn-touch-walk-left"
            onTouchStart={(e) => {
              e.stopPropagation();
              setVirtualMovement('left', true);
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              setVirtualMovement('left', false);
            }}
            onMouseDown={() => setVirtualMovement('left', true)}
            onMouseUp={() => setVirtualMovement('left', false)}
            className="w-10 h-10 rounded-xl bg-neutral-900/80 active:bg-amber-500/60 border border-neutral-700 active:border-amber-400 text-amber-400 flex items-center justify-center backdrop-blur-md shadow-lg transition-all"
            title="Geser ke kiri"
          >
            <span className="text-xs font-bold">◄</span>
          </button>

          {/* Quick Center Teleport icon in D-pad center */}
          <button
            id="btn-touch-walk-center"
            onClick={(e) => {
              e.stopPropagation();
              sceneSetupRef.current?.teleportTo([0, 1.6, 0]);
            }}
            className="w-10 h-10 rounded-xl bg-amber-500/20 active:bg-amber-500/50 border border-amber-500/40 text-amber-300 flex items-center justify-center backdrop-blur-md shadow-lg transition-all"
            title="Kembali ke Aula Pusat"
          >
            <Compass className="w-4 h-4" />
          </button>

          <button
            id="btn-touch-walk-right"
            onTouchStart={(e) => {
              e.stopPropagation();
              setVirtualMovement('right', true);
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              setVirtualMovement('right', false);
            }}
            onMouseDown={() => setVirtualMovement('right', true)}
            onMouseUp={() => setVirtualMovement('right', false)}
            className="w-10 h-10 rounded-xl bg-neutral-900/80 active:bg-amber-500/60 border border-neutral-700 active:border-amber-400 text-amber-400 flex items-center justify-center backdrop-blur-md shadow-lg transition-all"
            title="Geser ke kanan"
          >
            <span className="text-xs font-bold">►</span>
          </button>
        </div>

        {/* Backward */}
        <button
          id="btn-touch-walk-backward"
          onTouchStart={(e) => {
            e.stopPropagation();
            setVirtualMovement('backward', true);
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            setVirtualMovement('backward', false);
          }}
          onMouseDown={() => setVirtualMovement('backward', true)}
          onMouseUp={() => setVirtualMovement('backward', false)}
          className="w-10 h-10 rounded-xl bg-neutral-900/80 active:bg-amber-500/60 border border-neutral-700 active:border-amber-400 text-amber-400 flex items-center justify-center backdrop-blur-md shadow-lg transition-all"
          title="Mundur ke belakang"
        >
          <span className="text-xs font-bold">▼</span>
        </button>
      </div>

      {/* Proximity Interaction Prompt (Walked near an exhibit) */}
      {nearbyExhibit && (
        <div className="absolute bottom-20 sm:bottom-28 left-1/2 -translate-x-1/2 z-20 animate-fade-in pointer-events-auto w-[92vw] max-w-md">
          <div className="bg-neutral-950/95 backdrop-blur-xl border-2 border-amber-500/70 text-white p-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="min-w-0">
                <div className="text-[9px] sm:text-[10px] text-amber-400 uppercase tracking-wider font-bold truncate">
                  Artefak Bersejarah Ditemukan
                </div>
                <div className="text-xs sm:text-sm font-bold text-neutral-100 truncate">{nearbyExhibit.name}</div>
                <div className="text-[10px] sm:text-xs text-neutral-400 truncate">{nearbyExhibit.year} • {nearbyExhibit.era}</div>
              </div>
            </div>

            <button
              id={`btn-inspect-${nearbyExhibit.id}`}
              onClick={() => {
                onSelectExhibit(nearbyExhibit.id);
                onOpenInspector(nearbyExhibit.id);
              }}
              className="px-3 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 shrink-0 min-h-[38px]"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Periksa</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-neutral-900/30 rounded border border-neutral-900/40">
                E
              </kbd>
            </button>
          </div>
        </div>
      )}

      {/* Floating Hover Info Card */}
      {hoveredExhibit && !nearbyExhibit && (
        <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none animate-fade-in max-w-[90vw]">
          <div className="bg-neutral-900/85 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-white/10 text-center shadow-lg">
            <div className="text-xs font-bold text-amber-300 truncate">{hoveredExhibit.name}</div>
            <div className="text-[10px] sm:text-[11px] text-neutral-400">{hoveredExhibit.year} • Sentuh/Klik untuk mendekat</div>
          </div>
        </div>
      )}

      {/* Navigation Walk HUD Hint (Desktop only) */}
      <div className="absolute bottom-4 right-4 z-10 hidden lg:flex items-center gap-2 bg-neutral-950/70 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/10 text-[11px] text-neutral-400">
        <Move className="w-3.5 h-3.5 text-amber-400" />
        <span>Gunakan <strong>W A S D</strong> / Tombol Panah untuk berjalan, Klik & Geser untuk memutar pandangan</span>
      </div>
    </div>
  );
};
