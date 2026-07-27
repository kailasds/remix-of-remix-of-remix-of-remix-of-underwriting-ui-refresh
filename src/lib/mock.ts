export type CaseStatus = "New" | "In Progress" | "Approved" | "Referred" | "Declined";

export interface CaseRow {
  id: string;
  ref: string;
  insured: string;
  product: string;
  address: string;
  sumInsured: number;
  broker: string;
  riskScore: number;
  completeness: number;
  status: CaseStatus;
  due: string;
  priority: "Low" | "Medium" | "High";
}

export const cases: CaseRow[] = [
  { id: "151", ref: "UW-151", insured: "Root Down LLC", product: "BROAD — Theft, Machinery, Civil Liability", address: "1034 Park St, Jacksonville FL", sumInsured: 750_000, broker: "James Jenkins Agency — Riskwell", riskScore: 62, completeness: 84, status: "In Progress", due: "2026-08-15", priority: "High" },
  { id: "150", ref: "UW-150", insured: "Harborline Freight Co.", product: "Marine Cargo — Institute A", address: "22 Dockside Blvd, Long Beach CA", sumInsured: 2_400_000, broker: "TCS Specialty", riskScore: 41, completeness: 96, status: "New", due: "2026-08-16", priority: "Medium" },
  { id: "149", ref: "UW-149", insured: "Meridian Coastal Homes", product: "Property — Coastal HO3", address: "500 Ocean View, Miami FL", sumInsured: 5_100_000, broker: "Atlantic Brokers Group", riskScore: 78, completeness: 71, status: "In Progress", due: "2026-08-14", priority: "High" },
  { id: "148", ref: "UW-148", insured: "Northwind Fabrication", product: "Commercial Property + GL", address: "17 Industrial Way, Cleveland OH", sumInsured: 1_800_000, broker: "Guild & Palmer", riskScore: 52, completeness: 88, status: "New", due: "2026-08-18", priority: "Medium" },
  { id: "147", ref: "UW-147", insured: "Sable & Vine Restaurants", product: "SME Property Appetite", address: "88 Vine St, Napa CA", sumInsured: 640_000, broker: "James Jenkins Agency", riskScore: 34, completeness: 100, status: "Approved", due: "2026-08-12", priority: "Low" },
  { id: "146", ref: "UW-146", insured: "Cascade Data Center Ops", product: "Cyber + Business Interruption", address: "9 Server Row, Hillsboro OR", sumInsured: 12_500_000, broker: "TCS Specialty", riskScore: 68, completeness: 62, status: "Referred", due: "2026-08-17", priority: "High" },
  { id: "145", ref: "UW-145", insured: "Blue Ridge Timber", product: "Property + Cargo", address: "4 Ridge Rd, Asheville NC", sumInsured: 3_200_000, broker: "Atlantic Brokers Group", riskScore: 55, completeness: 79, status: "In Progress", due: "2026-08-20", priority: "Medium" },
  { id: "144", ref: "UW-144", insured: "Bright Path Academy", product: "D&O + EPLI", address: "12 Learning Ln, Austin TX", sumInsured: 900_000, broker: "Guild & Palmer", riskScore: 29, completeness: 94, status: "New", due: "2026-08-22", priority: "Low" },
];

export const kpis = [
  { label: "Open Submissions", value: 24, delta: "+3 today", tone: "electric" as const },
  { label: "Pending Review", value: 8, delta: "2 urgent", tone: "coral" as const },
  { label: "Approved Today", value: 11, delta: "+5 vs avg", tone: "leaf" as const },
  { label: "Referred", value: 5, delta: "This week", tone: "iris" as const },
];

export const activity = [
  { t: "2 min ago", text: "Submission #4821 flagged for review — flood zone exposure exceeds appetite." },
  { t: "14 min ago", text: "Policy #UW-2291 approved. Effective date set to June 1, 2026." },
  { t: "1 hr ago", text: "Referral received from TCS Specialty — commercial property, £2.4M TIV." },
  { t: "3 hr ago", text: "Guidelines updated: Coastal Property section revised per Q2 2026 appetite review." },
  { t: "Yesterday", text: "Agent AI completed analysis on batch #112 — 8 of 10 auto-decisioned." },
];

export const submissionTrend = [
  { d: "Mon", submissions: 14, approved: 9 },
  { d: "Tue", submissions: 22, approved: 13 },
  { d: "Wed", submissions: 18, approved: 11 },
  { d: "Thu", submissions: 26, approved: 17 },
  { d: "Fri", submissions: 31, approved: 22 },
  { d: "Sat", submissions: 8, approved: 5 },
  { d: "Sun", submissions: 6, approved: 4 },
];

export const guidelines = [
  { title: "Coastal Property Appetite", tag: "Property", updated: "May 15, 2026", desc: "Appetite, limits, and exclusions for properties within 2km of tidal coastlines. Includes flood zone classification.", tint: "ice" },
  { title: "Commercial Liability Limits", tag: "Liability", updated: "Apr 3, 2026", desc: "Standard indemnity limits, excess structures, and mandatory endorsements for commercial general liability placements.", tint: "lavender" },
  { title: "Flood Zone Exclusions", tag: "Property", updated: "May 28, 2026", desc: "Zone-by-zone exclusion matrix for flood-exposed properties. References EA flood maps and FEMA equivalents.", tint: "blush" },
  { title: "Marine Cargo Clauses", tag: "Marine", updated: "Mar 12, 2026", desc: "Institute Cargo Clauses A/B/C applicability guide, commodity-specific conditions, and survey requirements.", tint: "ice" },
  { title: "D&O Underwriting Standards", tag: "Specialty", updated: "Apr 20, 2026", desc: "Acceptance criteria and rating factors for Directors & Officers liability, including financial distress indicators.", tint: "lavender" },
  { title: "SME Property Appetite", tag: "Property", updated: "Jun 1, 2026", desc: "Streamlined appetite guide for SME commercial property risks up to $5M TIV. Includes auto-acceptance criteria.", tint: "blush" },
];

export const team = [
  { initials: "SC", name: "Sarah Chen", role: "Senior Underwriter", status: "Active", last: "2 min ago", tint: "electric" },
  { initials: "JO", name: "James Okafor", role: "UW Associate", status: "Active", last: "1 hr ago", tint: "leaf" },
  { initials: "RT", name: "Rachel Torres", role: "UW Manager", status: "Active", last: "Yesterday", tint: "iris" },
  { initials: "DK", name: "David Kim", role: "UW Associate", status: "Inactive", last: "2 weeks ago", tint: "coral" },
  { initials: "LP", name: "Lisa Patel", role: "Senior Underwriter", status: "Active", last: "3 hr ago", tint: "electric" },
];

export const integrations = [
  { name: "Salesforce CRM", desc: "Sync broker and submission data with your CRM.", connected: true, last: "5 min ago" },
  { name: "SharePoint", desc: "Store and retrieve policy documents from SharePoint.", connected: true, last: "1 hr ago" },
  { name: "Rating Engine", desc: "Pull real-time premium indications from the rating service.", connected: true, last: "12 min ago" },
  { name: "Guidewire", desc: "Policy admin integration for bind and issue workflows.", connected: false, last: null },
];

export function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
