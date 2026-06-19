import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { eq, inArray } from "drizzle-orm";
import {
  db,
  decisionNotesTable,
  brandNotesTable,
  projectNotesTable,
} from "@workspace/db";
import app from "../src/app";

// Parent identifiers chosen to be well outside the seeded data range so test
// fixtures never collide with (or mutate) real rows. PATCH/DELETE on a note
// only match on note id + parent id, so the parents do not need to exist.
const PARENT_A = 990000001;
const PARENT_B = 990000002;
const BRAND_A = "ZZTESTA";
const BRAND_B = "ZZTESTB";

const createdDecisionNoteIds: number[] = [];
const createdBrandNoteIds: number[] = [];
const createdProjectNoteIds: number[] = [];

async function insertDecisionNote(decisionId: number) {
  const [row] = await db
    .insert(decisionNotesTable)
    .values({
      decisionId,
      author: "Test Author",
      body: "original body",
      createdAt: new Date().toISOString(),
    })
    .returning();
  createdDecisionNoteIds.push(row.id);
  return row;
}

async function insertBrandNote(brandCode: string) {
  const [row] = await db
    .insert(brandNotesTable)
    .values({
      brandCode,
      author: "Test Author",
      body: "original body",
      createdAt: new Date().toISOString(),
    })
    .returning();
  createdBrandNoteIds.push(row.id);
  return row;
}

async function insertProjectNote(projectId: number) {
  const [row] = await db
    .insert(projectNotesTable)
    .values({
      projectId,
      author: "Test Author",
      body: "original body",
      createdAt: new Date().toISOString(),
    })
    .returning();
  createdProjectNoteIds.push(row.id);
  return row;
}

afterAll(async () => {
  if (createdDecisionNoteIds.length) {
    await db
      .delete(decisionNotesTable)
      .where(inArray(decisionNotesTable.id, createdDecisionNoteIds));
  }
  if (createdBrandNoteIds.length) {
    await db
      .delete(brandNotesTable)
      .where(inArray(brandNotesTable.id, createdBrandNoteIds));
  }
  if (createdProjectNoteIds.length) {
    await db
      .delete(projectNotesTable)
      .where(inArray(projectNotesTable.id, createdProjectNoteIds));
  }
});

describe("Decision notes — edit (PATCH)", () => {
  it("edits a note and returns the updated row", async () => {
    const note = await insertDecisionNote(PARENT_A);
    const res = await request(app)
      .patch(`/api/decisions/${PARENT_A}/notes/${note.id}`)
      .send({ body: "edited body" });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(note.id);
    expect(res.body.decisionId).toBe(PARENT_A);
    expect(res.body.body).toBe("edited body");
  });

  it("rejects an empty (whitespace-only) body with 400", async () => {
    const note = await insertDecisionNote(PARENT_A);
    const res = await request(app)
      .patch(`/api/decisions/${PARENT_A}/notes/${note.id}`)
      .send({ body: "   " });

    expect(res.status).toBe(400);

    const [row] = await db
      .select()
      .from(decisionNotesTable)
      .where(eq(decisionNotesTable.id, note.id));
    expect(row.body).toBe("original body");
  });

  it("returns 404 when the note belongs to a different decision", async () => {
    const note = await insertDecisionNote(PARENT_A);
    const res = await request(app)
      .patch(`/api/decisions/${PARENT_B}/notes/${note.id}`)
      .send({ body: "edited body" });

    expect(res.status).toBe(404);
  });
});

describe("Decision notes — delete (DELETE)", () => {
  it("deletes a note and returns 204", async () => {
    const note = await insertDecisionNote(PARENT_A);
    const res = await request(app).delete(
      `/api/decisions/${PARENT_A}/notes/${note.id}`,
    );

    expect(res.status).toBe(204);

    const rows = await db
      .select()
      .from(decisionNotesTable)
      .where(eq(decisionNotesTable.id, note.id));
    expect(rows).toHaveLength(0);
  });

  it("returns 404 when deleting an already-deleted note", async () => {
    const note = await insertDecisionNote(PARENT_A);
    await request(app)
      .delete(`/api/decisions/${PARENT_A}/notes/${note.id}`)
      .expect(204);

    const res = await request(app).delete(
      `/api/decisions/${PARENT_A}/notes/${note.id}`,
    );
    expect(res.status).toBe(404);
  });

  it("returns 404 when the note belongs to a different decision", async () => {
    const note = await insertDecisionNote(PARENT_A);
    const res = await request(app).delete(
      `/api/decisions/${PARENT_B}/notes/${note.id}`,
    );

    expect(res.status).toBe(404);

    const rows = await db
      .select()
      .from(decisionNotesTable)
      .where(eq(decisionNotesTable.id, note.id));
    expect(rows).toHaveLength(1);
  });
});

