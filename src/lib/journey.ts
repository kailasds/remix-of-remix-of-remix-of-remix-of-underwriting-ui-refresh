// Enterprise-grade underwriting content for the AI Investigation Journey.
// All values are fabricated but modelled on real commercial property submissions.

export const submission = {
  ref: "SUB-2026-081142",
  insured: "Coastal Ridge Cold Storage, LLC",
  dba: "Coastal Ridge Distribution",
  entity: "Florida Limited Liability Company",
  ein: "59-3821094",
  naics: "493120 · Refrigerated Warehousing & Storage",
  businessAge: "11 years (est. 2015)",
  primaryAddress: "1034 Park Street, Jacksonville, FL 32204",
  secondaryLocations: [
    "27 Waverly Court, Savannah, GA 31401 (leased office)",
    "5580 Industrial Blvd, Lakeland, FL 33815 (satellite DC)",
  ],
  construction: "ISO Class 4 · Steel Frame · Insulated Metal Panel",
  occupancy: "Refrigerated Warehousing (COPE Class 483)",
  buildingAge: "Built 2016 · Renovated 2022",
  roofAge: "8 years · TPO membrane, last inspected Feb 2026",
  squareFootage: "58,400 sq ft",
  fireProtection: "Wet-pipe sprinklered · Central-station monitored",
  hydrantDistance: "112 ft",
  crimeIndex: "34 / 100 (below city median)",
  broker: "Marsh McLennan Agency – Southeast",
  brokerName: "Priya Ramaswamy",
  brokerYears: "6 years",
  brokerHitRatio: "31%",
  effectiveDate: "March 1, 2026",
  termMonths: 12,
  sumInsured: 3_910_000,
  premiumIndicated: 148_200,
};

export const aiBrief = {
  headline:
    "Coastal Ridge Cold Storage is a well-run, above-average refrigerated warehouse risk sitting inside our Southeast appetite. Nine of ten investigation agents converged on Accept with Conditions at 95% confidence. A single wind & hail endorsement (CP-1049) and a broker-verified replacement-cost reconciliation are the only items standing between this submission and a bind-ready quote.",
  recommendation: "Accept with Conditions",
  confidence: 95,
  riskRating: "B+ (Preferred with light conditioning)",
  premiumIndicated: 148_200,
  rate: 1.68,
  benchmarkDelta: -4,
  snapshot: [
    { k: "Named insured", v: "Coastal Ridge Cold Storage, LLC" },
    { k: "Product", v: "Commercial Property – Special Form" },
    { k: "TIV", v: "$3.91M building + $1.22M BPP" },
    { k: "Effective date", v: "March 1, 2026 (12 mo)" },
    { k: "Broker", v: "MMA Southeast · Priya Ramaswamy" },
    { k: "Jurisdiction", v: "Florida (non-admitted eligible)" },
  ],
  kpis: [
    { label: "Premium", value: "$148,200", tone: "brand", sub: "Rate 1.68% · −4% vs class" },
    { label: "Risk Score", value: "68 / 100", tone: "leaf", sub: "Preferred band" },
    { label: "Fraud Score", value: "3 / 100", tone: "leaf", sub: "No adverse signals" },
    { label: "Credit Band", value: "D&B 82 · Strong", tone: "leaf", sub: "PAYDEX low delinquency" },
    { label: "Confidence", value: "95%", tone: "brand", sub: "9 of 10 agents converged" },
  ],
  topRisks: [
    {
      title: "Wind & hail exposure — coastal FL",
      body: "Location is 8.2 km from the Atlantic in FEMA AE. Modelled 1-in-100 wind loss of $214K. Requires named-storm deductible and endorsement CP-1049.",
      severity: "Moderate",
    },
    {
      title: "Replacement-cost delta vs broker submission",
      body: "AI valuation ($3.91M) is 18% above broker figure ($3.31M). Under-insurance risk if not reconciled prior to bind. Recommend agreed-value endorsement.",
      severity: "Needs review",
    },
    {
      title: "Open GL claim (2024 slip-and-fall)",
      body: "$18.5K paid, $5K reserved, still open. Property line unaffected but signals housekeeping controls — request updated safety walkthrough within 60 days.",
      severity: "Low",
    },
  ],
  positives: [
    {
      title: "Sprinklered ISO Class 4 construction",
      body: "Steel-frame IMP construction with central-station monitored wet-pipe sprinklers. COPE profile aligns with our preferred refrigerated-warehouse book.",
    },
    {
      title: "Clean 5-year loss history",
      body: "Loss ratio of 42% across three claims, all sub-$50K. No catastrophe losses despite two named-storm seasons in the exposure window.",
    },
    {
      title: "Top-quartile broker relationship",
      body: "MMA Southeast · Priya Ramaswamy: 6-year relationship, 31% hit ratio, submission scored 94/100 on completeness.",
    },
  ],
  openQuestions: [
    "Confirm 2025 roof re-coating warranty is transferable to new carrier.",
    "Request satisfactory close-out letter for 2024 GL slip-and-fall.",
    "Verify Lakeland satellite DC is included in Schedule of Locations (currently in ACORD 140 only).",
  ],
  nextActions: [
    { label: "Bind subject to CP-1049 (wind & hail) endorsement", priority: "Primary" },
    { label: "Issue agreed-value endorsement at $3.91M reconciled TIV", priority: "Primary" },
    { label: "Schedule 60-day post-bind risk-control walkthrough", priority: "Secondary" },
    { label: "Add named-storm 3% deductible with $50K minimum", priority: "Secondary" },
  ],
};

