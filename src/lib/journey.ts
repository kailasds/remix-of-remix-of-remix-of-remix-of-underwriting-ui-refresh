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

/** A data point that can carry provenance, and — if it needs attention — why and how to resolve it. */
type Sourced = { source: string; reason?: string; resolution?: string };

type LocationRow = {
  address: string; role: string; occupancy: string; construction: string;
  protectionClass: string; yearBuilt: string; sqft: string; tiv: string; onSov: boolean;
} & Sourced;

type CoverageRow = {
  part: string; requested: string; recommended: string; deductible: string;
  valuation: string; status: FindingStatus;
} & Sourced;

type DocRow = { doc: string; status: string; detail: string; pages: number; reason?: string; resolution?: string };

type ClaimRow = {
  date: string; cause: string; line: string; status: string;
  paid: number; reserved: number; incurred: number;
} & Sourced;

/** A conflict between what different source documents say a field's value is. */
export type FieldDiscrepancy = { values: { value: string; source: string }[]; recommendation: string };

type ProfileField = { k: string; v: string; source: string; discrepancy?: FieldDiscrepancy };

/* ── Business Identity ── */
export const identityDetail = {
  status: "verified" as FindingStatus,
  observation:
    "Legal entity, EIN and NAICS all reconcile across ACORD 125, IRS EIN letter and Florida SunBiz filing. DBA is registered and current. Both principals cleared OFAC/PEP/adverse-media screening.",
  recommendation: "Proceed. No additional identity verification required.",
  profile: [
    {
      k: "Legal Entity", v: "Coastal Ridge Cold Storage, LLC", source: "ACORD 125 (pg. 1)",
      discrepancy: {
        values: [
          { value: "Coastal Ridge Cold Storage, LLC", source: "ACORD 125" },
          { value: "Coastal Ridge Cold Storage LLC", source: "ACORD 140" },
          { value: "Coastal Ridge Cold Storage", source: "Certificate of Insurance" },
        ],
        recommendation: "Use “Coastal Ridge Cold Storage, LLC” — matches the FL SunBiz record of legal name exactly (ACORD 125).",
      },
    },
    {
      k: "DBA", v: "Coastal Ridge Distribution", source: "FL SunBiz fictitious name registry",
      discrepancy: {
        values: [
          { value: "Coastal Ridge Distribution", source: "ACORD 125" },
          { value: "Coastal Ridge Distributors", source: "Schedule of Locations" },
        ],
        recommendation: "Use “Coastal Ridge Distribution” — matches the active FL SunBiz fictitious name registration (ACORD 125).",
      },
    },
    { k: "Entity Type", v: "Florida Limited Liability Company", source: "FL SunBiz record L15000091823" },
    { k: "State of Formation", v: "Florida (2015)", source: "FL SunBiz record L15000091823" },
    { k: "EIN", v: "59-3821094", source: "IRS CP-575 EIN letter" },
    { k: "NAICS", v: "493120 — Refrigerated Warehousing & Storage", source: "ACORD 125 (pg. 1)" },
    { k: "Years in Business", v: "11 years (est. 2015)", source: "FL SunBiz record L15000091823" },
    { k: "Est. Annual Revenue", v: "$18.4M (2025)", source: "D&B business credit report" },
  ] as ProfileField[],
  principals: [
    { name: "Marcus Ridley", title: "Managing Member", ownership: "60%", screening: "Clear", source: "LexisNexis Accurint" },
    { name: "Elena Ridley", title: "Member", ownership: "40%", screening: "Clear", source: "LexisNexis Accurint" },
  ],
  verification: [
    { check: "Secretary of State filing status", result: "Active · Good Standing", source: "FL SunBiz record L15000091823" },
    { check: "EIN match", result: "Matches IRS record", source: "IRS CP-575 EIN letter" },
    { check: "DBA registration", result: "Active", source: "FL SunBiz fictitious name registry" },
    { check: "Principal screening (OFAC/PEP/adverse media)", result: "0 hits — both principals", source: "LexisNexis Accurint" },
  ],
};

/* ── Location & Property ── */
export const locationDetail = {
  status: "review" as FindingStatus,
  observation:
    "Primary Jacksonville location fully verified via county assessor and satellite. Secondary Lakeland DC appears on ACORD 140 but is missing from the Schedule of Locations — potential coverage gap.",
  recommendation:
    "Confirm Lakeland location scope with broker before bind and add via Schedule of Locations. All other property attributes verified — no revaluation required.",
  schedule: [
    {
      address: "1034 Park Street, Jacksonville, FL 32204",
      role: "Primary — Warehouse",
      occupancy: "Refrigerated Warehousing",
      construction: "ISO Class 4 · Steel/IMP",
      protectionClass: "PC 3",
      yearBuilt: "2016",
      sqft: "58,400",
      tiv: "$5,130,000",
      onSov: true,
      source: "ACORD 140 · Schedule of Locations",
    },
    {
      address: "27 Waverly Court, Savannah, GA 31401",
      role: "Secondary — Leased Office",
      occupancy: "General Office",
      construction: "ISO Class 6 · Masonry",
      protectionClass: "PC 4",
      yearBuilt: "1998",
      sqft: "3,200",
      tiv: "$180,000 (contents only)",
      onSov: true,
      source: "ACORD 125 · Schedule of Locations",
    },
    {
      address: "5580 Industrial Blvd, Lakeland, FL 33815",
      role: "Secondary — Satellite DC",
      occupancy: "Refrigerated Warehousing",
      construction: "ISO Class 4 · Steel/IMP",
      protectionClass: "PC 3",
      yearBuilt: "2019",
      sqft: "14,200",
      tiv: "$610,000",
      onSov: false,
      source: "ACORD 140 (property schedule only)",
      reason:
        "This location is described on ACORD 140's property schedule but does not appear on the broker's Schedule of Locations. If bound as-is, the Lakeland DC could be uninsured.",
      resolution:
        "Confirm the location's scope and TIV with the broker, then add it via the Schedule of Locations before bind.",
    },
  ] as LocationRow[],
  cope: [
    { label: "Construction", value: "ISO Class 4 · Steel Frame · Insulated Metal Panel", source: "ACORD 140" },
    { label: "Occupancy", value: "Refrigerated Warehousing (COPE Class 483)", source: "ACORD 125" },
    { label: "Protection", value: "Wet-pipe sprinklered · Central-station monitored · 112 ft to hydrant", source: "Inspection Report" },
    { label: "Exposure", value: "Paved surface lot adjacent · no amplification", source: "Nearmap aerial 2026-01-14" },
  ],
  catExposure: [
    { label: "Flood Zone", value: "FEMA AE", source: "FEMA flood map service" },
    { label: "Distance to Coast", value: "8.2 km", source: "AIR Worldwide model" },
    { label: "Wind Zone", value: "Tier 2", source: "AIR Worldwide model" },
    { label: "Earthquake Zone", value: "Negligible (Zone 0)", source: "USGS seismic hazard map" },
    { label: "Crime Index", value: "34 / 100 (below city median)", source: "SafeStreet crime index Q1 2026" },
  ],
};

