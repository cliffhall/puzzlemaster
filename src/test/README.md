# Test Database Setup

This document explains how the test database is set up for the PuzzleMaster project.

## Issues and Solutions

### Issue 1: Missing Tables

The project was experiencing an issue where the `AgentProxy.test.ts` tests were failing with the error:

```
Invalid `prisma.team.create()` invocation:
The table `main.Project` does not exist in the current database.
```

This was happening because the test database was not being properly initialized with the required schema. The original approach was using `npx prisma migrate deploy` to apply migrations to the test database, but this was not working correctly with in-memory SQLite databases.

#### Solution

The solution was to create a more robust test database setup that:

1. Creates a unique SQLite in-memory database for each test run
2. Checks if the required tables already exist
3. If they don't exist, creates them directly using SQL statements
4. Includes proper error handling and cleanup

The implementation can be found in `src/test/test-db-setup.ts`.

### Issue 2: Unique Constraint Violations

After fixing the missing tables issue, we encountered another problem where tests were failing with:

```
Invalid `prisma.role.create()` invocation:
Unique constraint failed on the fields: (`name`)
```

This was happening because:

1. The in-memory database was being shared between test runs due to the `cache=shared` parameter in the database URL
2. The cleanup function was only disconnecting from the database but not clearing the data
3. Multiple tests were creating roles with the same name ("Test Role")

#### Solution

We implemented a three-part solution:

1. Made the database URL truly unique by adding a random string and removing the `cache=shared` parameter:
   ```typescript
   const databaseUrl = `file:./test_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.db?mode=memory`;
   ```

2. Improved the cleanup function to properly delete all data from the tables in reverse order of their dependencies:
   ```typescript
   const cleanup = async (): Promise<void> => {
     try {
       // Delete all data from the tables in reverse order of their dependencies
       await prisma.agent.deleteMany({});
       await prisma.team.deleteMany({});
       await prisma.role.deleteMany({});
       await prisma.phase.deleteMany({});
       await prisma.plan.deleteMany({});
       await prisma.project.deleteMany({});
     } catch (error) {
       console.error("Error cleaning up test database:", error);
     } finally {
       // Always disconnect from the database
       await prisma.$disconnect();
     }
   };
   ```

3. Updated the test to use unique role names for each test run as an additional safeguard:
   ```typescript
   const uniqueRoleName = `Test Role ${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
   await testSetup.prisma.role.create({
     data: {
       id: roleId,
       name: uniqueRoleName,
     },
   });
   ```

These changes ensure that each test gets a truly isolated database environment and that data is properly cleaned up between tests.

## How It Works

1. The `setupTestDatabase` function creates a unique SQLite in-memory database URL
2. It sets the `DATABASE_URL` environment variable to this URL
3. It creates a new PrismaClient instance connected to this database
4. It checks if the Project table already exists in the database
5. If the table doesn't exist, it creates all the necessary tables with their relationships
6. It returns the PrismaClient instance for use in tests

## Benefits

This approach has several benefits:

- It's more reliable than using migrations for test databases
- It creates exactly the tables needed for the tests
- It's fast because it uses in-memory databases
- It doesn't leave any files behind
- It has proper error handling
- It works consistently across different environments

## Usage

To use this setup in your tests, import the `setupTestDatabase` function and use it to create a test database:

```typescript
import { setupTestDatabase } from "./test-db-setup";

// In your test setup
const prisma = await setupTestDatabase();

// Use prisma in your tests

// Clean up after tests
await prisma.$disconnect();
```

## Troubleshooting

If you encounter issues with the test database setup:

1. Check the console output for error messages
2. Ensure that the SQLite in-memory database URL is correctly formatted
3. Verify that the SQL statements match the current schema
4. Make sure that the tables are created in the correct order to respect foreign key constraints
