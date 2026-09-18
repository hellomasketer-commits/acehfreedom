import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EXHIBITS, MUSEUM_WINGS } from '../data/exhibits';
import { audioGuide } from '../services/audioGuide';
import { initMuseumScene, MuseumSceneSetup } from '../services/museum3d';
import { Exhibit, VRMode } from '../types/museum';
import { Compass, Eye, Headphones, Sparkles, Volume2, VolumeX, Move, Glasses, BookOpen } from 'lucide-react';

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

      // Handle WASD Keyboard walking
      const camera = setup.camera;
      const speed = 6.5 * delta;

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
      audioGuide.playAcousticChime(523.25);
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

  return (
    <div
      id="museum-viewport-container"
      className="relative w-full h-full overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 3D WebGL Canvas Injection */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

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
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-neutral-900/90 text-amber-300 font-mono text-xs border border-amber-500/40">
            Mode Stereoskopik VR (Gunakan Headset / Cardboard)
          </div>
        </div>
      )}

      {/* Top Header HUD: Museum Title & Current Hall */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-3">
        <div className="bg-neutral-950/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-500/30 shadow-xl flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-neutral-950 shadow-md">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] tracking-wider uppercase font-bold text-amber-400">
              Aceh Institute Virtual Archive
            </div>
            <h1 className="text-sm sm:text-base font-bold text-neutral-100 font-serif">
              Museum Kemerdekaan Aceh
            </h1>
          </div>
        </div>

        {/* Current Wing Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-xs font-medium text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>{currentWingName}</span>
        </div>
      </div>

      {/* Top Right Controls: VR Mode & Soundscape Toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          id="btn-toggle-ambience"
          onClick={onToggleAmbientSound}
          title="Nyalakan / Matikan Suara Lingkungan Rimba & Tradisional"
          className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 backdrop-blur-md transition-all border ${
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
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 backdrop-blur-md transition-all border ${
            vrMode === 'stereoscopic'
              ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/20'
              : 'bg-neutral-900/80 border-white/10 text-neutral-300 hover:text-white hover:border-amber-400'
          }`}
        >
          <Glasses className="w-4 h-4 text-amber-400" />
          <span>{vrMode === 'stereoscopic' ? 'Keluar VR' : 'Mode VR'}</span>
        </button>
      </div>

      {/* Proximity Interaction Prompt (Walked near an exhibit) */}
      {nearbyExhibit && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 animate-fade-in pointer-events-auto">
          <div className="bg-neutral-950/90 backdrop-blur-xl border-2 border-amber-500/70 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Eye className="w-5 h-5" />
            </div>

            <div>
              <div className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">
                Artefak Bersejarah Ditemukan
              </div>
              <div className="text-sm sm:text-base font-bold text-neutral-100">{nearbyExhibit.name}</div>
              <div className="text-xs text-neutral-400">{nearbyExhibit.year} • {nearbyExhibit.era}</div>
            </div>

            <button
              id={`btn-inspect-${nearbyExhibit.id}`}
              onClick={() => {
                onSelectExhibit(nearbyExhibit.id);
                onOpenInspector(nearbyExhibit.id);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Periksa & Dengarkan</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-neutral-900/30 rounded border border-neutral-900/40">
                E
              </kbd>
            </button>
          </div>
        </div>
      )}

      {/* Floating Hover Info Card */}
      {hoveredExhibit && !nearbyExhibit && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none animate-fade-in">
          <div className="bg-neutral-900/85 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-center shadow-lg">
            <div className="text-xs font-bold text-amber-300">{hoveredExhibit.name}</div>
            <div className="text-[11px] text-neutral-400">{hoveredExhibit.year} • Klik untuk mendekat</div>
          </div>
        </div>
      )}

      {/* Navigation Walk HUD Hint */}
      <div className="absolute bottom-4 right-4 z-10 hidden lg:flex items-center gap-2 bg-neutral-950/70 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/10 text-[11px] text-neutral-400">
        <Move className="w-3.5 h-3.5 text-amber-400" />
        <span>Gunakan <strong>W A S D</strong> / Tombol Panah untuk berjalan, Klik & Geser untuk memutar pandangan</span>
      </div>
    </div>
  );
};
