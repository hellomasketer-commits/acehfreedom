import { SpeechRecognitionConstructor, SpeechRecognitionInstance, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../types/speech';
import { WingId } from '../types/museum';
import { EXHIBITS, MUSEUM_WINGS } from '../data/exhibits';

export type VoiceIntent =
  | { type: 'NAVIGATE_WING'; wingId: WingId; label: string }
  | { type: 'NAVIGATE_LOBBY'; label: string }
  | { type: 'NAVIGATE_EXHIBIT'; exhibitId: string; label: string }
  | { type: 'NEXT_EXHIBIT'; label: string }
  | { type: 'PREV_EXHIBIT'; label: string }
  | { type: 'START_AUDIO_TOUR'; label: string; tourId?: string }
  | { type: 'NEXT_TOUR_STOP'; label: string }
  | { type: 'PREV_TOUR_STOP'; label: string }
  | { type: 'EXIT_TOUR'; label: string }
  | { type: 'PLAY_AUDIO'; label: string }
  | { type: 'PAUSE_AUDIO'; label: string }
  | { type: 'RESUME_AUDIO'; label: string }
  | { type: 'OPEN_INSPECTOR'; label: string }
  | { type: 'CLOSE_INSPECTOR'; label: string }
  | { type: 'OPEN_PASSPORT'; label: string }
  | { type: 'CLOSE_PASSPORT'; label: string }
  | { type: 'OPEN_TIMELINE'; label: string }
  | { type: 'CLOSE_TIMELINE'; label: string }
  | { type: 'TOGGLE_VR'; label: string }
  | { type: 'SHOW_HELP'; label: string };

export interface CommandParseResult {
  intent: VoiceIntent | null;
  rawText: string;
  matchedRule?: string;
}

export function parseVoiceCommand(transcript: string): CommandParseResult {
  const clean = transcript
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!clean) {
    return { intent: null, rawText: transcript };
  }

  // 1. Navigation to Specific Wings (e.g. 'Go to Halimon', 'Ke Halimon', etc.)
  if (
    clean.includes('halimon') ||
    clean.includes('gunung tjokkan') ||
    clean.includes('sayap halimon') ||
    clean.includes('deklarasi halimon')
  ) {
    return {
      intent: { type: 'NAVIGATE_WING', wingId: 'deklarasi_halimon', label: 'Sayap Deklarasi Halimon 1976' },
      rawText: transcript,
      matchedRule: 'Go to Halimon',
    };
  }

  if (
    clean.includes('kesultanan') ||
    clean.includes('sultan') ||
    clean.includes('iskandar muda') ||
    clean.includes('daulat kesultanan')
  ) {
    return {
      intent: { type: 'NAVIGATE_WING', wingId: 'kesultanan', label: 'Sayap Daulat Kesultanan Aceh' },
      rawText: transcript,
      matchedRule: 'Go to Kesultanan',
    };
  }

  if (
    clean.includes('perang') ||
    clean.includes('semesta') ||
    clean.includes('syuhada') ||
    clean.includes('chik di tiro') ||
    clean.includes('war wing')
  ) {
    return {
      intent: { type: 'NAVIGATE_WING', wingId: 'perang_semesta', label: 'Sayap Perang Semesta & Syuhada' },
      rawText: transcript,
      matchedRule: 'Go to Perang Semesta',
    };
  }

  if (
    clean.includes('rimba') ||
    clean.includes('belantara') ||
    clean.includes('hutan') ||
    clean.includes('price of freedom') ||
    clean.includes('jungle')
  ) {
    return {
      intent: { type: 'NAVIGATE_WING', wingId: 'rimba_gerilya', label: 'Sayap Belantara & Price of Freedom' },
      rawText: transcript,
      matchedRule: 'Go to Rimba',
    };
  }

  // Lobby / Center
  if (
    clean.includes('lobby') ||
    clean.includes('lobi') ||
    clean.includes('pusat') ||
    clean.includes('entrance') ||
    clean.includes('pintu masuk') ||
    clean.includes('tengah') ||
    clean.includes('monumen')
  ) {
    return {
      intent: { type: 'NAVIGATE_LOBBY', label: 'Lobi & Monumen Halimon' },
      rawText: transcript,
      matchedRule: 'Go to Lobby',
    };
  }

  // 2. Audio Tour & Guided Tour controls (e.g. 'Start audio tour', 'Mulai tur', etc.)
  if (
    clean.includes('start audio tour') ||
    clean.includes('start tour') ||
    clean.includes('mulai tur audio') ||
    clean.includes('mulai tur') ||
    clean.includes('mulai panduan') ||
    clean.includes('audio tour') ||
    clean.includes('tur audio') ||
    clean.includes('start the tour')
  ) {
    return {
      intent: { type: 'START_AUDIO_TOUR', label: 'Tur Audio Jejak Halimon 1976' },
      rawText: transcript,
      matchedRule: 'Start audio tour',
    };
  }

  if (clean.includes('next stop') || clean.includes('perhentian berikutnya') || clean.includes('tur berikutnya')) {
    return {
      intent: { type: 'NEXT_TOUR_STOP', label: 'Perhentian Tur Berikutnya' },
      rawText: transcript,
      matchedRule: 'Next tour stop',
    };
  }

  if (clean.includes('previous stop') || clean.includes('perhentian sebelumnya') || clean.includes('tur sebelumnya')) {
    return {
      intent: { type: 'PREV_TOUR_STOP', label: 'Perhentian Tur Sebelumnya' },
      rawText: transcript,
      matchedRule: 'Previous tour stop',
    };
  }

  if (clean.includes('exit tour') || clean.includes('akhiri tur') || clean.includes('keluar tur') || clean.includes('stop tour')) {
    return {
      intent: { type: 'EXIT_TOUR', label: 'Akhiri Panduan Tur' },
      rawText: transcript,
      matchedRule: 'Exit tour',
    };
  }

  // 3. Audio Narration Controls (Play, Pause, Stop, Resume)
  if (
    clean.includes('stop audio') ||
    clean.includes('pause audio') ||
    clean.includes('hentikan audio') ||
    clean.includes('jeda audio') ||
    clean.includes('diam') ||
    clean.includes('matikan audio') ||
    clean.includes('pause narration')
  ) {
    return {
      intent: { type: 'PAUSE_AUDIO', label: 'Jeda Audio Narasi' },
      rawText: transcript,
      matchedRule: 'Pause audio',
    };
  }

  if (
    clean.includes('resume audio') ||
    clean.includes('lanjutkan audio') ||
    clean.includes('teruskan audio') ||
    clean.includes('unpause')
  ) {
    return {
      intent: { type: 'RESUME_AUDIO', label: 'Lanjutkan Audio Narasi' },
      rawText: transcript,
      matchedRule: 'Resume audio',
    };
  }

  if (
    clean.includes('play audio') ||
    clean.includes('start audio') ||
    clean.includes('putar audio') ||
    clean.includes('baca narasi') ||
    clean.includes('dengarkan audio') ||
    clean.includes('suara narasi')
  ) {
    return {
      intent: { type: 'PLAY_AUDIO', label: 'Putar Audio Narasi' },
      rawText: transcript,
      matchedRule: 'Play audio',
    };
  }

  // 4. Artifact Stepping
  if (
    clean.includes('next artifact') ||
    clean.includes('next exhibit') ||
    clean.includes('artefak berikutnya') ||
    clean.includes('selanjutnya') ||
    clean.includes('berikutnya') ||
    clean.includes('next')
  ) {
    return {
      intent: { type: 'NEXT_EXHIBIT', label: 'Artefak Selanjutnya' },
      rawText: transcript,
      matchedRule: 'Next exhibit',
    };
  }

  if (
    clean.includes('previous artifact') ||
    clean.includes('prev artifact') ||
    clean.includes('artefak sebelumnya') ||
    clean.includes('sebelumnya') ||
    clean.includes('kembali') ||
    clean.includes('previous')
  ) {
    return {
      intent: { type: 'PREV_EXHIBIT', label: 'Artefak Sebelumnya' },
      rawText: transcript,
      matchedRule: 'Previous exhibit',
    };
  }

  // 5. Specific Artifact Queries
  if (clean.includes('proklamasi') || clean.includes('naskah deklarasi') || clean.includes('teks deklarasi')) {
    return {
      intent: { type: 'NAVIGATE_EXHIBIT', exhibitId: 'naskah_deklarasi_1976', label: 'Naskah Deklarasi Kemerdekaan 1976' },
      rawText: transcript,
      matchedRule: 'Naskah Deklarasi',
    };
  }

  if (clean.includes('buku harian') || clean.includes('price of freedom') || clean.includes('catatan harian')) {
    return {
      intent: { type: 'NAVIGATE_EXHIBIT', exhibitId: 'buku_price_of_freedom', label: 'Buku Catatan The Price of Freedom' },
      rawText: transcript,
      matchedRule: 'Buku Price of Freedom',
    };
  }

  if (clean.includes('sikureueng') || clean.includes('segel sembilan') || clean.includes('cap sultan')) {
    return {
      intent: { type: 'NAVIGATE_EXHIBIT', exhibitId: 'cap_sikureueng', label: 'Cap Sikureueng Segel Sembilan' },
      rawText: transcript,
      matchedRule: 'Cap Sikureueng',
    };
  }

  if (clean.includes('meriam') || clean.includes('lada sicupak')) {
    return {
      intent: { type: 'NAVIGATE_EXHIBIT', exhibitId: 'meriam_lada_sicupak', label: 'Meriam Lada Sicupak Utsmaniyah' },
      rawText: transcript,
      matchedRule: 'Meriam Lada Sicupak',
    };
  }

  if (clean.includes('peta kuno') || clean.includes('peta london') || clean.includes('peta sumatra')) {
    return {
      intent: { type: 'NAVIGATE_EXHIBIT', exhibitId: 'peta_kuno_sumatra', label: 'Peta Kuno Kedaulatan Sumatra' },
      rawText: transcript,
      matchedRule: 'Peta Kuno Sumatra',
    };
  }

  if (clean.includes('prang sabil') || clean.includes('hikayat')) {
    return {
      intent: { type: 'NAVIGATE_EXHIBIT', exhibitId: 'naskah_hikayat_prang_sabil', label: 'Naskah Hikayat Prang Sabil' },
      rawText: transcript,
      matchedRule: 'Hikayat Prang Sabil',
    };
  }

  if (clean.includes('rencong') || clean.includes('cut nyak')) {
    return {
      intent: { type: 'NAVIGATE_EXHIBIT', exhibitId: 'rencong_cut_nyak_dien', label: 'Rencong Pusaka Cut Nyak Dhien' },
      rawText: transcript,
      matchedRule: 'Rencong Cut Nyak Dhien',
    };
  }

  if (clean.includes('pita darah') || clean.includes('alue simi') || clean.includes('syuhada tiro')) {
    return {
      intent: { type: 'NAVIGATE_EXHIBIT', exhibitId: 'pita_darah_alue_simi', label: 'Pita Darah Perjuangan Alue Simi' },
      rawText: transcript,
      matchedRule: 'Pita Darah Alue Simi',
    };
  }

  if (clean.includes('arsip pbb') || clean.includes('un archives') || clean.includes('acheh institute')) {
    return {
      intent: { type: 'NAVIGATE_EXHIBIT', exhibitId: 'arsip_acheh_institute_pbb', label: 'Arsip Diplomasi PBB New York' },
      rawText: transcript,
      matchedRule: 'Arsip Diplomasi PBB',
    };
  }

  if (clean.includes('bendera') || clean.includes('bulan bintang')) {
    return {
      intent: { type: 'NAVIGATE_EXHIBIT', exhibitId: 'bendera_bulan_bintang_1976', label: 'Bendera Bulan Bintang 1976' },
      rawText: transcript,
      matchedRule: 'Bendera Bulan Bintang',
    };
  }

  if (clean.includes('mesin ketik') || clean.includes('typewriter') || clean.includes('sandiwara sejarah')) {
    return {
      intent: { type: 'NAVIGATE_EXHIBIT', exhibitId: 'mesin_ketik_drama_history', label: 'Mesin Ketik Naskah Sejarah' },
      rawText: transcript,
      matchedRule: 'Mesin Ketik Sejarah',
    };
  }

  if (clean.includes('radio') || clean.includes('voice of free acheh') || clean.includes('pemancar')) {
    return {
      intent: { type: 'NAVIGATE_EXHIBIT', exhibitId: 'radio_voice_of_free_acheh', label: 'Pemancar Radio Voice of Free Acheh' },
      rawText: transcript,
      matchedRule: 'Radio Voice of Free Acheh',
    };
  }

  // 6. UI Inspections & Modals
  if (
    clean.includes('inspect') ||
    clean.includes('periksa') ||
    clean.includes('lihat 3d') ||
    clean.includes('buka periksa') ||
    clean.includes('detail artefak')
  ) {
    return {
      intent: { type: 'OPEN_INSPECTOR', label: 'Buka Pemeriksaan 3D' },
      rawText: transcript,
      matchedRule: 'Open inspector',
    };
  }

  if (clean.includes('tutup periksa') || clean.includes('close inspector') || clean.includes('tutup detail')) {
    return {
      intent: { type: 'CLOSE_INSPECTOR', label: 'Tutup Pemeriksaan 3D' },
      rawText: transcript,
      matchedRule: 'Close inspector',
    };
  }

  if (clean.includes('passport') || clean.includes('paspor') || clean.includes('buka paspor')) {
    return {
      intent: { type: 'OPEN_PASSPORT', label: 'Buka Paspor Pengunjung' },
      rawText: transcript,
      matchedRule: 'Open passport',
    };
  }

  if (clean.includes('tutup paspor') || clean.includes('close passport')) {
    return {
      intent: { type: 'CLOSE_PASSPORT', label: 'Tutup Paspor Pengunjung' },
      rawText: transcript,
      matchedRule: 'Close passport',
    };
  }

  if (clean.includes('timeline') || clean.includes('linimasa') || clean.includes('buka linimasa')) {
    return {
      intent: { type: 'OPEN_TIMELINE', label: 'Buka Linimasa Kronologi' },
      rawText: transcript,
      matchedRule: 'Open timeline',
    };
  }

  if (clean.includes('tutup linimasa') || clean.includes('close timeline')) {
    return {
      intent: { type: 'CLOSE_TIMELINE', label: 'Tutup Linimasa Kronologi' },
      rawText: transcript,
      matchedRule: 'Close timeline',
    };
  }

  if (clean.includes('vr') || clean.includes('virtual reality') || clean.includes('stereoskopik')) {
    return {
      intent: { type: 'TOGGLE_VR', label: 'Alihkan Mode VR' },
      rawText: transcript,
      matchedRule: 'Toggle VR',
    };
  }

  if (
    clean.includes('help') ||
    clean.includes('bantuan') ||
    clean.includes('perintah') ||
    clean.includes('commands') ||
    clean.includes('suara')
  ) {
    return {
      intent: { type: 'SHOW_HELP', label: 'Panduan Perintah Suara' },
      rawText: transcript,
      matchedRule: 'Help commands',
    };
  }

  return { intent: null, rawText: transcript };
}

