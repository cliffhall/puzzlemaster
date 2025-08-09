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
  const { prisma, cleanup } = await createTestPrismaClient();

  // Create a test instance of AgentProxy that uses our test database
  const agentProxy = new AgentProxy(prisma);

  return { prisma, agentProxy, cleanup };
};
