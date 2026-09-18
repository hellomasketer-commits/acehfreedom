import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createArtifactMesh } from '../services/museum3d';
import { audioGuide } from '../services/audioGuide';
import { Exhibit } from '../types/museum';
import {
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Clock,
  Sparkles,
  Layers,
  MapPin,
  Calendar,
  CheckCircle2,
  Award,
  BookOpen,
  Volume2,
  FileText,
  Quote,
} from 'lucide-react';

interface ExhibitInspectorProps {
  exhibit: Exhibit;
  onClose: () => void;
  onStampPassport: (exhibitId: string) => void;
  isStamped: boolean;
  onPlayAudio: (exhibit: Exhibit) => void;
  onPauseAudio: () => void;
  isAudioPlaying: boolean;
  audioProgress: number;
  audioCurrentTime: number;
}

export const ExhibitInspector: React.FC<ExhibitInspectorProps> = ({
  exhibit,
  onClose,
  onStampPassport,
  isStamped,
  onPlayAudio,
  onPauseAudio,
  isAudioPlaying,
  audioProgress,
  audioCurrentTime,
}) => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'diary' | 'xray' | 'timeline'>('overview');
  const [stampFeedback, setStampFeedback] = useState(false);

  // 3D Canvas Orbit State
  const isDraggingRef = useRef(false);
  const previousMousePosRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.1, y: 0 });
  const zoomRef = useRef(2.8);

  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const width = canvasContainerRef.current.clientWidth || 500;
    const height = canvasContainerRef.current.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0e13);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0.8, zoomRef.current);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;

    canvasContainerRef.current.innerHTML = '';
    canvasContainerRef.current.appendChild(renderer.domElement);

    // Studio Lighting for high artifact detail
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.2);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfef08a, 1.8);
    rimLight.position.set(0, -3, -3);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Load artifact 3D mesh
    const artifactMesh = createArtifactMesh(exhibit.meshType);
    artifactMesh.position.set(0, -0.5, 0);
    scene.add(artifactMesh);

    // Floating circular display base
    const basePlate = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.3, 0.08, 32),
      new THREE.MeshStandardMaterial({
        color: 0x1f1e26,
        metalness: 0.6,
        roughness: 0.3,
      })
    );
    basePlate.position.set(0, -0.55, 0);
    scene.add(basePlate);

    const glowRing = new THREE.Mesh(
      new THREE.RingGeometry(1.22, 1.28, 32),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(exhibit.accentColor), side: THREE.DoubleSide })
    );
    glowRing.rotation.x = -Math.PI / 2;
    glowRing.position.set(0, -0.5, 0);
    scene.add(glowRing);

    // Render loop
    let animId: number;
    const renderLoop = () => {
      // Gentle idle turntable rotation when not dragged
      if (!isDraggingRef.current) {
        rotationRef.current.y += 0.005;
      }

      artifactMesh.rotation.y = rotationRef.current.y;
      artifactMesh.rotation.x = rotationRef.current.x;

      camera.position.z = zoomRef.current;
      renderer.render(scene, camera);
      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    // Mouse Drag events
    const el = renderer.domElement;
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - previousMousePosRef.current.x;
      const dy = e.clientY - previousMousePosRef.current.y;
      previousMousePosRef.current = { x: e.clientX, y: e.clientY };

      rotationRef.current.y += dx * 0.01;
      rotationRef.current.x = Math.max(-0.5, Math.min(0.5, rotationRef.current.x + dy * 0.01));
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomRef.current = Math.max(1.4, Math.min(4.5, zoomRef.current + e.deltaY * 0.002));
    };

    // Mobile Touch Drag & Pinch-to-Zoom
    let initialPinchDistance = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        isDraggingRef.current = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistance = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        const dx = e.touches[0].clientX - previousMousePosRef.current.x;
        const dy = e.touches[0].clientY - previousMousePosRef.current.y;
        previousMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        rotationRef.current.y += dx * 0.015;
        rotationRef.current.x = Math.max(-0.5, Math.min(0.5, rotationRef.current.x + dy * 0.015));
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.hypot(dx, dy);
        if (initialPinchDistance > 0) {
          const delta = (initialPinchDistance - currentDistance) * 0.005;
          zoomRef.current = Math.max(1.4, Math.min(4.5, zoomRef.current + delta));
          initialPinchDistance = currentDistance;
        }
      }
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      initialPinchDistance = 0;
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('wheel', onWheel);

      el.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, [exhibit]);

  const handleResetView = () => {
    rotationRef.current = { x: 0.1, y: 0 };
    zoomRef.current = 2.8;
  };

  const handleZoom = (delta: number) => {
    zoomRef.current = Math.max(1.4, Math.min(4.5, zoomRef.current + delta));
  };

  const handleStamp = () => {
    onStampPassport(exhibit.id);
    audioGuide.playAcousticChime(880);
    setStampFeedback(true);
    setTimeout(() => setStampFeedback(false), 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-fade-in select-none">
      <div className="relative w-full max-w-5xl max-h-[92vh] sm:max-h-[88vh] bg-neutral-900 border border-amber-500/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          id="btn-close-inspector"
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 p-2 sm:p-2.5 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-white/10 transition-colors shadow-lg"
          title="Tutup Inspektur"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* LEFT COLUMN: 3D Model Interactive Showcase */}
        <div className="relative w-full md:w-1/2 h-[220px] sm:h-[300px] md:h-auto min-h-[200px] bg-gradient-to-b from-[#181620] to-[#0d0c11] flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-800 shrink-0">
          <div ref={canvasContainerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

          {/* 3D Floating Toolstrip */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 bg-neutral-950/85 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10 shadow-lg text-xs text-neutral-300">
            <button
              onClick={handleResetView}
              className="p-1 sm:p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-amber-400 transition-colors"
              title="Reset Orientasi"
            >
              <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <div className="w-[1px] h-3.5 sm:h-4 bg-neutral-700" />
            <button
              onClick={() => handleZoom(-0.4)}
              className="p-1 sm:p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => handleZoom(0.4)}
              className="p-1 sm:p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <span className="text-[10px] sm:text-[11px] text-neutral-400 px-1 hidden xs:inline">Putar 360°</span>
          </div>

          {/* Era & Year Badge */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-1">
            <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {exhibit.era}
            </span>
            <span className="text-[11px] sm:text-xs font-mono text-neutral-400 pl-1">{exhibit.year}</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Curatorial Records, Diary Excerpts & Audio */}
        <div className="w-full md:w-1/2 flex flex-col flex-1 min-h-0 overflow-hidden bg-neutral-900/90">
          {/* Header */}
          <div className="p-4 sm:p-5 md:p-6 border-b border-neutral-800 shrink-0">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              {exhibit.nativeTitle}
            </div>
            <h2 className="text-xl md:text-2xl font-serif font-bold text-neutral-100 mt-1">
              {exhibit.name}
            </h2>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-neutral-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                <span>{exhibit.provenance}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-neutral-600" />
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                <span>{exhibit.year}</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-neutral-800 px-5 gap-2 bg-neutral-950/40">
            <button
              id="tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
                activeTab === 'overview'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Kuratorial
            </button>

            {exhibit.diaryQuote && (
              <button
                id="tab-diary"
                onClick={() => setActiveTab('diary')}
                className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-all ${
                  activeTab === 'diary'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Quote className="w-3.5 h-3.5 text-amber-500" />
                <span>Diari Hasan Tiro</span>
              </button>
            )}

            <button
              id="tab-xray"
              onClick={() => setActiveTab('xray')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-all ${
                activeTab === 'xray'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Analisis Fisik</span>
            </button>

            <button
              id="tab-timeline"
              onClick={() => setActiveTab('timeline')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-all ${
                activeTab === 'timeline'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Garis Waktu</span>
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4 text-neutral-300 text-sm">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <p className="leading-relaxed text-neutral-200 font-sans">
                  {exhibit.curatorNotes}
                </p>

                {/* Key Attributes Box */}
                <div className="grid grid-cols-2 gap-3 bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800 text-xs">
                  <div>
                    <span className="text-neutral-500 block uppercase font-mono text-[10px]">Material</span>
                    <span className="font-semibold text-neutral-200">{exhibit.material}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block uppercase font-mono text-[10px]">Dimensi</span>
                    <span className="font-semibold text-neutral-200">{exhibit.dimensions}</span>
                  </div>
                </div>

                {/* Highlight details bullet points */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold text-neutral-400 tracking-wider">
                    Aspek Kunci & Fakta Sejarah
                  </h4>
                  <ul className="space-y-2">
                    {exhibit.highlightDetails.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'diary' && exhibit.diaryQuote && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/40 relative">
                  <Quote className="w-8 h-8 text-amber-500/30 absolute top-3 right-3 pointer-events-none" />
                  <div className="text-xs font-mono font-bold text-amber-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Catatan Harian: {exhibit.diaryQuote.date}</span>
                  </div>
                  <p className="mt-3 text-sm italic font-serif text-amber-100/90 leading-relaxed border-l-2 border-amber-500 pl-3">
                    "{exhibit.diaryQuote.text}"
                  </p>
                  {exhibit.diaryQuote.pageRef && (
                    <div className="mt-2 text-[11px] font-mono text-neutral-400 text-right">
                      {exhibit.diaryQuote.pageRef}
                    </div>
                  )}
                </div>

                <div className="bg-neutral-950/50 p-3.5 rounded-2xl border border-neutral-800 text-xs text-neutral-300 leading-relaxed">
                  <span className="font-bold text-amber-300 block mb-1">
                    Konteks Buku "The Price of Freedom" (1984):
                  </span>
                  Ditulis langsung oleh Hasan di Tiro saat hidup di rimba belantara Aceh. Setiap catatan harian merefleksikan perjumpaan emosional dengan rakyat, keputusan perang dan diplomasi, serta cita-cita kemerdekaan bangsa Aceh.
                </div>
              </div>
            )}

            {activeTab === 'xray' && (
              <div className="space-y-3 animate-fade-in">
                <div className="text-xs text-neutral-400">
                  Kajian struktur arkeologis, bahan baku, dan keotentikan fisik artefak sejarah.
                </div>
                {exhibit.xrayFeatures.map((feat, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                    <div className="flex items-center gap-2 font-bold text-amber-300 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{feat.title}</span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-300 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-800 animate-fade-in">
                {exhibit.timeline.map((event, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-neutral-900" />
                    <div className="text-xs font-mono font-bold text-amber-400">{event.year}</div>
                    <div className="text-xs font-bold text-neutral-100">{event.title}</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">{event.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer: Audio Guide Controller & Passport Stamp */}
          <div className="p-4 md:p-5 border-t border-neutral-800 bg-neutral-950 flex flex-col gap-3">
            {/* Audio narration player inline */}
            <div className="flex items-center gap-3 bg-neutral-900/90 p-2.5 rounded-2xl border border-neutral-800">
              <button
                id="btn-inspector-play-audio"
                onClick={() => (isAudioPlaying ? onPauseAudio() : onPlayAudio(exhibit))}
                className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0"
                title={isAudioPlaying ? 'Jeda Audio' : 'Dengarkan Narasi Audio'}
              >
                {isAudioPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[11px] font-medium text-neutral-300">
                  <span className="truncate">Panduan Suara Kuratorial</span>
                  <span className="font-mono text-neutral-400">
                    {Math.round(audioCurrentTime)}s / {exhibit.audioDurationSeconds}s
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-200"
                    style={{ width: `${Math.round(audioProgress * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Passport Stamp Action Button */}
            <div className="flex items-center justify-between gap-3">
              <button
                id="btn-stamp-passport"
                onClick={handleStamp}
                disabled={isStamped}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isStamped
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-lg active:scale-95'
                }`}
              >
                {isStamped ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Telah Masuk Paspor Arsip</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Stempel Paspor Museum Aceh</span>
                  </>
                )}
              </button>

              {stampFeedback && (
                <span className="text-xs text-amber-400 font-bold animate-bounce flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Terstempel!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
