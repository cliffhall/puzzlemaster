import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { PhaseDTO, PhaseAPIMethods } from "../../../../types/domain";
import { PhaseProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { flattenResult } from "../../constants/AppConstants";
import { ipcMain } from "electron";

export class PhaseAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ PhaseAPICommand - Installing Phase API Handlers", 2);
    const phaseProxy = f.retrieveProxy(PhaseProxy.NAME) as PhaseProxy;

    // Create a phase and return it
    ipcMain.handle(
      PhaseAPIMethods.CREATE_PHASE,
      async (_, phaseDTO: PhaseDTO) => {
        const result = await phaseProxy.createPhase(phaseDTO);
        return flattenResult(result);
      },
    );

    // Get a phase by id
    ipcMain.handle(PhaseAPIMethods.GET_PHASE, async (_, id: string) => {
      const result = await phaseProxy.getPhase(id);
      return flattenResult(result);
    });

    // Get all phases
    ipcMain.handle(PhaseAPIMethods.GET_PHASES, async () => {
      const result = await phaseProxy.getPhases();
      return flattenResult(result);
    });

    // Update a phase
    ipcMain.handle(
      PhaseAPIMethods.UPDATE_PHASE,
      async (_, phaseDTO: PhaseDTO) => {
        const { id, ...updateData } = phaseDTO;
        const result = await phaseProxy.updatePhase(id, updateData);
        return flattenResult(result);
      },
    );

    // Delete a phase
    ipcMain.handle(PhaseAPIMethods.DELETE_PHASE, async (_, id: string) => {
      const result = await phaseProxy.deletePhase(id);
      return flattenResult(result);
    });

    // Signal completion
    this.commandComplete();
  }
}
