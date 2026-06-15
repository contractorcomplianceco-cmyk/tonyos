import { Router, type IRouter } from "express";
import { db, projectsTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import {
  GetProjectsResponse,
  GetProjectsQueryParams,
  GetProjectParams,
  GetProjectResponse,
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

export default router;
