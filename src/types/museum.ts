export type WingId = 'kesultanan' | 'perang_semesta' | 'deklarasi_halimon' | 'rimba_gerilya';

export type ArtifactMeshType =
  | 'cap_sikureueng'
  | 'meriam_lada_sicupak'
  | 'peta_kuno_sumatra'
  | 'naskah_hikayat_prang_sabil'
  | 'rencong_cut_nyak_dien'
  | 'pita_darah_alue_simi'
  | 'naskah_deklarasi_1976'
  | 'arsip_acheh_institute_pbb'
  | 'bendera_bulan_bintang_1976'
  | 'buku_price_of_freedom'
  | 'mesin_ketik_drama_history'
  | 'radio_voice_of_free_acheh';

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface Exhibit {
  id: string;
  name: string;
  nativeTitle: string;
  wingId: WingId;
  era: string;
  year: string;
  provenance: string;
  material: string;
  dimensions: string;
  curatorNotes: string;
  diaryQuote?: {
    date: string;
    text: string;
    pageRef?: string;
  };
  audioNarration: string;
  audioDurationSeconds: number;
  highlightDetails: string[];
  timeline: TimelineEvent[];
  pedestalPosition: [number, number, number]; // x, y, z in 3D museum world
  meshType: ArtifactMeshType;
  accentColor: string;
  ambienceTheme: 'seurune' | 'rapai' | 'azan_rimba' | 'vivaldi_forest';
  xrayFeatures: {
    title: string;
    description: string;
  }[];
}

export interface WingInfo {
  id: WingId;
  name: string;
  subtitle: string;
  eraPeriod: string;
  bannerColor: string;
  description: string;
  entrancePosition: [number, number, number];
}

export interface GuidedTour {
  id: string;
  title: string;
  durationMinutes: number;
  summary: string;
  badge: string;
  stops: string[]; // Exhibit IDs
}

export type VRMode = 'none' | 'stereoscopic' | 'webxr';

export interface MuseumVisitorState {
  stampedExhibits: string[];
  bookmarkedExhibits: string[];
  activeExhibitId: string | null;
  inspectingExhibitId: string | null;
  activeTourId: string | null;
  tourStepIndex: number;
  isAudioPlaying: boolean;
  audioProgress: number; // 0 to 1
  audioCurrentTime: number;
  vrMode: VRMode;
  audioSpeed: number;
  curatorVoice: 'curator' | 'storyteller' | 'archivist';
  ambientSoundEnabled: boolean;
  graphicsQuality: 'high' | 'medium';
}