/* ── Documents ── */
export const documentsDetail = {
  status: "verified" as FindingStatus,
  observation:
    "14 documents parsed with 312 structured fields extracted at 97.4% average confidence. Two low-confidence fields on the appraisal (page 6) auto-flagged and reconciled against county records.",
  recommendation: "Request updated Statement of Values before bind — current SoV is dated Nov 2025.",
  stats: [
    { label: "Documents Parsed", value: "14" },
    { label: "Fields Extracted", value: "312" },
    { label: "Avg. Confidence", value: "97.4%" },
    { label: "Duplicates Found", value: "0" },
  ],
  checklist: [
    { doc: "ACORD 125 — Commercial Application", status: "Received", detail: "v2016.03 · reconciled", pages: 4 },
    { doc: "ACORD 140 — Property Section", status: "Received", detail: "v2016.03 · reconciled", pages: 6 },
    { doc: "Inspection Report", status: "Received", detail: "AmeriSpec · Feb 2026", pages: 22 },
    { doc: "Appraisal / Valuation", status: "Received", detail: "Cushman & Wakefield · Jan 2026", pages: 41 },
    { doc: "5-Year Loss Runs", status: "Received", detail: "Chubb (prior carrier), 2020–2025", pages: 8 },
    { doc: "Property Photographs", status: "Received", detail: "42 files, geo-tagged", pages: 42 },
    { doc: "Satellite Imagery", status: "Received", detail: "Nearmap · 2026-01-14", pages: 1 },
    {
      doc: "Statement of Values", status: "Stale", detail: "Dated Nov 2025 — request refresh before bind", pages: 3,
      reason: "Current SoV predates the March 1, 2026 effective date by more than 90 days, so building/BPP values may no longer be current.",
      resolution: "Request a refreshed Statement of Values from the broker, dated within 90 days of bind.",
    },
  ] as DocRow[],
};

/* ── Coverage ── */
export const coverageDetail = {
  status: "recommendation" as FindingStatus,
  observation:
    "Requested limits are adequate for building and BPP. Business Income limit appears light for a refrigerated operation with 72-hour spoilage exposure. No equipment breakdown or spoilage coverage requested.",
  recommendation:
    "Increase BI to $850K (12-mo ALS). Add Equipment Breakdown at $1M and Spoilage (CP-04-40) at $250K. Raise named-storm deductible to 3%.",
  schedule: [
    { part: "Building", requested: "$3,910,000 (agreed value)", recommended: "$3,910,000 (agreed value)", deductible: "$10,000 AOP", valuation: "Agreed Value", status: "verified", source: "ACORD 140 · Section III" },
    { part: "Business Personal Property", requested: "$1,220,000", recommended: "$1,220,000", deductible: "$10,000 AOP", valuation: "Replacement Cost", status: "verified", source: "ACORD 140 · Section III" },
    {
      part: "Business Income (ALS)", requested: "$500,000 (12-mo)", recommended: "$850,000 (12-mo)", deductible: "72 hrs", valuation: "Actual Loss Sustained", status: "recommendation",
      source: "Coverage gap model v4.2",
      reason: "Requested BI limit doesn't account for the 72-hour spoilage window unique to refrigerated occupancies — a single extended outage could exceed $500K in lost inventory and income.",
      resolution: "Increase Business Income to $850,000 (12-mo ALS), per the coverage gap model.",
    },
    {
      part: "Equipment Breakdown", requested: "Not requested", recommended: "$1,000,000", deductible: "$5,000", valuation: "Replacement Cost", status: "recommendation",
      source: "Peer benchmarks: FL refrigerated (Q1 2026)",
      reason: "No equipment breakdown coverage requested despite the facility's dependency on compressors and condensers for refrigeration.",
      resolution: "Add Equipment Breakdown at a $1,000,000 sub-limit (endorsement IM-79-25).",
    },
    {
      part: "Spoilage", requested: "Not requested", recommended: "$250,000", deductible: "$2,500", valuation: "Selling Price", status: "recommendation",
      source: "ACORD 140 · Section III",
      reason: "No spoilage coverage requested; refrigerated inventory carries a direct spoilage exposure if temperature control is lost.",
      resolution: "Add spoilage endorsement CP-04-40 at a $250,000 limit.",
    },
    {
      part: "Flood", requested: "Not requested", recommended: "Consider — FEMA AE", deductible: "—", valuation: "—", status: "review",
      source: "FEMA flood map service",
      reason: "The primary location sits in FEMA Zone AE, but flood coverage was not requested on the submission.",
      resolution: "Discuss flood coverage with the broker; if declined, document it as an informed exclusion in the bind file.",
    },
  ] as CoverageRow[],
  endorsements: [
    { code: "CP-10-49", name: "Windstorm & Hail — Named Storm Deductible", why: "Coastal FL wind exposure", source: "AIR Worldwide CAT model" },
    { code: "CP-04-40", name: "Spoilage Coverage", why: "Refrigerated occupancy — 72hr spoilage window", source: "ACORD 140 · Section III" },
    { code: "CP-14-45", name: "Ordinance or Law – Coverage A/B/C", why: "2022 renovation to modern FL Building Code", source: "Duval County permitting record" },
    { code: "IM-79-25", name: "Equipment Breakdown Enhancement", why: "Compressor & condenser dependency", source: "Inspection Report" },
  ],
  deductibles: [
    { peril: "All Other Perils (AOP)", deductible: "$10,000", basis: "Per occurrence", source: "ACORD 140 · Section III" },
    { peril: "Named Storm (Wind & Hail)", deductible: "3% of TIV ($50,000 min)", basis: "Per occurrence, recommended increase from 2%", source: "AIR Worldwide CAT model" },
    { peril: "Flood", deductible: "Not purchased", basis: "—", source: "FEMA flood map service" },
    { peril: "Equipment Breakdown", deductible: "$5,000", basis: "Per occurrence", source: "ACORD 140 · Section III" },
  ],
  coinsurance: "90% (waived under agreed-value endorsement)",
};

