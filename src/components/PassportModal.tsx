import React from 'react';
import { EXHIBITS, MUSEUM_WINGS } from '../data/exhibits';
import { Exhibit } from '../types/museum';
import { Award, CheckCircle2, Sparkles, X, MapPin, Calendar, BookOpen, Quote } from 'lucide-react';

interface PassportModalProps {
  onClose: () => void;
  stampedExhibitIds: string[];
  onSelectExhibit: (exhibitId: string) => void;
  onOpenInspector: (exhibitId: string) => void;
}

export const PassportModal: React.FC<PassportModalProps> = ({
  onClose,
  stampedExhibitIds,
  onSelectExhibit,
  onOpenInspector,
}) => {
  const stampedCount = stampedExhibitIds.length;
  const totalCount = EXHIBITS.length;
  const completionPercent = Math.round((stampedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-[#1c1917] to-[#0c0a09] border-2 border-amber-600/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 transition-colors shadow-lg"
          title="Tutup Paspor"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Passport Header: Gold Embossed Seal */}
        <div className="p-6 sm:p-8 border-b border-amber-600/30 bg-neutral-950/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 shadow-xl border border-amber-300">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                Aceh Institute Virtual Archive
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-100 tracking-tight">
                Paspor Sejarah Kemerdekaan Aceh
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Dokumentasi penjelajahan saksi bisu perjuangan, traktat, dan deklarasi kemerdekaan
              </p>
            </div>
          </div>

          {/* Progress Pill */}
          <div className="bg-neutral-900/90 border border-amber-500/40 px-5 py-3 rounded-2xl flex items-center gap-4">
            <div>
              <div className="text-[10px] uppercase font-semibold text-neutral-400">Artefak Terstempel</div>
              <div className="text-xl font-bold font-mono text-amber-300">{stampedCount} / {totalCount}</div>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-amber-500/30 flex items-center justify-center font-bold text-xs text-amber-400 font-mono">
              {completionPercent}%
            </div>
          </div>
        </div>

        {/* Passport Stamps Grid */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EXHIBITS.map((exhibit) => {
              const isStamped = stampedExhibitIds.includes(exhibit.id);

              return (
                <div
                  key={exhibit.id}
                  onClick={() => {
                    onSelectExhibit(exhibit.id);
                    onOpenInspector(exhibit.id);
                    onClose();
                  }}
                  className={`relative p-4 rounded-2xl border transition-all cursor-pointer group ${
                    isStamped
                      ? 'bg-neutral-900/90 border-amber-500/60 shadow-lg hover:border-amber-400'
                      : 'bg-neutral-950/40 border-neutral-800/80 opacity-65 hover:opacity-100 hover:border-neutral-700'
                  }`}
                >
                  {/* Stamped Stamp Badge */}
                  {isStamped && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/40">
                      <CheckCircle2 className="w-3 h-3 text-amber-400" />
                      Terverifikasi
                    </div>
                  )}

                  <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                    {exhibit.era}
                  </div>
                  <h4 className="text-sm font-bold text-neutral-100 mt-0.5 group-hover:text-amber-300 transition-colors line-clamp-1">
                    {exhibit.name}
                  </h4>
                  <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-500" />
                    <span className="truncate">{exhibit.provenance}</span>
                  </div>

                  {exhibit.diaryQuote && (
                    <div className="mt-2 text-[10px] text-amber-400/90 flex items-center gap-1">
                      <Quote className="w-3 h-3 text-amber-500 shrink-0" />
                      <span className="truncate">Ada kutipan harian {exhibit.diaryQuote.date}</span>
                    </div>
                  )}

                  <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="font-mono">{exhibit.year}</span>
                    <span className="text-amber-400 group-hover:underline">Buka Artefak →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Passport Footer Motto */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 text-center text-xs text-neutral-400 font-serif italic">
          "Hudép Beusaré, Maté Beusadjan" — Arsip Sejarah Perjuangan Bangsa Aceh
        </div>
      </div>
    </div>
  );
};
