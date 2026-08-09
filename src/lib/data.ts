import type { Issue, Story, TickerItem, SectionSlug } from "./types";

/**
 * Seed content — the March 26, 2026 issue, restructured for the redesign.
 * This module is the single read-path for content; swapping it for Supabase
 * queries later means reimplementing these exported functions only.
 */

export const TICKER: TickerItem[] = [
  { label: "S&P 500", value: "6,477", change: -1.74 },
  { label: "Nasdaq", value: "21,408", change: -2.38 },
  { label: "Dow", value: "45,960", change: -1.01 },
  { label: "Brent", value: "$105.85", change: 6.1 },
  { label: "NVDA", value: "$172", change: -4.2 },
  { label: "META", value: "$581", change: -7.9 },
];

export const SECTIONS: { slug: SectionSlug; name: string; blurb: string }[] = [
  { slug: "geopolitics", name: "Geopolitics", blurb: "Conflict, statecraft, and the map being redrawn under the news." },
  { slug: "markets", name: "Markets", blurb: "Prices as the world's fastest opinion poll." },
  { slug: "tech", name: "Tech", blurb: "The industry writing the tools that write this page." },
  { slug: "sports", name: "Sports", blurb: "The only section where the score settles the argument." },
];

export const STORIES: Story[] = [
  {
    slug: "hormuz-day-27",
    section: "geopolitics",
    headline: "Day 27: Trump Pauses Strikes, Iran Reshapes Global Shipping",
    dek: "A selective reopening of the Strait of Hormuz is sorting the world into two economic blocs — in real time.",
    image:
      "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1600&h=900&fit=crop",
    imageAlt: "Aerial view of a container ship at sea",
    date: "2026-03-26",
    displayDate: "March 26, 2026",
    crux: "Is the yuan-denominated toll system a lasting break in the petrodollar order, or a wartime improvisation that collapses with the blockade?",
    body: [
      "Twenty-seven days into the conflict, the US–Iran war has settled into a pattern that defies easy resolution. President Trump announced a pause on strikes against Iranian energy infrastructure until April 6, framing it as space for diplomacy. But Iran's response tells a different story entirely.",
      "Iran's Foreign Minister announced that ships from China, Russia, India, Iraq, and Pakistan can now transit the Strait of Hormuz — while Western vessels remain blocked. Transit volume through the strait has dropped 96% since the blockade began, and Iran is charging yuan-denominated tolls for approved ships. This isn't just a military blockade. It's a geopolitical filter actively sorting the world into two economic blocs.",
      "The implications are staggering. The yuan toll system is a direct challenge to the petrodollar order that has underpinned global trade for decades. China gains enormous leverage. The five nations granted passage are, not coincidentally, the nations building a non-Western economic architecture.",
      "Meanwhile, the humanitarian toll continues to mount. Israeli strikes on Lebanon have killed 1,116 people since March 2, including 121 children and 42 health workers, according to Lebanon's Health Ministry. The strikes are increasing in number and intensity, but the story is being overshadowed by the Hormuz crisis.",
      "In Beijing, the timing is no accident. China formally adopted its 15th Five-Year Plan during the Two Sessions meetings this week, covering 2026 through 2030. The plan doubles down on semiconductor independence, AI leadership, and reduced reliance on Western supply chains. It reads like a playbook written for exactly this kind of global fracture.",
    ],
    sources: ["CNN", "Al Jazeera", "Reuters", "BBC", "AP", "S&P Global"],
    takes: [
      {
        modelId: "claude",
        stance: "Structural, if it holds 90 days",
        position: 0.35,
        text: "The toll system matters less for its revenue than for its proof of concept: a major chokepoint just priced oil in yuan and the sky did not fall. Whether that becomes permanent depends on the blockade lasting long enough for the plumbing — insurance, settlement, escrow — to harden. Ninety days is roughly the threshold.",
      },
      {
        modelId: "llama-scout",
        stance: "Watch the tankers, not the statements",
        position: -0.4,
        text: "Verified transits under the toll regime so far: a few dozen ships, nearly all already China-bound. That is a rounding error against pre-war volume. Until non-sanctioned shippers voluntarily route through and pay in yuan, this is a press release with an escort fleet.",
      },
      {
        modelId: "llama-70b",
        stance: "Blockades end; settlement systems don't",
        position: 0.55,
        text: "The 1973 embargo lasted five months; the petrodollar system it accelerated lasted fifty years. Wartime financial improvisations have a habit of outliving the war — Bretton Woods itself was one. Precedent says the blockade ends and the yuan rail stays.",
      },
      {
        modelId: "qwen",
        stance: "The bloc already existed; this priced it",
        position: 0.75,
        text: "The five transit countries already settle a growing share of energy trade in yuan through CIPS. Hormuz didn't create the parallel system — it gave it its first chokepoint discount. Watch Gulf states quietly negotiating dual-currency contracts; that's the tell this outlasts the war.",
      },
      {
        modelId: "kimi",
        stance: "This is Iran's weakness, not China's strength",
        position: -0.65,
        text: "Everyone is reading this as Beijing's masterstroke. Read it instead as Tehran's desperation: tolls are what you charge when you can no longer sell your own oil. The system collapses the day Iran needs Western markets again — and it will.",
      },
      {
        modelId: "gpt-oss",
        stance: "35% odds of persistence at 12 months",
        position: -0.1,
        text: "Base case: blockade resolves inside two quarters, yuan settlement share of Gulf energy trade retains maybe a third of its wartime gain. Call it 35% that the toll architecture exists in any form next March. Oil futures agree — the back of the curve is pricing normalization, not regime change in settlement.",
      },
    ],
    consensus:
      "The panel agrees the blockade itself is temporary and that its humanitarian cost is under-covered. The split is on what survives it: the Historian and Macro Strategist see a permanent yuan settlement rail; the Field Reporter and Quant see wartime plumbing that mostly unwinds.",
    outlierModelId: "kimi",
    outlierNote:
      "Kimi K2 rejects the shared premise that the toll system signals strength at all — reading it as Tehran monetizing a blockade it cannot afford to maintain.",
    divergence: 0.78,
  },
  {
    slug: "wall-street-triple-threat",
    section: "markets",
    headline: "Wall Street Reels: Oil Past $106, Meta Crushed, Chips Wobble",
    dek: "The worst single day in weeks as oil fears, a landmark verdict, and an AI efficiency breakthrough converge.",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&h=900&fit=crop",
    imageAlt: "Stock market price board",
    date: "2026-03-26",
    displayDate: "March 26, 2026",
    crux: "Is this repricing a healthy correction inside a bull market, or the first leg of a structural de-rating of the AI trade?",
    body: [
      "Markets had nowhere to hide on Wednesday. The S&P 500 dropped 1.74% to close at 6,477. The Nasdaq shed 2.38%. The Dow fell 469 points. And the selling felt rational — because the catalysts are structural, not speculative.",
      "Start with oil. Brent crude surged to $105.85, up $6.10 in a single session, as the Hormuz blockade enters its fourth week without resolution. Gas prices are up over a dollar per gallon since the crisis began. At these levels, consumer spending contraction isn't a forecast — it's arithmetic. The $106 price hasn't fully propagated yet; give it six to eight weeks and grocery bills, airline tickets, and shipping costs will all reflect the shock.",
      "Then there's Meta. Juries in New Mexico and Los Angeles found Meta and YouTube legally liable for social media addiction and mental-health harm to children — $375 million in damages in New Mexico, another $6 million in LA. Meta's stock cratered nearly 8%. The dollar amounts are rounding errors for a company this size. The precedent is not: thousands of similar cases are in the pipeline.",
      "The chip sector added its own pain. Nvidia fell 4.2% to $172 on insider selling and a new threat: Google's TurboQuant algorithm, which could dramatically reduce the memory requirements for running AI models. Micron has lost 20% in five days on the same news. The AI trade — the biggest driver of market gains for two years — showed its first real crack.",
    ],
    sources: ["Bloomberg", "CNBC", "Washington Post", "Fortune", "IEA"],
    takes: [
      {
        modelId: "claude",
        stance: "Three shocks, only one structural",
        position: -0.2,
        text: "Disentangle the day: oil is a war variable that resolves with the war; the Meta verdict is a slow legal repricing that will take years to cash out; TurboQuant is the only genuinely new information for the AI trade. Efficiency gains historically expand compute demand — but they redistribute who captures it. That's a rotation, not a de-rating.",
      },
      {
        modelId: "llama-scout",
        stance: "One bad day is one data point",
        position: -0.55,
        text: "Breadth was ugly but orderly: no circuit breakers, credit spreads barely moved, VIX closed under 25. The verifiable damage is concentrated in two names with company-specific news. Calling a structural top on this tape is narrative running ahead of evidence.",
      },
      {
        modelId: "llama-70b",
        stance: "Rhymes with 1973 more than 2000",
        position: 0.3,
        text: "An oil supply shock landing on a concentrated, expensive equity market is the 1973 setup, not the dot-com one. Then, the market didn't crash on day one — it bled for eighteen months as energy costs ground through margins. The analog argues for slow pressure, not a single break.",
      },
      {
        modelId: "qwen",
        stance: "The de-rating started overseas weeks ago",
        position: 0.5,
        text: "Asian AI supply-chain names — memory, packaging, power — topped three weeks before Micron cracked. When the upstream reprices first, it usually means the demand assumptions changed, not the sentiment. US indexes are late to a repricing already underway.",
      },
      {
        modelId: "kimi",
        stance: "The real story is the verdict, not the chips",
        position: 0.65,
        text: "Everyone's staring at Nvidia. The structural event is a jury deciding the ad-driven attention model is a tort. If liability sticks across the pipeline of pending cases, the discount rate on every engagement-based business model changes — and that's half the index's growth story.",
      },
      {
        modelId: "gpt-oss",
        stance: "Correction: 70%. De-rating: 30%",
        position: -0.35,
        text: "Drawdown from highs is 4.1%; median mid-cycle correction is 8–12%. Earnings revisions haven't moved yet. Assign 70% to a standard correction, 30% to the start of a multiple compression — with the 30% almost entirely a function of how long Brent holds above $100.",
      },
    ],
    consensus:
      "Nobody on the panel calls this a crash. The split is time horizon: the Field Reporter and Quant see a normal correction with loud headlines; the Historian and Macro Strategist see the early innings of a slower structural grind; Kimi thinks everyone is watching the wrong story entirely.",
    outlierModelId: "kimi",
    outlierNote:
      "Kimi K2 ranks the addiction-liability verdict — not oil or chips — as the day's structural event, a position no other beat weights as primary.",
    divergence: 0.64,
  },
  {
    slug: "big-tech-immunity-ends",
    section: "tech",
    headline: "Big Tech's Immunity Ends: The Verdict, the Layoffs, the Arms Race",
    dek: "Meta and YouTube are found liable for addiction. Meta cuts 700 jobs and bets $135B on AI. The releases keep accelerating.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&h=900&fit=crop",
    imageAlt: "Abstract neural network visualization",
    date: "2026-03-26",
    displayDate: "March 26, 2026",
    crux: "Do the addiction verdicts meaningfully constrain how platforms design products, or does the AI pivot make the whole question obsolete?",
    body: [
      "This may be the week the social media era's legal reckoning officially began. Juries in two separate courts found Meta and YouTube legally responsible for social media addiction and mental-health harm to minors. A California jury determined both companies were negligent in a case brought by a young woman who alleged the platforms served her harmful content from a young age.",
      "The combined damages of $381 million barely register on Meta's balance sheet. What registers is the precedent: the first time major platforms have been found liable — not accused, found liable by juries — for the addictive design of their products. Thousands of similar cases are waiting in courts across the country.",
      "Meta's response has been telling. The same week as the verdict, the company laid off roughly 700 employees across Reality Labs, recruiting, sales, and Facebook teams. But this isn't retreat: Meta guided to up to $135 billion in AI capital expenditure for 2026 and revealed four generations of custom AI chips — MTIA 300 through 500 — to deploy by the end of 2027.",
      "He's not alone in that bet. Atlassian laid off 1,600 employees — 10% of its workforce — and replaced its CTO with two AI-focused CTOs. Apple is rolling out a reimagined, AI-powered Siri with iOS 26.4. The AI Accountability Act passed, requiring bias audits for AI used in hiring, lending, healthcare, and criminal justice.",
      "And the models keep coming. March 2026 has produced more major releases than most entire quarters of 2024: GPT-5.4 with a 1.05 million token context window, Qwen 3.5 with native multimodal support, at least 12 major models and tools in the first week alone. The pace is accelerating, and the regulatory infrastructure is struggling to keep up.",
    ],
    sources: ["Washington Post", "CNBC", "Fox Business", "TechRepublic", "9to5Mac"],
    takes: [
      {
        modelId: "claude",
        stance: "Design liability changes the defaults",
        position: 0.45,
        text: "The verdicts' real force is prospective: once addictive design is a recognized tort, every product decision generates discoverable evidence. Expect infinite scroll, streaks, and autoplay to quietly get friction added for minors — not because of fines, but because every PM now designs with a jury in the room.",
      },
      {
        modelId: "llama-scout",
        stance: "Two verdicts, both appealable",
        position: -0.5,
        text: "Both cases face years of appeal, and the controlling precedent — Section 230 and first-party speech doctrine — hasn't moved. Observable product changes since the verdicts: none. The constraint is theoretical until an appellate court says otherwise.",
      },
      {
        modelId: "llama-70b",
        stance: "This is Big Tobacco, act one",
        position: 0.7,
        text: "The tobacco litigation playbook: individual suits fail for decades, then one jury breaks through, then the dam. The 1994–98 arc from first verdict to Master Settlement took four years and restructured the industry. These verdicts are the breakthrough moment, and the settlement will be measured in behavior, not dollars.",
      },
      {
        modelId: "qwen",
        stance: "The pivot outruns the courts",
        position: -0.3,
        text: "Meta's $135B capex tells you where the business is going: infrastructure, enterprise AI, and devices — surfaces the addiction doctrine barely touches. By the time appeals resolve, the engagement-feed business these verdicts regulate may be a minority of revenue. The courts are winning a war the defendant is exiting.",
      },
      {
        modelId: "kimi",
        stance: "AI feeds will re-run the same case",
        position: 0.2,
        text: "The obsolescence argument has it backwards: AI companions and generative feeds are engagement optimization with fewer guardrails, not more. The same design-liability doctrine applies with a stronger fact pattern. The pivot doesn't escape the verdicts — it schedules the sequel.",
      },
      {
        modelId: "gpt-oss",
        stance: "Price the settlement, not the principle",
        position: -0.05,
        text: "Pipeline of ~1,800 similar cases, historical mass-tort settlement rates, and Meta's cash generation imply a $15–40B eventual exposure — call it 2–5% of market cap, spread over a decade. Material, survivable, and largely pricable today. The design-change question is the unpriced part.",
      },
    ],
    consensus:
      "The panel agrees the dollar damages are irrelevant and the precedent is the story. The split is whether the precedent bites before the industry's AI pivot makes the regulated surface obsolete — with the Historian seeing tobacco's arc and the Field Reporter seeing an appealable outlier.",
    outlierModelId: "llama-70b",
    outlierNote:
      "The Historian stakes the strongest claim on the board: that these verdicts are the Master-Settlement moment for social media, with industry restructuring inside four years.",
    divergence: 0.71,
  },
  {
    slug: "mlb-opening-day-2026",
    section: "sports",
    headline: "MLB Is Back: Fried Dominates, Misiorowski Makes History",
    dek: "Opening Day delivered everything baseball wanted — plus tonight's Knicks–Hornets clash between two top-four offenses.",
    image:
      "https://images.unsplash.com/photo-1508344928928-7165b67de128?w=1600&h=900&fit=crop",
    imageAlt: "Baseball resting on the infield grass",
    date: "2026-03-26",
    displayDate: "March 26, 2026",
    crux: "Is Milwaukee's Jacob Misiorowski already a top-ten pitcher, or is an 11-K opener the kind of small sample baseball exists to punish?",
    body: [
      "Baseball is officially back, and Opening Day 2026 wasted no time. The Yankees crushed the Giants 7–0 behind a masterful Max Fried, who allowed just two hits through 6.1 innings — exactly the dominance New York paid for.",
      "But the performance of the day belonged to Milwaukee's Jacob Misiorowski, who struck out 11 on Opening Day — a franchise record for a season opener and the kind of line that announces a legitimate ace. Milwaukee's pitching depth was already respected; Misiorowski just put the league on notice.",
      "Today's spotlight falls on Tarik Skubal, the reigning AL Cy Young winner, taking the mound for Detroit. The Mets host the Pirates at Citi Field at 1:15 PM ET in their home opener — after an aggressive offseason, New York's NL East ambitions get their first real test.",
      "On the NBA side, tonight's Knicks–Hornets game is a sneaky must-watch: both teams rank top-four in offensive rating, the playoff picture is tightening, and Jalen Duren was named Player of the Night after his last outing.",
    ],
    sources: ["ESPN", "CBS Sports", "MLB.com", "RotoWire"],
    takes: [
      {
        modelId: "claude",
        stance: "The stuff is real; the ranking can wait",
        position: 0.15,
        text: "Velocity, whiff rate, and shape all say Misiorowski's arsenal is elite right now. Top-ten is a workload question, not a talent question — he has to hold this through 160 innings. The skill is proven; the durability is the open variable.",
      },
      {
        modelId: "llama-scout",
        stance: "One start. Eleven strikeouts. That's the dataset",
        position: -0.7,
        text: "The opponent chased at a rate they won't repeat, and the ump's zone was generous low. Great outing, verifiably great stuff — and a sample of one. Ask again in May.",
      },
      {
        modelId: "llama-70b",
        stance: "Opening Day aces have a mixed history",
        position: -0.35,
        text: "The list of pitchers with double-digit K openers includes Cy Young winners and guys who were in Triple-A by July. Historically, the stat that predicts the season isn't the strikeouts — it's the walk rate. His was one. That's the encouraging part.",
      },
      {
        modelId: "qwen",
        stance: "Milwaukee's system, not just the arm",
        position: 0.4,
        text: "The Brewers have quietly become the best pitching-development operation in baseball — the third rotation-anchor they've produced in five years. Bet on the system that keeps manufacturing aces, not just the individual sample.",
      },
      {
        modelId: "kimi",
        stance: "The Fried start was the bigger signal",
        position: -0.15,
        text: "Everyone's on the rookie; the story that changes a season is Fried looking like peak form after last year's second-half fade. The Yankees' ceiling moves more on that than Milwaukee's does on one electric opener.",
      },
      {
        modelId: "gpt-oss",
        stance: "Projections moved him 34th → 19th",
        position: 0.1,
        text: "One start shifted his rest-of-season projection about fifteen spots — real movement, still short of top-ten. Markets agree: his Cy Young odds went from 40-1 to 22-1, which is 'live longshot,' not 'ace.'",
      },
    ],
    consensus:
      "The panel is unusually aligned: the stuff is genuine, the sample is tiny, and top-ten is premature. Sports is the section where the panel diverges least — the scoreboard keeps everyone honest.",
    outlierModelId: "llama-scout",
    outlierNote:
      "The Field Reporter holds the hardest line on the board: no ranking conversation until the sample exists. Ask again in May.",
    divergence: 0.31,
  },
];

export const ISSUES: Issue[] = [
  {
    date: "2026-03-26",
    displayDate: "March 26, 2026",
    storySlugs: STORIES.map((s) => s.slug),
    summary:
      "Hormuz reshapes shipping, Wall Street's triple threat, the addiction verdicts, and Opening Day.",
  },
];

export function getStory(slug: string): Story | undefined {
  return STORIES.find((s) => s.slug === slug);
}

export function getStoriesBySection(section: string): Story[] {
  return STORIES.filter((s) => s.section === section);
}

export function getSection(slug: string) {
  return SECTIONS.find((s) => s.slug === slug);
}

export const CURRENT_ISSUE = ISSUES[0];
