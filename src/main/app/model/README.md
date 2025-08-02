# Database Proxy Pattern

This document explains how database proxies are implemented in the Puzzlemaster application and provides guidelines for creating new proxies.

## Overview

The Puzzlemaster application uses the PureMVC framework's Proxy pattern to interact with the database. Each domain entity has its own proxy class that handles CRUD (Create, Read, Update, Delete) operations for that entity.

Database proxies:
- Encapsulate database access logic
- Handle error cases gracefully using the `neverthrow` library
- Convert between database models and domain entities
- Provide a consistent API for the application

## Creating a New Database Proxy

Follow these steps to create a new database proxy for a domain entity:

1. **Create a new file** in the `src/main/app/model` directory named after your entity (e.g., `TeamProxy.ts`)
2. **Extend the PureMVC Proxy class**
3. **Implement CRUD operations** for your entity
4. **Use the Result type** from neverthrow for error handling

### Template

```typescript
import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { PrismaClient } from "db";
import { Result, ok, err } from "neverthrow";
import { DomainError } from "../../../types/domain/DomainError";
import { YourEntity, YourEntityDTO } from "../../../types/domain/YourEntity";

// For production code, use a singleton instance
const prisma = new PrismaClient();

export class YourEntityProxy extends Proxy {
  static NAME: string = "YourEntityProxy";

  // For testability, allow injection of a PrismaClient instance
  private prismaClient: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    super(YourEntityProxy.NAME, process);
    this.prismaClient = prismaClient || prisma;
  }

  /**
   * Create a new entity in the database
   * @param dto The entity data transfer object
   * @returns A Result containing the created entity or a DomainError
   */
  public async createEntity(
    dto: YourEntityDTO
  ): Promise<Result<YourEntity, DomainError>> {
    try {
      const entity = await this.prismaClient.yourEntity.create({
        data: {
          // Map DTO fields to database fields
        }
      });

      // Convert database entity to domain entity
      return YourEntity.create({
        // Map database fields to DTO fields
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to create entity", error));
    }
  }

  /**
   * Get an entity by ID
   * @param id The entity ID
   * @returns A Result containing the entity or a DomainError
   */
  public async getEntity(id: string): Promise<Result<YourEntity, DomainError>> {
    try {
      const entity = await this.prismaClient.yourEntity.findUnique({
        where: { id }
      });

      if (!entity) {
        return err(new DomainError(`Entity with ID ${id} not found`));
      }

      // Convert database entity to domain entity
      return YourEntity.create({
        // Map database fields to DTO fields
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to get entity", error));
    }
  }

  /**
   * Get all entities
   * @returns A Result containing an array of entities or a DomainError
   */
  public async getEntities(): Promise<Result<YourEntity[], DomainError>> {
    try {
      const entities = await this.prismaClient.yourEntity.findMany();

      const entityResults = entities.map(entity =>
        YourEntity.create({
          // Map database fields to DTO fields
        })
      );

      // Process the results using neverthrow's combinatorial functions
      return Result.combine(entityResults);
    } catch (error) {
      return err(DomainError.fromError("Failed to get entities", error));
    }
  }

  /**
   * Update an entity
   * @param id The entity ID
   * @param dto The entity data transfer object
   * @returns A Result containing the updated entity or a DomainError
   */
  public async updateEntity(
    id: string,
    dto: Partial<YourEntityDTO>
  ): Promise<Result<YourEntity, DomainError>> {
    try {
      // First check if the entity exists
      const existingEntity = await this.prismaClient.yourEntity.findUnique({
        where: { id }
      });

      if (!existingEntity) {
        return err(new DomainError(`Entity with ID ${id} not found`));
      }

      // Prepare update data
      const updateData = {};
      // Map DTO fields to database fields

      // Update the entity
      const entity = await this.prismaClient.yourEntity.update({
        where: { id },
        data: updateData
      });

      // Convert database entity to domain entity
      return YourEntity.create({
        // Map database fields to DTO fields
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to update entity", error));
    }
  }

  /**
   * Delete an entity
   * @param id The entity ID
   * @returns A Result containing a success boolean or a DomainError
   */
  public async deleteEntity(id: string): Promise<Result<boolean, DomainError>> {
    try {
      // First check if the entity exists
      const existingEntity = await this.prismaClient.yourEntity.findUnique({
        where: { id }
      });

      if (!existingEntity) {
        return err(new DomainError(`Entity with ID ${id} not found`));
      }

      // Delete the entity
      await this.prismaClient.yourEntity.delete({
        where: { id }
      });

      return ok(true);
    } catch (error) {
      return err(DomainError.fromError("Failed to delete entity", error));
    }
  }
}
```

## Error Handling with neverthrow

All database operations should return a `Result` type from the neverthrow library. This allows for consistent error handling throughout the application.

- Use `ok(value)` to return a successful result
- Use `err(error)` to return an error result
- Use `DomainError.fromError()` to create a DomainError from an unknown error

Example:

```typescript
try {
  // Database operation
  return ok(result);
} catch (error) {
  return err(DomainError.fromError("Context message", error));
}
```

## Testing Database Proxies

For testing database proxies, we use an in-memory SQLite database. This allows for fast, isolated tests without mocking.

### Test Setup

1. Create a test database configuration:

```typescript
// test-db-setup.ts
import { PrismaClient } from 'db';
import { execSync } from 'child_process';

// Create a unique URL for each test run
const generateDatabaseURL = (schema: string) => {
  if (process.env.NODE_ENV === 'test') {
    return `file:./test-${schema}.db?mode=memory&cache=shared`;
  }
  return process.env.DATABASE_URL;
};

// Setup function to be called before tests
export const setupTestDatabase = async () => {
  // Generate a unique schema identifier
  const schema = `test_${Date.now()}`;

  // Set the URL for this test run
  process.env.DATABASE_URL = generateDatabaseURL(schema);

  // Run migrations to set up the test database schema
  execSync('npx prisma migrate deploy');

  // Return a new PrismaClient instance
  return new PrismaClient();
};
```

2. Create a test helper for your proxy:

```typescript
// entity-proxy-test-helper.ts
import { PrismaClient } from 'db';
import { YourEntityProxy } from '../src/main/app/model/YourEntityProxy';
import { setupTestDatabase } from './test-db-setup';

export const createTestEntityProxy = async () => {
  const prisma = await setupTestDatabase();

  // Create a test instance of YourEntityProxy that uses our test database
  const entityProxy = new YourEntityProxy(prisma);

  const cleanup = async () => {
    await prisma.$disconnect();
  };

  return { prisma, entityProxy, cleanup };
};
```

3. Write tests for your proxy:

```typescript
// YourEntityProxy.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTestEntityProxy } from './entity-proxy-test-helper';

describe('YourEntityProxy', () => {
  let testSetup;

  beforeEach(async () => {
    testSetup = await createTestEntityProxy();
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  describe('createEntity', () => {
    it('should create an entity in the database', async () => {
      // Test implementation
    });
  });

  // More tests...
});
```

## Example: AgentProxy

The `AgentProxy` class is a good example of a database proxy implementation. It provides CRUD operations for the `Agent` entity and handles errors using the neverthrow library.

Key features:
- Creates, reads, updates, and deletes agents in the database
- Converts between database models and domain entities
- Handles errors gracefully using the Result type
- Checks for entity existence before updates and deletes
- Includes related entities when needed

See the `AgentProxy.ts` file for the full implementation.
