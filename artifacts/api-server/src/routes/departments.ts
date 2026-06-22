import { Router, type IRouter } from "express";
import { db, departmentsTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";
import {
  GetDepartmentsResponse,
  GetDepartmentsQueryParams,
  GetDepartmentParams,
  GetDepartmentResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/departments", async (req, res) => {
  const { brand } = GetDepartmentsQueryParams.parse(req.query);
  const rows = await db
    .select()
    .from(departmentsTable)
    .orderBy(asc(departmentsTable.sort), asc(departmentsTable.id));
  const filtered = brand ? rows.filter((r) => r.brandCode === brand) : rows;
  const data = GetDepartmentsResponse.parse(filtered);
  res.json(data);
});

router.get("/departments/:id", async (req, res) => {
  const { id } = GetDepartmentParams.parse(req.params);
  const [row] = await db
    .select()
    .from(departmentsTable)
    .where(eq(departmentsTable.id, id))
    .limit(1);
  if (!row) {
    res.status(404).json({ error: "Department not found" });
    return;
  }
  const data = GetDepartmentResponse.parse(row);
  res.json(data);
});

export default router;