/* ── Loss History ── */
export const lossDetail = {
  status: "verified" as FindingStatus,
  observation:
    "3 claims in the trailing 5 years, aggregate incurred of $77,800. Loss ratio of 42% is well within the 55% class benchmark. No catastrophe activity through two named-storm seasons.",
  recommendation: "No loss-history conditions required. Continue standard post-bind monitoring.",
  kpis: [
    { label: "Claims (5yr)", value: "3 · 1 open" },
    { label: "Frequency", value: "0.6 / yr" },
    { label: "Avg. Severity", value: "$25,933" },
    { label: "Largest Loss", value: "$42,000" },
    { label: "Loss Ratio", value: "42% (bench 55%)" },
  ],
  claims: [
    { date: "2021-08-14", cause: "Wind & Hail", line: "Property", status: "Closed", paid: 12_300, reserved: 0, incurred: 12_300, source: "Chubb loss run · claim CB-21-0842" },
    { date: "2023-11-02", cause: "Water Damage (sprinkler leak)", line: "Property", status: "Closed", paid: 23_500, reserved: 0, incurred: 23_500, source: "Chubb loss run · claim CB-23-1190" },
    {
      date: "2025-03-22", cause: "Equipment Breakdown (compressor)", line: "Property", status: "Open", paid: 37_000, reserved: 5_000, incurred: 42_000,
      source: "Chubb loss run · claim CB-25-0311",
      reason: "Claim remains open with $5,000 reserved against the final compressor repair invoice.",
      resolution: "Request an updated claim status / reserve confirmation from the prior carrier before bind; no property-line concern otherwise.",
    },
  ] as ClaimRow[],
};

/* ── Broker ── */
export const brokerDetail = {
  status: "verified" as FindingStatus,
  observation:
    "Priya Ramaswamy at MMA Southeast — a top-quartile producer on our book. 6-year relationship with a 31% hit ratio and 94/100 submission-quality score. No E&O signals.",
  recommendation: "Fast-track review. Broker credibility supports streamlined bind pathway.",
  profile: [
    { k: "Agency", v: "Marsh McLennan Agency — Southeast", source: "Producer file APEX-3421" },
    { k: "Producer", v: "Priya Ramaswamy", source: "Producer file APEX-3421" },
    { k: "License Status", v: "Active · FL Producer #A123456", source: "FL DFS producer registry" },
    { k: "E&O Coverage", v: "Current · $5M/$5M", source: "Producer file APEX-3421" },
  ],
  metrics: [
    { label: "Relationship", value: "6 years", source: "Producer file APEX-3421" },
    { label: "Submissions (LTM)", value: "148", source: "Prior-year performance dashboard" },
    { label: "Hit Ratio", value: "31%", source: "Prior-year performance dashboard" },
    { label: "Submission Quality", value: "94 / 100", source: "Submission-quality analyzer" },
  ],
  recentSubmissions: [
    { ref: "SUB-2026-081142", insured: "Coastal Ridge Cold Storage", line: "Commercial Property", status: "In Review" },
    { ref: "SUB-2026-079815", insured: "Palmetto Logistics Partners", line: "Commercial Property", status: "Bound" },
    { ref: "SUB-2025-074002", insured: "Harbor Fresh Distribution", line: "Commercial Property", status: "Bound" },
  ],
};

/* ── Compliance ── */
export const complianceDetail = {
  status: "verified" as FindingStatus,
  observation:
    "Florida non-admitted eligible with surplus-lines tax applied. TRIA disclosures on file. Building complies with 2020 Florida Building Code. No OFAC, sanctions, or export-control triggers.",
  recommendation: "No compliance conditions required prior to bind.",
  checklist: [
    { check: "OFAC / Sanctions / PEP Screening", result: "Clear — 0 hits", source: "LexisNexis Accurint" },
    { check: "Surplus Lines Eligibility", result: "FL non-admitted eligible · 4.94% tax applied", source: "FL DFS surplus lines registry" },
    { check: "TRIA Disclosure", result: "On file", source: "ACORD 125 (pg. 3)" },
    { check: "Building Code Compliance", result: "Compliant · 2020 FL Building Code (post-renovation)", source: "Duval County permitting record" },
    { check: "Producer Licensing / Appointment", result: "Verified", source: "FL DFS producer registry" },
    { check: "Adverse Media Screening", result: "Clear — 3 favorable mentions, no litigation", source: "OSINT Agent scan" },
  ],
};

/* ─────────────────────── Step 3 – Risk Story ─────────────────────── */

export const riskStory = {
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
};

/* ── Risk Story · Risk Summary tab ── */

export type RiskBand = "Low" | "Moderate" | "High";

type FactorRow = { factor: string; detail: string; value: string; source: string; weight: number; direction: "up" | "down" };
type PerilDerivation = { key: string; label: string; band: RiskBand; factors: FactorRow[] };

