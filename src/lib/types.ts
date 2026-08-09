export type SectionSlug = "geopolitics" | "markets" | "tech" | "sports";

export interface PanelModel {
  id: string;
  name: string;
  maker: string;
  /** Editorial beat — the role this model plays on the panel */
  beat: string;
  beatDescription: string;
  hue: string; // hex
  /** How this model tends to read the world — shown on its profile */
  tendencies: string[];
  sampleQuestionStance: string;
}

export interface ModelTake {
  modelId: string;
  /** Short stance label, e.g. "Escalation likely" */
  stance: string;
  text: string;
  /** Position on the story's crux question, -1 .. +1. Drives the strand fingerprint. */
  position: number;
}

export interface Story {
  slug: string;
  section: SectionSlug;
  headline: string;
  dek: string;
  image: string;
  imageAlt: string;
  date: string; // ISO
  displayDate: string;
  /** The crux — the one question the panel is actually split on */
  crux: string;
  body: string[];
  sources: string[];
  takes: ModelTake[];
  consensus: string;
  outlierModelId: string;
  outlierNote: string;
  /** 0..1 — how far apart the panel is on the crux */
  divergence: number;
}

export interface TickerItem {
  label: string;
  value: string;
  change: number; // percent
}

export interface Issue {
  date: string;
  displayDate: string;
  storySlugs: string[];
  summary: string;
}
