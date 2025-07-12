import {
  INotification,
  SimpleCommand,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { IAppFacade } from "../../AppFacade";
import { EnvProxy } from "../../model/EnvProxy";
import { DbDemoProxy } from "../../model/DbDemoProxy";

export class PrepareModelCommand extends SimpleCommand {
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
    const envProxy = new EnvProxy();
    f.registerProxy(envProxy);

    const dbDemoProxy = new DbDemoProxy();
    f.registerProxy(dbDemoProxy);
  }
}
