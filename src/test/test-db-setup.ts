import { PrismaClient } from "db";
import { execSync } from "child_process";

/**
 * Generate a unique database URL for testing
 * @param schema The schema identifier
 * @returns A database URL for testing
 */
export const generateDatabaseURL = (schema: string): string => {
  if (process.env.NODE_ENV === "test") {
    return `file:./test-${schema}.db?mode=memory&cache=shared`;
  }
  return process.env.DATABASE_URL || "file:database/puzzlemaster.db";
};

/**
 * Set up a test database
 * @returns A PrismaClient instance connected to the test database
 */
export const setupTestDatabase = async (): Promise<PrismaClient> => {
  // Generate a unique schema identifier
  const schema = `test_${Date.now()}`;

  // Set the URL for this test run
  process.env.DATABASE_URL = generateDatabaseURL(schema);

  // Run migrations to set up the test database schema
  execSync("npx prisma migrate deploy");

  // Return a new PrismaClient instance
  return new PrismaClient();
};