export const riskSummaryTab = {
  status: "review" as FindingStatus,
  aiSummary: {
    band: "Moderate Risk" as const,
    confidence: 90,
    observation:
      "Coastal Ridge Cold Storage is a well-protected Class 4 refrigerated warehouse whose sprinklered construction and clean loss history meaningfully offset an above-average wind/hail exposure typical of the Jacksonville coastal corridor. This narrative synthesizes ISO, CoreLogic, FEMA, NOAA and D&B data alongside the Map & GIS and Satellite Imagery sections later in this tab — expand any peril below for its full weighted derivation.",
    bullets: [
      "Primary driver of the overall score is wind/hail exposure (score 71 — High) given the Tier-2 coastal wind zone and a prior $12.3K wind & hail loss in 2021.",
      "Flood exposure is moderate: FEMA Zone AE covers the primary parcel, but the elevated finished-floor freeboard meaningfully reduces expected severity.",
      "Fire, crime and liability exposures are all favorable given sprinklers, monitored alarm, low-hazard occupancy and site conditions confirmed in the Satellite Imagery section.",
      "Recommend confirming the named-storm deductible structure and roof maintenance schedule given the 2021 wind/hail loss and the coastal wind-zone rating.",
    ],
  },
  overall: { score: 54, band: "Moderate" as RiskBand },
  perils: [
    { key: "fire", label: "Fire", score: 18, band: "Low" as RiskBand },
    { key: "wind", label: "Wind / Hail", score: 71, band: "High" as RiskBand },
    { key: "flood", label: "Flood", score: 52, band: "Moderate" as RiskBand },
    { key: "crime", label: "Crime / Theft", score: 22, band: "Low" as RiskBand },
    { key: "gl", label: "General Liability", score: 26, band: "Low" as RiskBand },
  ],
  derivation: [
    {
      key: "fire", label: "Fire", band: "Low",
      factors: [
        { factor: "ISO Public Protection Class", detail: "PC 3 is strong — within the top quartile nationally for refrigerated-warehouse risks.", value: "PC 3", source: "Verisk / ISO", weight: 25, direction: "down" },
        { factor: "Construction Class", detail: "Steel frame / insulated metal panel significantly limits fire spread and structural collapse risk.", value: "Class 4 — Non-Combustible", source: "CoreLogic + Submission", weight: 20, direction: "down" },
        { factor: "Sprinkler System", detail: "Full NFPA 13 wet-pipe coverage with current inspections and no open impairments is the single largest fire-score reducer.", value: "NFPA 13 wet-pipe, 100% coverage", source: "Insured Submission", weight: 20, direction: "down" },
        { factor: "Occupancy Hazard", detail: "Refrigerated storage of general merchandise; no flammable liquids, Class III packaging only.", value: "Refrigerated warehousing (COPE 483)", source: "ISO Class Code", weight: 10, direction: "down" },
        { factor: "Nearest Hydrant Distance", detail: "Within the 300 ft preferred threshold for PC 3 territory.", value: "112 ft", source: "Verisk / ISO", weight: 10, direction: "down" },
        { factor: "Wildfire Hazard Severity", detail: "Wildfire overlay from Map & GIS shows negligible wildland-fire adjacency.", value: "Minimal — dense urban surroundings", source: "Map & GIS Data Layers", weight: 10, direction: "down" },
        { factor: "Adjacent Exposure", detail: "Paved surface lot adjacent — no combustible exposure amplification.", value: "Paved lot, 40 ft east", source: "Satellite / Aerial Imagery", weight: 5, direction: "down" },
      ],
    },
    {
      key: "wind", label: "Wind / Hail", band: "High",
      factors: [
        { factor: "Wind Zone (Tier)", detail: "AIR Worldwide places the parcel in a Tier-2 hurricane wind band — the primary driver of the overall score.", value: "Tier 2", source: "AIR Worldwide model", weight: 30, direction: "up" },
        { factor: "Distance to Coast", detail: "8.2 km from the Atlantic — close enough to see meaningful gust amplification during named-storm events.", value: "8.2 km", source: "AIR Worldwide model", weight: 20, direction: "up" },
        { factor: "Prior Wind & Hail Loss", detail: "A 2021 wind & hail claim confirms realized exposure, though severity was modest.", value: "$12,300 incurred (2021, closed)", source: "Chubb loss run", weight: 20, direction: "up" },
        { factor: "Roof Condition", detail: "TPO membrane re-coated in 2026 with a 15-year warranty meaningfully reduces uplift and wind-driven-rain severity.", value: "Re-coated 2026 · 15-yr warranty", source: "Inspection Report", weight: 15, direction: "down" },
        { factor: "Named-Storm Deductible", detail: "Current 2% named-storm deductible is thin relative to Tier-2 exposure; model assumes a step-up to 3%.", value: "2% of TIV (recommend 3%)", source: "ACORD 140 · Section III", weight: 15, direction: "up" },
      ],
    },
    {
      key: "flood", label: "Flood", band: "Moderate",
      factors: [
        { factor: "FEMA Flood Zone", detail: "Primary parcel sits within FEMA Zone AE — the base driver of the flood score.", value: "Zone AE", source: "FEMA flood map service", weight: 40, direction: "up" },
        { factor: "Base Flood Elevation / Freeboard", detail: "Finished floor sits above base flood elevation, meaningfully moderating expected severity within the AE zone.", value: "2.1 ft freeboard above BFE", source: "FEMA flood map service", weight: 30, direction: "down" },
        { factor: "1-in-250 Flood Loss (Modelled)", detail: "AIR Worldwide models a modest expected severity given the freeboard offset.", value: "$58,000", source: "AIR Worldwide model", weight: 20, direction: "up" },
        { factor: "Flood Coverage Purchased", detail: "No flood coverage currently requested on the submission despite the AE designation.", value: "Not purchased", source: "ACORD 140 · Section III", weight: 10, direction: "up" },
      ],
    },
    {
      key: "crime", label: "Crime / Theft", band: "Low",
      factors: [
        { factor: "Crime Index", detail: "Below the city median for the ZIP code, consistent with a light-industrial corridor.", value: "34 / 100", source: "SafeStreet crime index Q1 2026", weight: 40, direction: "down" },
        { factor: "Security & Access Control", detail: "Perimeter fencing, badge access and CCTV meaningfully reduce theft and vandalism exposure.", value: "Fenced · badge access · CCTV", source: "Inspection Report", weight: 35, direction: "down" },
        { factor: "Central-Station Monitoring", detail: "Alarm system is centrally monitored around the clock, including off-hours.", value: "Monitored 24/7", source: "Insured Submission", weight: 25, direction: "down" },
      ],
    },
    {
      key: "gl", label: "General Liability", band: "Low",
      factors: [
        { factor: "5-Year Loss Ratio", detail: "42% loss ratio is 13 points below the class benchmark of 55%.", value: "42% (bench 55%)", source: "Chubb loss run", weight: 40, direction: "down" },
        { factor: "Open GL Claim", detail: "A 2024 slip-and-fall remains open with a modest reserve — a housekeeping signal rather than a controls failure.", value: "$18.5K paid / $5K reserved, open", source: "Chubb loss run · claim CB-24-0562", weight: 35, direction: "up" },
        { factor: "Site Housekeeping", detail: "Satellite imagery shows generally tidy loading-dock areas with only minor palletized-goods staging.", value: "Minor staging near south dock", source: "Satellite / Aerial Imagery", weight: 25, direction: "up" },
      ],
    },
  ] as PerilDerivation[],
};

/* ── Risk Story · Property Details tab ── */

