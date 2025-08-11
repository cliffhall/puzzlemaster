import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { TeamDTO, TeamAPIMethods } from "../../../../types/domain";
import { TeamProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { ipcMain } from "electron";

export class TeamAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ TeamAPICommand - Installing Team API Handlers", 2);
    const teamProxy = f.retrieveProxy(TeamProxy.NAME) as TeamProxy;

    // Create a team and return it
    ipcMain.handle(TeamAPIMethods.CREATE_TEAM, async (_, teamDTO: TeamDTO) => {
      const result = await teamProxy.createTeam(teamDTO);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Get a team by id
    ipcMain.handle(TeamAPIMethods.GET_TEAM, async (_, id: string) => {
      const result = await teamProxy.getTeam(id);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Get all teams
    ipcMain.handle(TeamAPIMethods.GET_TEAMS, async () => {
      const result = await teamProxy.getTeams();
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Update a team
    ipcMain.handle(TeamAPIMethods.UPDATE_TEAM, async (_, teamDTO: TeamDTO) => {
      const { id, ...updateData } = teamDTO;
      const result = await teamProxy.updateTeam(id, updateData);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Delete a team
    ipcMain.handle(TeamAPIMethods.DELETE_TEAM, async (_, id: string) => {
      const result = await teamProxy.deleteTeam(id);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Signal completion
    this.commandComplete();
  }
}