/* ─────────────────────── Step 2 – Review Findings ─────────────────────── */

export type FindingStatus = "verified" | "review" | "missing" | "recommendation";

export type FindingRow = { label: string; value: string; status?: FindingStatus };

export type FindingSection = {
  id: string;
  title: string;
  status: FindingStatus;
  observation: string;
  recommendation: string;
  evidence: string[];
  rows: FindingRow[];
};

export const findingSections: FindingSection[] = [
  {
    id: "identity",
    title: "Business Identity",
    status: "verified",
    observation:
      "Legal entity, EIN and NAICS all reconcile across ACORD 125, IRS EIN letter and Florida SunBiz filing. DBA is registered and current.",
    recommendation: "Proceed. No additional identity verification required.",
    evidence: ["ACORD 125 (pg. 1)", "IRS CP-575 EIN letter", "FL SunBiz record L15000091823"],
    rows: [
      { label: "Legal Entity", value: "Coastal Ridge Cold Storage, LLC", status: "verified" },
      { label: "DBA", value: "Coastal Ridge Distribution", status: "verified" },
      { label: "Entity Type", value: "FL Limited Liability Company", status: "verified" },
      { label: "EIN", value: "59-3821094", status: "verified" },
      { label: "NAICS", value: "493120 – Refrigerated Warehousing", status: "verified" },
      { label: "Business Age", value: "11 years (est. 2015)", status: "verified" },
    ],
  },
  {
    id: "location",
    title: "Location & Property Details",
    status: "review",
    observation:
      "Primary Jacksonville location fully verified via county assessor and satellite. Secondary Lakeland DC appears on ACORD 140 but is missing from the Schedule of Locations — potential coverage gap.",
    recommendation:
      "Confirm Lakeland location scope with broker before bind. All other property attributes verified — no revaluation required.",
    evidence: [
      "Duval County property record #093822-0100",
      "Nearmap aerial 2026-01-14",
      "ACORD 140 (pgs. 2–3)",
      "SafeStreet crime index (2026 Q1)",
    ],
    rows: [
      { label: "Primary Address", value: "1034 Park St, Jacksonville, FL 32204", status: "verified" },
      { label: "Secondary Locations", value: "Savannah GA (office), Lakeland FL (DC)", status: "review" },
      { label: "Construction", value: "ISO Class 4 · Steel Frame · IMP", status: "verified" },
      { label: "Occupancy", value: "Refrigerated Warehousing (COPE 483)", status: "verified" },
      { label: "Building Age", value: "Built 2016, renovated 2022", status: "verified" },
      { label: "Roof Age", value: "8 yrs · TPO · re-coated Feb 2026", status: "verified" },
      { label: "Square Footage", value: "58,400 sq ft", status: "verified" },
      { label: "Fire Protection", value: "Wet-pipe sprinklered, monitored", status: "verified" },
      { label: "Hydrant Distance", value: "112 ft", status: "verified" },
      { label: "Crime Index", value: "34 / 100 (below city median)", status: "verified" },
    ],
  },
  {
    id: "documents",
    title: "Document Intelligence",
    status: "verified",
    observation:
      "14 documents parsed with 312 structured fields extracted at 97.4% average confidence. Two low-confidence fields on the appraisal (page 6) auto-flagged and reconciled against county records.",
    recommendation:
      "Request updated Statement of Values before bind — current SoV is dated Nov 2025.",
    evidence: [
      "ACORD 125 (v2016.03) · 4 pages",
      "ACORD 140 (v2016.03) · 6 pages",
      "AmeriSpec inspection report · 22 pages",
      "Cushman & Wakefield appraisal · 41 pages",
      "5-year loss runs (Chubb, prior carrier)",
      "42 property photographs · Nearmap satellite tile",
    ],
    rows: [
      { label: "ACORD 125", value: "Received · reconciled", status: "verified" },
      { label: "ACORD 140", value: "Received · reconciled", status: "verified" },
      { label: "Inspection Report", value: "AmeriSpec · Feb 2026", status: "verified" },
      { label: "Appraisal", value: "Cushman & Wakefield · Jan 2026", status: "verified" },
      { label: "Loss Runs", value: "5-year Chubb export · complete", status: "verified" },
      { label: "Property Photos", value: "42 files · geo-tagged", status: "verified" },
      { label: "Satellite Image", value: "Nearmap 2026-01-14", status: "verified" },
      { label: "Extraction Confidence", value: "97.4% avg (312 fields)", status: "verified" },
      { label: "Missing Documents", value: "Updated SoV (Nov 2025 stale)", status: "missing" },
      { label: "Duplicate Detection", value: "0 duplicates across 14 files", status: "verified" },
    ],
  },
  {
    id: "coverage",
    title: "Coverage Review",
    status: "recommendation",
    observation:
      "Requested limits are adequate for building and BPP. Business Income limit appears light for a refrigerated operation with 72-hour spoilage exposure. No equipment breakdown requested.",
    recommendation:
      "Increase BI to $850K (12-month ALS). Add equipment breakdown at $1M sub-limit. Include spoilage endorsement CP-04-40 at $250K.",
    evidence: [
      "ACORD 140 – Section III Coverage Requested",
      "Peer benchmarks: FL refrigerated (Q1 2026)",
      "Coverage gap model v4.2",
    ],
    rows: [
      { label: "Building Limit", value: "$3,910,000 (agreed value)", status: "verified" },
      { label: "Business Personal Property", value: "$1,220,000", status: "verified" },
      { label: "Business Income", value: "$500,000 (12-mo ALS)", status: "recommendation" },
      { label: "Equipment Breakdown", value: "Not requested", status: "recommendation" },
      { label: "Wind Deductible", value: "2% (recommend 3%)", status: "recommendation" },
      { label: "Flood Coverage", value: "Not requested (FEMA AE)", status: "review" },
      { label: "Coinsurance", value: "90% (waived under agreed value)", status: "verified" },
    ],
  },
  {
    id: "loss",
    title: "Loss History",
    status: "verified",
    observation:
      "3 claims in the trailing 5 years, aggregate incurred of $77,800. Loss ratio of 42% is well within the 55% class benchmark. No catastrophe activity through two named-storm seasons.",
    recommendation: "No loss-history conditions required. Continue standard post-bind monitoring.",
    evidence: ["Chubb 5-year loss run (2020–2025)", "NAIC MarketProfile FL refrigerated Q1 2026"],
    rows: [
      { label: "Previous Claims (5yr)", value: "3 events · 1 open", status: "verified" },
      { label: "Frequency", value: "0.6 per year", status: "verified" },
      { label: "Severity (avg)", value: "$25,933", status: "verified" },
      { label: "Largest Loss", value: "$42,000 (Property, 2025)", status: "verified" },
      { label: "Loss Ratio (5yr)", value: "42% (class benchmark 55%)", status: "verified" },
    ],
  },
  {
    id: "broker",
    title: "Broker Review",
    status: "verified",
    observation:
      "Priya Ramaswamy at MMA Southeast — a top-quartile producer on our book. 6-year relationship with a 31% hit ratio and 94/100 submission-quality score. No E&O signals.",
    recommendation: "Fast-track review. Broker credibility supports streamlined bind pathway.",
    evidence: ["Producer file APEX-3421", "Prior-year performance dashboard", "Submission-quality analyzer"],
    rows: [
      { label: "Broker", value: "Marsh McLennan Agency – Southeast", status: "verified" },
      { label: "Producer", value: "Priya Ramaswamy", status: "verified" },
      { label: "Relationship", value: "6 years · 148 submissions", status: "verified" },
      { label: "Submission Quality", value: "94 / 100", status: "verified" },
      { label: "Hit Ratio", value: "31% (top quartile)", status: "verified" },
      { label: "AI Confidence", value: "High", status: "verified" },
    ],
  },
];

