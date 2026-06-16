import { Router, type IRouter } from "express";
import { db, brandsTable, brandNotesTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import {
  GetBrandsResponse,
  GetBrandParams,
  GetBrandResponse,
  GetBrandNotesResponse,
  GetBrandNotesParams,
  CreateBrandNoteParams,
  CreateBrandNoteBody,
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

router.get("/brands/:code/notes", async (req, res) => {
  const { code } = GetBrandNotesParams.parse(req.params);
  const rows = await db
    .select()
    .from(brandNotesTable)
    .where(eq(brandNotesTable.brandCode, code))
    .orderBy(asc(brandNotesTable.id));
  const data = GetBrandNotesResponse.parse(rows);
  res.json(data);
});

router.post("/brands/:code/notes", async (req, res) => {
  const { code } = CreateBrandNoteParams.parse(req.params);
  const body = CreateBrandNoteBody.parse(req.body);

  const trimmedBody = body.body.trim();
  if (!trimmedBody) {
    res.status(400).json({ error: "Note body must not be empty" });
    return;
  }

  const [brand] = await db
    .select()
    .from(brandsTable)
    .where(eq(brandsTable.code, code))
    .limit(1);
  if (!brand) {
    res.status(404).json({ error: "Brand not found" });
    return;
  }

  const [created] = await db
    .insert(brandNotesTable)
    .values({
      brandCode: code,
      author: body.author?.trim() ? body.author.trim() : "Tony Casella",
      body: trimmedBody,
      createdAt: new Date().toISOString(),
    })
    .returning();

  res.status(201).json(created);
});

export default router;
