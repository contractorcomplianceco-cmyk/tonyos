import { Router, type IRouter } from "express";
import {
  db,
  financialOverviewTable,
  financialMonthlyTable,
  financialCommitmentsTable,
} from "@workspace/db";
import { asc } from "drizzle-orm";
import {
  GetFinancialOverviewResponse,
  GetFinancialMonthlyResponse,
  GetFinancialCommitmentsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/financial-overview", async (_req, res) => {
  const [row] = await db.select().from(financialOverviewTable).limit(1);
  if (!row) {
    res.status(404).json({ error: "Financial overview not configured" });
    return;
  }
  const data = GetFinancialOverviewResponse.parse({
    metrics: row.metrics,
    reserveMonths: row.reserveMonths,
    reserveTarget: row.reserveTarget,
    revenueTriggerProgress: row.revenueTriggerProgress,
    bankSummaries: row.bankSummaries,
  });
  res.json(data);
});

router.get("/financial-monthly", async (_req, res) => {
  const rows = await db
    .select()
    .from(financialMonthlyTable)
    .orderBy(asc(financialMonthlyTable.sort), asc(financialMonthlyTable.id));
  const data = GetFinancialMonthlyResponse.parse(rows);
  res.json(data);
});

router.get("/financial-commitments", async (_req, res) => {
  const rows = await db
    .select()
    .from(financialCommitmentsTable)
    .orderBy(
      asc(financialCommitmentsTable.sort),
      asc(financialCommitmentsTable.id),
    );
  const data = GetFinancialCommitmentsResponse.parse(rows);
  res.json(data);
});

export default router;