/* ─────────────────────── Step 3 – Risk Story ─────────────────────── */

export const riskStory = {
  narrative:
    "Coastal Ridge presents as a modern, well-maintained refrigerated warehouse operating in a mature Southeast logistics corridor. The building, construction and protection profile are all above the class median, and the insured has demonstrated 5 years of disciplined risk management with a 42% loss ratio through two active hurricane seasons. The primary risk driver is location: the Jacksonville facility sits within FEMA AE flood band and inside a Tier-2 wind zone, requiring a named-storm endorsement and a modestly higher wind deductible. A secondary theme is under-valuation — broker submission values the building at $3.31M against an AI-modelled replacement cost of $3.91M — which is easily addressed via an agreed-value endorsement at bind. Fraud, credit, compliance and OSINT signals are all clean. Net-net, this is a preferred risk that should bind at ~4% below class benchmark with two conditions attached.",
  positives: [
    "Sprinklered ISO Class 4 construction with monitored central station.",
    "Roof re-coated in 2026 with 15-year manufacturer warranty.",
    "5-year loss ratio 42% — 13 pts below class benchmark.",
    "Broker in the top quartile of our Southeast book.",
    "Strong D&B PAYDEX (82) and zero adverse media hits.",
  ],
  watchItems: [
    "Coastal wind & hail exposure (8.2 km from Atlantic).",
    "Open GL claim from 2024 slip-and-fall (housekeeping signal).",
    "Business Income limit light relative to spoilage exposure.",
    "Lakeland satellite DC missing from Schedule of Locations.",
  ],
  drivers: [
    { name: "CAT wind & flood", weight: 34, note: "FEMA AE + Tier-2 wind" },
    { name: "Property valuation", weight: 28, note: "18% delta vs broker" },
    { name: "Loss history", weight: 18, note: "Clean, one open GL" },
    { name: "Occupancy hazard", weight: 12, note: "Refrigerated w/ spoilage" },
    { name: "Financial & fraud", weight: 8, note: "Clean signals" },
  ],
  endorsements: [
    { code: "CP-10-49", name: "Windstorm & Hail — Named Storm Deductible", why: "Coastal FL wind exposure" },
    { code: "CP-04-40", name: "Spoilage Coverage", why: "Refrigerated occupancy — 72hr spoilage window" },
    { code: "CP-14-45", name: "Ordinance or Law – Coverage A/B/C", why: "2022 renovation to modern FL Building Code" },
    { code: "IM-79-25", name: "Equipment Breakdown Enhancement", why: "Compressor & condenser dependency" },
  ],
  lossTrends: {
    summary:
      "Frequency has declined year-over-year since 2022. No claim severity above $50K. Prior GL slip-and-fall is unrelated to the property line but is being tracked as a controls indicator.",
    series: [
      { year: 2020, count: 1, incurred: 8_400 },
      { year: 2021, count: 0, incurred: 0 },
      { year: 2022, count: 1, incurred: 12_300 },
      { year: 2023, count: 0, incurred: 0 },
      { year: 2024, count: 1, incurred: 23_500 },
      { year: 2025, count: 1, incurred: 42_000 },
    ],
  },
  propertyIntel:
    "Nearmap aerial dated 2026-01-14 confirms 58,400 sq ft footprint (98% overlap with county assessor). Roof is uniform TPO membrane with no ponding or debris. Loading-dock lighting, bollards and drainage all present. Adjacent parcel is a paved surface lot — no exposure amplification.",
  catExposure:
    "AIR Worldwide model returns a 1-in-100 wind loss of $214K and a 1-in-250 flood loss of $58K. Composite CAT PML is 5.5% of TIV — within appetite when paired with CP-10-49 and a 3% named-storm deductible.",
  fraud:
    "Zero hits across LexisNexis Accurint, OFAC, sanctions, PEP lists and adverse-media scan. Insured principals verified via Florida driver-license match. Broker producer file clean.",
  financial:
    "D&B PAYDEX of 82 (Strong). Experian Intelliscore 78. 12 active trade lines, zero delinquencies in the trailing 24 months. Estimated revenue $18.4M (2025), 8-year positive tax filings.",
  compliance:
    "Florida non-admitted eligible. Surplus-lines tax (4.94%) applied. TRIA disclosures on file. No OFAC or export-control triggers. Building complies with 2020 Florida Building Code (post-renovation).",
  visualCards: [
    { label: "Property Exposure", value: "Preferred", tone: "leaf", detail: "Above-median COPE" },
    { label: "Flood Risk", value: "Moderate", tone: "amber", detail: "FEMA AE · 0.2%/yr" },
    { label: "Wind Risk", value: "Moderate-High", tone: "amber", detail: "Tier-2 · 8.2 km coast" },
    { label: "Fire Risk", value: "Low", tone: "leaf", detail: "Class 4 · sprinklered" },
    { label: "Crime Index", value: "34 / 100", tone: "leaf", detail: "Below city median" },
    { label: "RCV Confidence", value: "High", tone: "leaf", detail: "$3.91M ±3%" },
    { label: "Occupancy Risk", value: "Moderate", tone: "amber", detail: "Refrigerated spoilage" },
  ],
};

