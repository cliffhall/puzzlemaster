import { AsyncMacroCommand } from '@puremvc/puremvc-typescript-util-async-command'
import { INotification } from '@puremvc/puremvc-typescript-multicore-framework'
import { PrepareModelCommand } from './PrepareModelCommand'
import { PrepareViewCommand } from './PrepareViewCommand'
import { IAppFacade } from '../AppFacade'

export class StartupCommand extends AsyncMacroCommand {
  /**
   * Create the primary command pipeline for the App
   * @override
   */
  public override initializeAsyncMacroCommand(): void {
    this.addSubCommand(() => new PrepareModelCommand())
    this.addSubCommand(() => new PrepareViewCommand())

  }

  /**
   * Execute the primary command pipeline
   * @override
   * @param {object} note the notification that triggered this command
   */
  public override execute(note: INotification): void {
    ;(this.facade as IAppFacade).log('⚙️ StartupCommand - Running Subcommands', 1)
    super.execute(note)
  }
}
