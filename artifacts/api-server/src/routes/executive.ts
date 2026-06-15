import { Router, type IRouter } from "express";
import { db, executiveSummaryTable, briefingItemsTable } from "@workspace/db";
import { asc } from "drizzle-orm";
import {
  GetExecutiveSummaryResponse,
  GetBriefingItemsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/executive-summary", async (_req, res) => {
  const [row] = await db.select().from(executiveSummaryTable).limit(1);
  if (!row) {
    res.status(404).json({ error: "Executive summary not configured" });
    return;
  }
  const data = GetExecutiveSummaryResponse.parse({
    companyPulse: row.companyPulse,
    collectedRetainedRevenue: row.collectedRetainedRevenue,
    operatingReserve: row.operatingReserve,
    majorDecisionsPending: row.majorDecisionsPending,
    predictiveAlerts: row.predictiveAlerts,
    pulseTrend: row.pulseTrend,
  });
  res.json(data);
});

router.get("/briefing-items", async (_req, res) => {
  const rows = await db
    .select()
    .from(briefingItemsTable)
    .orderBy(asc(briefingItemsTable.sort), asc(briefingItemsTable.id));
  const data = GetBriefingItemsResponse.parse(rows);
  res.json(data);
});

export default router;
