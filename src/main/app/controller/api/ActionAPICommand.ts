import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { ActionDTO, ActionAPIMethods } from "../../../../types/domain";
import { IAppFacade } from "../../AppFacade";
import { ActionProxy } from "../../model";
import { ipcMain } from "electron";

export class ActionAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ ActionAPICommand - Installing Action API Handlers", 2);
    const actionProxy = f.retrieveProxy(ActionProxy.NAME) as ActionProxy;

    // Create an action and return it
    ipcMain.handle(
      ActionAPIMethods.CREATE_ACTION,
      async (_, actionDTO: ActionDTO) => {
        const result = await actionProxy.createAction(actionDTO);
        if (result.isOk()) return { success: true, data: result.value };
        return { success: false, error: result.error.message };
      },
    );

    // Get an action by id
    ipcMain.handle(ActionAPIMethods.GET_ACTION, async (_, id: string) => {
      const result = await actionProxy.getAction(id);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Get all actions
    ipcMain.handle(ActionAPIMethods.GET_ACTIONS, async () => {
      const result = await actionProxy.getActions();
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Get actions by phase id
    ipcMain.handle(
      ActionAPIMethods.GET_ACTIONS_BY_PHASE,
      async (_, phaseId: string) => {
        const result = await actionProxy.getActionsByPhase(phaseId);
        if (result.isOk()) return { success: true, data: result.value };
        return { success: false, error: result.error.message };
      },
    );

    // Update an action
    ipcMain.handle(
      ActionAPIMethods.UPDATE_ACTION,
      async (_, actionDTO: ActionDTO) => {
        const { id, ...updateData } = actionDTO;
        const result = await actionProxy.updateAction(id, updateData);
        if (result.isOk()) return { success: true, data: result.value };
        return { success: false, error: result.error.message };
      },
    );

    // Delete an action
    ipcMain.handle(ActionAPIMethods.DELETE_ACTION, async (_, id: string) => {
      const result = await actionProxy.deleteAction(id);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Signal completion
    this.commandComplete();
  }
}
