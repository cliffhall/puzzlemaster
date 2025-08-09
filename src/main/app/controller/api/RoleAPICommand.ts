import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { RoleDTO, RoleAPIMethods } from "../../../../types/domain";
import { RoleProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { ipcMain } from "electron";

export class RoleAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ RoleAPICommand - Installing Role API Handlers", 2);
    const roleProxy = f.retrieveProxy(RoleProxy.NAME) as RoleProxy;

    // Create a role and return it
    ipcMain.handle(RoleAPIMethods.CREATE_ROLE, async (_, roleDTO: RoleDTO) => {
      return await roleProxy.createRole(roleDTO);
    });

    // Get a role by id
    ipcMain.handle(RoleAPIMethods.GET_ROLE, async (_, id: string) => {
      return await roleProxy.getRole(id);
    });

    // Get all roles
    ipcMain.handle(RoleAPIMethods.GET_ROLES, async () => {
      return await roleProxy.getRoles();
    });

    // Update a role
    ipcMain.handle(RoleAPIMethods.UPDATE_ROLE, async (_, roleDTO: RoleDTO) => {
      const { id, ...updateData } = roleDTO;
      return await roleProxy.updateRole(id, updateData);
    });

    // Delete a role
    ipcMain.handle(RoleAPIMethods.DELETE_ROLE, async (_, id: string) => {
      return await roleProxy.deleteRole(id);
    });

    // Signal completion
    this.commandComplete();
  }
}
