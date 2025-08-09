import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { IAppFacade } from "../../AppFacade";
import { EnvProxy } from "../../model/EnvProxy";
import { ActionProxy } from "../../model/ActionProxy";
import { AgentProxy } from "../../model/AgentProxy";
import { RoleProxy } from "../../model/RoleProxy";
import { TaskProxy } from "../../model/TaskProxy";
import { DbDemoProxy } from "../../model/DbDemoProxy";
import { JobProxy } from "../../model/JobProxy";
import { PlanProxy } from "../../model/PlanProxy";
import { ProjectProxy } from "../../model/ProjectProxy";
import { TeamProxy } from "../../model/TeamProxy";
import { ValidatorProxy } from "../../model/ValidatorProxy";

export class PrepareModelCommand extends AsyncCommand {
  /**
   * Initialize and register proxies
   * - EnvProxy provides access to the environment
   * - ArgsProxy provides access to the command line arguments
   */
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ PrepareModelCommand - Registering Proxies", 2);

    // Create a warning logger for proxies
    /*
        const warnLogger = (message: string, indent: number = 2): void => {
          f.log(`⚠️ ${message}`, indent)
        }
    */

    // Proxy to access the environment (with soft validation)
    f.registerProxy(new EnvProxy());
    f.registerProxy(new ActionProxy());
    f.registerProxy(new AgentProxy());
    f.registerProxy(new JobProxy());
    f.registerProxy(new PlanProxy());
    f.registerProxy(new ProjectProxy());
    f.registerProxy(new RoleProxy());
    f.registerProxy(new TaskProxy());
    f.registerProxy(new TeamProxy());
    f.registerProxy(new ValidatorProxy());
    f.registerProxy(new DbDemoProxy());

    // Signal completion
    this.commandComplete();
  }
}
