import React, { useState } from 'react';
import { Exhibit } from '../types/museum';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  FileText,
  UserCheck,
  Gauge,
  ChevronDown,
  ChevronUp,
  X,
  SkipForward,
  SkipBack,
  Eye,
} from 'lucide-react';

interface AudioPlayerDrawerProps {
  activeExhibit: Exhibit | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  progress: number;
  currentTime: number;
  onSeek: (fraction: number) => void;
  voiceStyle: 'curator' | 'storyteller' | 'archivist';
  onChangeVoice: (voice: 'curator' | 'storyteller' | 'archivist') => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  onClosePlayer: () => void;
  onNextExhibit: () => void;
  onPrevExhibit: () => void;
  onOpenInspector: () => void;
}

export const AudioPlayerDrawer: React.FC<AudioPlayerDrawerProps> = ({
  activeExhibit,
  isPlaying,
  onPlay,
  onPause,
  progress,
  currentTime,
  onSeek,
  voiceStyle,
  onChangeVoice,
  speed,
  onChangeSpeed,
  onClosePlayer,
  onNextExhibit,
  onPrevExhibit,
  onOpenInspector,
}) => {
  const [showTranscript, setShowTranscript] = useState(false);

  if (!activeExhibit) return null;

  const speeds = [0.75, 1.0, 1.25, 1.5];
  const nextSpeed = () => {
    const currentIndex = speeds.indexOf(speed);
    const nextIdx = (currentIndex + 1) % speeds.length;
    onChangeSpeed(speeds[nextIdx]);
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(fraction);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-2 sm:p-4 flex flex-col items-center pointer-events-none animate-slide-up select-none">
      <div className="w-full max-w-3xl bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/70 rounded-2xl sm:rounded-3xl shadow-2xl pointer-events-auto overflow-hidden">
        {/* Transcript Slideout */}
        {showTranscript && (
          <div className="p-4 sm:p-5 border-b border-neutral-800 bg-neutral-950/80 max-h-48 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Transkrip Narasi Sejarah
              </span>
              <button
                onClick={() => setShowTranscript(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed italic">
              "{activeExhibit.audioNarration}"
            </p>
          </div>
        )}

        {/* Player Main Controls Bar */}
        <div className="p-3 sm:p-4 flex flex-col gap-2.5">
          {/* Top Info Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: `${activeExhibit.accentColor}20`,
                  borderColor: `${activeExhibit.accentColor}50`,
                }}
              >
                <Volume2 className="w-5 h-5 text-amber-400" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Panduan Suara</span>
                  <span className="text-[11px] text-neutral-400 font-mono">• {activeExhibit.era}</span>
                </div>
                <button
                  onClick={onOpenInspector}
                  className="text-sm font-bold text-neutral-100 truncate hover:text-amber-300 transition-colors text-left block"
                >
                  {activeExhibit.name}
                </button>
              </div>
            </div>

            {/* Right Tools (Voice, Speed, Transcript, Inspect 3D, Close) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Voice Style Selector */}
              <select
                id="voice-persona-select"
                value={voiceStyle}
                onChange={(e) => onChangeVoice(e.target.value as 'curator' | 'storyteller' | 'archivist')}
                className="bg-neutral-800 text-neutral-300 hover:text-white text-xs px-2.5 py-1.5 rounded-lg border border-neutral-700 focus:outline-none focus:border-amber-400"
                title="Gaya Suara Narasi"
              >
                <option value="curator">Kurator</option>
                <option value="storyteller">Pengisah</option>
                <option value="archivist">Arsiparis</option>
              </select>

              {/* Speed Button */}
              <button
                id="audio-speed-btn"
                onClick={nextSpeed}
                className="px-2 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono font-semibold border border-neutral-700"
                title="Kecepatan Pemutaran"
              >
                {speed}x
              </button>

              {/* Transcript Toggle */}
              <button
                id="toggle-transcript-btn"
                onClick={() => setShowTranscript(!showTranscript)}
                className={`p-2 rounded-lg border transition-colors ${
                  showTranscript
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border-neutral-700'
                }`}
                title="Buka Transkrip"
              >
                <FileText className="w-4 h-4" />
              </button>

              {/* Inspect 3D Modal trigger */}
              <button
                id="drawer-open-inspector-btn"
                onClick={onOpenInspector}
                className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 transition-colors"
                title="Periksa Artefak 3D"
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Close Audio Player */}
              <button
                id="drawer-close-btn"
                onClick={onClosePlayer}
                className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                title="Tutup Pemutar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar & Scrubber */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-neutral-400 w-10 text-right">
              {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
            </span>

            <div
              className="flex-1 h-2 bg-neutral-800 hover:bg-neutral-700 rounded-full cursor-pointer relative overflow-hidden transition-all group"
              onClick={handleScrub}
            >
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-150 relative"
                style={{ width: `${Math.round(progress * 100)}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <span className="text-[11px] font-mono text-neutral-400 w-10">
              {Math.floor(activeExhibit.audioDurationSeconds / 60)}:
              {Math.floor(activeExhibit.audioDurationSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Player Transport Controls */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <button
              onClick={onPrevExhibit}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Artefak Sebelumnya"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              id="audio-play-pause-btn"
              onClick={isPlaying ? onPause : onPlay}
              className="w-11 h-11 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 flex items-center justify-center shadow-lg transition-all active:scale-95"
              title={isPlaying ? 'Jeda' : 'Putar'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={onNextExhibit}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Artefak Selanjutnya"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
