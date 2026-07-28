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
