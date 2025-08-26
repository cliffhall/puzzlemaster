import { createTestPrismaClient } from "./test-db-factory";
import { RoleProxy } from "../../RoleProxy";
import { PrismaClient } from "db";

/**
 * Create a test instance of RoleProxy with a test database
 * @returns An object containing the test PrismaClient, RoleProxy, and cleanup function
 */
export const createTestRoleProxy = async (): Promise<{
  prisma: PrismaClient;
  roleProxy: RoleProxy;
  cleanup: () => Promise<void>;
}> => {
  // Create a test database with full schema
  const { prisma, cleanup } = await createTestPrismaClient();

  // Create a test instance of RoleProxy that uses our test database
  const roleProxy = new RoleProxy(prisma);

  return { prisma, roleProxy, cleanup };
};
