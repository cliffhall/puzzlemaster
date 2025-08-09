import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { ActionDTO } from "../../../../types/domain";
import { ActionProxy } from "../../model/ActionProxy";
import { IAppFacade } from "../../AppFacade";
import { ipcMain } from "electron";

export class ActionAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ ActionAPICommand - Installing Action API Handlers", 2);
    const actionProxy = f.retrieveProxy(ActionProxy.NAME) as ActionProxy;

    // Create an action and return it
    ipcMain.handle("create-action", async (_, actionDTO: ActionDTO) => {
      return await actionProxy.createAction(actionDTO);
    });

    // Get an action by id
    ipcMain.handle("get-action", async (_, id: string) => {
      return await actionProxy.getAction(id);
    });

    // Get all actions
    ipcMain.handle("get-actions", async () => {
      return await actionProxy.getActions();
    });

    // Get actions by phase id
    ipcMain.handle("get-actions-by-phase", async (_, phaseId: string) => {
      return await actionProxy.getActionsByPhase(phaseId);
    });

    // Update an action
    ipcMain.handle("update-action", async (_, actionDTO: ActionDTO) => {
      const { id, ...updateData } = actionDTO;
      return await actionProxy.updateAction(id, updateData);
    });

    // Delete an action
    ipcMain.handle("delete-action", async (_, id: string) => {
      return await actionProxy.deleteAction(id);
    });

    // Signal completion
    this.commandComplete();
  }
}
