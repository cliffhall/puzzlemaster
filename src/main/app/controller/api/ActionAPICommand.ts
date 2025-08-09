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
        return actionProxy.createAction(actionDTO);
      },
    );

    // Get an action by id
    ipcMain.handle(ActionAPIMethods.GET_ACTION, async (_, id: string) => {
      return actionProxy.getAction(id);
    });

    // Get all actions
    ipcMain.handle(ActionAPIMethods.GET_ACTIONS, async () => {
      return actionProxy.getActions();
    });

    // Get actions by phase id
    ipcMain.handle(
      ActionAPIMethods.GET_ACTIONS_BY_PHASE,
      async (_, phaseId: string) => {
        return actionProxy.getActionsByPhase(phaseId);
      },
    );

    // Update an action
    ipcMain.handle(
      ActionAPIMethods.UPDATE_ACTION,
      async (_, actionDTO: ActionDTO) => {
        const { id, ...updateData } = actionDTO;
        return actionProxy.updateAction(id, updateData);
      },
    );

    // Delete an action
    ipcMain.handle(ActionAPIMethods.DELETE_ACTION, async (_, id: string) => {
      return actionProxy.deleteAction(id);
    });

    // Signal completion
    this.commandComplete();
  }
}