describe("Brand notes — edit (PATCH)", () => {
  it("edits a note and returns the updated row", async () => {
    const note = await insertBrandNote(BRAND_A);
    const res = await request(app)
      .patch(`/api/brands/${BRAND_A}/notes/${note.id}`)
      .send({ body: "edited body" });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(note.id);
    expect(res.body.brandCode).toBe(BRAND_A);
    expect(res.body.body).toBe("edited body");
  });

  it("rejects an empty (whitespace-only) body with 400", async () => {
    const note = await insertBrandNote(BRAND_A);
    const res = await request(app)
      .patch(`/api/brands/${BRAND_A}/notes/${note.id}`)
      .send({ body: "   " });

    expect(res.status).toBe(400);
  });

  it("returns 404 when the note belongs to a different brand", async () => {
    const note = await insertBrandNote(BRAND_A);
    const res = await request(app)
      .patch(`/api/brands/${BRAND_B}/notes/${note.id}`)
      .send({ body: "edited body" });

    expect(res.status).toBe(404);
  });
});

describe("Brand notes — delete (DELETE)", () => {
  it("deletes a note and returns 204", async () => {
    const note = await insertBrandNote(BRAND_A);
    const res = await request(app).delete(
      `/api/brands/${BRAND_A}/notes/${note.id}`,
    );

    expect(res.status).toBe(204);

    const rows = await db
      .select()
      .from(brandNotesTable)
      .where(eq(brandNotesTable.id, note.id));
    expect(rows).toHaveLength(0);
  });

  it("returns 404 when deleting an already-deleted note", async () => {
    const note = await insertBrandNote(BRAND_A);
    await request(app)
      .delete(`/api/brands/${BRAND_A}/notes/${note.id}`)
      .expect(204);

    const res = await request(app).delete(
      `/api/brands/${BRAND_A}/notes/${note.id}`,
    );
    expect(res.status).toBe(404);
  });

  it("returns 404 when the note belongs to a different brand", async () => {
    const note = await insertBrandNote(BRAND_A);
    const res = await request(app).delete(
      `/api/brands/${BRAND_B}/notes/${note.id}`,
    );

    expect(res.status).toBe(404);
  });
});

describe("Project notes — edit (PATCH)", () => {
  it("edits a note and returns the updated row", async () => {
    const note = await insertProjectNote(PARENT_A);
    const res = await request(app)
      .patch(`/api/projects/${PARENT_A}/notes/${note.id}`)
      .send({ body: "edited body" });

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(note.id);
    expect(res.body.projectId).toBe(PARENT_A);
    expect(res.body.body).toBe("edited body");
  });

  it("rejects an empty (whitespace-only) body with 400", async () => {
    const note = await insertProjectNote(PARENT_A);
    const res = await request(app)
      .patch(`/api/projects/${PARENT_A}/notes/${note.id}`)
      .send({ body: "   " });

    expect(res.status).toBe(400);
  });

  it("returns 404 when the note belongs to a different project", async () => {
    const note = await insertProjectNote(PARENT_A);
    const res = await request(app)
      .patch(`/api/projects/${PARENT_B}/notes/${note.id}`)
      .send({ body: "edited body" });

    expect(res.status).toBe(404);
  });
});

describe("Project notes — delete (DELETE)", () => {
  it("deletes a note and returns 204", async () => {
    const note = await insertProjectNote(PARENT_A);
    const res = await request(app).delete(
      `/api/projects/${PARENT_A}/notes/${note.id}`,
    );

    expect(res.status).toBe(204);

    const rows = await db
      .select()
      .from(projectNotesTable)
      .where(eq(projectNotesTable.id, note.id));
    expect(rows).toHaveLength(0);
  });

  it("returns 404 when deleting an already-deleted note", async () => {
    const note = await insertProjectNote(PARENT_A);
    await request(app)
      .delete(`/api/projects/${PARENT_A}/notes/${note.id}`)
      .expect(204);

    const res = await request(app).delete(
      `/api/projects/${PARENT_A}/notes/${note.id}`,
    );
    expect(res.status).toBe(404);
  });

  it("returns 404 when the note belongs to a different project", async () => {
    const note = await insertProjectNote(PARENT_A);
    const res = await request(app).delete(
      `/api/projects/${PARENT_B}/notes/${note.id}`,
    );

    expect(res.status).toBe(404);
  });
});
