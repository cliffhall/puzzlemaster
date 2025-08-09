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
  const { prisma, cleanup } = await createTestPrismaClient();

  // Create a test instance of ActionProxy that uses our test database
  const actionProxy = new ActionProxy(prisma);

  return { prisma, actionProxy, cleanup };
};
