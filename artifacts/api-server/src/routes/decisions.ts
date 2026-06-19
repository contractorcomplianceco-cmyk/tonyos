import { Router, type IRouter } from "express";
import { db, decisionsTable, decisionNotesTable } from "@workspace/db";
import { and, asc, eq } from "drizzle-orm";
import {
  GetDecisionsResponse,
  GetDecisionsQueryParams,
  GetDecisionResponse,
  GetDecisionParams,
  GetDecisionSummaryResponse,
  GetDecisionNotesResponse,
  GetDecisionNotesParams,
  CreateDecisionNoteParams,
  CreateDecisionNoteBody,
  UpdateDecisionNoteParams,
  UpdateDecisionNoteBody,
  DeleteDecisionNoteParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/decisions", async (req, res) => {
  const { status } = GetDecisionsQueryParams.parse(req.query);
  const rows = await db
    .select()
    .from(decisionsTable)
    .orderBy(asc(decisionsTable.sort), asc(decisionsTable.id));
  const filtered = status ? rows.filter((r) => r.status === status) : rows;
  const data = GetDecisionsResponse.parse(filtered);
  res.json(data);
});

router.get("/decisions/summary", async (_req, res) => {
  const rows = await db.select().from(decisionsTable);
  const pending = rows.filter((r) => r.founderApprovalRequired && r.status === "pending");

  const counts = new Map<string, number>();
  const labelFor: Record<string, string> = {
    needs_written_approval: "Needs Written Approval",
    budget_threshold: "Budget Threshold",
    ip_platform_rights: "IP / Platform Rights",
    financial_commitment: "Financial Commitment",
    strategic: "Strategic",
  };
  for (const r of pending) {
    counts.set(r.approvalType, (counts.get(r.approvalType) ?? 0) + 1);
  }
  const byApprovalType = Array.from(counts.entries()).map(([key, count]) => ({
    label: labelFor[key] ?? key,
    count,
  }));

  // Normalize each estimatedImpact to a dollar amount, honoring K/M/B suffixes.
  const parseImpact = (raw: string | null): number => {
    if (!raw) return 0;
    const match = raw.match(/([0-9][0-9,]*\.?[0-9]*)\s*([kmb])?/i);
    if (!match) return 0;
    const value = Number(match[1].replace(/,/g, ""));
    if (!Number.isFinite(value)) return 0;
    const suffix = (match[2] ?? "").toLowerCase();
    const multiplier =
      suffix === "b" ? 1e9 : suffix === "m" ? 1e6 : suffix === "k" ? 1e3 : 1;
    return value * multiplier;
  };

  const totalImpactDollars = pending.reduce(
    (sum, r) => sum + parseImpact(r.estimatedImpact),
    0,
  );
  const formatDollars = (n: number): string => {
    if (n <= 0) return "$0";
    if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
    if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
    return `$${n.toFixed(0)}`;
  };
  const totalImpact = formatDollars(totalImpactDollars);

  const data = GetDecisionSummaryResponse.parse({
    total: rows.length,
    pendingApproval: pending.length,
    totalImpact,
    byApprovalType,
  });
  res.json(data);
});

router.get("/decisions/:id", async (req, res) => {
  const { id } = GetDecisionParams.parse(req.params);
  const [row] = await db
    .select()
    .from(decisionsTable)
    .where(eq(decisionsTable.id, id))
    .limit(1);
  if (!row) {
    res.status(404).json({ error: "Decision not found" });
    return;
  }
  const data = GetDecisionResponse.parse(row);
  res.json(data);
});

router.get("/decisions/:id/notes", async (req, res) => {
  const { id } = GetDecisionNotesParams.parse(req.params);
  const rows = await db
    .select()
    .from(decisionNotesTable)
    .where(eq(decisionNotesTable.decisionId, id))
    .orderBy(asc(decisionNotesTable.id));
  const data = GetDecisionNotesResponse.parse(rows);
  res.json(data);
});

router.post("/decisions/:id/notes", async (req, res) => {
  const { id } = CreateDecisionNoteParams.parse(req.params);
  const body = CreateDecisionNoteBody.parse(req.body);

  const trimmedBody = body.body.trim();
  if (!trimmedBody) {
    res.status(400).json({ error: "Note body must not be empty" });
    return;
  }

  const [decision] = await db
    .select()
    .from(decisionsTable)
    .where(eq(decisionsTable.id, id))
    .limit(1);
  if (!decision) {
    res.status(404).json({ error: "Decision not found" });
    return;
  }

  const [created] = await db
    .insert(decisionNotesTable)
    .values({
      decisionId: id,
      author: body.author?.trim() ? body.author.trim() : "Tony Casella",
      body: trimmedBody,
      createdAt: new Date().toISOString(),
    })
    .returning();

  res.status(201).json(created);
});

router.patch("/decisions/:id/notes/:noteId", async (req, res) => {
  const { id, noteId } = UpdateDecisionNoteParams.parse(req.params);
  const body = UpdateDecisionNoteBody.parse(req.body);

  const trimmedBody = body.body.trim();
  if (!trimmedBody) {
    res.status(400).json({ error: "Note body must not be empty" });
    return;
  }

  const [updated] = await db
    .update(decisionNotesTable)
    .set({ body: trimmedBody, updatedAt: new Date().toISOString() })
    .where(
      and(
        eq(decisionNotesTable.id, noteId),
        eq(decisionNotesTable.decisionId, id),
      ),
    )
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  res.json(updated);
});

router.delete("/decisions/:id/notes/:noteId", async (req, res) => {
  const { id, noteId } = DeleteDecisionNoteParams.parse(req.params);

  const [deleted] = await db
    .delete(decisionNotesTable)
    .where(
      and(
        eq(decisionNotesTable.id, noteId),
        eq(decisionNotesTable.decisionId, id),
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