export class VoiceRecognitionManager {
  private recognition: SpeechRecognitionInstance | null = null;
  private isListeningInternal = false;
  private currentLanguage: 'id-ID' | 'en-US' = 'id-ID';
  private onResultCallback: ((result: CommandParseResult) => void) | null = null;
  private onStateChangeCallback: ((state: VoiceState) => void) | null = null;
  private interimTranscript = '';
  private finalTranscript = '';
  private shouldRestart = false;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI: SpeechRecognitionConstructor | undefined =
      (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      return;
    }

    try {
      const rec = new SpeechRecognitionAPI();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = this.currentLanguage;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        this.isListeningInternal = true;
        this.notifyState('listening', 'Mendengarkan suara Anda...');
      };

      rec.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            final += res[0].transcript;
          } else {
            interim += res[0].transcript;
          }
        }

        this.interimTranscript = interim;
        if (final) {
          this.finalTranscript = final;
          const parsed = parseVoiceCommand(final);
          if (this.onResultCallback) {
            this.onResultCallback(parsed);
          }
        }

        this.notifyState(
          'listening',
          interim ? `"${interim}..."` : final ? `"${final}"` : 'Mendengarkan...'
        );
      };

      rec.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === 'no-speech') {
          // Normal timeout waiting for speech
          return;
        }
        if (event.error === 'not-allowed') {
          this.isListeningInternal = false;
          this.shouldRestart = false;
          this.notifyState('error', 'Izin mikrofon ditolak oleh peramban');
          return;
        }
        this.notifyState('error', `Kesalahan suara: ${event.error}`);
      };

      rec.onend = () => {
        this.isListeningInternal = false;
        if (this.shouldRestart) {
          // Auto restart if continuous listening was requested
          try {
            rec.start();
          } catch {
            // Safe ignore
          }
        } else {
          this.notifyState('idle', 'Mikrofon siaga');
        }
      };

      this.recognition = rec;
    } catch {
      this.recognition = null;
    }
  }

  public isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
    );
  }

  public setLanguage(lang: 'id-ID' | 'en-US') {
    this.currentLanguage = lang;
    if (this.recognition) {
      const wasListening = this.isListeningInternal;
      if (wasListening) {
        this.stopListening();
      }
      this.recognition.lang = lang;
      if (wasListening) {
        this.startListening();
      }
    }
  }

  public getLanguage(): 'id-ID' | 'en-US' {
    return this.currentLanguage;
  }

  public startListening() {
    if (!this.recognition) {
      this.initRecognition();
    }
    if (!this.recognition) {
      this.notifyState('error', 'Web Speech API tidak didukung di peramban ini');
      return;
    }

    try {
      this.shouldRestart = true;
      this.interimTranscript = '';
      this.finalTranscript = '';
      this.recognition.lang = this.currentLanguage;
      this.recognition.start();
    } catch {
      // Already running or starting
    }
  }

  public stopListening() {
    this.shouldRestart = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore
      }
    }
    this.isListeningInternal = false;
    this.notifyState('idle', 'Mikrofon nonaktif');
  }

  public toggleListening() {
    if (this.isListeningInternal) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  public isListening(): boolean {
    return this.isListeningInternal;
  }

  public onCommand(callback: (result: CommandParseResult) => void) {
    this.onResultCallback = callback;
  }

  public onStateChange(callback: (state: VoiceState) => void) {
    this.onStateChangeCallback = callback;
  }

  private notifyState(status: VoiceState['status'], message: string) {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({
        status,
        message,
        isListening: this.isListeningInternal,
        interimTranscript: this.interimTranscript,
        finalTranscript: this.finalTranscript,
        language: this.currentLanguage,
      });
    }
  }
}

export interface VoiceState {
  status: 'idle' | 'listening' | 'recognized' | 'error';
  message: string;
  isListening: boolean;
  interimTranscript: string;
  finalTranscript: string;
  language: 'id-ID' | 'en-US';
}

export const voiceCommander = new VoiceRecognitionManager();
