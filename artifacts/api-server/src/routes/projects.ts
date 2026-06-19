import { Router, type IRouter } from "express";
import { db, projectsTable, projectNotesTable } from "@workspace/db";
import { and, asc, eq } from "drizzle-orm";
import {
  GetProjectsResponse,
  GetProjectsQueryParams,
  GetProjectParams,
  GetProjectResponse,
  GetProjectNotesResponse,
  GetProjectNotesParams,
  CreateProjectNoteParams,
  CreateProjectNoteBody,
  UpdateProjectNoteParams,
  UpdateProjectNoteBody,
  DeleteProjectNoteParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/projects", async (req, res) => {
  const { brand, department } = GetProjectsQueryParams.parse(req.query);
  const rows = await db
    .select()
    .from(projectsTable)
    .orderBy(asc(projectsTable.sort), asc(projectsTable.id));
  let filtered = rows;
  if (brand) filtered = filtered.filter((r) => r.brandCode === brand);
  if (department) filtered = filtered.filter((r) => r.department === department);
  const data = GetProjectsResponse.parse(filtered);
  res.json(data);
});

router.get("/projects/:id", async (req, res) => {
  const { id } = GetProjectParams.parse(req.params);
  const [row] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, id))
    .limit(1);
  if (!row) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  const data = GetProjectResponse.parse(row);
  res.json(data);
});

router.get("/projects/:id/notes", async (req, res) => {
  const { id } = GetProjectNotesParams.parse(req.params);
  const rows = await db
    .select()
    .from(projectNotesTable)
    .where(eq(projectNotesTable.projectId, id))
    .orderBy(asc(projectNotesTable.id));
  const data = GetProjectNotesResponse.parse(rows);
  res.json(data);
});

router.post("/projects/:id/notes", async (req, res) => {
  const { id } = CreateProjectNoteParams.parse(req.params);
  const body = CreateProjectNoteBody.parse(req.body);

  const trimmedBody = body.body.trim();
  if (!trimmedBody) {
    res.status(400).json({ error: "Note body must not be empty" });
    return;
  }

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, id))
    .limit(1);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const [created] = await db
    .insert(projectNotesTable)
    .values({
      projectId: id,
      author: body.author?.trim() ? body.author.trim() : "Tony Casella",
      body: trimmedBody,
      createdAt: new Date().toISOString(),
    })
    .returning();

  res.status(201).json(created);
});

router.patch("/projects/:id/notes/:noteId", async (req, res) => {
  const { id, noteId } = UpdateProjectNoteParams.parse(req.params);
  const body = UpdateProjectNoteBody.parse(req.body);

  const trimmedBody = body.body.trim();
  if (!trimmedBody) {
    res.status(400).json({ error: "Note body must not be empty" });
    return;
  }

  const [updated] = await db
    .update(projectNotesTable)
    .set({ body: trimmedBody, updatedAt: new Date().toISOString() })
    .where(
      and(
        eq(projectNotesTable.id, noteId),
        eq(projectNotesTable.projectId, id),
      ),
    )
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  res.json(updated);
});

router.delete("/projects/:id/notes/:noteId", async (req, res) => {
  const { id, noteId } = DeleteProjectNoteParams.parse(req.params);

  const [deleted] = await db
    .delete(projectNotesTable)
    .where(
      and(
        eq(projectNotesTable.id, noteId),
        eq(projectNotesTable.projectId, id),
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
