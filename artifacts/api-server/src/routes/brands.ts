import { Router, type IRouter } from "express";
import { db, brandsTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import {
  GetBrandsResponse,
  GetBrandParams,
  GetBrandResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/brands", async (_req, res) => {
  const rows = await db
    .select()
    .from(brandsTable)
    .orderBy(asc(brandsTable.sort), asc(brandsTable.id));
  const data = GetBrandsResponse.parse(rows);
  res.json(data);
});

router.get("/brands/:code", async (req, res) => {
  const { code } = GetBrandParams.parse(req.params);
  const [row] = await db
    .select()
    .from(brandsTable)
    .where(eq(brandsTable.code, code))
    .limit(1);
  if (!row) {
    res.status(404).json({ error: "Brand not found" });
    return;
  }
  const data = GetBrandResponse.parse(row);
  res.json(data);
});

export default router;
