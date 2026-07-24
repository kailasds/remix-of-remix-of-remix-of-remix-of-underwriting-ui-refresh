import type { FindingState } from "../components/app/finding";

export interface FieldFinding {
  key: string;
  value: string;
  state: FindingState;
  detail?: {
    observation: string;
    recommendation: string;
    evidence: { doc: string; value: string }[];
  };
}

export interface FindingGroup {
  id: string;
  title: string;
  eyebrow: string;
  state: FindingState;
  summary: string;
  fields: FieldFinding[];
}

export const findingGroups: FindingGroup[] = [
  {
    id: "identity",
    title: "Business Identity",
    eyebrow: "Business",
    state: "review",
    summary: "AI verified the business identity across ACORD 125 and ACORD 140. One address value disagrees between documents.",
    fields: [
      { key: "Legal name", value: "Root Down LLC", state: "verified" },
      { key: "Type of business", value: "Full-service restaurant", state: "verified" },
      {
        key: "Primary address",
        value: "1034 Park Street, Jacksonville FL 32202",
        state: "review",
        detail: {
          observation: "Street name differs between documents. ZIP code and city match.",
          recommendation: "Use the Schedule of Locations value — it is the newest document.",
          evidence: [
            { doc: "ACORD 125 · p.1", value: "1034 Park Street" },
            { doc: "Schedule of Locations · p.2", value: "1034 Park Avenue" },
          ],
        },
      },
      { key: "NAICS", value: "722511 · Full-service restaurants", state: "verified" },
      { key: "FEIN", value: "**-*******", state: "verified" },
      { key: "No. of locations", value: "1", state: "verified" },
    ],
  },
  {
    id: "coverage",
    title: "Coverage",
    eyebrow: "Coverage",
    state: "verified",
    summary: "AI extracted four coverage lines from the ACORD forms with consistent limits and deductibles.",
    fields: [
      { key: "Commercial Property", value: "$750,000 TIV", state: "verified" },
      { key: "General Liability", value: "$1M / $2M", state: "verified" },
      { key: "Business Interruption", value: "12 months", state: "verified" },
      { key: "Cyber", value: "$500,000", state: "verified" },
      { key: "Effective date", value: "Aug 15, 2026", state: "verified" },
      { key: "Expiry date", value: "Aug 15, 2027", state: "verified" },
    ],
  },
  {
    id: "broker",
    title: "Broker",
    eyebrow: "Producer",
    state: "verified",
    summary: "Broker credentials matched against the internal producer database. 22 cases YTD, 71% bind rate.",
    fields: [
      { key: "Agency", value: "James Jenkins Agency — Riskwell", state: "verified" },
      { key: "Producer", value: "James Jenkins", state: "verified" },
      { key: "Bind rate", value: "71%", state: "verified" },
      { key: "Loss ratio", value: "42%", state: "verified" },
    ],
  },
  {
    id: "loss",
    title: "Loss History",
    eyebrow: "5-year",
    state: "verified",
    summary: "AI parsed three loss events over the last five years. No open catastrophic claims. Loss ratio within appetite.",
    fields: [
      { key: "2025 · Property", value: "$42,000 paid · Closed", state: "verified" },
      { key: "2024 · GL", value: "$18,500 paid · $5,000 reserved · Open", state: "verified" },
      { key: "2022 · Property", value: "$12,300 paid · Closed", state: "verified" },
    ],
  },
  {
    id: "property",
    title: "Property",
    eyebrow: "Location",
    state: "missing",
    summary: "AI could not locate building age or roof material in the submitted documents. Required for coastal band 3b.",
    fields: [
      { key: "Building age", value: "Not found", state: "missing" },
      { key: "Roof material", value: "Not found", state: "missing" },
      { key: "Square footage", value: "4,200 sq ft", state: "verified" },
      { key: "Construction type", value: "Frame", state: "verified" },
      {
        key: "Coastal proximity",
        value: "~8 km",
        state: "recommendation",
        detail: {
          observation: "Coastal proximity is within referral threshold but outside the elevated wind band.",
          recommendation: "Proceed with standard appetite and add endorsement CP-1049 for wind & hail.",
          evidence: [
            { doc: "Schedule of Locations · p.2", value: "Latitude/longitude derived, 8.2 km to coast" },
          ],
        },
      },
    ],
  },
  {
    id: "financials",
    title: "Financials",
    eyebrow: "Financial",
    state: "missing",
    summary: "Financial statements were not attached to the submission. AI recommends requesting them from the broker before binding.",
    fields: [
      { key: "Prior year revenue", value: "Not found", state: "missing" },
      { key: "Financial statements", value: "Not attached", state: "missing" },
    ],
  },
];

