import { createTestPrismaClient } from "./test-db-factory";
import { PlanProxy } from "../../PlanProxy";
import { PrismaClient } from "db";

/**
 * Create a test instance of PlanProxy with a test database
 * @returns An object containing the test PrismaClient, PlanProxy, and cleanup function
 */
export const createTestPlanProxy = async (): Promise<{
  prisma: PrismaClient;
  planProxy: PlanProxy;
  cleanup: () => Promise<void>;
}> => {
  // Create a test database with full schema
  const { prisma, cleanup } = await createTestPrismaClient();

  // Create a test instance of PlanProxy that uses our test database
  const planProxy = new PlanProxy(prisma);

  return { prisma, planProxy, cleanup };
};
