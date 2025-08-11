import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { TeamDTO, TeamAPIMethods } from "../../../../types/domain";
import { TeamProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { flattenResult } from "../../constants/AppConstants";
import { ipcMain } from "electron";

export class TeamAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ TeamAPICommand - Installing Team API Handlers", 2);
    const teamProxy = f.retrieveProxy(TeamProxy.NAME) as TeamProxy;

    // Create a team and return it
    ipcMain.handle(TeamAPIMethods.CREATE_TEAM, async (_, teamDTO: TeamDTO) => {
      const result = await teamProxy.createTeam(teamDTO);
      return flattenResult(result);
    });

    // Get a team by id
    ipcMain.handle(TeamAPIMethods.GET_TEAM, async (_, id: string) => {
      const result = await teamProxy.getTeam(id);
      return flattenResult(result);
    });

    // Get all teams
    ipcMain.handle(TeamAPIMethods.GET_TEAMS, async () => {
      const result = await teamProxy.getTeams();
      return flattenResult(result);
    });

    // Update a team
    ipcMain.handle(TeamAPIMethods.UPDATE_TEAM, async (_, teamDTO: TeamDTO) => {
      const { id, ...updateData } = teamDTO;
      const result = await teamProxy.updateTeam(id, updateData);
      return flattenResult(result);
    });

    // Delete a team
    ipcMain.handle(TeamAPIMethods.DELETE_TEAM, async (_, id: string) => {
      const result = await teamProxy.deleteTeam(id);
      return flattenResult(result);
    });

    // Signal completion
    this.commandComplete();
  }
}
