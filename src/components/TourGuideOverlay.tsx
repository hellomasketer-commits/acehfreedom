import React from 'react';
import { EXHIBITS } from '../data/exhibits';
import { GuidedTour } from '../types/museum';
import { Sparkles, ChevronRight, ChevronLeft, X, Headphones } from 'lucide-react';

interface TourGuideOverlayProps {
  tour: GuidedTour;
  currentStepIndex: number;
  onNextStop: () => void;
  onPrevStop: () => void;
  onExitTour: () => void;
  onOpenInspector: (exhibitId: string) => void;
}

export const TourGuideOverlay: React.FC<TourGuideOverlayProps> = ({
  tour,
  currentStepIndex,
  onNextStop,
  onPrevStop,
  onExitTour,
  onOpenInspector,
}) => {
  const currentExhibitId = tour.stops[currentStepIndex];
  const currentExhibit = EXHIBITS.find((e) => e.id === currentExhibitId);
  const totalStops = tour.stops.length;

  if (!currentExhibit) return null;

  return (
    <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-30 w-[95%] sm:w-[94%] max-w-xl animate-fade-in pointer-events-none select-none">
      <div className="bg-neutral-900/95 backdrop-blur-xl border border-amber-500/60 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-2xl pointer-events-auto flex flex-col gap-2.5 sm:gap-3">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-amber-400 truncate">
              Tur: {tour.title}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className="text-[10px] sm:text-xs font-mono text-neutral-300 font-bold bg-neutral-800 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-neutral-700">
              {currentStepIndex + 1}/{totalStops}
            </span>
            <button
              onClick={onExitTour}
              className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title="Keluar dari Tur"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Stop Exhibit Banner */}
        <div className="flex items-center justify-between gap-2.5 bg-neutral-950/60 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-neutral-800">
          <div className="min-w-0">
            <div className="text-[10px] sm:text-[11px] text-neutral-400 truncate">{currentExhibit.era} • {currentExhibit.year}</div>
            <div className="text-xs sm:text-base font-bold text-white truncate">{currentExhibit.name}</div>
          </div>

          <button
            onClick={() => onOpenInspector(currentExhibit.id)}
            className="shrink-0 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors min-h-[34px]"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Periksa Artefak</span>
            <span className="sm:hidden">Artefak</span>
          </button>
        </div>

        {/* Next / Previous Navigation Bar */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={onPrevStop}
            disabled={currentStepIndex === 0}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none bg-neutral-800 hover:bg-neutral-700 flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {tour.stops.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'w-6 bg-amber-400'
                    : idx < currentStepIndex
                    ? 'w-2 bg-amber-500/50'
                    : 'w-2 bg-neutral-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={onNextStop}
            disabled={currentStepIndex === totalStops - 1}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-neutral-950 disabled:opacity-40 disabled:pointer-events-none bg-amber-500 hover:bg-amber-400 flex items-center gap-1 transition-colors"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
