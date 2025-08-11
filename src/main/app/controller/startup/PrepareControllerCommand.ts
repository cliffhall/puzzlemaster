import { AsyncMacroCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { ActionAPICommand } from "../api/ActionAPICommand.js";
import { ProjectAPICommand } from "../api/ProjectAPICommand";
import { AgentAPICommand } from "../api/AgentAPICommand";
import { RoleAPICommand } from "../api/RoleAPICommand";
import { PhaseAPICommand } from "../api/PhaseAPICommand";
import { PlanAPICommand } from "../api/PlanAPICommand";
import { JobAPICommand } from "../api/JobAPICommand";
import { TaskAPICommand } from "../api/TaskAPICommand";
import { TeamAPICommand } from "../api/TeamAPICommand";
import { ValidatorAPICommand } from "../api/ValidatorAPICommand";
import { IAppFacade } from "../../AppFacade";

export class PrepareControllerCommand extends AsyncMacroCommand {
  /**
   * Create the Controller command pipeline
   * @override
   */
  public override initializeAsyncMacroCommand(): void {
    this.addSubCommand(() => new ActionAPICommand());
    this.addSubCommand(() => new AgentAPICommand());
    this.addSubCommand(() => new JobAPICommand());
    this.addSubCommand(() => new PhaseAPICommand());
    this.addSubCommand(() => new PlanAPICommand());
    this.addSubCommand(() => new ProjectAPICommand());
    this.addSubCommand(() => new RoleAPICommand());
    this.addSubCommand(() => new TaskAPICommand());
    this.addSubCommand(() => new TeamAPICommand());
    this.addSubCommand(() => new ValidatorAPICommand());
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
