# Test Database Factory

This document explains how the test database factory works for the PuzzleMaster project and how to use it for testing.

## Overview

The test database factory (`src/main/app/model/__tests__/helpers/test-db-factory.ts`) provides isolated test databases for each test run. It creates unique SQLite database files with the complete schema from `prisma/schema.prisma`, ensuring that tests run in complete isolation without affecting the production database.

## Key Features

- **True Isolation**: Each test gets its own unique database file
- **Complete Schema**: All tables from `prisma/schema.prisma` are created automatically
- **Automatic Cleanup**: Database files are automatically deleted after tests complete
- **Schema Verification**: Ensures all expected tables are created correctly
- **Fast Setup**: Optimized for quick test execution

## How It Works

### Database Creation Process

1. **Unique Database URL**: Creates a unique SQLite database file using timestamp and UUID
   ```typescript
   const testDbName = `test_${Date.now()}_${randomUUID().replace(/-/g, "")}`;
   const testDbUrl = `file:./${testDbName}.db`;
   ```

2. **Schema Application**: Applies the complete schema from `prisma/schema.prisma` using direct SQL statements that mirror the Prisma schema definition

3. **Schema Verification**: Verifies that all expected tables exist:
   - Demo tables: `User`, `Post`
   - Domain tables: `Project`, `Plan`, `Phase`, `Job`, `Task`, `Action`, `Team`, `Agent`, `Role`, `Validator`

4. **Cleanup Function**: Provides automatic cleanup that:
   - Disconnects from the database
   - Deletes the temporary database file

### Schema Synchronization

The factory creates tables using SQL statements that are directly derived from the `prisma/schema.prisma` file. Each CREATE TABLE statement includes comments referencing the corresponding lines in the schema file, making it easy to maintain synchronization when the schema changes.

## Usage

### Basic Usage

Import and use the `createTestPrismaClient` function:

```typescript
import { createTestPrismaClient } from "./test-db-factory";

// Create test database
const { prisma, cleanup } = await createTestPrismaClient();

// Use prisma in your tests
const user = await prisma.user.create({
  data: { email: "test@example.com", name: "Test User" }
});

// Clean up after tests
await cleanup();
```

### Using Test Helpers

For proxy classes, use the dedicated test helpers:

```typescript
// For ActionProxy tests
import { createTestActionProxy } from "./action-proxy-test-helper";

const { prisma, actionProxy, cleanup } = await createTestActionProxy();
// Use actionProxy and prisma in tests
await cleanup();

// For AgentProxy tests
import { createTestAgentProxy } from "./agent-proxy-test-helper";

const { prisma, agentProxy, cleanup } = await createTestAgentProxy();
// Use agentProxy and prisma in tests
await cleanup();
```

### Test Structure Pattern

Follow this pattern for new proxy tests:

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createTestYourProxy } from "../../../test/your-proxy-test-helper";

describe("YourProxy", () => {
  let testSetup: {
    prisma: PrismaClient;
    yourProxy: YourProxy;
    cleanup: () => Promise<void>;
  };

  beforeEach(async () => {
    testSetup = await createTestYourProxy();
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  // Your tests here
});
```

## Adding New Proxy Tests

To add tests for a new proxy class:

1. **Create a test helper** (e.g., `src/main/app/model/__tests__/helpers/your-proxy-test-helper.ts`):
   ```typescript
   import { PrismaClient } from "db";
   import { YourProxy } from "../main/app/model/YourProxy";
   import { createTestPrismaClient } from "./test-db-factory";

   export const createTestYourProxy = async (): Promise<{
     prisma: PrismaClient;
     yourProxy: YourProxy;
     cleanup: () => Promise<void>;
   }> => {
     const { prisma, cleanup: dbCleanup } = await createTestPrismaClient();
     const yourProxy = new YourProxy(prisma);

     const cleanup = async (): Promise<void> => {
       try {
         // Clear test data in reverse dependency order
         await prisma.yourTable.deleteMany({});
         // Add other table cleanups as needed
       } catch (error) {
         console.error("Error cleaning up test data:", error);
       } finally {
         await dbCleanup();
       }
     };

     return { prisma, yourProxy, cleanup };
   };
   ```

2. **Create the test file** following the pattern shown above

3. **Update the cleanup function** in your test helper to include any new tables your proxy uses

## Benefits

- **Reliability**: Tests produce consistent results every run
- **Speed**: Fast database creation and cleanup
- **Isolation**: No test interference or shared state issues
- **Maintainability**: Schema changes only require updating the factory
- **Debugging**: Each test database can be inspected if needed

## Troubleshooting

### Common Issues

1. **Missing Tables Error**: If you see "Missing tables in test database", check that all required tables are included in the `expectedTables` array in `verifySchema()`

2. **Foreign Key Constraint Errors**: Ensure tables are created in the correct order to respect foreign key dependencies

3. **Cleanup Errors**: Make sure the cleanup function deletes data in reverse dependency order

### Schema Updates

When the `prisma/schema.prisma` file changes:

1. Update the corresponding CREATE TABLE statements in `applySchemaToTestDatabase()`
2. Update the `expectedTables` array in `verifySchema()`
3. Update test helper cleanup functions if new tables are added
4. Run tests to verify everything works correctly

## File Structure

```
src/main/app/model/__tests__/helpers/
├── test-db-factory.ts           # Main factory for creating test databases
├── action-proxy-test-helper.ts  # Helper for ActionProxy tests
├── agent-proxy-test-helper.ts   # Helper for AgentProxy tests
├── ...
└── README.md                    # This documentation
```
