import React, { useState, useMemo } from 'react';
import { HISTORICAL_ERAS, HistoricalEra, TimelineMilestone } from '../data/timelineData';
import { EXHIBITS, MUSEUM_WINGS } from '../data/exhibits';
import { Exhibit, WingId, WingInfo } from '../types/museum';
import {
  Calendar,
  Clock,
  Compass,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Eye,
  Volume2,
  MapPin,
  Sparkles,
  Milestone,
  ArrowRight,
  X,
  BookOpen,
  Layers,
  Minimize2,
  Maximize2,
} from 'lucide-react';

interface HistoricalTimelineProps {
  activeExhibitId: string | null;
  onJumpToEra: (wingId: WingId) => void;
  onJumpToExhibit: (exhibitId: string) => void;
  onOpenInspector: (exhibitId: string) => void;
  isAudioDrawerOpen: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const HistoricalTimeline: React.FC<HistoricalTimelineProps> = ({
  activeExhibitId,
  onJumpToEra,
  onJumpToExhibit,
  onOpenInspector,
  isAudioDrawerOpen,
  isOpen,
  onToggleOpen,
}) => {
  // Determine active era from activeExhibitId or default to first era
  const currentExhibit = useMemo(
    () => EXHIBITS.find((e) => e.id === activeExhibitId) || null,
    [activeExhibitId]
  );

  const activeWingId: WingId = currentExhibit?.wingId || 'kesultanan';

  const [selectedEraIndex, setSelectedEraIndex] = useState<number>(() => {
    const idx = HISTORICAL_ERAS.findIndex((e) => e.wingId === activeWingId);
    return idx >= 0 ? idx : 0;
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<TimelineMilestone | null>(null);
  const [hoveredMilestone, setHoveredMilestone] = useState<TimelineMilestone | null>(null);

  // Sync selected era if activeExhibitId changes and user hasn't manually picked another era
  React.useEffect(() => {
    if (currentExhibit) {
      const idx = HISTORICAL_ERAS.findIndex((e) => e.wingId === currentExhibit.wingId);
      if (idx >= 0) {
        setSelectedEraIndex(idx);
      }
    }
  }, [currentExhibit]);

  const activeEra = HISTORICAL_ERAS[selectedEraIndex];
  const totalEras = HISTORICAL_ERAS.length;

  const handlePrevEra = () => {
    const newIdx = Math.max(0, selectedEraIndex - 1);
    setSelectedEraIndex(newIdx);
    const targetEra = HISTORICAL_ERAS[newIdx];
    onJumpToEra(targetEra.wingId);
  };

  const handleNextEra = () => {
    const newIdx = Math.min(totalEras - 1, selectedEraIndex + 1);
    setSelectedEraIndex(newIdx);
    const targetEra = HISTORICAL_ERAS[newIdx];
    onJumpToEra(targetEra.wingId);
  };

  const handleSelectEra = (index: number) => {
    setSelectedEraIndex(index);
    const targetEra = HISTORICAL_ERAS[index];
    onJumpToEra(targetEra.wingId);
  };

  // Get exhibits belonging to this era
  const eraExhibits = useMemo(() => {
    return EXHIBITS.filter((e) => e.wingId === activeEra.wingId);
  }, [activeEra]);

  // If component is closed by user, show a sleek floating trigger pill at bottom
  if (!isOpen) {
    return (
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-30 transition-all duration-300 pointer-events-auto select-none ${
          isAudioDrawerOpen ? 'bottom-20 sm:bottom-24' : 'bottom-3 sm:bottom-4'
        }`}
      >
        <button
          id="btn-reopen-timeline"
          onClick={onToggleOpen}
          className="px-4 py-2.5 rounded-2xl bg-neutral-900/95 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/90 shadow-2xl backdrop-blur-xl flex items-center gap-2.5 text-xs font-semibold hover:border-amber-400/60 transition-all group"
          title="Buka Linimasa Sejarah 4 Sayap"
        >
          <div
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: activeEra.color }}
          />
          <Calendar className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>Linimasa: {activeEra.shortName} ({activeEra.periodLabel})</span>
          <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
        </button>
      </div>
    );
  }

  return (
    <div
      id="historical-timeline-root"
      className={`fixed left-1/2 -translate-x-1/2 z-35 w-[96vw] max-w-4xl transition-all duration-300 pointer-events-none select-none ${
        isAudioDrawerOpen ? 'bottom-24 sm:bottom-28' : 'bottom-3 sm:bottom-4'
      }`}
    >
      <div className="w-full bg-neutral-950/92 backdrop-blur-xl border border-neutral-700/80 hover:border-amber-500/40 rounded-2xl sm:rounded-3xl shadow-2xl pointer-events-auto overflow-hidden transition-all">
        {/* EXPANDED FULL DRAWER VIEW */}
        {isExpanded && (
          <div className="p-4 sm:p-6 border-b border-neutral-800/80 bg-gradient-to-b from-neutral-900/90 to-neutral-950/95 max-h-[62vh] overflow-y-auto">
            {/* Expanded Header */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-neutral-950 shadow-md shrink-0"
                  style={{ backgroundColor: activeEra.color }}
                >
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                    Kronologi & Linimasa Sejarah
                  </div>
                  <h3 className="text-sm sm:text-base font-serif font-bold text-neutral-100 truncate">
                    {activeEra.name} ({activeEra.periodLabel})
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onJumpToEra(activeEra.wingId)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Teleport ke Sayap Ini"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Masuki Sayap 3D</span>
                </button>

                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                  title="Perkecil Panel Linimasa"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Era Synopsis & Theme Banner */}
            <div
              className={`p-3.5 sm:p-4 rounded-2xl border ${activeEra.borderColor} bg-gradient-to-r ${activeEra.bgGradient} mb-5`}
            >
              <div className="text-xs font-bold text-neutral-100 mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeEra.color }} />
                <span>{activeEra.headline}</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                {activeEra.summary}
              </p>
            </div>

            {/* Historical Milestones along Time Axis */}
            <div className="space-y-3 mb-5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Milestone className="w-3.5 h-3.5 text-amber-400" />
                <span>Peristiwa Penting & Titik Balik Sejarah ({activeEra.periodLabel})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeEra.milestones.map((ms) => {
                  const isLinkedActiveExhibit = activeExhibitId === ms.exhibitId;

                  return (
                    <div
                      key={ms.id}
                      onClick={() => {
                        setSelectedMilestone(ms);
                        onJumpToExhibit(ms.exhibitId);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between group ${
                        isLinkedActiveExhibit
                          ? 'bg-neutral-900 border-amber-400/80 ring-1 ring-amber-400/40 shadow-lg'
                          : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md text-neutral-950"
                            style={{ backgroundColor: activeEra.color }}
                          >
                            {ms.year}
                          </span>
                          <span className="text-[10px] text-neutral-400 flex items-center gap-1 truncate max-w-[120px]">
                            <MapPin className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
                            <span className="truncate">{ms.location}</span>
                          </span>
                        </div>

                        <div className="text-xs font-bold text-neutral-200 group-hover:text-amber-300 transition-colors line-clamp-1 mt-1">
                          {ms.title}
                        </div>
                        <div className="text-[11px] text-neutral-400 leading-snug mt-1 line-clamp-2">
                          {ms.description}
                        </div>
                      </div>

                      {ms.quote && (
                        <div className="mt-2 text-[10px] italic text-amber-400/90 border-t border-neutral-800/80 pt-1.5 line-clamp-1">
                          "{ms.quote}"
                        </div>
                      )}

                      <div className="mt-2 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[10px] text-amber-400 group-hover:underline">
                        <span>Lompat ke Artefak Ini</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Artifacts in this Wing */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-2.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Koleksi Artefak Saksi Sejarah di Sayap Ini</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {eraExhibits.map((exhibit) => {
                  const isCurActive = activeExhibitId === exhibit.id;
                  return (
                    <div
                      key={exhibit.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                        isCurActive
                          ? 'bg-neutral-900 border-amber-400 shadow-md'
                          : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-[10px] text-neutral-400 font-mono truncate">{exhibit.year}</div>
                        <div className="text-xs font-bold text-neutral-100 truncate">{exhibit.name}</div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onJumpToExhibit(exhibit.id)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 text-[10px] font-semibold transition-colors"
                          title="Teleport ke Artefak"
                        >
                          <Compass className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenInspector(exhibit.id)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-[10px] transition-colors"
                          title="Periksa 3D & Sejarah"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* COMPACT BOTTOM BAR & TRACK SCRUBBER */}
        <div className="p-2 sm:p-2.5 flex flex-col gap-1.5">
          {/* Top Row: Era Jump Buttons & Steppers */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {/* Previous Era Stepper */}
            <button
              id="btn-prev-era"
              onClick={handlePrevEra}
              disabled={selectedEraIndex === 0}
              className="p-1.5 sm:p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:pointer-events-none border border-neutral-800 transition-colors shrink-0"
              title="Era Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* 4 Wing Era Quick-Jump Pills */}
            <div className="flex-1 grid grid-cols-4 gap-1 sm:gap-1.5 min-w-0">
              {HISTORICAL_ERAS.map((era, index) => {
                const isActive = index === selectedEraIndex;
                return (
                  <button
                    key={era.id}
                    id={`btn-era-${era.wingId}`}
                    onClick={() => handleSelectEra(index)}
                    className={`px-2 py-1 sm:py-1.5 rounded-xl border text-left transition-all flex flex-col justify-center min-w-0 ${
                      isActive
                        ? 'bg-neutral-900 border-white/40 shadow-lg ring-1 ring-white/20'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 opacity-70 hover:opacity-100'
                    }`}
                    title={`Lompat ke ${era.name} (${era.periodLabel})`}
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full shrink-0 transition-transform"
                        style={{
                          backgroundColor: era.color,
                          transform: isActive ? 'scale(1.2)' : 'scale(1)',
                        }}
                      />
                      <span className="text-[10px] font-mono font-bold text-neutral-300 truncate">
                        {era.startYear === era.endYear ? `${era.startYear}` : `${era.startYear}–${era.endYear}`}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-semibold truncate ${
                        isActive ? 'text-white' : 'text-neutral-400'
                      }`}
                    >
                      {era.shortName}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Next Era Stepper */}
            <button
              id="btn-next-era"
              onClick={handleNextEra}
              disabled={selectedEraIndex === totalEras - 1}
              className="p-1.5 sm:p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:pointer-events-none border border-neutral-800 transition-colors shrink-0"
              title="Era Selanjutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Toggle Full Timeline Drawer */}
            <button
              id="btn-toggle-timeline-drawer"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 ${
                isExpanded
                  ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-700/80'
              }`}
              title={isExpanded ? 'Perkecil Linimasa' : 'Buka Linimasa Lengkap'}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">
                {isExpanded ? 'Ringkas' : 'Detail'}
              </span>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>

            {/* Minimize Timeline Button */}
            <button
              id="btn-minimize-timeline"
              onClick={onToggleOpen}
              className="p-1.5 sm:p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors shrink-0"
              title="Sembunyikan Linimasa"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Continuous Chronological Timeline Rail with Milestone Nodes */}
          <div className="relative px-1 pt-0.5">
            <div className="relative h-2.5 w-full bg-neutral-900 rounded-full overflow-hidden flex">
              {HISTORICAL_ERAS.map((era, idx) => {
                const isActive = idx === selectedEraIndex;
                return (
                  <div
                    key={era.id}
                    onClick={() => handleSelectEra(idx)}
                    className="h-full flex-1 cursor-pointer transition-all duration-300 relative group"
                    style={{
                      backgroundColor: isActive ? era.color : `${era.color}40`,
                    }}
                    title={`Klik untuk lompat ke ${era.shortName} (${era.periodLabel})`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Visual Year Labels & Milestone Ticks */}
            <div className="flex justify-between items-center text-[9px] font-mono text-neutral-400 mt-1 px-1">
              <span className="cursor-pointer hover:text-amber-400" onClick={() => handleSelectEra(0)}>1607 M (Kesultanan)</span>
              <span className="cursor-pointer hover:text-red-400" onClick={() => handleSelectEra(1)}>1873 M (Perang Semesta)</span>
              <span className="cursor-pointer hover:text-sky-400" onClick={() => handleSelectEra(2)}>1976 M (Halimon)</span>
              <span className="cursor-pointer hover:text-emerald-400" onClick={() => handleSelectEra(3)}>1979 M (Rimba)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
