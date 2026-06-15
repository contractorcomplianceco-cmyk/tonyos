import { Router, type IRouter } from "express";
import { db, predictorsTable } from "@workspace/db";
import { asc } from "drizzle-orm";
import { GetPredictorsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/predictors", async (_req, res) => {
  const rows = await db
    .select()
    .from(predictorsTable)
    .orderBy(asc(predictorsTable.sort), asc(predictorsTable.id));
  const data = GetPredictorsResponse.parse(rows);
  res.json(data);
});

export default router;
