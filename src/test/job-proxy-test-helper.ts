import { createTestPrismaClient } from "./test-db-factory";
import { JobProxy } from "../main/app/model/JobProxy";
import { PrismaClient } from "db";

/**
 * Create a test instance of JobProxy with a test database
 * @returns An object containing the test PrismaClient, JobProxy, and cleanup function
 */
export const createTestJobProxy = async (): Promise<{
  prisma: PrismaClient;
  jobProxy: JobProxy;
  cleanup: () => Promise<void>;
}> => {
  // Create a test database with full schema
  const { prisma, cleanup } = await createTestPrismaClient();

  // Create a test instance of JobProxy that uses our test database
  const jobProxy = new JobProxy(prisma);

  return { prisma, jobProxy, cleanup };
};
