import { PrismaClient } from "db";
import { ActionProxy } from "../main/app/model/ActionProxy.js";
import { setupTestDatabase } from "./test-db-setup";

/**
 * Create a test instance of ActionProxy with a test database
 * @returns An object containing the test PrismaClient, ActionProxy, and cleanup function
 */
export const createTestActionProxy = async (): Promise<{
  prisma: PrismaClient;
  actionProxy: ActionProxy;
  cleanup: () => Promise<void>;
}> => {
  // Set up a test database
  const prisma = await setupTestDatabase();

  // Create Action table if it doesn't exist
  try {
    // Check if Action table exists
    const tableExists = await prisma.$queryRaw`
      SELECT name FROM sqlite_master WHERE type='table' AND name='Action';
    `;

    // If the table doesn't exist, we need to create it
    if (
      !Array.isArray(tableExists) ||
      (tableExists as unknown[]).length === 0
    ) {
      console.log("Creating Validator and Action tables for test database...");

      // Create Validator table (required for Action)
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Validator" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "template" TEXT NOT NULL,
          "resource" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL
        );
      `);

      // Create Action table - without foreign key constraints for testing
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Action" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL,
          "phaseId" TEXT NOT NULL,
          "targetPhaseId" TEXT NOT NULL,
          "validatorId" TEXT NOT NULL
        );
      `);
    }
  } catch (error) {
    console.error("Error setting up Action table:", error);
    throw error;
  }

  // Create a test instance of ActionProxy that uses our test database
  const actionProxy = new ActionProxy(prisma);

  // Cleanup function to clear data and disconnect from the database
  const cleanup = async (): Promise<void> => {
    try {
      // Delete all data from the tables in reverse order of their dependencies
      await prisma.action.deleteMany({});
      await prisma.validator.deleteMany({});
      await prisma.agent.deleteMany({});
      await prisma.team.deleteMany({});
      await prisma.role.deleteMany({});
      await prisma.phase.deleteMany({});
      await prisma.plan.deleteMany({});
      await prisma.project.deleteMany({});
    } catch (error) {
      console.error("Error cleaning up test database:", error);
    } finally {
      // Always disconnect from the database
      await prisma.$disconnect();
    }
  };

  return { prisma, actionProxy, cleanup };
};
