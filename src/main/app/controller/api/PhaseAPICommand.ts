import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { PhaseDTO, PhaseAPIMethods } from "../../../../domain";
import { PhaseProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { flattenResult } from "../../constants/AppConstants";
import { ipcMain } from "electron";

export class PhaseAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ PhaseAPICommand - Installing Phase API Handlers", 3);
    const phaseProxy = f.retrieveProxy(PhaseProxy.NAME) as PhaseProxy;

    // Create a phase and return it
    ipcMain.handle(
      PhaseAPIMethods.CREATE_PHASE,
      async (_, phaseDTO: PhaseDTO) => {
        f.log(
          `️👉 Phase API method ${PhaseAPIMethods.CREATE_PHASE} invoked`,
          0,
        );
        const result = await phaseProxy.createPhase(phaseDTO);
        return flattenResult(result);
      },
    );

    // Get a phase by id
    ipcMain.handle(PhaseAPIMethods.GET_PHASE, async (_, id: string) => {
      f.log(`️👉 Phase API method ${PhaseAPIMethods.GET_PHASE} invoked`, 0);
      const result = await phaseProxy.getPhase(id);
      return flattenResult(result);
    });

    // Get phases for a plan
    ipcMain.handle(PhaseAPIMethods.GET_PHASES, async (_, _planId: string) => {
      f.log(`️👉 Phase API method ${PhaseAPIMethods.GET_PHASES} invoked`, 0);
      const result = await phaseProxy.getPhases(_planId);
      return flattenResult(result);
    });

    // Update a phase
    ipcMain.handle(
      PhaseAPIMethods.UPDATE_PHASE,
      async (_, phaseDTO: PhaseDTO) => {
        f.log(
          `️👉 Phase API method ${PhaseAPIMethods.UPDATE_PHASE} invoked`,
          0,
        );
        const { id, ...updateData } = phaseDTO;
        const result = await phaseProxy.updatePhase(id, updateData);
        return flattenResult(result);
      },
    );

    // Delete a phase
    ipcMain.handle(PhaseAPIMethods.DELETE_PHASE, async (_, id: string) => {
      f.log(`️👉 Phase API method ${PhaseAPIMethods.DELETE_PHASE} invoked`, 0);
      const result = await phaseProxy.deletePhase(id);
      return flattenResult(result);
    });

    // Signal completion
    this.commandComplete();
  }
}
