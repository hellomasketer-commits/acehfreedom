import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  HelpCircle,
  X,
  Compass,
  Headphones,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Globe,
  Radio,
  BookOpen,
} from 'lucide-react';
import { voiceCommander, VoiceState, CommandParseResult } from '../services/voiceCommander';
import { audioGuide } from '../services/audioGuide';

interface VoiceCommandOverlayProps {
  onExecuteCommand: (result: CommandParseResult) => void;
  isAudioDrawerOpen: boolean;
  isTimelineOpen: boolean;
}

export const VoiceCommandOverlay: React.FC<VoiceCommandOverlayProps> = ({
  onExecuteCommand,
  isAudioDrawerOpen,
  isTimelineOpen,
}) => {
  const [isSupported, setIsSupported] = useState(true);
  const [voiceState, setVoiceState] = useState<VoiceState>({
    status: 'idle',
    message: 'Mikrofon siaga',
    isListening: false,
    interimTranscript: '',
    finalTranscript: '',
    language: 'id-ID',
  });
  const [lastExecuted, setLastExecuted] = useState<string | null>(null);
  const [unrecognizedPrompt, setUnrecognizedPrompt] = useState<string | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    setIsSupported(voiceCommander.isSupported());

    voiceCommander.onStateChange((state) => {
      setVoiceState(state);
    });

    voiceCommander.onCommand((result) => {
      if (result.intent) {
        setUnrecognizedPrompt(null);
        setLastExecuted(result.intent.label);
        audioGuide.playAcousticChime(659.25); // Feedback chime
        onExecuteCommand(result);

        // Auto clear feedback after 3.5s
        setTimeout(() => {
          setLastExecuted(null);
        }, 3500);
      } else if (result.rawText.trim().length > 0) {
        setUnrecognizedPrompt(result.rawText);
        setTimeout(() => {
          setUnrecognizedPrompt(null);
        }, 4000);
      }
    });

    return () => {
      voiceCommander.stopListening();
    };
  }, [onExecuteCommand]);

  const handleToggleMic = () => {
    if (!isSupported) {
      setShowGuideModal(true);
      return;
    }
    voiceCommander.toggleListening();
    if (!voiceCommander.isListening()) {
      audioGuide.playAcousticChime(523.25);
    }
  };

  const handleSelectLanguage = (lang: 'id-ID' | 'en-US') => {
    voiceCommander.setLanguage(lang);
    setVoiceState((prev) => ({ ...prev, language: lang }));
  };

  const sampleCommands = [
    {
      category: 'Navigasi Sayap & Sejarah',
      icon: <Compass className="w-4 h-4 text-amber-400" />,
      items: [
        { phrase: 'Go to Halimon', desc: 'Teleport langsung ke Sayap Deklarasi Halimon 1976' },
        { phrase: 'Go to Kesultanan', desc: 'Teleport ke Sayap Daulat Iskandar Muda' },
        { phrase: 'Go to Perang', desc: 'Menuju Sayap Perang Semesta 1873–1911' },
        { phrase: 'Go to Rimba', desc: 'Menuju Sayap The Price of Freedom' },
        { phrase: 'Go to Lobby', desc: 'Kembali ke Hall Utama & Monumen Halimon' },
      ],
    },
    {
      category: 'Tur Audio & Panduan Suara',
      icon: <Headphones className="w-4 h-4 text-sky-400" />,
      items: [
        { phrase: 'Start audio tour', desc: 'Memulai tur audio terpandu Jejak Halimon' },
        { phrase: 'Stop audio', desc: 'Menjeda / menghentikan pemutaran narasi suara' },
        { phrase: 'Play audio', desc: 'Memutar narasi kurator untuk artefak aktif' },
        { phrase: 'Next stop', desc: 'Lanjut ke perhentian tur berikutnya' },
      ],
    },
    {
      category: 'Artefak & Eksplorasi',
      icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
      items: [
        { phrase: 'Naskah Deklarasi', desc: 'Lompat ke Teks Proklamasi 4 Desember 1976' },
        { phrase: 'Cap Sikureueng', desc: 'Melihat Segel Sembilan Kesultanan Aceh' },
        { phrase: 'Buku Price of Freedom', desc: 'Menuju Buku Harian Hasan di Tiro' },
        { phrase: 'Next artifact', desc: 'Berpindah ke artefak selanjutnya' },
      ],
    },
    {
      category: 'Alat & Modal Interaktif',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      items: [
        { phrase: 'Open inspector', desc: 'Buka panel periksa 3D & sinar-X' },
        { phrase: 'Open passport', desc: 'Buka paspor & stempel kunjungan' },
        { phrase: 'Open timeline', desc: 'Buka linimasa sejarah 4 sayap' },
        { phrase: 'Toggle VR', desc: 'Alihkan mode tampilan VR stereoskopik' },
      ],
    },
  ];

  return (
    <>
      {/* Floating Voice Command Docked Widget */}
      <div
        id="voice-command-widget"
        className={`fixed right-4 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto transition-all duration-300 ${
          isAudioDrawerOpen
            ? isTimelineOpen
              ? 'bottom-40 sm:bottom-44'
              : 'bottom-24 sm:bottom-28'
            : isTimelineOpen
            ? 'bottom-28 sm:bottom-32'
            : 'bottom-4 sm:bottom-6'
        }`}
      >
        {/* Live Feedback Bubble */}
        {(voiceState.isListening || lastExecuted || unrecognizedPrompt) && (
          <div className="bg-neutral-950/95 border border-neutral-700/90 text-neutral-100 px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-xl max-w-xs sm:max-w-sm flex items-center gap-3 animate-fade-in">
            {lastExecuted ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 animate-bounce" />
                <span className="truncate">✓ Perintah: {lastExecuted}</span>
              </div>
            ) : unrecognizedPrompt ? (
              <div className="flex items-center gap-2 text-xs text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span className="truncate">
                  "{unrecognizedPrompt}" • Coba katakan: "Go to Halimon"
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 text-xs text-neutral-200">
                <div className="flex items-end gap-0.5 h-3.5 px-0.5">
                  <span className="w-1 bg-amber-400 rounded-full animate-pulse h-2" />
                  <span className="w-1 bg-amber-400 rounded-full animate-pulse h-3.5 delay-75" />
                  <span className="w-1 bg-amber-400 rounded-full animate-pulse h-2.5 delay-150" />
                </div>
                <span className="font-mono truncate">
                  {voiceState.message || 'Katakan "Go to Halimon"...'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Primary Mic Button & Guide Trigger */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Pill */}
          <div className="bg-neutral-900/90 border border-neutral-700/80 rounded-2xl p-1 flex items-center shadow-lg backdrop-blur-md">
            <button
              onClick={() => handleSelectLanguage('id-ID')}
              className={`px-2 py-1 rounded-xl text-[10px] font-bold transition-all ${
                voiceState.language === 'id-ID'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Bahasa Perintah: Indonesia"
            >
              ID
            </button>
            <button
              onClick={() => handleSelectLanguage('en-US')}
              className={`px-2 py-1 rounded-xl text-[10px] font-bold transition-all ${
                voiceState.language === 'en-US'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Voice Command Language: English"
            >
              EN
            </button>
          </div>

          {/* Help / Guide Trigger */}
          <button
            id="btn-voice-guide"
            onClick={() => setShowGuideModal(true)}
            className="p-2.5 rounded-2xl bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 border border-neutral-700/80 shadow-xl backdrop-blur-md transition-all active:scale-95"
            title="Daftar Perintah Suara (Voice Commands)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Main Voice Recognition Toggle Button */}
          <button
            id="btn-toggle-voice"
            onClick={handleToggleMic}
            className={`px-4 py-2.5 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-2.5 font-bold text-xs transition-all active:scale-95 group relative ${
              voiceState.isListening
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white border-red-400 ring-4 ring-red-500/30 shadow-red-500/30'
                : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border-neutral-700 hover:border-amber-400/60'
            }`}
            title={
              voiceState.isListening
                ? 'Klik untuk mematikan mikrofon (atau tekan V)'
                : 'Klik untuk mengaktifkan navigasi perintah suara (atau tekan V)'
            }
          >
            {voiceState.isListening ? (
              <>
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-4 h-4 rounded-full bg-red-400 animate-ping opacity-75" />
                  <Mic className="w-4 h-4 text-white relative z-10 animate-pulse" />
                </div>
                <span>Mendengarkan...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Perintah Suara</span>
                <span className="px-1.5 py-0.5 rounded-md bg-neutral-800 text-[10px] text-neutral-400 font-mono hidden sm:inline">
                  V
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Voice Command Cheat-Sheet Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-scale-in">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-neutral-100 flex items-center gap-2">
                    <span>Panduan Navigasi Perintah Suara</span>
                    <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                      Web Speech API
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Katakan frasa langsung atau klik contoh perintah untuk mencoba navigasi otomatis.
                  </p>
                </div>
              </div>

              <button
                id="close-voice-guide"
                onClick={() => setShowGuideModal(false)}
                className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              {!isSupported && (
                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-600/50 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-neutral-300">
                    <strong className="text-amber-300 block mb-1">Pemberitahuan Peramban:</strong>
                    Web Speech API membutuhkan peramban modern seperti Google Chrome, Microsoft Edge, atau Safari dengan izin mikrofon aktif. Anda tetap dapat mengklik frasa perintah di bawah untuk mencoba navigasi simulasi.
                  </div>
                </div>
              )}

              {/* Language Selection */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>Bahasa Pengenalan Suara:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSelectLanguage('id-ID')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      voiceState.language === 'id-ID'
                        ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Bahasa Indonesia (id-ID)
                  </button>
                  <button
                    onClick={() => handleSelectLanguage('en-US')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      voiceState.language === 'en-US'
                        ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    English (en-US)
                  </button>
                </div>
              </div>

              {/* Categorized Command Grids */}
              <div className="space-y-4">
                {sampleCommands.map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                      {cat.icon}
                      <span>{cat.category}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {cat.items.map((cmd, cIdx) => (
                        <div
                          key={cIdx}
                          onClick={() => {
                            // Test command execution directly by clicking
                            const parsed = voiceCommander['recognition']
                              ? voiceCommander['recognition']
                              : null;
                            const res = voiceCommander;
                            // Execute parsed command
                            const simulated = {
                              intent: null,
                              rawText: cmd.phrase,
                            };
                            import('../services/voiceCommander').then(({ parseVoiceCommand }) => {
                              const result = parseVoiceCommand(cmd.phrase);
                              if (result.intent) {
                                setLastExecuted(result.intent.label);
                                audioGuide.playAcousticChime(659.25);
                                onExecuteCommand(result);
                                setShowGuideModal(false);
                              }
                            });
                          }}
                          className="p-3 rounded-2xl bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800/80 hover:border-amber-500/50 cursor-pointer transition-all group flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-amber-300 group-hover:text-amber-200">
                              "{cmd.phrase}"
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:translate-x-0.5 group-hover:text-amber-400 transition-all" />
                          </div>
                          <span className="text-[11px] text-neutral-400 mt-1">
                            {cmd.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between">
              <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Tekan tombol pintas <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 font-mono text-[10px] text-neutral-300">V</kbd> pada papan ketik kapan saja.
              </span>

              <button
                onClick={() => {
                  setShowGuideModal(false);
                  if (!voiceState.isListening) {
                    voiceCommander.startListening();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Mulai Bicara Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
