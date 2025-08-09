import { createTestPrismaClient } from "./test-db-factory";
import { TaskProxy } from "../main/app/model/TaskProxy";
import { PrismaClient } from "db";

/**
 * Create a test instance of TaskProxy with a test database
 * @returns An object containing the test PrismaClient, TaskProxy, and cleanup function
 */
export const createTestTaskProxy = async (): Promise<{
  prisma: PrismaClient;
  taskProxy: TaskProxy;
  cleanup: () => Promise<void>;
}> => {
  // Create a test database with full schema
  const { prisma, cleanup } = await createTestPrismaClient();

  // Create a test instance of TaskProxy that uses our test database
  const taskProxy = new TaskProxy(prisma);

  return { prisma, taskProxy, cleanup };
};
