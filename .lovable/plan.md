# AI-First Underwriting Redesign

Scope is large. Proposing a phased plan so each phase is shippable and reviewable. Nav and page hierarchy stay identical.

## Core primitive (built first, used everywhere)

**FindingStatus** — a single component + type that replaces every confidence percentage in the app.

- States: `verified` (green), `needs-review` (yellow), `missing` (red), `ai-recommendation` (blue)
- Variants: inline pill, section header, and expanded card with reasoning slot
- All existing `%` values in the codebase get removed and replaced with one of these four states

Tokens added to `src/styles.css`: `--status-verified`, `--status-review`, `--status-missing`, `--status-ai` (+ foreground pairs), plus subtle "AI thinking" animation keyframes (soft pulse, streaming shimmer).

## Phase 1 — Case Workspace (the biggest change)

Replace the six existing tabs with workflow-named tabs:

```text
Overview        → AI Brief
Request Details → Review Findings
Risk Summary    → Risk Story
Pricing         → Quote Recommendation
Communication   → Decision
Audit           → Audit Trail
```

Per-page content:

1. **AI Brief** — landing view. Large natural-language summary from the AI, four count cards (Verified / Needs Review / Missing / AI Recs), documents analysed strip, single primary CTA "Start Review" that deep-links to the first unresolved finding.
2. **Review Findings** — grouped smart cards: Business Identity, Coverage, Broker, Loss History, Financials, Property. Each card leads with a one-line AI summary + status pill, then extracted key/value rows each carrying a status. Needs-Review rows expand inline with mismatch table, AI observation, AI recommendation, and buttons: Accept Recommendation / View Evidence / Compare Documents. Evidence stays collapsed until requested.
3. **Risk Story** — reasoning first (prose), then Risk Drivers / Positive Factors / Watch Items / Suggested Endorsements, then charts.
4. **Quote Recommendation** — AI recommendation banner + rationale, three scenarios (Conservative / Balanced / Competitive), deductible slider, premium breakdown, coverage table.
5. **Decision** — decision workspace: outstanding vs resolved findings, missing info, AI recommendation, underwriter comments, four decision buttons (Approve / Refer / Request Info / Reject). Approve is gated with an AI confirmation line.
6. **Audit Trail** — chronological timeline mixing AI reasoning steps, document events, human edits, approvals.

**Right rail (Agent Workspace)** — upgrade from progress tracker to intelligence hub: current summary, latest finding in natural language, running task, completed agents, pinned findings, Ask AI input. Sticky.

**Ask AI** — same input component surfaces on every workspace page; local mocked responses for now (no backend call), phrased conversationally.

## Phase 2 — Dashboard

Keep grid. Swap metrics to operational-AI framing: Cases auto-completed today, Documents processed, Avg review time saved, Cases waiting for human review. Add two feed cards: Recent AI Discoveries, Recent Referrals. Modernize card styling (elevation, subtle motion on mount).

## Phase 3 — My Queue

Keep table structure. Replace generic status column with the four-state indicator plus two workflow states (Waiting for AI, Ready for Decision). Add a filter chip row driven by those states so "what needs me" is one click.

## Phase 4 — Create Case wizard

Keep modal wizard. Step 3 (AI Processing) becomes a live agent list — Reading ACORD, OCR, Business Identification, Coverage Extraction, Loss History, Guideline Matching, Risk Assessment, Pricing Analysis, Summary — each ticking to done progressively with a streamed one-line finding under it. Step 4 says "AI completed the first review" with CTA to open AI Workspace.

## Out of scope (this pass)

- Real AI backend / streaming — content is deterministic mock data shaped so a real agent can drop in later
- Knowledge Hub and Settings pages
- Nav or route changes

## Technical notes

- New: `src/components/app/finding-status.tsx`, `src/components/app/ai-summary.tsx`, `src/components/app/agent-workspace.tsx`, `src/components/app/ask-ai.tsx`, plus one file per workspace page under `src/components/app/case/`
- Case route becomes a thin shell that renders the six workflow sections via internal tab state (no new routes)
- All colors via semantic tokens in `src/styles.css`; no hard-coded hex in components
- Framer Motion for calm transitions (fade + subtle translate, 200–300ms)

## Suggested execution order

1. Tokens + FindingStatus + Ask AI + Agent Workspace shell
2. Case Workspace: AI Brief + Review Findings (highest value)
3. Case Workspace: Risk Story + Quote Recommendation + Decision + Audit
4. Dashboard refresh
5. Queue indicators
6. Create Case wizard step 3/4

Confirm and I'll start at step 1. If you want a smaller first slice (e.g. just steps 1–2), say so and I'll ship that alone.
