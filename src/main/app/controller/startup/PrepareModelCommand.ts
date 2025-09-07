import { app } from "electron";
import path from "path";
import fs from "fs";
import { PrismaClient } from "db";

import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { IAppFacade } from "../../AppFacade";
import {
  EnvProxy,
  ActionProxy,
  AgentProxy,
  JobProxy,
  PlanProxy,
  ProjectProxy,
  RoleProxy,
  TaskProxy,
  TeamProxy,
  ValidatorProxy,
  PhaseProxy,
} from "../../model";

export class PrepareModelCommand extends AsyncCommand {
  /**
   * Initialize and register proxies
   * - EnvProxy provides access to the environment
   * - ArgsProxy provides access to the command line arguments
   */
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ PrepareModelCommand - Registering Proxies", 2);

    const prisma: PrismaClient = this.createPrismaClient();

    // Create a warning logger for proxies
    /*
        const warnLogger = (message: string, indent: number = 2): void => {
          f.log(`⚠️ ${message}`, indent)
        }
    */

    // Proxy to access the environment (with soft validation)
    f.registerProxy(new EnvProxy());
    f.registerProxy(new ActionProxy(prisma));
    f.registerProxy(new AgentProxy(prisma));
    f.registerProxy(new JobProxy(prisma));
    f.registerProxy(new PhaseProxy(prisma));
    f.registerProxy(new PlanProxy(prisma));
    f.registerProxy(new ProjectProxy(prisma));
    f.registerProxy(new RoleProxy(prisma));
    f.registerProxy(new TaskProxy(prisma));
    f.registerProxy(new TeamProxy(prisma));
    f.registerProxy(new ValidatorProxy(prisma));

    // Signal completion
    this.commandComplete();
  }

  /**
   * Get the database path
   */
  getDatabasePath(): string | undefined {
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
      // Use the development database
      return;
    }

    // Use user data directory for a production database
    const userDataPath = app.getPath("userData");
    const userDbPath = path.join(userDataPath, "puzzlemaster.db");

    // If a user database doesn't exist, copy from the bundled template
    if (!fs.existsSync(userDbPath)) {
      const bundledDbPath = path.join(
        process.resourcesPath,
        "database",
        "puzzlemaster-prod.db",
      );

      if (fs.existsSync(bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, userDbPath);
        console.log("Created user database from template");
      } else {
        throw new Error("Bundled database template not found");
      }
    }

    return `file:${userDbPath}`;
  }

  /**
   * Create PrismaClient with the correct database path
   */
  createPrismaClient = (): PrismaClient => {
    const databaseUrl = this.getDatabasePath();
    return databaseUrl
      ? new PrismaClient({
          datasources: {
            db: {
              url: databaseUrl,
            },
          },
        })
      : new PrismaClient();
  };
}