export const propertyDetailsTab = {
  status: "verified" as FindingStatus,
  aiSummary: {
    band: "Low Risk" as const,
    confidence: 93,
    observation:
      "Construction and occupancy are favorable: non-combustible steel/IMP construction, single-story refrigerated warehouse occupancy, with a roof re-coated within the last year and no reported structural concerns.",
    bullets: [
      "Class 4 non-combustible construction is favorable relative to the broader refrigerated-warehousing book.",
      "Refrigerated general-merchandise storage carries low combustibility versus hazardous-storage warehouses.",
      "Roof was re-coated in 2026 with a 15-year manufacturer warranty — well within normal wear range for an 8-year-old TPO membrane.",
      "No secondary structures or additional occupancies identified on the parcel beyond the primary warehouse building.",
    ],
  },
  yearBuilt: "2016",
  renovated: "2022",
  stories: "1",
  squareFootage: "58,400 sq ft",
  buildingsAndDocks: "1 building / 8 dock doors",
  roof: "TPO single-ply membrane over steel deck (8 yrs old, re-coated 2026)",
  sprinklered: "Yes — full coverage (NFPA 13 wet-pipe)",
  buildingValue: "$3,910,000",
  contentsBI: "$1,220,000 / $850,000",
  cope: [
    { label: "Construction", value: "Class 4 — Non-Combustible (Steel Frame / Insulated Metal Panel)", source: "ACORD 140" },
    { label: "Occupancy", value: "Refrigerated Warehousing — general merchandise (COPE Class 483)", source: "ACORD 125" },
    { label: "Protection", value: "PC 3, NFPA 13 wet-pipe sprinklers (100% coverage), central-station monitored alarm", source: "Inspection Report" },
    { label: "Exposure", value: "Light industrial corridor; leased Savannah office is the only secondary location", source: "Nearmap aerial 2026-01-14" },
  ],
};

/* ── Risk Story · Risk Protections tab ── */

export const riskProtectionsTab = {
  status: "verified" as FindingStatus,
  aiSummary: {
    band: "Low Risk" as const,
    confidence: 91,
    observation:
      "Fire protection is strong across the board: PC 3 territory, 100% NFPA 13 sprinkler coverage with current inspections, monitored alarm, and layered physical security. Backup power directly supports refrigeration continuity, which is the insured's core spoilage exposure.",
    bullets: [
      "Sprinkler 5-year internal/external test and the 2026 annual inspection are both current with no open impairments.",
      "Nearest hydrant (112 ft) and responding station (1.4 mi) are both within preferred underwriting thresholds for PC 3.",
      "On-site security (fencing, badge access, CCTV) reduces theft and vandalism exposure.",
      "Backup generator with 36-hour fuel reserve directly protects refrigerated inventory from spoilage during grid outages.",
    ],
  },
  cards: [
    { key: "fire-class", icon: "flame", label: "Fire Protection Class", lines: ["PC 3 — Jacksonville Fire Station 14, 1.4 mi", "Nearest hydrant: 112 ft"] },
    { key: "sprinkler", icon: "droplet", label: "Sprinkler System", lines: ["Wet-pipe, NFPA 13", "100% of building area", "Last inspected 2026-02-11"] },
    { key: "alarm", icon: "bell", label: "Fire Alarm", lines: ["Central-station monitored", "Simplex 4100ES panel", "Last tested 2026-03-04"] },
    { key: "security", icon: "lock", label: "Security", lines: ["6 ft perimeter chain-link with gated access", "16-camera CCTV, 60-day retention", "Badge access, monitored off-hours"] },
    { key: "power", icon: "zap", label: "Backup Power", lines: ["250 kW diesel generator with automatic transfer switch", "36-hour run time on-site fuel storage", "Protects refrigeration continuity"] },
  ],
};

/* ── Risk Story · Data Sources tab ── */

export const dataSourcesTab = {
  status: "verified" as FindingStatus,
  aiSummary: {
    band: "High Confidence" as const,
    confidence: 96,
    observation:
      "Eleven third-party and submission data sources were reconciled to build this risk story, spanning protection-class ratings, catastrophe modelling, flood and seismic hazard mapping, aerial imagery, credit, and identity screening. All sources returned current, high-confidence data.",
    bullets: [
      "Property and protection-class data (Verisk/ISO, CoreLogic) is cross-checked against the insured's own submission.",
      "Catastrophe modelling (AIR Worldwide, FEMA, USGS) is refreshed on standard quarterly cycles.",
      "Aerial imagery is under 6 months old, well within underwriting freshness guidelines.",
      "No data source returned a stale or unavailable status for this submission.",
    ],
  },
  sources: [
    { name: "Verisk / ISO", type: "Protection class & construction rating", lastUpdated: "2026-01-08", coverage: "High confidence", status: "Verified" },
    { name: "CoreLogic", type: "Replacement cost & construction model", lastUpdated: "2026-02-02", coverage: "±3% RCV confidence", status: "Verified" },
    { name: "FEMA Flood Map Service", type: "Flood zone & base flood elevation", lastUpdated: "2024-03-01", coverage: "Parcel-level", status: "Verified" },
    { name: "AIR Worldwide", type: "Wind, hurricane & flood CAT modelling", lastUpdated: "2026-01-14", coverage: "1-in-100 / 1-in-250 return periods", status: "Verified" },
    { name: "USGS", type: "Seismic hazard & fault mapping", lastUpdated: "2023-11-14", coverage: "Regional", status: "Verified" },
    { name: "Nearmap", type: "Aerial & satellite imagery", lastUpdated: "2026-01-14", coverage: "Full parcel + 300 ft buffer", status: "Verified" },
    { name: "D&B", type: "Business credit report", lastUpdated: "2026-01-20", coverage: "PAYDEX 82", status: "Verified" },
    { name: "LexisNexis Accurint", type: "Principal & entity screening", lastUpdated: "2026-01-19", coverage: "OFAC / PEP / adverse media", status: "Verified" },
    { name: "Chubb (prior carrier)", type: "5-year loss run history", lastUpdated: "2026-01-05", coverage: "2020 – 2025", status: "Verified" },
    { name: "FL SunBiz", type: "Entity registration & good-standing", lastUpdated: "2026-01-02", coverage: "Record L15000091823", status: "Verified" },
    { name: "Insured Submission", type: "ACORD 125 / 140, SOV, appraisal", lastUpdated: "2025-11-01", coverage: "14 documents · 312 fields", status: "Review — SOV stale" },
  ],
};

/* ── Risk Story · Map & GIS tab ── */

