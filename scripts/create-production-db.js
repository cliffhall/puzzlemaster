const { PrismaClient } = require('db');
const fs = require('fs');
const path = require('path');

/**
 * Find the latest migration directory based on timestamp naming convention
 * @returns {string} Path to the latest migration directory
 */
function findLatestMigration() {
  const migrationsDir = path.resolve('prisma/migrations');

  if (!fs.existsSync(migrationsDir)) {
    throw new Error('Migrations directory not found');
  }

  const migrationDirs = fs.readdirSync(migrationsDir)
    .filter(dir => {
      const fullPath = path.join(migrationsDir, dir);
      return fs.statSync(fullPath).isDirectory() && dir.match(/^\d{14}_/);
    })
    .sort()
    .reverse(); // Latest first

  if (migrationDirs.length === 0) {
    throw new Error('No migration directories found');
  }

  return path.join(migrationsDir, migrationDirs[0]);
}

/**
 * Parse migration.sql file and extract executable SQL statements
 * @param {string} migrationDir Path to the migration directory
 * @returns {string[]} Array of SQL statements
 */
function parseMigrationSql(migrationDir) {
  const migrationSqlPath = path.join(migrationDir, 'migration.sql');

  if (!fs.existsSync(migrationSqlPath)) {
    throw new Error(`migration.sql not found in ${migrationDir}`);
  }

  const sqlContent = fs.readFileSync(migrationSqlPath, 'utf8');

  // Split by semicolons and clean up each statement
  const statements = sqlContent
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => {
      // Remove completely empty statements
      return stmt.length > 0;
    })
    .map(stmt => {
      // Remove comments and extra whitespace, but keep the SQL structure
      const cleaned = stmt
        .split('\n')
        .map(line => {
          // Remove comments that start with -- but keep the rest of the line
          const commentIndex = line.indexOf('--');
          if (commentIndex !== -1) {
            line = line.substring(0, commentIndex);
          }
          return line.trim();
        })
        .filter(line => line.length > 0)
        .join('\n');
      return cleaned;
    })
    .filter(stmt => {
      // Only keep statements that have actual SQL content after cleaning
      return stmt.trim().length > 0;
    });

  return statements;
}

async function createProductionDatabase() {
  const productionDbPath = path.resolve('resources/database/puzzlemaster-prod.db');

  // Ensure the resources/database directory exists
  const dir = path.dirname(productionDbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Remove existing production database if it exists
  if (fs.existsSync(productionDbPath)) {
    fs.unlinkSync(productionDbPath);
  }

  // Create PrismaClient with production database URL
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `file:${productionDbPath}`,
      },
    },
  });

  try {
    console.log('Creating production database with schema...');

    // Find the latest migration and parse its SQL statements
    const latestMigrationDir = findLatestMigration();
    console.log('Using migration from:', path.basename(latestMigrationDir));

    const sqlStatements = parseMigrationSql(latestMigrationDir);
    console.log(`Executing ${sqlStatements.length} SQL statements from migration...`);

    // Execute each SQL statement from the migration
    for (const statement of sqlStatements) {
      if (statement.trim()) {
        await prisma.$executeRawUnsafe(statement);
      }
    }

    console.log('✓ Production database created successfully:', productionDbPath);
  } catch (error) {
    console.error('Error creating production database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createProductionDatabase();
