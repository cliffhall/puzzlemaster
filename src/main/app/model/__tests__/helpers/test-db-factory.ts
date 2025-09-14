import {
  unlinkSync,
  existsSync,
  readdirSync,
  statSync,
  readFileSync,
} from "fs";
import * as path from "path";
import { randomUUID } from "crypto";
import { PrismaClient } from "db";

/**
 * Creates a test PrismaClient instance with a unique in-memory database
 * and applies the current schema using Prisma's db push
 */
export const createTestPrismaClient = async (): Promise<{
  prisma: PrismaClient;
  cleanup: () => Promise<void>;
}> => {
  // Generate unique test database URL
  const testDbName = `test_${Date.now()}_${randomUUID().replace(/-/g, "")}`;
  const testDbUrl = `file:./${testDbName}.db`;

  // Create PrismaClient with an explicit database URL
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: testDbUrl,
      },
    },
  });

  try {
    // Apply the current schema using direct SQL execution
    console.log(`Creating schema for test database: ${testDbUrl}`);

    await applySchemaToTestDatabase(testDbUrl);

    // Verify the schema was applied correctly
    await verifySchema(prisma);

    const cleanup = async (): Promise<void> => {
      try {
        // Delete all data from the tables in reverse order of their dependencies
        await prisma.action.deleteMany({});
        await prisma.task.deleteMany({});
        await prisma.job.deleteMany({});
        await prisma.validator.deleteMany({});
        await prisma.agent.deleteMany({});
        await prisma.team.deleteMany({});
        await prisma.role.deleteMany({});
        await prisma.phase.deleteMany({});
        await prisma.plan.deleteMany({});
        await prisma.project.deleteMany({});
        await prisma.$disconnect();

        // Clean up temporary database file
        // Database files are created in the prisma directory, not the current directory
        const dbPath = testDbUrl.replace("file:", "");
        const possiblePaths = [
          dbPath, // Try the current directory first
          `prisma/${dbPath}`, // Try prisma directory
          `./prisma/${dbPath.replace("./", "")}`, // Try prisma directory with the cleaned path
        ];

        for (const path of possiblePaths) {
          if (existsSync(path)) {
            unlinkSync(path);
            console.log(`✓ Cleaned up test database: ${path}`);
            break;
          }
        }
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    };

    return { prisma, cleanup };
  } catch (error) {
    // If setup fails, clean up and rethrow
    try {
      await prisma.$disconnect();
      const dbPath = testDbUrl.replace("file:", "");
      const possiblePaths = [
        dbPath, // Try the current directory first
        `prisma/${dbPath}`, // Try prisma directory
        `./prisma/${dbPath.replace("./", "")}`, // Try prisma directory with the cleaned path
      ];

      for (const path of possiblePaths) {
        if (existsSync(path)) {
          unlinkSync(path);
          console.log(`✓ Cleaned up failed test database: ${path}`);
          break;
        }
      }
    } catch (cleanupError) {
      console.error("Error during failed setup cleanup:", cleanupError);
    }

    console.error("Error creating test database:", error);
    throw error;
  }
};

/**
 * Applies the current schema to the test database using direct SQL
 * This approach ensures the test database exactly matches the Prisma schema
 * without relying on Prisma's "db push" command, which doesn't work well with dynamic URLs
 */
const applySchemaToTestDatabase = async (testDbUrl: string): Promise<void> => {
  // Create a temporary PrismaClient for the test database to execute SQL
  const tempPrisma = new PrismaClient({
    datasources: {
      db: {
        url: testDbUrl,
      },
    },
  });

  // Helper: Find all migration directories sorted ascending (14-digit timestamp prefix)
  const findAllMigrations = (): string[] => {
    const migrationsDir = path.resolve("prisma/migrations");

    if (!existsSync(migrationsDir)) {
      throw new Error("Migrations directory not found");
    }

    const migrationDirs = readdirSync(migrationsDir)
      .filter((dir) => {
        const fullPath = path.join(migrationsDir, dir);
        return statSync(fullPath).isDirectory() && /^\d{14}_/.test(dir);
      })
      .sort(); // oldest to newest

    if (migrationDirs.length === 0) {
      throw new Error("No migration directories found");
    }

    return migrationDirs.map((dir) => path.join(migrationsDir, dir));
  };

  // Helper: Parse migration.sql and produce executable statements
  const parseMigrationSql = (migrationDir: string): string[] => {
    const migrationSqlPath = path.join(migrationDir, "migration.sql");
    if (!existsSync(migrationSqlPath)) {
      throw new Error(`migration.sql not found in ${migrationDir}`);
    }

    const sqlContent = readFileSync(migrationSqlPath, "utf8");

    return sqlContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0)
      .map((stmt) =>
        stmt
          .split("\n")
          .map((line) => {
            const commentIndex = line.indexOf("--");
            const newLine =
              commentIndex !== -1 ? line.substring(0, commentIndex) : line;
            return newLine.trim();
          })
          .filter((line) => line.length > 0)
          .join("\n"),
      )
      .filter((stmt) => stmt.trim().length > 0);
  };

  try {
    console.log(
      "Applying schema to test database from migrations (oldest -> newest)...",
    );

    // Find and parse all migrations
    const migrationDirs = findAllMigrations();
    for (const dir of migrationDirs) {
      console.log("Using migration from:", path.basename(dir));
      const sqlStatements = parseMigrationSql(dir);
      console.log(
        `Executing ${sqlStatements.length} SQL statements from migration...`,
      );

      // Execute each SQL statement from the migration
      for (const statement of sqlStatements) {
        if (statement.trim()) {
          await tempPrisma.$executeRawUnsafe(statement);
        }
      }
    }

    console.log("✓ Schema applied successfully to test database");
  } catch (error) {
    console.error("Error applying schema to test database:", error);
    throw error;
  } finally {
    await tempPrisma.$disconnect();
  }
};

/**
 * Verifies that all expected tables exist in the test database
 */
const verifySchema = async (prisma: PrismaClient): Promise<void> => {
  const expectedTables = [
    "Project",
    "Plan",
    "Phase",
    "Job",
    "Task",
    "Action",
    "Team",
    "Agent",
    "Role",
    "Validator",
  ];

  try {
    const tables = await prisma.$queryRaw<Array<{ name: string }>>`
      SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != '_prisma_migrations';
    `;

    const tableNames = tables.map((t) => t.name);
    const missingTables = expectedTables.filter(
      (table) => !tableNames.includes(table),
    );

    if (missingTables.length > 0) {
      throw new Error(
        `Missing tables in test database: ${missingTables.join(", ")}`,
      );
    }

    console.log(
      `✓ Test database created with ${tableNames.length} tables: ${tableNames.join(", ")}`,
    );
  } catch (error) {
    console.error("Schema verification failed:", error);
    throw error;
  }
};
