/**
 * Spoken-briefing manifest. OVERWRITTEN by scripts/pull-content.mjs (prebuild).
 */
export interface AudioSegment {
  slug: string;
  headline: string;
  section: string;
  src: string;
}
export interface AudioIssue {
  date: string;
  displayDate: string;
  segments: AudioSegment[];
}
export const AUDIO: Record<string, AudioIssue> = {
  "2026-08-09": {
    "date": "2026-08-09",
    "segments": [
      {
        "src": "https://gbthuftvbbdtettsynue.supabase.co/storage/v1/object/public/media/audio/2026-08-09/senate-russia-sanctions-bill-advances-against-oil-buyers.wav",
        "slug": "senate-russia-sanctions-bill-advances-against-oil-buyers",
        "section": "geopolitics",
        "headline": "U.S. Senate advances sanctions bill aimed at buyers of Russian oil"
      },
      {
        "src": "https://gbthuftvbbdtettsynue.supabase.co/storage/v1/object/public/media/audio/2026-08-09/wall-street-logs-late-week-risk-off-after-senate-russia-bill.wav",
        "slug": "wall-street-logs-late-week-risk-off-after-senate-russia-bill",
        "section": "markets",
        "headline": "Markets weigh new U.S. sanctions risk as Russia oil buyers face tariff threat"
      },
      {
        "src": "https://gbthuftvbbdtettsynue.supabase.co/storage/v1/object/public/media/audio/2026-08-09/pentagon-revises-nuclear-guidance-amid-ai-and-defense-competition.wav",
        "slug": "pentagon-revises-nuclear-guidance-amid-ai-and-defense-competition",
        "section": "tech",
        "headline": "Pentagon moves to loosen nuclear employment guidance in major defense-tech shift"
      },
      {
        "src": "https://gbthuftvbbdtettsynue.supabase.co/storage/v1/object/public/media/audio/2026-08-09/british-open-wing-walker-breaks-own-world-record.wav",
        "slug": "british-open-wing-walker-breaks-own-world-record",
        "section": "sports",
        "headline": "97-year-old British woman breaks her own world record in wing walking"
      }
    ],
    "displayDate": "August 9, 2026"
  }
};
