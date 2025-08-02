import { PrismaClient } from "db";

/**
 * Set up a test database
 * @returns A PrismaClient instance connected to the test database
 */
export const setupTestDatabase = async (): Promise<PrismaClient> => {
  try {
    // Create a unique database URL for this test run
    // Using SQLite in-memory database with a unique name to avoid conflicts
    // Adding a random UUID to ensure uniqueness even if tests run in the same millisecond
    process.env.DATABASE_URL = `file:./test_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.db?mode=memory`;

    // Create a new PrismaClient instance
    const prisma = new PrismaClient();

    try {
      // Check if Project table exists
      const tableExists = await prisma.$queryRaw`
        SELECT name FROM sqlite_master WHERE type='table' AND name='Project';
      `;

      // If the table doesn't exist, we need to create all tables
      if (
        !Array.isArray(tableExists) ||
        (tableExists as unknown[]).length === 0
      ) {
        console.log("Creating tables for test database...");

        // Create Project table
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "Project" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "name" TEXT NOT NULL,
            "description" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL
          );
        `);

        // Create Plan table
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "Plan" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "description" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL,
            "projectId" TEXT NOT NULL UNIQUE,
            CONSTRAINT "Plan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
          );
        `);

        // Create Phase table
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "Phase" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "name" TEXT NOT NULL,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL,
            "planId" TEXT NOT NULL,
            CONSTRAINT "Phase_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
          );
        `);

        // Create Team table
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "Team" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "name" TEXT NOT NULL,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL,
            "phaseId" TEXT NOT NULL UNIQUE,
            CONSTRAINT "Team_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
          );
        `);

        // Create Role table
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "Role" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "name" TEXT NOT NULL UNIQUE,
            "description" TEXT,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL
          );
        `);

        // Create Agent table
        await prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS "Agent" (
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
      } else {
        console.log("Tables already exist in test database");
      }

      return prisma;
    } catch (error) {
      console.error("Error setting up test database:", error);

      // Try to clean up by disconnecting
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        console.error(
          "Error disconnecting from test database:",
          disconnectError,
        );
      }

      throw error;
    }
  } catch (error) {
    console.error("Fatal error setting up test database:", error);
    throw error;
  }
};
