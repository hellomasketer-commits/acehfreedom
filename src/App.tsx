import React, { useState, useEffect, useCallback } from 'react';
import { EXHIBITS, GUIDED_TOURS, MUSEUM_WINGS } from './data/exhibits';
import { audioGuide } from './services/audioGuide';
import { Exhibit, GuidedTour, VRMode, WingInfo } from './types/museum';
import { MuseumViewport } from './components/MuseumViewport';
import { ExhibitInspector } from './components/ExhibitInspector';
import { AudioPlayerDrawer } from './components/AudioPlayerDrawer';
import { MuseumControls } from './components/MuseumControls';
import { PassportModal } from './components/PassportModal';
import { TourGuideOverlay } from './components/TourGuideOverlay';
import { Compass, Sparkles, BookOpen, Headphones, Glasses, Volume2, X, Award, ChevronRight } from 'lucide-react';

export default function App() {
  // Navigation & Exhibit State
  const [activeExhibitId, setActiveExhibitId] = useState<string | null>(null);
  const [inspectingExhibitId, setInspectingExhibitId] = useState<string | null>(null);
  const [stampedExhibitIds, setStampedExhibitIds] = useState<string[]>(['cap_sikureueng']);
  const [showPassport, setShowPassport] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  // Teleportation target state
  const [teleportTarget, setTeleportTarget] = useState<{
    pos: [number, number, number];
    lookAt?: [number, number, number];
  } | null>(null);

  // Audio Guide State
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [voiceStyle, setVoiceStyle] = useState<'curator' | 'storyteller' | 'archivist'>('curator');
  const [audioSpeed, setAudioSpeed] = useState(1.0);
  const [ambientSoundEnabled, setAmbientSoundEnabled] = useState(true);

  // VR & Tour State
  const [vrMode, setVrMode] = useState<VRMode>('none');
  const [activeTour, setActiveTour] = useState<GuidedTour | null>(null);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  const activeExhibit = EXHIBITS.find((e) => e.id === activeExhibitId) || null;
  const inspectingExhibit = EXHIBITS.find((e) => e.id === inspectingExhibitId) || null;

  // Start Audio Narration for an exhibit
  const handlePlayAudio = useCallback(
    (exhibit: Exhibit) => {
      setActiveExhibitId(exhibit.id);
      setIsAudioPlaying(true);
      setAudioProgress(0);
      setAudioCurrentTime(0);

      // Play period-accurate ambience if enabled
      if (ambientSoundEnabled) {
        audioGuide.startAmbientSoundscape(exhibit.ambienceTheme);
      }

      audioGuide.playNarration(
        exhibit.audioNarration,
        exhibit.audioDurationSeconds,
        voiceStyle,
        audioSpeed,
        (current, progress) => {
          setAudioCurrentTime(current);
          setAudioProgress(progress);
        },
        () => {
          setIsAudioPlaying(false);
          setAudioProgress(1);
          setAudioCurrentTime(exhibit.audioDurationSeconds);

          // If on a tour, auto advance next tour stop after 2s
          if (activeTour && tourStepIndex < activeTour.stops.length - 1) {
            setTimeout(() => {
              handleNextTourStop();
            }, 2000);
          }
        }
      );
    },
    [voiceStyle, audioSpeed, ambientSoundEnabled, activeTour, tourStepIndex]
  );

  const handlePauseAudio = useCallback(() => {
    setIsAudioPlaying(false);
    audioGuide.pauseNarration();
  }, []);

  const handleResumeAudio = useCallback(() => {
    if (activeExhibit) {
      if (audioProgress >= 1 || audioCurrentTime === 0) {
        handlePlayAudio(activeExhibit);
      } else {
        setIsAudioPlaying(true);
        audioGuide.resumeNarration();
      }
    } else {
      // Pick first exhibit
      handlePlayAudio(EXHIBITS[0]);
    }
  }, [activeExhibit, audioProgress, audioCurrentTime, handlePlayAudio]);

  const handleSeekAudio = (fraction: number) => {
    if (activeExhibit) {
      setAudioProgress(fraction);
      setAudioCurrentTime(fraction * activeExhibit.audioDurationSeconds);
    }
  };

  const handleNextExhibit = () => {
    const currentIndex = EXHIBITS.findIndex((e) => e.id === activeExhibitId);
    const nextIdx = (currentIndex + 1) % EXHIBITS.length;
    const nextExhibit = EXHIBITS[nextIdx];
    setActiveExhibitId(nextExhibit.id);
    handlePlayAudio(nextExhibit);
    setTeleportTarget({
      pos: [nextExhibit.pedestalPosition[0], 1.6, nextExhibit.pedestalPosition[2] + 2.8],
      lookAt: [nextExhibit.pedestalPosition[0], 1.2, nextExhibit.pedestalPosition[2]],
    });
  };

  const handlePrevExhibit = () => {
    const currentIndex = EXHIBITS.findIndex((e) => e.id === activeExhibitId);
    const prevIdx = (currentIndex - 1 + EXHIBITS.length) % EXHIBITS.length;
    const prevExhibit = EXHIBITS[prevIdx];
    setActiveExhibitId(prevExhibit.id);
    handlePlayAudio(prevExhibit);
    setTeleportTarget({
      pos: [prevExhibit.pedestalPosition[0], 1.6, prevExhibit.pedestalPosition[2] + 2.8],
      lookAt: [prevExhibit.pedestalPosition[0], 1.2, prevExhibit.pedestalPosition[2]],
    });
  };

  // Stamp Passport
  const handleStampPassport = (exhibitId: string) => {
    if (!stampedExhibitIds.includes(exhibitId)) {
      setStampedExhibitIds((prev) => [...prev, exhibitId]);
    }
  };

  // Ambient sound toggle
  const handleToggleAmbientSound = () => {
    if (ambientSoundEnabled) {
      audioGuide.stopAmbientSoundscape();
      setAmbientSoundEnabled(false);
    } else {
      setAmbientSoundEnabled(true);
      const theme = activeExhibit ? activeExhibit.ambienceTheme : 'seurune';
      audioGuide.startAmbientSoundscape(theme);
    }
  };

  // Toggle VR Mode
  const handleToggleVR = () => {
    setVrMode((prev) => (prev === 'none' ? 'stereoscopic' : 'none'));
    audioGuide.playAcousticChime(659.25);
  };

  // Guided Tour handlers
  const handleStartTour = (tour: GuidedTour) => {
    setActiveTour(tour);
    setTourStepIndex(0);
    const firstExhibitId = tour.stops[0];
    const firstExhibit = EXHIBITS.find((e) => e.id === firstExhibitId);
    if (firstExhibit) {
      setActiveExhibitId(firstExhibit.id);
      handlePlayAudio(firstExhibit);
      setTeleportTarget({
        pos: [firstExhibit.pedestalPosition[0], 1.6, firstExhibit.pedestalPosition[2] + 2.8],
        lookAt: [firstExhibit.pedestalPosition[0], 1.2, firstExhibit.pedestalPosition[2]],
      });
    }
  };

  const handleNextTourStop = () => {
    if (!activeTour) return;
    if (tourStepIndex < activeTour.stops.length - 1) {
      const nextIndex = tourStepIndex + 1;
      setTourStepIndex(nextIndex);
      const nextExhibitId = activeTour.stops[nextIndex];
      const nextExhibit = EXHIBITS.find((e) => e.id === nextExhibitId);
      if (nextExhibit) {
        setActiveExhibitId(nextExhibit.id);
        handlePlayAudio(nextExhibit);
        setTeleportTarget({
          pos: [nextExhibit.pedestalPosition[0], 1.6, nextExhibit.pedestalPosition[2] + 2.8],
          lookAt: [nextExhibit.pedestalPosition[0], 1.2, nextExhibit.pedestalPosition[2]],
        });
      }
    }
  };

  const handlePrevTourStop = () => {
    if (!activeTour) return;
    if (tourStepIndex > 0) {
      const prevIndex = tourStepIndex - 1;
      setTourStepIndex(prevIndex);
      const prevExhibitId = activeTour.stops[prevIndex];
      const prevExhibit = EXHIBITS.find((e) => e.id === prevExhibitId);
      if (prevExhibit) {
        setActiveExhibitId(prevExhibit.id);
        handlePlayAudio(prevExhibit);
        setTeleportTarget({
          pos: [prevExhibit.pedestalPosition[0], 1.6, prevExhibit.pedestalPosition[2] + 2.8],
          lookAt: [prevExhibit.pedestalPosition[0], 1.2, prevExhibit.pedestalPosition[2]],
        });
      }
    }
  };

  const handleExitTour = () => {
    setActiveTour(null);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.code === 'KeyV') {
        handleToggleVR();
      } else if (e.code === 'KeyP') {
        setShowPassport((prev) => !prev);
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (isAudioPlaying) {
          handlePauseAudio();
        } else {
          handleResumeAudio();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAudioPlaying, handlePauseAudio, handleResumeAudio]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 font-sans text-neutral-100 select-none">
      {/* 3D Museum Canvas Viewport */}
      <MuseumViewport
        onSelectExhibit={(exhibitId) => setActiveExhibitId(exhibitId)}
        onOpenInspector={(exhibitId) => setInspectingExhibitId(exhibitId)}
        activeExhibitId={activeExhibitId}
        vrMode={vrMode}
        onToggleVR={handleToggleVR}
        ambientSoundEnabled={ambientSoundEnabled}
        onToggleAmbientSound={handleToggleAmbientSound}
        teleportTarget={teleportTarget}
      />

      {/* Guided Tour Active HUD Banner */}
      {activeTour && (
        <TourGuideOverlay
          tour={activeTour}
          currentStepIndex={tourStepIndex}
          onNextStop={handleNextTourStop}
          onPrevStop={handlePrevTourStop}
          onExitTour={handleExitTour}
          onOpenInspector={(exhibitId) => setInspectingExhibitId(exhibitId)}
        />
      )}

      {/* Museum Bottom Left Controls (Wings Teleport, Tours, Minimap, Passport) */}
      <MuseumControls
        onTeleportToWing={(wing: WingInfo) => {
          setTeleportTarget({
            pos: wing.entrancePosition,
            lookAt: [0, 1.6, 0],
          });
          const firstInWing = EXHIBITS.find((e) => e.wingId === wing.id);
          if (firstInWing) {
            setActiveExhibitId(firstInWing.id);
          }
        }}
        onTeleportToExhibit={(exhibit: Exhibit) => {
          setActiveExhibitId(exhibit.id);
          setTeleportTarget({
            pos: [exhibit.pedestalPosition[0], 1.6, exhibit.pedestalPosition[2] + 2.8],
            lookAt: [exhibit.pedestalPosition[0], 1.2, exhibit.pedestalPosition[2]],
          });
        }}
        onSelectTour={handleStartTour}
        activeTour={activeTour}
        onOpenPassport={() => setShowPassport(true)}
        stampedCount={stampedExhibitIds.length}
        totalExhibits={EXHIBITS.length}
      />

      {/* Persistent Bottom Audio Player Drawer */}
      <AudioPlayerDrawer
        activeExhibit={activeExhibit}
        isPlaying={isAudioPlaying}
        onPlay={handleResumeAudio}
        onPause={handlePauseAudio}
        progress={audioProgress}
        currentTime={audioCurrentTime}
        onSeek={handleSeekAudio}
        voiceStyle={voiceStyle}
        onChangeVoice={(newVoice) => {
          setVoiceStyle(newVoice);
          if (activeExhibit && isAudioPlaying) {
            handlePlayAudio(activeExhibit);
          }
        }}
        speed={audioSpeed}
        onChangeSpeed={(newSpeed) => {
          setAudioSpeed(newSpeed);
          if (activeExhibit && isAudioPlaying) {
            handlePlayAudio(activeExhibit);
          }
        }}
        onClosePlayer={() => {
          audioGuide.stopNarration();
          setIsAudioPlaying(false);
          setActiveExhibitId(null);
        }}
        onNextExhibit={handleNextExhibit}
        onPrevExhibit={handlePrevExhibit}
        onOpenInspector={() => {
          if (activeExhibit) {
            setInspectingExhibitId(activeExhibit.id);
          }
        }}
      />

      {/* 3D Artifact Inspector Modal (360 Orbit & Historical Deep-Dive) */}
      {inspectingExhibit && (
        <ExhibitInspector
          exhibit={inspectingExhibit}
          onClose={() => setInspectingExhibitId(null)}
          onStampPassport={handleStampPassport}
          isStamped={stampedExhibitIds.includes(inspectingExhibit.id)}
          onPlayAudio={handlePlayAudio}
          onPauseAudio={handlePauseAudio}
          isAudioPlaying={isAudioPlaying && activeExhibitId === inspectingExhibit.id}
          audioProgress={audioProgress}
          audioCurrentTime={audioCurrentTime}
        />
      )}

      {/* Visitor Passport Modal */}
      {showPassport && (
        <PassportModal
          onClose={() => setShowPassport(false)}
          stampedExhibitIds={stampedExhibitIds}
          onSelectExhibit={(id) => setActiveExhibitId(id)}
          onOpenInspector={(id) => setInspectingExhibitId(id)}
        />
      )}

      {/* Grand Welcome & Orientation Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#18161f] to-[#0c0b0f] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
            {/* Top Close Button */}
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10"
              title="Tutup & Mulai"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-neutral-950 font-bold shadow-lg">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                  Aceh Institute Virtual Archive
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Museum Kemerdekaan Aceh
                </h2>
              </div>
            </div>

            {/* Description */}
            <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              Selamat datang di arsip virtual interaktif 3D & Virtual Reality yang mendokumentasikan perjalanan sejarah kemerdekaan bangsa Aceh. Telusuri 4 abad perjuangan, mulai dari zaman keemasan Kesultanan Aceh, Perang Semesta 1873, hingga deklarasi kemerdekaan di Gunung Halimon 1976.
            </p>

            {/* 4 Galleries Preview */}
            <div className="grid grid-cols-2 gap-2.5 mt-5">
              <div className="p-3 rounded-2xl bg-neutral-950/60 border border-amber-500/20">
                <div className="text-[10px] font-bold text-amber-400 uppercase">Sayap 1</div>
                <div className="text-xs font-bold text-neutral-100 mt-0.5">Kesultanan Aceh</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Cap Sikureueng & Meriam Lada Sicupak</div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950/60 border border-red-500/20">
                <div className="text-[10px] font-bold text-red-400 uppercase">Sayap 2</div>
                <div className="text-xs font-bold text-neutral-100 mt-0.5">Perang Semesta 1873</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Hikayat Prang Sabil & Rencong Cut Nyak Dhien</div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950/60 border border-sky-500/20">
                <div className="text-[10px] font-bold text-sky-400 uppercase">Sayap 3</div>
                <div className="text-xs font-bold text-neutral-100 mt-0.5">Deklarasi Halimon 1976</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Naskah Proklamasi & Arsip PBB New York</div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950/60 border border-emerald-500/20">
                <div className="text-[10px] font-bold text-emerald-400 uppercase">Sayap 4</div>
                <div className="text-xs font-bold text-neutral-100 mt-0.5">The Price of Freedom</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Diari Hasan Tiro & Radio Gerilya</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 pt-4 border-t border-neutral-800">
              <button
                id="btn-start-exploration"
                onClick={() => {
                  setShowWelcomeModal(false);
                  audioGuide.playAcousticChime(659.25);
                  if (ambientSoundEnabled) {
                    audioGuide.startAmbientSoundscape('seurune');
                  }
                }}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs font-bold shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Mulai Eksplorasi Bebas</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                id="btn-start-intro-tour"
                onClick={() => {
                  setShowWelcomeModal(false);
                  handleStartTour(GUIDED_TOURS[0]);
                }}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Ikuti Tur Panduan Audio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
