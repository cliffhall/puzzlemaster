import { AsyncMacroCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { DbDemoCommand } from "../api/DbDemoCommand";
import { PrefsCommand } from "../api/PrefsCommand";
import { IAppFacade } from "../../AppFacade";

export class PrepareControllerCommand extends AsyncMacroCommand {
  /**
   * Create the Controller command pipeline
   * @override
   */
  public override initializeAsyncMacroCommand(): void {
    this.addSubCommand(() => new PrefsCommand());
    this.addSubCommand(() => new DbDemoCommand());
  }

  /**
   * Execute the Controller pipeline
   * @override
   * @param {object} note the notification that triggered this command
   */
  public override execute(note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ PrepareControllerCommand - Preparing API Handlers", 2);
    super.execute(note);
  }
}
