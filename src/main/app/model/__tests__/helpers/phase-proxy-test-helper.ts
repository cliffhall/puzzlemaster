import { createTestPrismaClient } from "./test-db-factory";
import { PhaseProxy } from "../../PhaseProxy";
import { PrismaClient } from "db";

/**
 * Create a test instance of PhaseProxy with a test database
 * @returns An object containing the test PrismaClient, PhaseProxy, and cleanup function
 */
export const createTestPhaseProxy = async (): Promise<{
  prisma: PrismaClient;
  phaseProxy: PhaseProxy;
  cleanup: () => Promise<void>;
}> => {
  // Create a test database with full schema
  const { prisma, cleanup } = await createTestPrismaClient();

  // Create a test instance of PhaseProxy that uses our test database
  const phaseProxy = new PhaseProxy(prisma);

  return { prisma, phaseProxy, cleanup };
};