/* ─────────────────────── Step 4 – Quote ─────────────────────── */

export const quote = {
  recommendation:
    "Bind at $148,200 annual premium with wind & hail endorsement (CP-10-49) and agreed-value at $3.91M. Rate of 1.68% sits 4% below the FL refrigerated class benchmark of 1.75%.",
  recommendedPremium: 148_200,
  rate: 1.68,
  benchmark: 1.75,
  benchmarkDelta: -4.0,
  expectedLossRatio: 51,
  expectedCombinedRatio: 88,
  coverageSummary: [
    { line: "Building", limit: "$3,910,000", ded: "$10,000 AOP", premium: 96_140 },
    { line: "Business Personal Property", limit: "$1,220,000", ded: "$10,000 AOP", premium: 21_360 },
    { line: "Business Income (12-mo ALS)", limit: "$850,000", ded: "72 hrs", premium: 12_240 },
    { line: "Equipment Breakdown", limit: "$1,000,000", ded: "$5,000", premium: 6_820 },
    { line: "Spoilage (CP-04-40)", limit: "$250,000", ded: "$2,500", premium: 4_180 },
    { line: "Wind & Hail (CP-10-49)", limit: "Included", ded: "3% named storm ($50K min)", premium: 7_460 },
  ],
  breakdown: {
    subtotal: 148_200,
    surplusLinesTax: 7_321,
    stampingFee: 89,
    brokerCommission: 22_230,
    total: 155_610,
  },
  alternatives: [
    {
      tier: "Conservative",
      premium: 162_800,
      rate: 1.85,
      ded: "$25K AOP · 5% wind",
      notes: "Higher deductibles, wider coverage, spoilage @ $500K, 24-mo BI.",
    },
    {
      tier: "Balanced (recommended)",
      premium: 148_200,
      rate: 1.68,
      ded: "$10K AOP · 3% wind",
      notes: "Aligned to broker request with CP-10-49 endorsement.",
    },
    {
      tier: "Competitive",
      premium: 134_500,
      rate: 1.52,
      ded: "$25K AOP · 5% wind",
      notes: "Trim BI to $500K, drop equipment breakdown. Below appetite floor.",
    },
  ],
  reasoning: [
    "Base rate anchored to 2026 FL refrigerated-warehouse curve (1.42%).",
    "+0.14% CAT load from AIR wind & flood modelling.",
    "+0.08% occupancy load for spoilage exposure.",
    "+0.04% for open GL claim (soft controls flag).",
    "−0.00% credit modifier (D&B 82 offsets nothing further — already at rate floor).",
    "Result: 1.68% rate · $148,200 premium · 4% below class benchmark.",
  ],
};

