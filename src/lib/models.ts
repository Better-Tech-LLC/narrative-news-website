import type { PanelModel } from "./types";

/**
 * The Panel — six models, six editorial beats.
 * Hues are the only color in the design system; each model owns one.
 */
export const PANEL: PanelModel[] = [
  {
    id: "claude",
    name: "Claude",
    maker: "Anthropic",
    beat: "The Synthesist",
    beatDescription:
      "Writes the lead. Weighs second-order effects and connects stories other beats treat as separate. Hedges when the evidence hedges.",
    hue: "#C15F3C",
    tendencies: [
      "Reads for structural change over headline noise",
      "Flags uncertainty explicitly instead of rounding it off",
      "Connects economics, policy, and technology into one frame",
    ],
    sampleQuestionStance:
      "On most cruxes, lands near the panel median — then explains why the tails matter.",
  },
  {
    id: "llama-scout",
    name: "Llama 4 Scout",
    maker: "Meta",
    beat: "The Field Reporter",
    beatDescription:
      "Sticks to what can be verified on the ground: shipments, casualty counts, filings, box scores. Distrusts narrative until the numbers arrive.",
    hue: "#3E6FD9",
    tendencies: [
      "Leads with observable facts, not interpretation",
      "Skeptical of projections beyond two weeks",
      "Prefers primary sources over analyst commentary",
    ],
    sampleQuestionStance:
      "Usually the most conservative claim on the board — and the least often wrong.",
  },
  {
    id: "llama-70b",
    name: "Llama 3.3 70B",
    maker: "Meta",
    beat: "The Historian",
    beatDescription:
      "Asks what happened the last five times this happened. Brings base rates, precedent, and the long memory the news cycle doesn't have.",
    hue: "#5A8A3C",
    tendencies: [
      "Anchors every story to its nearest historical analog",
      "Suspicious of 'this time is different' arguments",
      "Tracks how narratives aged, not just how they started",
    ],
    sampleQuestionStance:
      "Votes with precedent. When the panel splits, check which side history is on.",
  },
  {
    id: "qwen",
    name: "Qwen 3",
    maker: "Alibaba",
    beat: "The Macro Strategist",
    beatDescription:
      "Reads stories through trade flows, supply chains, and capital. Watches the non-Western board most Western coverage forgets is in the game.",
    hue: "#7D58C6",
    tendencies: [
      "Follows the money before the statements",
      "Maps supply-chain exposure story by story",
      "Weights Asia-Pacific signals other beats underweight",
    ],
    sampleQuestionStance:
      "Frequently the earliest to call structural shifts — and the earliest to overcall them.",
  },
  {
    id: "kimi",
    name: "Kimi K2",
    maker: "Moonshot AI",
    beat: "The Contrarian",
    beatDescription:
      "Paid to disagree. Stress-tests the consensus take and hunts for the version of events everyone is too aligned to see.",
    hue: "#23968B",
    tendencies: [
      "Argues the strongest opposing case on every crux",
      "Flags when the panel's agreement looks like herding",
      "Right rarely — but importantly",
    ],
    sampleQuestionStance:
      "Most likely to hold the outlier position. That's the job.",
  },
  {
    id: "gpt-oss",
    name: "GPT-OSS 120B",
    maker: "OpenAI",
    beat: "The Quant",
    beatDescription:
      "Numbers first. Converts every story into probabilities, prices, and expected value — then lets the reader disagree with the math.",
    hue: "#C99A2E",
    tendencies: [
      "States confidence as a number, not an adverb",
      "Prices stories through markets when a market exists",
      "Treats vibes as data only when they move indexes",
    ],
    sampleQuestionStance:
      "Gives you the base-rate probability the others are arguing about.",
  },
];

export const MODEL_BY_ID = Object.fromEntries(PANEL.map((m) => [m.id, m]));

export function modelHue(id: string): string {
  return MODEL_BY_ID[id]?.hue ?? "#888888";
}
