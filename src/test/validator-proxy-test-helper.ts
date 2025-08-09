import { createTestPrismaClient } from "./test-db-factory";
import { ValidatorProxy } from "../main/app/model/ValidatorProxy";
import { PrismaClient } from "db";

/**
 * Create a test instance of ValidatorProxy with a test database
 * @returns An object containing the test PrismaClient, ValidatorProxy, and cleanup function
 */
export const createTestValidatorProxy = async (): Promise<{
  prisma: PrismaClient;
  validatorProxy: ValidatorProxy;
  cleanup: () => Promise<void>;
}> => {
  // Create a test database with full schema
  const { prisma, cleanup } = await createTestPrismaClient();

  // Create a test instance of ValidatorProxy that uses our test database
  const validatorProxy = new ValidatorProxy(prisma);

  return { prisma, validatorProxy, cleanup };
};