/* ─────────────────────── Step 5 – Decision ─────────────────────── */

export const decision = {
  recommendation: "Accept with Conditions",
  confidence: 95,
  summary:
    "This submission satisfies all appetite guardrails for the Southeast Refrigerated Warehousing program. The composite risk score, loss history, financial strength and broker profile all fall inside preferred bands. Two light conditions and one endorsement bring residual CAT and valuation risk into full appetite.",
  supporting: [
    "5-year loss ratio of 42% (13 pts below class benchmark).",
    "COPE profile above-median for refrigerated warehousing.",
    "Broker in top quartile of Southeast production.",
    "D&B PAYDEX 82 · zero adverse-media hits.",
    "AI valuation aligns with independent Cushman & Wakefield appraisal.",
  ],
  blocking: [
    "None. All investigation agents cleared or reached recommendation status.",
  ],
  uncertainty: [
    "Lakeland satellite DC scope pending broker confirmation.",
    "Roof warranty transferability to be attached to bind file.",
  ],
  conditionsBind: [
    "Attach CP-10-49 (named-storm wind & hail) endorsement.",
    "Agreed-value endorsement at reconciled $3.91M TIV.",
    "3% named-storm deductible with $50K minimum.",
    "Receive updated Statement of Values dated within 90 days of bind.",
  ],
  conditionsPost: [
    "Post-bind risk-control walkthrough within 60 days.",
    "Confirm close-out documentation for 2024 GL slip-and-fall within 30 days.",
    "Add Lakeland DC via mid-term endorsement once scope confirmed.",
  ],
  endorsements: ["CP-10-49", "CP-04-40", "CP-14-45", "IM-79-25"],
  pricingJustification:
    "Premium of $148,200 (rate 1.68%) is 4% below the FL refrigerated class benchmark of 1.75%. Discount is justified by preferred COPE, clean loss history and top-quartile broker profile, and is offset by the CAT & occupancy loads embedded in the rate.",
  reasoning:
    "The Decision Agent weighted CAT exposure (34%), property valuation (28%), loss history (18%), occupancy (12%) and financial signals (8%). All five vectors returned favorable or manageable outputs with recommended endorsements. No agent recommended decline or referral to senior underwriting.",
  alternative: {
    label: "Refer to Senior Underwriter",
    reason:
      "Would be triggered only if the broker declines the wind endorsement or the SoV cannot be refreshed. Neither condition currently expected.",
  },
  humanNotes:
    "Underwriter should confirm the Lakeland DC scope in a single call with the broker and add via endorsement post-bind. All other conditions can be papered into the binder.",
};