export const aiBriefSummary = {
  headline: "I reviewed 6 submitted documents and prepared the underwriting assessment.",
  body: "Most information has been verified automatically. Three items require your attention before approval: an address mismatch, missing building details, and no financial statements on file.",
};

export const aiKpis = {
  verified: 18,
  review: 1,
  missing: 4,
  recommendations: 2,
};

export const documentsAnalysed = [
  { name: "ACORD 125.pdf", size: "1.6 MB", state: "verified" as const },
  { name: "ACORD 140.pdf", size: "1.0 MB", state: "verified" as const },
  { name: "Schedule of Locations.pdf", size: "0.6 MB", state: "verified" as const },
  { name: "Loss runs 5yr.xlsx", size: "0.4 MB", state: "verified" as const },
  { name: "Broker cover email.eml", size: "12 KB", state: "verified" as const },
  { name: "Prior policy binder.pdf", size: "2.1 MB", state: "verified" as const },
];

export const riskStory = {
  reasoning: [
    "Property exposure sits at the upper edge of appetite for coastal band 3b, driven by the location's 8 km proximity to the shoreline.",
    "Business interruption limits are 12 months, which is above the regional class average — appropriate for a single-location restaurant.",
    "Loss history is clean: three small events over five years, all closed except one open GL slip-and-fall with modest reserves.",
    "Flood exposure raises overall referral requirements but does not push the risk out of appetite.",
  ],
  drivers: [
    { label: "Property exposure", tone: "high", value: 68 },
    { label: "Flood", tone: "med", value: 42 },
    { label: "Fire", tone: "med", value: 55 },
    { label: "Cyber", tone: "low", value: 24 },
    { label: "Financial", tone: "low", value: 38 },
    { label: "Operational", tone: "med", value: 51 },
  ],
  positives: [
    "5-year loss ratio of 42% — well within appetite",
    "Bind rate on this broker channel is 71%",
    "NAICS class trending favorably YoY",
  ],
  watch: [
    "Coastal wind exposure — mitigated by CP-1049",
    "Missing building age blocks precise property scoring",
  ],
  endorsements: ["CP-1049 · Wind & hail", "IL-5501 · Business interruption waiting period"],
};

export const auditTimeline = [
  { t: "10:12:04", who: "AI · Document Reader", what: "Parsed 12 pages from ACORD 125.pdf", kind: "ai" as const },
  { t: "10:12:11", who: "AI · OCR", what: "Extracted text from 3 scanned pages", kind: "ai" as const },
  { t: "10:12:22", who: "AI · Business Identification", what: "Matched insured on ACORD 125 and ACORD 140", kind: "ai" as const },
  { t: "10:12:35", who: "AI · Business Identification", what: "Detected address mismatch — flagged for review", kind: "flag" as const },
  { t: "10:12:38", who: "AI · Coverage Extraction", what: "Normalized 4 coverage lines and limits", kind: "ai" as const },
  { t: "10:12:51", who: "AI · Loss History", what: "Parsed 3 loss events over 5 years", kind: "ai" as const },
  { t: "10:13:04", who: "AI · Guideline Matching", what: "Compared against Coastal Property Appetite v2026.5", kind: "ai" as const },
  { t: "10:13:22", who: "AI · Risk Assessment", what: "Composite score 62 · property and flood are top drivers", kind: "ai" as const },
  { t: "10:13:40", who: "AI · Pricing", what: "Rate 1.68% — 4% below benchmark for the class", kind: "ai" as const },
  { t: "10:14:02", who: "AI · Summary", what: "Generated case brief and prioritized 3 review items", kind: "ai" as const },
  { t: "10:22:11", who: "Akhil Philip", what: "Opened case workspace", kind: "human" as const },
];
