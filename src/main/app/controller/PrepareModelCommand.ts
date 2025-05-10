import {
  INotification,
  SimpleCommand
} from '@puremvc/puremvc-typescript-multicore-framework'
import { IAppFacade } from '../AppFacade'
import { EnvProxy } from '../model/EnvProxy'

export class PrepareModelCommand extends SimpleCommand {
  /**
   * Initialize and register proxies
   * - EnvProxy provides access to the environment
   * - ArgsProxy provides access to the command line arguments
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade
    f.log('⚙️ PrepareModelCommand - Registering Proxies', 2)
    const halt = (message: string, indent: number = 2): void => f.halt(message, indent)

    // Proxy to access the environment
    const envProxy = new EnvProxy(process.cwd(), process.env as ProcessEnv, halt)
    f.registerProxy(envProxy)
  }
}
