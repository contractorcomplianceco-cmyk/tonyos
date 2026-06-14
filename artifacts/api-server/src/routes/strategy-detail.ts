import { Router, type IRouter } from "express";
import {
  db,
  riskItemsTable,
  roadmapPhasesTable,
  partnershipsTable,
  milestonesTable,
  sourceRecordsTable,
  guardrailsTable,
} from "@workspace/db";
import { asc } from "drizzle-orm";
import {
  GetRiskItemsResponse,
  GetRoadmapPhasesResponse,
  GetPartnershipsResponse,
  GetMilestonesResponse,
  GetSourceRecordsResponse,
  GetGuardrailsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/risk-items", async (_req, res) => {
  const rows = await db
    .select()
    .from(riskItemsTable)
    .orderBy(asc(riskItemsTable.sort), asc(riskItemsTable.id));
  res.json(GetRiskItemsResponse.parse(rows));
});

router.get("/roadmap-phases", async (_req, res) => {
  const rows = await db
    .select()
    .from(roadmapPhasesTable)
    .orderBy(asc(roadmapPhasesTable.sort), asc(roadmapPhasesTable.id));
  res.json(GetRoadmapPhasesResponse.parse(rows));
});

router.get("/partnerships", async (_req, res) => {
  const rows = await db
    .select()
    .from(partnershipsTable)
    .orderBy(asc(partnershipsTable.sort), asc(partnershipsTable.id));
  res.json(GetPartnershipsResponse.parse(rows));
});

router.get("/milestones", async (_req, res) => {
  const rows = await db
    .select()
    .from(milestonesTable)
    .orderBy(asc(milestonesTable.sort), asc(milestonesTable.id));
  res.json(GetMilestonesResponse.parse(rows));
});

router.get("/source-records", async (_req, res) => {
  const rows = await db
    .select()
    .from(sourceRecordsTable)
    .orderBy(asc(sourceRecordsTable.sort), asc(sourceRecordsTable.id));
  res.json(GetSourceRecordsResponse.parse(rows));
});

router.get("/guardrails", async (_req, res) => {
  const rows = await db
    .select()
    .from(guardrailsTable)
    .orderBy(asc(guardrailsTable.sort), asc(guardrailsTable.id));
  res.json(GetGuardrailsResponse.parse(rows));
});

export default router;
