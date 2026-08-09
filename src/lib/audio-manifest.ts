/**
 * Spoken-briefing manifest. OVERWRITTEN by scripts/generate-audio.mjs.
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
    "displayDate": "August 9, 2026",
    "segments": [
      {
        "slug": "senate-passes-russia-sanctions-bill",
        "headline": "U.S. Senate passes sweeping Russia sanctions bill targeting oil buyers",
        "section": "geopolitics",
        "src": "/audio/2026-08-09/senate-passes-russia-sanctions-bill.m4a"
      },
      {
        "slug": "senate-russia-bill-rattles-energy-and-shipping-markets",
        "headline": "Russia sanctions drive fresh risk in energy markets as traders gauge tariff spillovers",
        "section": "markets",
        "src": "/audio/2026-08-09/senate-russia-bill-rattles-energy-and-shipping-markets.m4a"
      },
      {
        "slug": "pentagon-loosens-nuclear-guidance-ai-debate",
        "headline": "Pentagon weighs looser nuclear employment guidance in era of AI and great-power rivalry",
        "section": "tech",
        "src": "/audio/2026-08-09/pentagon-loosens-nuclear-guidance-ai-debate.m4a"
      },
      {
        "slug": "typhoon-dolphin-disrupts-japan-sports-travel",
        "headline": "Typhoon Dolphin disrupts Japan travel as weather threatens late-summer sports schedules",
        "section": "sports",
        "src": "/audio/2026-08-09/typhoon-dolphin-disrupts-japan-sports-travel.m4a"
      }
    ]
  }
};
