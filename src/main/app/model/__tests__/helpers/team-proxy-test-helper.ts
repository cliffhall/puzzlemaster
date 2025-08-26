import { createTestPrismaClient } from "./test-db-factory";
import { TeamProxy } from "../../TeamProxy";
import { PrismaClient } from "db";

/**
 * Create a test instance of TeamProxy with a test database
 * @returns An object containing the test PrismaClient, TeamProxy, and cleanup function
 */
export const createTestTeamProxy = async (): Promise<{
  prisma: PrismaClient;
  teamProxy: TeamProxy;
  cleanup: () => Promise<void>;
}> => {
  // Create a test database with full schema
  const { prisma, cleanup } = await createTestPrismaClient();

  // Create a test instance of TeamProxy that uses our test database
  const teamProxy = new TeamProxy(prisma);

  return { prisma, teamProxy, cleanup };
};
