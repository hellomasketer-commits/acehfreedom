import React, { useState } from 'react';
import { EXHIBITS, GUIDED_TOURS, MUSEUM_WINGS } from '../data/exhibits';
import { Exhibit, GuidedTour, WingId, WingInfo } from '../types/museum';
import {
  Compass,
  Map,
  BookOpen,
  Award,
  Layers,
  Sparkles,
  ChevronRight,
  X,
  Footprints,
  Info,
  CheckCircle2,
  Calendar,
  Mic,
} from 'lucide-react';

interface MuseumControlsProps {
  onTeleportToWing: (wing: WingInfo) => void;
  onTeleportToExhibit: (exhibit: Exhibit) => void;
  onSelectTour: (tour: GuidedTour) => void;
  activeTour: GuidedTour | null;
  onOpenPassport: () => void;
  stampedCount: number;
  totalExhibits: number;
  onToggleTimeline?: () => void;
  isTimelineOpen?: boolean;
  onToggleVoice?: () => void;
  isVoiceListening?: boolean;
  isAudioDrawerOpen?: boolean;
}

export const MuseumControls: React.FC<MuseumControlsProps> = ({
  onTeleportToWing,
  onTeleportToExhibit,
  onSelectTour,
  activeTour,
  onOpenPassport,
  stampedCount,
  totalExhibits,
  onToggleTimeline,
  isTimelineOpen,
  onToggleVoice,
  isVoiceListening,
  isAudioDrawerOpen = false,
}) => {
  const [showMinimap, setShowMinimap] = useState(false);
  const [showWingMenu, setShowWingMenu] = useState(false);
  const [showTourMenu, setShowTourMenu] = useState(false);

  // Dynamic bottom positioning on mobile so it doesn't overlap timeline or audio bar
  const bottomPositionClass = isAudioDrawerOpen
    ? isTimelineOpen
      ? 'bottom-36 sm:bottom-28'
      : 'bottom-28 sm:bottom-24'
    : isTimelineOpen
    ? 'bottom-20 sm:bottom-20 md:bottom-4'
    : 'bottom-2.5 sm:bottom-4';

  return (
    <>
      {/* Floating Bottom Navigation Panel with Smooth Mobile Scroll */}
      <div
        className={`fixed left-2.5 sm:left-4 z-30 flex items-center gap-1.5 sm:gap-2 transition-all duration-300 max-w-[calc(100vw-1.25rem)] overflow-x-auto no-scrollbar py-1 ${bottomPositionClass}`}
      >
        {/* Wing Teleport Menu Trigger */}
        <button
          id="open-wings-menu-btn"
          onClick={() => {
            setShowWingMenu(!showWingMenu);
            setShowTourMenu(false);
            setShowMinimap(false);
          }}
          className="min-h-[38px] sm:min-h-[42px] px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-neutral-900/95 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 backdrop-blur-md text-xs font-semibold shadow-xl flex items-center gap-1.5 sm:gap-2 transition-all active:scale-95 shrink-0"
          title="Teleport ke Sayap Galeri Museum"
        >
          <Layers className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="hidden sm:inline">Sayap Galeri</span>
        </button>

        {/* Guided Tours Trigger */}
        <button
          id="open-tours-menu-btn"
          onClick={() => {
            setShowTourMenu(!showTourMenu);
            setShowWingMenu(false);
            setShowMinimap(false);
          }}
          className={`min-h-[38px] sm:min-h-[42px] px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl border backdrop-blur-md text-xs font-semibold shadow-xl flex items-center gap-1.5 sm:gap-2 transition-all active:scale-95 shrink-0 ${
            activeTour
              ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold'
              : 'bg-neutral-900/95 hover:bg-neutral-800 text-neutral-200 border-neutral-700/80'
          }`}
          title="Tur Panduan Tematik Bersejarah"
        >
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="hidden sm:inline">{activeTour ? 'Tur: ' + activeTour.badge : 'Tur Tematik'}</span>
        </button>

        {/* Interactive Floorplan Minimap Trigger */}
        <button
          id="open-minimap-btn"
          onClick={() => {
            setShowMinimap(!showMinimap);
            setShowWingMenu(false);
            setShowTourMenu(false);
          }}
          className={`min-h-[38px] sm:min-h-[42px] px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl border backdrop-blur-md text-xs font-semibold shadow-xl flex items-center gap-1.5 sm:gap-2 transition-all active:scale-95 shrink-0 ${
            showMinimap
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-neutral-900/95 hover:bg-neutral-800 text-neutral-200 border-neutral-700/80'
          }`}
          title="Peta Denah Museum Interaktif"
        >
          <Map className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="hidden sm:inline">Denah Museum</span>
        </button>

        {/* Visitor Passport Trigger */}
        <button
          id="open-passport-btn"
          onClick={onOpenPassport}
          className="min-h-[38px] sm:min-h-[42px] px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-600/90 to-amber-700/90 hover:from-amber-500 hover:to-amber-600 text-amber-50 border border-amber-500/50 backdrop-blur-md text-xs font-bold shadow-xl flex items-center gap-1.5 sm:gap-2 transition-all active:scale-95 shrink-0"
          title="Paspor Pengunjung & Arsip Stempel Sejarah"
        >
          <Award className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="hidden sm:inline">Paspor</span>
          <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[10px] text-amber-200 font-mono">
            {stampedCount}/{totalExhibits}
          </span>
        </button>

        {/* Historical Timeline Trigger */}
        {onToggleTimeline && (
          <button
            id="open-timeline-btn"
            onClick={onToggleTimeline}
            className={`min-h-[38px] sm:min-h-[42px] px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl border backdrop-blur-md text-xs font-semibold shadow-xl flex items-center gap-1.5 sm:gap-2 transition-all active:scale-95 shrink-0 ${
              isTimelineOpen
                ? 'bg-amber-500/25 text-amber-300 border-amber-400 font-bold'
                : 'bg-neutral-900/95 hover:bg-neutral-800 text-neutral-200 border-neutral-700/80'
            }`}
            title="Buka / Tutup Linimasa Kronologi 4 Sayap"
          >
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden md:inline">Linimasa</span>
          </button>
        )}

        {/* Voice Command Quick Button */}
        {onToggleVoice && (
          <button
            id="open-voice-btn"
            onClick={onToggleVoice}
            className={`min-h-[38px] sm:min-h-[42px] px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl border backdrop-blur-md text-xs font-semibold shadow-xl flex items-center gap-1.5 sm:gap-2 transition-all active:scale-95 shrink-0 ${
              isVoiceListening
                ? 'bg-red-500/30 text-red-300 border-red-400 font-bold ring-2 ring-red-500/40'
                : 'bg-neutral-900/95 hover:bg-neutral-800 text-neutral-200 border-neutral-700/80'
            }`}
            title="Aktifkan Navigasi Perintah Suara (Tekan V)"
          >
            <Mic className={`w-4 h-4 shrink-0 ${isVoiceListening ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
            <span className="hidden lg:inline">{isVoiceListening ? 'Mendengarkan' : 'Suara'}</span>
          </button>
        )}
      </div>

      {/* Gallery Wings Modal Drawer */}
      {showWingMenu && (
        <div className="fixed bottom-16 sm:bottom-20 left-2.5 sm:left-4 z-40 w-84 sm:w-96 max-w-[calc(100vw-1.5rem)] max-h-[75vh] overflow-y-auto bg-neutral-900/95 border border-neutral-700 rounded-2xl sm:rounded-3xl shadow-2xl p-4 backdrop-blur-xl animate-fade-in space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Sayap Galeri Sejarah Aceh
            </span>
            <button onClick={() => setShowWingMenu(false)} className="text-neutral-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {/* Center Rotunda option */}
            <button
              onClick={() => {
                onTeleportToWing({
                  id: 'kesultanan',
                  name: 'Meuligoe Agung & Monumen Halimon',
                  subtitle: 'Pusat Kehormatan Lambang Negara & Peringatan 1873-1976',
                  eraPeriod: 'Pusat Sejarah',
                  bannerColor: '#f59e0b',
                  description: 'Pusat rotunda museum dengan monumen lambang negara Aceh Sumatra dan semboyan Hudép Beusaré, Maté Beusadjan.',
                  entrancePosition: [0, 1.6, 0],
                });
                setShowWingMenu(false);
              }}
              className="w-full text-left p-3 rounded-2xl bg-neutral-950/70 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 transition-all flex items-center justify-between group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300">Meuligoe Agung & Monumen Halimon</div>
                <div className="text-[11px] text-neutral-400">Pusat Rotunda Utama</div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400" />
            </button>

            {MUSEUM_WINGS.map((wing) => (
              <button
                key={wing.id}
                onClick={() => {
                  onTeleportToWing(wing);
                  setShowWingMenu(false);
                }}
                className="w-full text-left p-3 rounded-2xl bg-neutral-950/70 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 transition-all flex items-center justify-between group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: wing.bannerColor }} />
                    <span className="text-xs font-bold text-white group-hover:text-amber-300 truncate">{wing.name}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate pl-4.5">{wing.eraPeriod}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Guided Tours Modal */}
      {showTourMenu && (
        <div className="fixed bottom-16 sm:bottom-20 left-2.5 sm:left-4 z-40 w-92 max-w-[calc(100vw-1.5rem)] bg-neutral-900/95 border border-neutral-700 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 backdrop-blur-xl animate-fade-in space-y-3 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Tur Audio Tematik
            </span>
            <button onClick={() => setShowTourMenu(false)} className="text-neutral-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {GUIDED_TOURS.map((tour) => (
              <div
                key={tour.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  activeTour?.id === tour.id
                    ? 'bg-amber-500/10 border-amber-500/60'
                    : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                    {tour.badge}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono">{tour.durationMinutes} menit • {tour.stops.length} perhentian</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white">{tour.title}</h4>
                <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">{tour.summary}</p>

                <button
                  onClick={() => {
                    onSelectTour(tour);
                    setShowTourMenu(false);
                  }}
                  className={`w-full mt-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeTour?.id === tour.id
                      ? 'bg-amber-500 text-neutral-950 hover:bg-amber-400'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                  }`}
                >
                  <Footprints className="w-3.5 h-3.5" />
                  <span>{activeTour?.id === tour.id ? 'Lanjutkan Tur' : 'Mulai Tur Audio'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive 2D Floorplan Radar Modal */}
      {showMinimap && (
        <div className="fixed bottom-16 sm:bottom-20 left-2.5 sm:left-4 z-40 w-96 max-w-[calc(100vw-1.5rem)] bg-neutral-900/95 border border-neutral-700 rounded-2xl sm:rounded-3xl shadow-2xl p-4 backdrop-blur-xl animate-fade-in space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div>
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                <Map className="w-4 h-4" />
                Peta Radar Denah Museum
              </span>
              <p className="text-[11px] text-neutral-400">Klik titik artefak untuk berteleportasi langsung</p>
            </div>
            <button onClick={() => setShowMinimap(false)} className="text-neutral-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Radar Visual Canvas Grid */}
          <div className="relative w-full aspect-square bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden flex items-center justify-center p-3">
            {/* Gallery Quadrants */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="border-r border-b border-neutral-800/80 p-2 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-amber-400/80 uppercase">Kesultanan Aceh</span>
              </div>
              <div className="border-b border-neutral-800/80 p-2 flex flex-col justify-between text-right">
                <span className="text-[9px] font-bold text-red-400/80 uppercase">Perang Semesta</span>
              </div>
              <div className="border-r border-neutral-800/80 p-2 flex flex-col justify-between">
                <span className="text-[9px] font-bold text-sky-400/80 uppercase">Acheh Institute</span>
              </div>
              <div className="p-2 flex flex-col justify-between text-right">
                <span className="text-[9px] font-bold text-emerald-400/80 uppercase">The Price of Freedom</span>
              </div>
            </div>

            {/* Center Rotunda Circle */}
            <button
              onClick={() => {
                onTeleportToWing({
                  id: 'kesultanan',
                  name: 'Meuligoe Agung & Monumen Halimon',
                  subtitle: '',
                  eraPeriod: '',
                  bannerColor: '#f59e0b',
                  description: '',
                  entrancePosition: [0, 1.6, 0],
                });
                setShowMinimap(false);
              }}
              className="absolute w-14 h-14 rounded-full border border-amber-400/50 bg-neutral-900/90 flex items-center justify-center text-[8px] font-bold text-amber-300 hover:scale-110 transition-transform shadow-lg z-10 text-center leading-tight p-1"
              title="Teleport ke Rotunda Pusat"
            >
              Meuligoe
            </button>

            {/* Exhibit dots positioned relative to -30..+30 coordinates */}
            {EXHIBITS.map((ex) => {
              const leftPercent = ((ex.pedestalPosition[0] + 30) / 60) * 100;
              const topPercent = ((ex.pedestalPosition[2] + 30) / 60) * 100;

              return (
                <button
                  key={ex.id}
                  onClick={() => {
                    onTeleportToExhibit(ex);
                    setShowMinimap(false);
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 p-1 group z-20"
                  style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                  title={`${ex.name} (${ex.era})`}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 border-neutral-900 shadow-md group-hover:scale-150 transition-transform"
                    style={{ backgroundColor: ex.accentColor }}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 rounded bg-neutral-900 text-[9px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 shadow-lg">
                    {ex.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