export const mapGisTab = {
  status: "review" as FindingStatus,
  aiSummary: {
    band: "Moderate Risk" as const,
    confidence: 84,
    observation:
      "GIS overlays show the primary parcel fully inside FEMA Zone AE, sitting within a Tier-2 wind/hail exposure band typical of the Jacksonville coastal corridor, with negligible wildfire or seismic exposure.",
    bullets: [
      "Flood: full-parcel Zone AE overlap, but 2.1 ft of freeboard above base flood elevation moderates otherwise elevated flood risk.",
      "Wind/Hail: entire parcel sits within a Tier-2 exposure band — consistent with regional hurricane and hailstorm frequency.",
      "Wildfire hazard severity is minimal given dense urban surroundings and lack of wildland fuel.",
      "Seismic exposure is negligible — nearest mapped fault trace is 38 miles away with a very low peak ground acceleration.",
    ],
  },
  flood: { zone: "Zone AE (full parcel)", bfe: "48.0 ft", lowestFloor: "50.1 ft (2.1 ft freeboard)", lastUpdated: "2024-03-01" },
  seismic: { category: "A (very low)", pga: "0.03g", nearestFault: "38 miles", lastUpdated: "2023-11-14" },
  lossHistory: { claims: "3 claims / $77,800 incurred", largestLoss: "$42,000 — equipment breakdown (2025)", openClaims: "1 open", lastUpdated: "2026-01-05" },
  imageryFeed: { source: "Nearmap · Imagery", captureDate: "2026-01-14", resolution: "6.0 cm / pixel", coverage: "Full parcel + 300 ft buffer" },
  layers: [
    { key: "flood", label: "Flood Zone (AE)", color: "#0098f2", defaultOn: true },
    { key: "wind", label: "Wind / Hail Exposure", color: "#f5a623", defaultOn: true },
    { key: "wildfire", label: "Wildfire Hazard", color: "#5a6472", defaultOn: false },
    { key: "seismic", label: "Seismic / Fault", color: "#e0455f", defaultOn: false },
    { key: "hydrant", label: "Fire Station & Hydrants", color: "#e0455f", defaultOn: true },
  ],
};

/* ── Risk Story · Satellite Imagery tab ── */

export const satelliteImageryTab = {
  status: "review" as FindingStatus,
  aiSummary: {
    band: "Low Risk" as const,
    confidence: 88,
    observation:
      "Recent aerial imagery (captured 2026-01-14) shows a well-maintained property with a uniform re-coated roof and clear loading-dock areas. One minor vegetation observation is worth routine follow-up; nothing rises to a material exposure.",
    bullets: [
      "Roof surface is uniform TPO membrane with no ponding or debris — consistent with the 2026 re-coating.",
      "Loading-dock lighting, bollards and drainage are all present and in good condition.",
      "Minor vegetation growth along the northeast fence line is a routine-maintenance note, not a material exposure.",
      "Adjacent parcel is a paved surface lot — no exposure amplification from neighboring occupancies.",
    ],
  },
  captureDate: "2026-01-14",
  resolution: "6.0 cm / pixel",
  observations: [
    { label: "Roof surface — uniform TPO membrane", detail: "No ponding, debris or membrane damage observed, consistent with the 2026 re-coating.", severity: "good" as const },
    { label: "Loading dock & drainage", detail: "Dock lighting, bollards and drainage are all present and functioning.", severity: "good" as const },
    { label: "Rooftop refrigeration units", detail: "Condenser and compressor units appear well-maintained with no visible corrosion.", severity: "good" as const },
    { label: "Perimeter fencing & lighting", detail: "Fencing and security lighting are intact around the full site perimeter.", severity: "good" as const },
    { label: "Vegetation — northeast fence line", detail: "Minor vegetation growth along the fence line; recommend routine trim, not a material exposure.", severity: "watch" as const },
    { label: "Adjacent parcel", detail: "Paved surface lot to the east — no exposure amplification from neighboring occupancies.", severity: "good" as const },
  ],
};

/* ─────────────────────── Step 3 – Risk Story: Peril Scorecard ─────────────────────── */

export type PerilBand = "low" | "moderate" | "high";
export type FactorDirection = "increases" | "reduces" | "neutral";

export type PerilFactor = {
  factor: string;
  detail: string;
  value: string;
  source: string;
  weight: number;
  direction: FactorDirection;
};

export type Peril = {
  key: string;
  label: string;
  score: number;
  band: PerilBand;
  factors: PerilFactor[];
};

export type AiInsight = { badge: string; confidence: number; body: string; bullets: string[] };

