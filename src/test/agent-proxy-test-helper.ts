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

  // Cleanup function to disconnect from the database
  const cleanup = async (): Promise<void> => {
    await prisma.$disconnect();
  };

  return { prisma, agentProxy, cleanup };
};
