import { PrismaClient } from "db";
import { AgentProxy } from "../main/app/model/AgentProxy";
import { createTestPrismaClient } from "./test-db-factory";

/**
 * Create a test instance of AgentProxy with a test database
 * @returns An object containing the test PrismaClient, AgentProxy, and cleanup function
 */
export const createTestAgentProxy = async (): Promise<{
  prisma: PrismaClient;
  agentProxy: AgentProxy;
  cleanup: () => Promise<void>;
}> => {
  // Create a test database with full schema
  const { prisma, cleanup: dbCleanup } = await createTestPrismaClient();

  // Create a test instance of AgentProxy that uses our test database
  const agentProxy = new AgentProxy(prisma);

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

  return { prisma, agentProxy, cleanup };
};