export const riskScorecard = {
  overallScore: 54,
  overallBand: "moderate" as PerilBand,
  aiSummary: {
    badge: "Moderate Risk",
    confidence: 89,
    body: "Coastal Ridge Cold Storage is a well-protected ISO Class 4 refrigerated warehouse (PC 3, full sprinkler coverage) that meaningfully offsets an above-average wind/hail and partial flood exposure typical of the Jacksonville coastal market. This narrative synthesizes ISO, CoreLogic, FEMA, NOAA and USGS data alongside the inspection report and aerial imagery — expand any peril below for its full weighted factor-level derivation.",
    bullets: [
      "Primary driver of the composite score is wind/hail exposure (score 72 — High) given the Tier-2 coastal wind band and a confirmed $12,300 hail loss in 2021.",
      "Flood exposure is moderate: FEMA Zone AE covers the primary parcel, but 2.5 ft of freeboard above BFE meaningfully reduces expected severity.",
      "Fire, crime and liability exposures are all favorable given sprinklers, monitored alarm, layered security and the low-hazard refrigerated-storage occupancy.",
      "Recommend confirming named-storm deductible structure given the Tier-2 wind zone and 8-year-old TPO roof.",
    ],
  } as AiInsight,
  perils: [
    {
      key: "fire", label: "Fire", score: 20, band: "low",
      factors: [
        { factor: "ISO Public Protection Class", detail: "PPC 3 is strong — top quartile nationally for refrigerated-warehouse risks.", value: "PPC 3", source: "Verisk / ISO", weight: 25, direction: "reduces" },
        { factor: "Construction Class", detail: "Steel/IMP construction significantly limits fire spread and structural collapse risk.", value: "Class 4 – Non-Combustible", source: "CoreLogic + Submission", weight: 20, direction: "reduces" },
        { factor: "Sprinkler System", detail: "Full NFPA 13 coverage with current inspections and no open impairments is the single largest fire-score reducer.", value: "NFPA 13 wet-pipe, 100% coverage", source: "Insured Submission", weight: 20, direction: "reduces" },
        { factor: "Occupancy Hazard", detail: "Non-hazardous commodity storage; no flammable liquids or Class III+ packaging.", value: "Refrigerated storage (COPE Class 483)", source: "ISO Class Code", weight: 10, direction: "reduces" },
        { factor: "Wildfire Hazard Severity", detail: "No wildland-fire adjacency in the surrounding parcel.", value: "Minimal — dense industrial surroundings", source: "Map & GIS Data Layers", weight: 10, direction: "reduces" },
        { factor: "Nearest Hydrant Distance", detail: "Well within the 300 ft preferred threshold for PC 3 territory.", value: "112 ft", source: "Verisk / ISO", weight: 5, direction: "reduces" },
        { factor: "Adjacent Exposure", detail: "No combustible neighboring occupancy within exposure distance.", value: "Paved surface lot, 40 ft east", source: "Satellite / Aerial Imagery", weight: 5, direction: "reduces" },
        { factor: "Vegetation / Tree Canopy", detail: "Clear roofline reduces fire-spread and debris-accumulation risk.", value: "No canopy within 20 ft of roofline", source: "Satellite / Aerial Imagery", weight: 5, direction: "reduces" },
      ],
    },
    {
      key: "wind", label: "Wind / Hail", score: 72, band: "high",
      factors: [
        { factor: "Geographic Exposure Zone", detail: "The Wind/Hail Exposure overlay places the parcel within a Tier-2 high-exposure band; no geographic mitigation available.", value: "Atlantic Coastal Tier-2 Wind Band", source: "Map & GIS Data Layers / NOAA", weight: 28, direction: "increases" },
        { factor: "Historical Hail Events (10 yr, 5 mi)", detail: "5 hail events within 5 miles over 10 years is above the national warehouse benchmark of ~2 events.", value: "5 events, max 1.5 in diameter", source: "NOAA Storm Events Database", weight: 20, direction: "increases" },
        { factor: "Named Storm History", detail: "Two named-storm impacts in 9 years elevate long-term frequency assumptions, though neither made direct landfall on the parcel.", value: "Irma (2017), Ian (2022)", source: "NOAA Storm Events Database", weight: 12, direction: "increases" },
        { factor: "Prior Wind/Hail Loss (2021)", detail: "Confirmed loss demonstrates site vulnerability; roof condition score of 78/100 post-repair is adequate but warrants monitoring.", value: "$12,300 — roof damage", source: "Loss Run – Insured Submission", weight: 13, direction: "increases" },
        { factor: "Roof Type & Age", detail: "TPO is hail-susceptible above ~1.5 in; 8-year age is within useful life but not new.", value: "TPO membrane, 8 years old", source: "CoreLogic + Submission", weight: 10, direction: "neutral" },
        { factor: "Roof Condition Score", detail: "Above the 75-point threshold that materially reduces expected wind/hail severity.", value: "78 / 100 (CoreLogic)", source: "CoreLogic Property Intelligence", weight: 7, direction: "reduces" },
        { factor: "Roof Drainage / Ponding", detail: "Clean roofline with functioning drainage limits water-intrusion severity after a wind event.", value: "No ponding observed, proper slope & drains", source: "Satellite / Aerial Imagery", weight: 10, direction: "reduces" },
      ],
    },
    {
      key: "flood", label: "Flood", score: 52, band: "moderate",
      factors: [
        { factor: "Flood Zone Designation", detail: "Zone AE requires flood coverage consideration; base flood elevation applies to the primary warehouse.", value: "Zone AE (primary), Zone X (office)", source: "FEMA National Flood Hazard Layer", weight: 35, direction: "increases" },
        { factor: "Elevation / Freeboard", detail: "Finished floor sits meaningfully above BFE, reducing expected flood severity relative to at-grade Zone AE risk.", value: "2.5 ft above Base Flood Elevation", source: "FEMA + Inspection Report", weight: 25, direction: "reduces" },
        { factor: "Distance to Nearest Waterbody", detail: "Proximity to a tidal-influenced waterway adds storm-surge-adjacent exposure during major named storms.", value: "1.2 mi to St. Johns River tributary", source: "USGS / Map & GIS Data Layers", weight: 15, direction: "increases" },
        { factor: "Historical Flood Claims", detail: "No flood-related claims despite two named-storm seasons in the exposure window.", value: "None in 10 years", source: "Loss Run – Insured Submission", weight: 15, direction: "reduces" },
        { factor: "Local Drainage Infrastructure", detail: "Recent capacity upgrades in the surrounding drainage basin lower localized ponding risk.", value: "Municipal stormwater system upgraded 2021", source: "Duval County Public Works", weight: 10, direction: "reduces" },
      ],
    },
    {
      key: "crime", label: "Crime / Theft", score: 22, band: "low",
      factors: [
        { factor: "Local Crime Index", detail: "Property sits in a below-median crime tract relative to the broader Jacksonville metro.", value: "34 / 100 (below city median)", source: "SafeStreet Crime Index Q1 2026", weight: 40, direction: "reduces" },
        { factor: "Security System", detail: "Layered physical security materially reduces theft and vandalism exposure.", value: "24-camera CCTV, badge access, on-site guard", source: "Inspection Report", weight: 25, direction: "reduces" },
        { factor: "Nearest Police Response", detail: "Response time is within the preferred underwriting threshold for commercial property.", value: "~6 min average", source: "Duval County Sheriff's Office", weight: 15, direction: "reduces" },
        { factor: "Neighboring Occupancy Risk", detail: "No adjacent occupancies known to elevate area theft frequency.", value: "Light industrial park", source: "Satellite / Aerial Imagery", weight: 10, direction: "reduces" },
        { factor: "Cargo / Inventory Portability", detail: "Refrigerated inventory has limited black-market resale value relative to general merchandise.", value: "Palletized frozen goods, low resale liquidity", source: "Insured Submission", weight: 10, direction: "reduces" },
      ],
    },
    {
      key: "liability", label: "General Liability", score: 24, band: "low",
      factors: [
        { factor: "GL Loss History", detail: "Open claim signals a housekeeping/controls gap; property line is unaffected but the item is being tracked.", value: "1 open claim (2024 slip-and-fall), $18.5K paid / $5K reserved", source: "Loss Run", weight: 30, direction: "increases" },
        { factor: "Premises Foot Traffic", detail: "Low foot-traffic occupancy with no retail or public-facing operations limits slip-and-fall frequency.", value: "Warehouse — no public access", source: "Insured Submission", weight: 25, direction: "reduces" },
        { factor: "Contractual Risk Transfer", detail: "Standard risk-transfer language on third-party contracts limits residual GL exposure.", value: "Hold-harmless + additional-insured clauses standard", source: "Submission", weight: 20, direction: "reduces" },
        { factor: "Product / Completed Operations", detail: "No products-completed-operations exposure beyond basic bailee/storage liability.", value: "Storage-only, no manufacturing", source: "ISO Class Code", weight: 15, direction: "reduces" },
        { factor: "Safety Program", detail: "Formal safety program reduces likelihood of repeat premises-liability incidents.", value: "Documented housekeeping & safety walkthroughs", source: "Inspection Report", weight: 10, direction: "reduces" },
      ],
    },
  ] as Peril[],
};

