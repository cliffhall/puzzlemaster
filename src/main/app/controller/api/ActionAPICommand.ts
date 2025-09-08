import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { ActionDTO, ActionAPIMethods } from "../../../../domain";
import { IAppFacade } from "../../AppFacade";
import { ActionProxy } from "../../model";
import { flattenResult } from "../../constants/AppConstants";
import { ipcMain } from "electron";

export class ActionAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ ActionAPICommand - Installing Action API Handlers", 3);
    const actionProxy = f.retrieveProxy(ActionProxy.NAME) as ActionProxy;

    // Create an action and return it
    ipcMain.handle(
      ActionAPIMethods.CREATE_ACTION,
      async (_, actionDTO: ActionDTO) => {
        f.log(
          `️👉 Action API method ${ActionAPIMethods.CREATE_ACTION} invoked`,
          0,
        );
        const result = await actionProxy.createAction(actionDTO);
        return flattenResult(result);
      },
    );

    // Get an action by id
    ipcMain.handle(ActionAPIMethods.GET_ACTION, async (_, id: string) => {
      f.log(`️👉 Action API method ${ActionAPIMethods.GET_ACTION} invoked`, 0);
      const result = await actionProxy.getAction(id);
      return flattenResult(result);
    });

    // Get all actions
    ipcMain.handle(ActionAPIMethods.GET_ACTIONS, async () => {
      f.log(`️👉 Action API method ${ActionAPIMethods.GET_ACTIONS} invoked`, 0);
      const result = await actionProxy.getActions();
      return flattenResult(result);
    });

    // Get actions by phase id
    ipcMain.handle(
      ActionAPIMethods.GET_ACTIONS_BY_PHASE,
      async (_, phaseId: string) => {
        f.log(
          `️👉 Action API method ${ActionAPIMethods.GET_ACTIONS_BY_PHASE} invoked`,
          0,
        );
        const result = await actionProxy.getActionsByPhase(phaseId);
        return flattenResult(result);
      },
    );

    // Update an action
    ipcMain.handle(
      ActionAPIMethods.UPDATE_ACTION,
      async (_, actionDTO: ActionDTO) => {
        f.log(
          `️👉 Action API method ${ActionAPIMethods.UPDATE_ACTION} invoked`,
          0,
        );
        const { id, ...updateData } = actionDTO;
        const result = await actionProxy.updateAction(id, updateData);
        return flattenResult(result);
      },
    );

    // Delete an action
    ipcMain.handle(ActionAPIMethods.DELETE_ACTION, async (_, id: string) => {
      f.log(
        `️👉 Action API method ${ActionAPIMethods.DELETE_ACTION} invoked`,
        0,
      );
      const result = await actionProxy.deleteAction(id);
      return flattenResult(result);
    });

    // Signal completion
    this.commandComplete();
  }
}
