# Puzzlemaster Development Guidelines

## Project Overview
Puzzlemaster is an Electron-based MCP (Model Context Protocol) host application that coordinates teams of agents working on long-horizon tasks. The application uses a sophisticated architecture with React frontend, TypeScript throughout, Prisma ORM for data persistence, and PureMVC framework for application state management.

## Build/Configuration Instructions

### Prerequisites
- Node.js (latest stable version recommended)
- npm (comes with Node.js)

### Initial Setup
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Database Setup:**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Initialize database (development)
   npm run create:db

   # For production builds, database is created automatically via:
   npm run create:prod-db
   ```

### Development
```bash
# Start development server with hot reload
npm run dev

# Preview production build
npm start
```

### Building for Production
```bash
# Full build with type checking
npm run build

# Platform-specific builds
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
npm run build:dir    # Directory only (no installer)
```

### Important Configuration Details

#### TypeScript Configuration
The project uses project references with separate configurations:
- `tsconfig.node.json` - Main/preload processes (Node.js environment)
- `tsconfig.web.json` - Renderer process (browser environment)
- Shared domain/types directories are included in both configurations

#### Electron + Vite Configuration
- Uses `electron-vite` for unified build system
- Renderer process has alias: `@renderer` → `src/renderer/src`
- Main and preload processes use `externalizeDepsPlugin` for proper dependency handling

#### Database Configuration
- SQLite database located at `database/puzzlemaster.db`
- Uses Prisma with driver adapters (preview feature)
- Binary targets: `["native", "darwin-arm64"]` for cross-platform compatibility

## Testing Information

### Framework Setup
- **Test Runner:** Vitest with environment-specific routing
- **DOM Testing:** jsdom for renderer components
- **Node Testing:** Native Node.js environment for main/domain logic
- **Mocking:** Built-in Vitest mocking with Electron utilities mocked

### Environment Routing
```javascript
// Automatic environment selection by directory:
["src/renderer/**", "jsdom"]    // UI components
["src/main/**", "node"]         // Main process
["src/domain/**", "node"]       // Domain entities/api
```

### Running Tests
```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run vitest:watch

# Run specific test file
npm test -- src/domain/__tests__/Project.test.ts

# Run tests with coverage
npx vitest run --coverage
```

### Writing Tests
Tests are located in `__tests__` directories alongside source code:
- `src/domain/__tests__/` - Domain model tests
- `src/main/app/model/__tests__/` - Proxy/data layer tests

#### Test Patterns
1. **Basic Test Structure:**
   ```typescript
   import { describe, it, expect, beforeEach } from "vitest";

   describe("ComponentName", () => {
     it("should do something", () => {
       expect(result).toBe(expected);
     });
   });
   ```

2. **Parameterized Tests:**
   ```typescript
   it.each([
     { input: value1, expected: result1 },
     { input: value2, expected: result2 },
   ])("should handle $input", ({ input, expected }) => {
     expect(myFunction(input)).toBe(expected);
   });
   ```

3. **Async Testing:**
   ```typescript
   it("should handle async operations", async () => {
     const result = await asyncFunction();
     expect(result).toBe("expected");
   });
   ```

#### Database Testing
Use the test database factory for isolated tests:
```typescript
import { createTestPrismaClient } from "./helpers/test-db-factory";

// Creates isolated test database instance
const { prisma, cleanup } = await createTestPrismaClient();
```

### Example Test Execution
A simple test demonstrates the setup:
```bash
npm test -- src/domain/__tests__/sample.test.ts
# ✓ Sample Test for Guidelines > should demonstrate basic testing functionality
# ✓ Sample Test for Guidelines > should work with async operations
# ✓ Sample Test for Guidelines > should use parameterized testing where appropriate
```

## Code Style and Quality

### ESLint Configuration
- **Base:** Electron Toolkit + Mantine configurations
- **TypeScript:** Strict rules with explicit return types required
- **React:** Hooks and refresh plugins enabled
- **Unused Variables:** Use `_` prefix to ignore (e.g., `_omittedParam`)
- **Console:** `console.log` allowed (useful for Electron debugging)

### Prettier Configuration
```
{
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'none',
  // Sophisticated import sorting with specific order
}
```

### Import Ordering
Prettier automatically sorts imports in this order:
1. CSS files
2. React/Next.js
3. Built-in modules
4. Third-party modules
5. Mantine components
6. Relative imports
7. CSS imports last

### Code Quality Commands
```bash
# Run all quality checks
npm run lint

# Individual checks
npm run eslint        # TypeScript linting
npm run prettier      # Format checking
npm run stylelint     # CSS linting
npm run typecheck     # Type checking

# Auto-fix formatting
npm run prettier:fix
```

## Architecture-Specific Notes

### PureMVC Framework
- Uses multicore TypeScript implementation
- Async command utilities included
- State machine utilities available
- ESM module resolution handled in Vitest config

### Domain-Driven Design
- Domain models use Result type pattern (neverthrow library)
- Comprehensive validation with `DomainError` for failures
- Separation between domain logic and data persistence

### Electron Process Architecture
- **Main Process:** Application lifecycle, native APIs
- **Preload Scripts:** Secure API bridge
- **Renderer Process:** React UI with Mantine components

### API Layering
To add a new API method that allows the frontend to interact with the database, there are several steps:
1. Add the method to the appropriate proxy class in `src/main/app/model/`, e.g., `ProjectProxy.ts`.
2. Define the API method constant in the entity file in `src/domain/`, e.g., `Project.ts`.
3. Update the appropriate API command in `src/main/app/controller/api`, e.g., `ProjectAPICommand.ts`.
4. Define the API method in the appropriate interface in `src/domain/api`, e.g. `ProjectAPI.ts`
5. Add the client method for invoking the API in the appropriate file in `src/renderer/src/client`, e.g., `project.ts`.
6. Invoke the client method from a React component or hook as needed.

### Known Configuration Notes
- Vitest uses forked pool mode for native module compatibility (Prisma/SQLite)
- PureMVC framework aliasing resolves ESM import issues
- Some Vitest deprecation warnings exist but don't affect functionality:
  - `deps.inline` (use `server.deps.inline`)
  - `environmentMatchGlobs` (use `test.projects`)

### Development Workflow
1. Make changes to source code
2. Run tests: `npm test`
3. Check code quality: `npm run lint`
4. Fix formatting: `npm run prettier:fix`
5. Verify build: `npm run build`
6. NEVER commit or push changes
