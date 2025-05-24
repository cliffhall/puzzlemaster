import { INotification, SimpleCommand } from '@puremvc/puremvc-typescript-multicore-framework'
import { IAppFacade } from '../AppFacade'
import { EnvProxy } from '../model/EnvProxy'

export class PrepareModelCommand extends SimpleCommand {
  /**
   * Initialize and register proxies
   * - EnvProxy provides access to the environment
   * - ArgsProxy provides access to the command line arguments
   */
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade
    f.log('⚙️ PrepareModelCommand - Registering Proxies', 2)

    // Create a warning logger instead of a halt function
    const warnLogger = (message: string, indent: number = 2): void => {
      f.log(`⚠️ ${message}`, indent)
    }

    // Proxy to access the environment (with soft validation)
    const envProxy = new EnvProxy(process.cwd(), process.env as ProcessEnv, warnLogger)
    f.registerProxy(envProxy)

    // Log environment validation status
    if (!envProxy.validate()) {
      const missingVars = envProxy.getMissingVars()
      f.log(`⚠️ Missing environment variables: ${missingVars.join(', ')}`, 2)
      f.log('⚠️ Using default values for missing environment variables', 2)
    } else {
      f.log('✅ All required environment variables are present', 2)
    }
  }
}
