import {
  db,
  pool,
  brandsTable,
  departmentsTable,
  projectsTable,
  predictorsTable,
  decisionsTable,
  executiveSummaryTable,
  reviewersTable,
  financialOverviewTable,
} from "@workspace/db";
import {
  brands,
  departments,
  projects,
  predictors,
  decisions,
  executiveSummary,
  reviewers,
  financialOverview,
} from "./data/cockpit-starter.js";

const TARGET_TABLES = [
  { table: brandsTable, name: "brands" },
  { table: departmentsTable, name: "departments" },
  { table: projectsTable, name: "projects" },
  { table: predictorsTable, name: "predictors" },
  { table: decisionsTable, name: "decisions" },
  { table: executiveSummaryTable, name: "executive_summary" },
  { table: reviewersTable, name: "reviewers" },
  { table: financialOverviewTable, name: "financial_overview" },
] as const;

async function loadStagingStarter() {
  await db.transaction(async (tx) => {
    for (const { table, name } of TARGET_TABLES) {
      const existing = await tx.select().from(table).limit(1);
      if (existing.length > 0) {
        throw new Error(
          `Aborting: table "${name}" already has row(s). ` +
            "staging-starter is insert-only and must run against an empty TonyOS staging database.",
        );
      }
    }

    await tx.insert(brandsTable).values(brands);
    await tx.insert(departmentsTable).values(departments);
    await tx.insert(projectsTable).values(projects);
    await tx.insert(predictorsTable).values(predictors);
    await tx.insert(decisionsTable).values(decisions);
    await tx.insert(executiveSummaryTable).values(executiveSummary);
    await tx.insert(reviewersTable).values(reviewers);
    await tx.insert(financialOverviewTable).values(financialOverview);
  });

  console.log("Loaded TonyOS staging starter data:");
  console.log(`  brands: ${brands.length}`);
  console.log(`  departments: ${departments.length}`);
  console.log(`  projects: ${projects.length}`);
  console.log(`  predictors: ${predictors.length}`);
  console.log(`  decisions: ${decisions.length}`);
  console.log(`  executive_summary: 1`);
  console.log(`  reviewers: ${reviewers.length}`);
  console.log(`  financial_overview: 1`);
}

loadStagingStarter()
  .then(() => pool.end())
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("staging-starter failed:", err);
    return pool.end().finally(() => process.exit(1));
  });
