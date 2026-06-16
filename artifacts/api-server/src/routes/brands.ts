import { Router, type IRouter } from "express";
import { db, brandsTable, brandNotesTable } from "@workspace/db";
import { and, asc, eq } from "drizzle-orm";
import {
  GetBrandsResponse,
  GetBrandParams,
  GetBrandResponse,
  GetBrandNotesResponse,
  GetBrandNotesParams,
  CreateBrandNoteParams,
  CreateBrandNoteBody,
  UpdateBrandNoteParams,
  UpdateBrandNoteBody,
  DeleteBrandNoteParams,
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

router.patch("/brands/:code/notes/:noteId", async (req, res) => {
  const { code, noteId } = UpdateBrandNoteParams.parse(req.params);
  const body = UpdateBrandNoteBody.parse(req.body);

  const trimmedBody = body.body.trim();
  if (!trimmedBody) {
    res.status(400).json({ error: "Note body must not be empty" });
    return;
  }

  const [updated] = await db
    .update(brandNotesTable)
    .set({ body: trimmedBody })
    .where(
      and(
        eq(brandNotesTable.id, noteId),
        eq(brandNotesTable.brandCode, code),
      ),
    )
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  res.json(updated);
});

router.delete("/brands/:code/notes/:noteId", async (req, res) => {
  const { code, noteId } = DeleteBrandNoteParams.parse(req.params);

  const [deleted] = await db
    .delete(brandNotesTable)
    .where(
      and(
        eq(brandNotesTable.id, noteId),
        eq(brandNotesTable.brandCode, code),
      ),
    )
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  res.status(204).end();
});

export default router;
