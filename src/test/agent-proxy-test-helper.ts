import { PrismaClient } from "db";
import { AgentProxy } from "../main/app/model/AgentProxy";
import { setupTestDatabase } from "./test-db-setup";

/**
 * Create a test instance of AgentProxy with a test database
 * @returns An object containing the test PrismaClient, AgentProxy, and cleanup function
 */
export const createTestAgentProxy = async (): Promise<{
  prisma: PrismaClient;
  agentProxy: AgentProxy;
  cleanup: () => Promise<void>;
}> => {
  // Set up a test database
  const prisma = await setupTestDatabase();

  // Create a test instance of AgentProxy that uses our test database
  const agentProxy = new AgentProxy(prisma);

  // Cleanup function to clear data and disconnect from the database
  const cleanup = async (): Promise<void> => {
    try {
      // Delete all data from the tables in reverse order of their dependencies
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

  return { prisma, agentProxy, cleanup };
};