export const riskPropertyProfile = {
  aiSummary: {
    badge: "Low Risk",
    confidence: 93,
    body: "Construction and occupancy are favorable: non-combustible steel/IMP construction, single-story refrigerated warehouse occupancy with a roof re-coated in 2026 and no reported structural concerns.",
    bullets: [
      "ISO Class 4 non-combustible construction is favorable relative to the broader industrial portfolio.",
      "Refrigerated general-merchandise occupancy carries low combustibility versus hazardous-storage warehouses.",
      "Roof is 8 years into an expected 20+ year TPO membrane lifecycle — within normal wear range.",
      "No secondary structures or additional occupancies identified on the primary parcel.",
    ],
  } as AiInsight,
  yearBuilt: "2016",
  stories: "1",
  sqft: "58,400 sq ft",
  buildingsDocks: "1 building / 8 dock doors",
  roof: "TPO single-ply membrane over steel deck (8 yrs old)",
  sprinklered: "Yes — full coverage (NFPA 13 wet-pipe)",
  buildingValue: "$3,910,000",
  contentsBI: "$1,220,000 / $850,000",
  cope: [
    { code: "C", text: "Class 4 – Non-Combustible (steel frame / insulated metal panel)" },
    { code: "O", text: "Refrigerated warehousing – general merchandise (COPE Class 483)" },
    { code: "P", text: "PC 3, NFPA 13 wet-pipe sprinklers (100% coverage), central-station monitored alarm" },
    { code: "E", text: "Light industrial corridor; paved surface lot adjacent, no amplification" },
  ],
};

export const riskProtectionsPanel = {
  aiSummary: {
    badge: "Low Risk",
    confidence: 91,
    body: "Fire protection is strong across the board: PC 3 territory, 100% NFPA 13 sprinkler coverage with current inspections, monitored alarm, and layered physical security including guards and CCTV.",
    bullets: [
      "Sprinkler 5-year internal/external test and 2025 annual inspection are both current with no open impairments.",
      "Nearest hydrant (112 ft) and responding station (1.4 mi) are both within preferred underwriting thresholds for PC 3.",
      "On-site security (guard, CCTV, badge access, fencing) reduces theft and vandalism exposure.",
      "Backup generator with 36-hour fuel reserve supports cold-chain continuity during grid outages from named storms.",
    ],
  } as AiInsight,
  items: [
    { icon: "flame", title: "Fire Protection Class 3", lines: ["Duval County Fire Station 14 – 1.4 mi", "Nearest hydrant: 112 ft"] },
    { icon: "droplet", title: "Sprinkler System", lines: ["Wet-pipe, NFPA 13", "100% of building area", "Last inspected 2025-11-02"] },
    { icon: "bell", title: "Fire Alarm", lines: ["Central-station monitored", "Simplex 4100ES panel", "Last tested 2026-01-18"] },
    { icon: "lock", title: "Security", lines: ["8 ft perimeter fencing, gated access", "24-camera CCTV, 60-day retention", "On-site guard nights & weekends"] },
    { icon: "zap", title: "Backup Power", lines: ["350 kW diesel generator, auto transfer switch", "36-hour run time on-site fuel storage", "Sized for cold-chain continuity"] },
  ],
};

export const riskDataSourcesPanel = {
  aiSummary: {
    badge: "Low Risk",
    confidence: 86,
    body: "Third-party data across ISO, CoreLogic, county records and federal sources is largely consistent and recently refreshed; the one open item is the insured-submitted loss run, which is still pending underwriter review.",
    bullets: [
      "ISO and CoreLogic construction/protection details corroborate each other — no material discrepancies found.",
      "FEMA and USGS hazard layers were last refreshed in 2024 and 2023 respectively — still within acceptable currency for this risk.",
      "Loss run reflects one material weather-related claim (2021 wind/hail, $12,300) and one open GL claim.",
      "Imagery feed is current, supporting confidence in the roof and site-condition findings above.",
    ],
  } as AiInsight,
  items: [
    {
      title: "ISO Public Protection Classification", org: "Verisk / ISO · Fire Protection", updated: "2025-06-01",
      fields: [{ k: "PPC Rating", v: "3" }, { k: "Responding Company", v: "Duval County Fire Station 14" }, { k: "Water Supply", v: "Adequate – public hydrant system" }],
    },
    {
      title: "CoreLogic Property Intelligence", org: "CoreLogic · Property Characteristics & Valuation", updated: "2026-01-15",
      fields: [{ k: "Replacement Cost Estimate", v: "$3.91M" }, { k: "Roof Condition Score", v: "78 / 100" }, { k: "Construction Confidence", v: "High" }],
    },
    {
      title: "Duval County Appraisal District", org: "County Assessor · Public Records", updated: "2025-09-10",
      fields: [{ k: "Legal Owner", v: "Coastal Ridge Cold Storage, LLC" }, { k: "Last Sale", v: "2016-04-19, $2.9M" }, { k: "Assessed Value", v: "$3.4M" }],
    },
    {
      title: "NOAA / NWS Storm Events Database", org: "NOAA · Weather History", updated: "2026-06-30",
      fields: [{ k: "Hail Events (5 mi, 10 yr)", v: "5 events, max 1.5 in" }, { k: "Wind Events (5 mi, 10 yr)", v: "3 severe thunderstorm warnings" }, { k: "Named Storm Exposure", v: "Irma (2017), Ian (2022)" }],
    },
    {
      title: "FEMA National Flood Hazard Layer", org: "FEMA · Flood", updated: "2024-03-01",
      fields: [{ k: "Flood Zone", v: "Zone AE (partial), Zone X (remainder)" }, { k: "Base Flood Elevation", v: "14.0 ft" }, { k: "Lowest Floor Elevation", v: "16.5 ft (2.5 ft freeboard)" }],
    },
    {
      title: "USGS Seismic Hazard Database", org: "USGS · Earthquake", updated: "2023-11-14",
      fields: [{ k: "Seismic Design Category", v: "A (very low)" }, { k: "Peak Ground Acceleration", v: "0.03g" }, { k: "Nearest Mapped Fault", v: "210 miles" }],
    },
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
