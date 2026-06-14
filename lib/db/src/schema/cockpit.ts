import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  doublePrecision,
  jsonb,
} from "drizzle-orm/pg-core";

export const briefingItemsTable = pgTable("briefing_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  detail: text("detail"),
  status: text("status").notNull(),
  category: text("category"),
  sourceRecord: text("source_record"),
  sort: integer("sort").notNull().default(0),
});

export const strategyObjectivesTable = pgTable("strategy_objectives", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  owner: text("owner"),
  horizon: text("horizon"),
  status: text("status").notNull(),
  progress: integer("progress").notNull().default(0),
  pillar: text("pillar"),
  sort: integer("sort").notNull().default(0),
});

export const decisionsTable = pgTable("decisions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  approvalType: text("approval_type").notNull(),
  estimatedImpact: text("estimated_impact"),
  dueDate: text("due_date").notNull(),
  status: text("status").notNull().default("pending"),
  founderApprovalRequired: boolean("founder_approval_required")
    .notNull()
    .default(true),
  recommendation: text("recommendation"),
  sourceRecord: text("source_record"),
  sort: integer("sort").notNull().default(0),
});

export const decisionNotesTable = pgTable("decision_notes", {
  id: serial("id").primaryKey(),
  decisionId: integer("decision_id").notNull(),
  author: text("author").notNull(),
  body: text("body").notNull(),
  createdAt: text("created_at").notNull(),
});

export const financialCommitmentsTable = pgTable("financial_commitments", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  amount: text("amount").notNull(),
  dueDate: text("due_date").notNull(),
  status: text("status").notNull(),
  approvalRequired: boolean("approval_required").notNull().default(false),
  sort: integer("sort").notNull().default(0),
});

export const financialMonthlyTable = pgTable("financial_monthly", {
  id: serial("id").primaryKey(),
  month: text("month").notNull(),
  actual: doublePrecision("actual").notNull(),
  plan: doublePrecision("plan").notNull(),
  sort: integer("sort").notNull().default(0),
});

export const riskItemsTable = pgTable("risk_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  severity: text("severity").notNull(),
  status: text("status").notNull(),
  openFindings: integer("open_findings").notNull().default(0),
  summary: text("summary"),
  sort: integer("sort").notNull().default(0),
});

export const roadmapPhasesTable = pgTable("roadmap_phases", {
  id: serial("id").primaryKey(),
  phase: text("phase").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull(),
  progress: integer("progress").notNull().default(0),
  vendor: text("vendor"),
  timeline: text("timeline"),
  sort: integer("sort").notNull().default(0),
});

export const partnershipsTable = pgTable("partnerships", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  stage: text("stage").notNull(),
  value: text("value"),
  description: text("description"),
  sort: integer("sort").notNull().default(0),
});

export const milestonesTable = pgTable("milestones", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull(),
  category: text("category"),
  description: text("description"),
  sort: integer("sort").notNull().default(0),
});

export const monthlyReviewsTable = pgTable("monthly_reviews", {
  id: serial("id").primaryKey(),
  period: text("period").notNull(),
  status: text("status").notNull(),
  summary: text("summary").notNull(),
  highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
  watchItems: jsonb("watch_items").$type<string[]>().notNull().default([]),
  metrics: jsonb("metrics")
    .$type<
      {
        label: string;
        value: string;
        unit?: string | null;
        change?: string | null;
        trend?: string | null;
        helper?: string | null;
      }[]
    >()
    .notNull()
    .default([]),
  sort: integer("sort").notNull().default(0),
});

export const sourceRecordsTable = pgTable("source_records", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  source: text("source").notNull(),
  status: text("status").notNull(),
  clpCleared: boolean("clp_cleared").notNull().default(false),
  lastUpdated: text("last_updated").notNull(),
  sort: integer("sort").notNull().default(0),
});

export const guardrailsTable = pgTable("guardrails", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(),
  category: text("category").notNull(),
  sort: integer("sort").notNull().default(0),
});

type Metric = {
  label: string;
  value: string;
  unit?: string | null;
  change?: string | null;
  trend?: string | null;
  helper?: string | null;
};

export const executiveSummaryTable = pgTable("executive_summary", {
  id: serial("id").primaryKey(),
  companyPulse: jsonb("company_pulse").$type<Metric>().notNull(),
  collectedRetainedRevenue: jsonb("collected_retained_revenue")
    .$type<Metric>()
    .notNull(),
  operatingReserve: jsonb("operating_reserve").$type<Metric>().notNull(),
  majorDecisionsPending: jsonb("major_decisions_pending")
    .$type<Metric>()
    .notNull(),
  pulseTrend: jsonb("pulse_trend").$type<number[]>().notNull().default([]),
});

export const financialOverviewTable = pgTable("financial_overview", {
  id: serial("id").primaryKey(),
  metrics: jsonb("metrics").$type<Metric[]>().notNull().default([]),
  reserveMonths: doublePrecision("reserve_months").notNull(),
  reserveTarget: doublePrecision("reserve_target").notNull(),
  revenueTriggerProgress: integer("revenue_trigger_progress")
    .notNull()
    .default(0),
  bankSummaries: jsonb("bank_summaries")
    .$type<{ name: string; balance: string; note: string }[]>()
    .notNull()
    .default([]),
});
