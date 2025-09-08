import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { RoleDTO, RoleAPIMethods } from "../../../../domain";
import { RoleProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { flattenResult } from "../../constants/AppConstants";
import { ipcMain } from "electron";

export class RoleAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ RoleAPICommand - Installing Role API Handlers", 3);
    const roleProxy = f.retrieveProxy(RoleProxy.NAME) as RoleProxy;

    // Create a role and return it
    ipcMain.handle(RoleAPIMethods.CREATE_ROLE, async (_, roleDTO: RoleDTO) => {
      f.log(`️👉 Role API method ${RoleAPIMethods.CREATE_ROLE} invoked`, 0);
      const result = await roleProxy.createRole(roleDTO);
      return flattenResult(result);
    });

    // Get a role by id
    ipcMain.handle(RoleAPIMethods.GET_ROLE, async (_, id: string) => {
      f.log(`️👉 Role API method ${RoleAPIMethods.GET_ROLE} invoked`, 0);
      const result = await roleProxy.getRole(id);
      return flattenResult(result);
    });

    // Get all roles
    ipcMain.handle(RoleAPIMethods.GET_ROLES, async () => {
      f.log(`️👉 Role API method ${RoleAPIMethods.GET_ROLES} invoked`, 0);
      const result = await roleProxy.getRoles();
      return flattenResult(result);
    });

    // Update a role
    ipcMain.handle(RoleAPIMethods.UPDATE_ROLE, async (_, roleDTO: RoleDTO) => {
      f.log(`️👉 Role API method ${RoleAPIMethods.UPDATE_ROLE} invoked`, 0);
      const { id, ...updateData } = roleDTO;
      const result = await roleProxy.updateRole(id, updateData);
      return flattenResult(result);
    });

    // Delete a role
    ipcMain.handle(RoleAPIMethods.DELETE_ROLE, async (_, id: string) => {
      f.log(`️👉 Role API method ${RoleAPIMethods.DELETE_ROLE} invoked`, 0);
      const result = await roleProxy.deleteRole(id);
      return flattenResult(result);
    });

    // Signal completion
    this.commandComplete();
  }
}
