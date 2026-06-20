import { Router, type IRouter } from "express";
import { db, reviewersTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import {
  GetReviewersResponse,
  CreateReviewerBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reviewers", async (_req, res) => {
  const rows = await db
    .select()
    .from(reviewersTable)
    .orderBy(asc(reviewersTable.sort), asc(reviewersTable.name));
  const data = GetReviewersResponse.parse(rows);
  res.json(data);
});

router.post("/reviewers", async (req, res) => {
  const body = CreateReviewerBody.parse(req.body);
  const name = body.name.trim();
  if (!name) {
    res.status(400).json({ error: "Reviewer name must not be empty" });
    return;
  }

  const [existing] = await db
    .select()
    .from(reviewersTable)
    .where(eq(reviewersTable.name, name))
    .limit(1);
  if (existing) {
    res.status(200).json(existing);
    return;
  }

  const [created] = await db
    .insert(reviewersTable)
    .values({ name })
    .returning();

  res.status(201).json(created);
});

export default router;
