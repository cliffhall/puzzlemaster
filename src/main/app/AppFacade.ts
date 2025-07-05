import { IFacade, Facade } from '@puremvc/puremvc-typescript-multicore-framework'
import { ConsoleMediator } from './view/ConsoleMediator'
import { StartupCommand } from './controller/startup/StartupCommand'
import { STARTUP } from './constants/AppConstants'

export interface IAppFacade extends IFacade {
  startup(): void
  log(message: string, indent?: number): void
  halt(message: string, indent?: number): void
}

export class AppFacade extends Facade {
  /**
   * Constructor
   * @override
   * @param multitonKey
   */
  constructor(multitonKey: string) {
    super(multitonKey)
  }

  /**
   * Initialize the `View`
   * @override
   */
  protected override initializeView(): void {
    super.initializeView()
    this.registerMediator(new ConsoleMediator(console))
  }

  /**
   * Initialize the `Controller`
   * @override
   */
  public override initializeController(): void {
    super.initializeController()
    this.registerCommand(STARTUP, () => new StartupCommand())
  }

  /**
   * Get the `Facade` instance for the given `multitonKey`
   * @param multitonKey
   * @returns {Facade}
   */
  public static getInstance(multitonKey: string): IAppFacade {
    return Facade.getInstance(multitonKey, (k) => new AppFacade(k)) as IAppFacade
  }

  /**
   * Start the business
   */
  public startup(): void {
    this.log(`▶️ ${this.multitonKey}`)
    this.log('🔱 AppFacade - Preparing Primary MVC Core')
    this.sendNotification(STARTUP)
  }

  /**
   * Hierarchical logging method for all PureMVC actors
   * @param message
   * @param indent
   */
  public log(message: string, indent?: number): void {
    this.sendNotification(ConsoleMediator.CONSOLE_MESSAGE, message, indent?.toString())
  }

  /**
   * Halt the process, logging the given `message`
   * @param message
   * @param indent
   */
  public halt(message: string, indent?: number): void {
    this.log(`🛑 ${message}`, indent)
    process.exit(1)
  }
}
