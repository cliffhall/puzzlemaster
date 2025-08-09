import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { PhaseDTO } from "../../../../types/domain";
import { PhaseProxy } from "../../model/PhaseProxy";
import { IAppFacade } from "../../AppFacade";
import { ipcMain } from "electron";

export class PhaseAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ PhaseAPICommand - Installing Phase API Handlers", 2);
    const phaseProxy = f.retrieveProxy(PhaseProxy.NAME) as PhaseProxy;

    // Create a phase and return it
    ipcMain.handle("create-phase", async (_, phaseDTO: PhaseDTO) => {
      return await phaseProxy.createPhase(phaseDTO);
    });

    // Get a phase by id
    ipcMain.handle("get-phase", async (_, id: string) => {
      return await phaseProxy.getPhase(id);
    });

    // Get all phases
    ipcMain.handle("get-phases", async () => {
      return await phaseProxy.getPhases();
    });

    // Update a phase
    ipcMain.handle("update-phase", async (_, phaseDTO: PhaseDTO) => {
      const { id, ...updateData } = phaseDTO;
      return await phaseProxy.updatePhase(id, updateData);
    });

    // Delete a phase
    ipcMain.handle("delete-phase", async (_, id: string) => {
      return await phaseProxy.deletePhase(id);
    });

    // Signal completion
    this.commandComplete();
  }
}
