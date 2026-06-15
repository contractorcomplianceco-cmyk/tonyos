import { Router, type IRouter } from "express";
import { db, departmentsTable } from "@workspace/db";
import { asc } from "drizzle-orm";
import {
  GetDepartmentsResponse,
  GetDepartmentsQueryParams,
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

export default router;
