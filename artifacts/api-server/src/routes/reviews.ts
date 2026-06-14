import { Router, type IRouter } from "express";
import { db, monthlyReviewsTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import {
  GetMonthlyReviewsResponse,
  GetMonthlyReviewResponse,
  GetMonthlyReviewParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/monthly-reviews", async (_req, res) => {
  const rows = await db
    .select()
    .from(monthlyReviewsTable)
    .orderBy(asc(monthlyReviewsTable.sort), asc(monthlyReviewsTable.id));
  res.json(GetMonthlyReviewsResponse.parse(rows));
});

router.get("/monthly-reviews/:id", async (req, res) => {
  const { id } = GetMonthlyReviewParams.parse(req.params);
  const [row] = await db
    .select()
    .from(monthlyReviewsTable)
    .where(eq(monthlyReviewsTable.id, id))
    .limit(1);
  if (!row) {
    res.status(404).json({ error: "Monthly review not found" });
    return;
  }
  res.json(GetMonthlyReviewResponse.parse(row));
});

export default router;