/* ─────────────────────── Step 6 – Audit Trail ─────────────────────── */

export type AuditEntry = {
  time: string;
  agent: string;
  action: string;
  evidence?: string;
  recommendation?: string;
  confidenceDelta?: number;
  confidence?: number;
};

export const auditTrail: AuditEntry[] = [
  { time: "09:40:12", agent: "Orchestrator", action: "Investigation initiated for SUB-2026-081142", confidence: 0 },
  { time: "09:41:04", agent: "Document Intelligence", action: "Parsed 14 documents · extracted 312 fields at 97.4% avg confidence", evidence: "ACORD 125/140, appraisal, loss runs, 42 photos", confidenceDelta: 18, confidence: 18 },
  { time: "09:41:38", agent: "Document Intelligence", action: "Reconciled ACORD 125 with Schedule of Locations", evidence: "1 address delta flagged for review", confidenceDelta: 3, confidence: 21 },
  { time: "09:42:02", agent: "Property Intelligence", action: "Verified building footprint via Nearmap aerial 2026-01-14", evidence: "98% overlap with Duval County assessor", confidenceDelta: 6, confidence: 27 },
  { time: "09:42:29", agent: "Property Intelligence", action: "Estimated roof age via vision model", evidence: "8 yrs ±1 · TPO membrane · re-coated Feb 2026", confidenceDelta: 5, confidence: 32 },
  { time: "09:42:58", agent: "Property Intelligence", action: "Replacement cost recalculated at $3.91M (CoreLogic model)", recommendation: "Agreed-value endorsement recommended", confidenceDelta: 11, confidence: 43 },
  { time: "09:43:24", agent: "CAT Risk Agent", action: "Ran AIR wind & flood models · FEMA AE, Tier-2 wind", evidence: "1-in-100 wind loss $214K · flood $58K", confidenceDelta: 6, confidence: 49 },
  { time: "09:43:41", agent: "CAT Risk Agent", action: "Recommended endorsement CP-10-49 (named storm)", recommendation: "Accept with Conditions", confidenceDelta: 4, confidence: 53 },
  { time: "09:44:03", agent: "Fraud Agent", action: "Scanned Accurint, OFAC, sanctions, PEP, adverse media", evidence: "0 hits across all sources", confidenceDelta: 4, confidence: 57 },
  { time: "09:44:22", agent: "Credit Agent", action: "Pulled D&B and Experian business credit reports", evidence: "PAYDEX 82 · Intelliscore 78 · 0 delinquencies (24mo)", confidenceDelta: 5, confidence: 62 },
  { time: "09:44:47", agent: "OSINT Agent", action: "Scanned public web, litigation and state filings", evidence: "3 favorable press mentions · no open litigation", confidenceDelta: 4, confidence: 66 },
  { time: "09:45:08", agent: "Compliance Agent", action: "Verified FL non-admitted eligibility · surplus lines tax applied", evidence: "TRIA disclosures on file · FL Building Code compliant", confidenceDelta: 4, confidence: 70 },
  { time: "09:45:29", agent: "Claims History", action: "Parsed 5-year Chubb loss run", evidence: "3 claims · $77.8K incurred · 42% loss ratio", confidenceDelta: 8, confidence: 78 },
  { time: "09:45:52", agent: "Pricing Agent", action: "Recalculated premium using refined TIV and CAT load", evidence: "Rate 1.68% · $148,200 · −4% vs benchmark", confidenceDelta: 9, confidence: 87 },
  { time: "09:46:14", agent: "Decision Agent", action: "Aggregated 9 upstream agent outputs and weighted risk drivers", recommendation: "Accept with Conditions", confidenceDelta: 5, confidence: 92 },
  { time: "09:46:31", agent: "Decision Agent", action: "Finalized bind conditions and endorsement schedule", recommendation: "Accept with Conditions · attach CP-10-49, CP-04-40, CP-14-45, IM-79-25", confidenceDelta: 3, confidence: 95 },
];
