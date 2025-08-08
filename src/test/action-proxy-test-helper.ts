import { PrismaClient } from "db";
import { ActionProxy } from "../main/app/model/ActionProxy.js";
import { createTestPrismaClient } from "./test-db-factory";

/**
 * Create a test instance of ActionProxy with a test database
 * @returns An object containing the test PrismaClient, ActionProxy, and cleanup function
 */
export const createTestActionProxy = async (): Promise<{
  prisma: PrismaClient;
  actionProxy: ActionProxy;
  cleanup: () => Promise<void>;
}> => {
  // Create a test database with full schema
  const { prisma, cleanup: dbCleanup } = await createTestPrismaClient();

  // Create a test instance of ActionProxy that uses our test database
  const actionProxy = new ActionProxy(prisma);

  // Enhanced cleanup function that clears data and cleans up the database
  const cleanup = async (): Promise<void> => {
    try {
      // Delete all data from the tables in reverse order of their dependencies
      await prisma.action.deleteMany({});
      await prisma.task.deleteMany({});
      await prisma.job.deleteMany({});
      await prisma.validator.deleteMany({});
      await prisma.agent.deleteMany({});
      await prisma.team.deleteMany({});
      await prisma.role.deleteMany({});
      await prisma.phase.deleteMany({});
      await prisma.plan.deleteMany({});
      await prisma.project.deleteMany({});
      await prisma.post.deleteMany({});
      await prisma.user.deleteMany({});
    } catch (error) {
      console.error("Error cleaning up test data:", error);
    } finally {
      // Clean up the database file and disconnect
      await dbCleanup();
    }
  };

  return { prisma, actionProxy, cleanup };
};
