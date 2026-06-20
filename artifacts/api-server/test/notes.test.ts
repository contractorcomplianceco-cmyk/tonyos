import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { eq, inArray } from "drizzle-orm";
import {
  db,
  decisionsTable,
  brandsTable,
  projectsTable,
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

// Parent identifiers used by the create (POST) tests. The POST routes verify the
// parent exists before inserting, so these need a real row in their table (the
// id-based ones are created in beforeAll and captured below).
const NEW_BRAND = "ZZTESTCREATE";
const MISSING_DECISION = 990000091;
const MISSING_BRAND = "ZZTESTMISSING";
const MISSING_PROJECT = 990000092;

const createdDecisionNoteIds: number[] = [];
const createdBrandNoteIds: number[] = [];
const createdProjectNoteIds: number[] = [];

const createdDecisionParentIds: number[] = [];
const createdBrandParentCodes: string[] = [];
const createdProjectParentIds: number[] = [];

let createDecisionParentId = 0;
let createProjectParentId = 0;

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

beforeAll(async () => {
  const [decision] = await db
    .insert(decisionsTable)
    .values({
      title: "ZZ Test Decision",
      category: "test",
      approvalType: "strategic",
      dueDate: "2099-01-01",
    })
    .returning();
  createDecisionParentId = decision.id;
  createdDecisionParentIds.push(decision.id);

  const [brand] = await db
    .insert(brandsTable)
    .values({
      code: NEW_BRAND,
      name: "ZZ Test Brand",
      fullName: "ZZ Test Brand Full",
      kind: "brand",
      stage: "candidate",
    })
    .returning();
  createdBrandParentCodes.push(brand.code);

  const [project] = await db
    .insert(projectsTable)
    .values({
      brandCode: NEW_BRAND,
      name: "ZZ Test Project",
      status: "on_track",
    })
    .returning();
  createProjectParentId = project.id;
  createdProjectParentIds.push(project.id);
});

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
  if (createdDecisionParentIds.length) {
    await db
      .delete(decisionsTable)
      .where(inArray(decisionsTable.id, createdDecisionParentIds));
  }
  if (createdProjectParentIds.length) {
    await db
      .delete(projectsTable)
      .where(inArray(projectsTable.id, createdProjectParentIds));
  }
  if (createdBrandParentCodes.length) {
    await db
      .delete(brandsTable)
      .where(inArray(brandsTable.code, createdBrandParentCodes));
  }
});

describe("Decision notes — create (POST)", () => {
  it("creates a note (201) defaulting the author to Tony Casella", async () => {
    const res = await request(app)
      .post(`/api/decisions/${createDecisionParentId}/notes`)
      .send({ body: "new decision note" });

    expect(res.status).toBe(201);
    expect(res.body.decisionId).toBe(createDecisionParentId);
    expect(res.body.body).toBe("new decision note");
    expect(res.body.author).toBe("Tony Casella");
    if (res.body.id) createdDecisionNoteIds.push(res.body.id);
  });

  it("rejects an empty (whitespace-only) body with 400", async () => {
    const res = await request(app)
      .post(`/api/decisions/${createDecisionParentId}/notes`)
      .send({ body: "   " });

    expect(res.status).toBe(400);
  });

  it("returns 404 when the decision does not exist", async () => {
    const res = await request(app)
      .post(`/api/decisions/${MISSING_DECISION}/notes`)
      .send({ body: "note for missing decision" });

    expect(res.status).toBe(404);
  });
});

describe("Brand notes — create (POST)", () => {
  it("creates a note (201) defaulting the author to Tony Casella", async () => {
    const res = await request(app)
      .post(`/api/brands/${NEW_BRAND}/notes`)
      .send({ body: "new brand note" });

    expect(res.status).toBe(201);
    expect(res.body.brandCode).toBe(NEW_BRAND);
    expect(res.body.body).toBe("new brand note");
    expect(res.body.author).toBe("Tony Casella");
    if (res.body.id) createdBrandNoteIds.push(res.body.id);
  });

  it("rejects an empty (whitespace-only) body with 400", async () => {
    const res = await request(app)
      .post(`/api/brands/${NEW_BRAND}/notes`)
      .send({ body: "   " });

    expect(res.status).toBe(400);
  });

  it("returns 404 when the brand does not exist", async () => {
    const res = await request(app)
      .post(`/api/brands/${MISSING_BRAND}/notes`)
      .send({ body: "note for missing brand" });

    expect(res.status).toBe(404);
  });
});

describe("Project notes — create (POST)", () => {
  it("creates a note (201) defaulting the author to Tony Casella", async () => {
    const res = await request(app)
      .post(`/api/projects/${createProjectParentId}/notes`)
      .send({ body: "new project note" });

    expect(res.status).toBe(201);
    expect(res.body.projectId).toBe(createProjectParentId);
    expect(res.body.body).toBe("new project note");
    expect(res.body.author).toBe("Tony Casella");
    if (res.body.id) createdProjectNoteIds.push(res.body.id);
  });

  it("rejects an empty (whitespace-only) body with 400", async () => {
    const res = await request(app)
      .post(`/api/projects/${createProjectParentId}/notes`)
      .send({ body: "   " });

    expect(res.status).toBe(400);
  });

  it("returns 404 when the project does not exist", async () => {
    const res = await request(app)
      .post(`/api/projects/${MISSING_PROJECT}/notes`)
      .send({ body: "note for missing project" });

    expect(res.status).toBe(404);
  });
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
