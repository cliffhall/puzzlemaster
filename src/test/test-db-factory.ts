import { PrismaClient } from "db";
import { randomUUID } from "crypto";
import { unlinkSync, existsSync } from "fs";

/**
 * Creates a test PrismaClient instance with a unique in-memory database
 * and applies the current schema using Prisma's db push
 */
export const createTestPrismaClient = async (): Promise<{
  prisma: PrismaClient;
  cleanup: () => Promise<void>;
}> => {
  // Generate unique test database URL
  const testDbName = `test_${Date.now()}_${randomUUID().replace(/-/g, "")}`;
  const testDbUrl = `file:./${testDbName}.db`;

  // Create PrismaClient with explicit database URL
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: testDbUrl,
      },
    },
  });

  try {
    // Apply current schema using direct SQL execution
    console.log(`Creating schema for test database: ${testDbUrl}`);

    await applySchemaToTestDatabase(prisma);

    // Verify the schema was applied correctly
    await verifySchema(prisma);

    const cleanup = async (): Promise<void> => {
      try {
        await prisma.$disconnect();

        // Clean up temporary database file
        const dbPath = testDbUrl.replace("file:", "");
        if (existsSync(dbPath)) {
          unlinkSync(dbPath);
        }
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    };

    return { prisma, cleanup };
  } catch (error) {
    // If setup fails, clean up and rethrow
    try {
      await prisma.$disconnect();
      const dbPath = testDbUrl.replace("file:", "");
      if (existsSync(dbPath)) {
        unlinkSync(dbPath);
      }
    } catch (cleanupError) {
      console.error("Error during failed setup cleanup:", cleanupError);
    }

    console.error("Error creating test database:", error);
    throw error;
  }
};

/**
 * Applies the current schema to the test database using direct SQL
 */
const applySchemaToTestDatabase = async (prisma: PrismaClient): Promise<void> => {
  try {
    // Create all tables based on the current Prisma schema

    // Demo tables (User, Post)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "User" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "email" TEXT NOT NULL UNIQUE,
        "name" TEXT
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Post" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "title" TEXT NOT NULL,
        "content" TEXT,
        "published" BOOLEAN NOT NULL DEFAULT false,
        "authorId" INTEGER NOT NULL,
        CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);

    // Domain tables
    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Project" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Plan" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "description" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        "projectId" TEXT NOT NULL UNIQUE,
        CONSTRAINT "Plan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Phase" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        "planId" TEXT NOT NULL,
        CONSTRAINT "Phase_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Job" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        "phaseId" TEXT NOT NULL UNIQUE,
        CONSTRAINT "Job_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Team" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        "phaseId" TEXT NOT NULL UNIQUE,
        CONSTRAINT "Team_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Role" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "description" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Agent" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        "teamId" TEXT NOT NULL,
        "roleId" TEXT NOT NULL,
        CONSTRAINT "Agent_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "Agent_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Validator" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "template" TEXT NOT NULL,
        "resource" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Task" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        "jobId" TEXT NOT NULL,
        "agentId" TEXT NOT NULL,
        "validatorId" TEXT NOT NULL,
        CONSTRAINT "Task_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "Task_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "Task_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "Validator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE "Action" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        "phaseId" TEXT NOT NULL,
        "targetPhaseId" TEXT NOT NULL,
        "validatorId" TEXT NOT NULL,
        CONSTRAINT "Action_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "Action_targetPhaseId_fkey" FOREIGN KEY ("targetPhaseId") REFERENCES "Phase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT "Action_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES "Validator" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);

    console.log("✓ Schema applied successfully to test database");
  } catch (error) {
    console.error("Error applying schema to test database:", error);
    throw error;
  }
};

/**
 * Verifies that all expected tables exist in the test database
 */
const verifySchema = async (prisma: PrismaClient): Promise<void> => {
  const expectedTables = [
    "User",
    "Post", // Demo tables
    "Project",
    "Plan",
    "Phase",
    "Job",
    "Task",
    "Action",
    "Team",
    "Agent",
    "Role",
    "Validator", // Domain tables
  ];

  try {
    const tables = await prisma.$queryRaw<Array<{ name: string }>>`
      SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != '_prisma_migrations';
    `;

    const tableNames = tables.map((t) => t.name);
    const missingTables = expectedTables.filter(
      (table) => !tableNames.includes(table),
    );

    if (missingTables.length > 0) {
      throw new Error(
        `Missing tables in test database: ${missingTables.join(", ")}`,
      );
    }

    console.log(
      `✓ Test database created with ${tableNames.length} tables: ${tableNames.join(", ")}`,
    );
  } catch (error) {
    console.error("Schema verification failed:", error);
    throw error;
  }
};
