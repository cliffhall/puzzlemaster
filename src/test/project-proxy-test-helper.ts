import { createTestPrismaClient } from "./test-db-factory";
import { ProjectProxy } from "../main/app/model/ProjectProxy";
import { PrismaClient } from "db";

/**
 * Create a test instance of ProjectProxy with a test database
 * @returns An object containing the test PrismaClient, ProjectProxy, and cleanup function
 */
export const createTestProjectProxy = async (): Promise<{
  prisma: PrismaClient;
  projectProxy: ProjectProxy;
  cleanup: () => Promise<void>;
}> => {
  // Create a test database with full schema
  const { prisma, cleanup } = await createTestPrismaClient();

  // Create a test instance of ProjectProxy that uses our test database
  const projectProxy = new ProjectProxy(prisma);

  return { prisma, projectProxy, cleanup };
};
