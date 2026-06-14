import { Router, type IRouter } from "express";
import { db, strategyObjectivesTable } from "@workspace/db";
import { asc } from "drizzle-orm";
import { GetStrategyObjectivesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/strategy-objectives", async (_req, res) => {
  const rows = await db
    .select()
    .from(strategyObjectivesTable)
    .orderBy(asc(strategyObjectivesTable.sort), asc(strategyObjectivesTable.id));
  const data = GetStrategyObjectivesResponse.parse(rows);
  res.json(data);
});

export default router;
