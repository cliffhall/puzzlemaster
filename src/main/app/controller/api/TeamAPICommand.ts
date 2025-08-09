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
      return await teamProxy.createTeam(teamDTO);
    });

    // Get a team by id
    ipcMain.handle(TeamAPIMethods.GET_TEAM, async (_, id: string) => {
      return await teamProxy.getTeam(id);
    });

    // Get all teams
    ipcMain.handle(TeamAPIMethods.GET_TEAMS, async () => {
      return await teamProxy.getTeams();
    });

    // Update a team
    ipcMain.handle(TeamAPIMethods.UPDATE_TEAM, async (_, teamDTO: TeamDTO) => {
      const { id, ...updateData } = teamDTO;
      return await teamProxy.updateTeam(id, updateData);
    });

    // Delete a team
    ipcMain.handle(TeamAPIMethods.DELETE_TEAM, async (_, id: string) => {
      return await teamProxy.deleteTeam(id);
    });

    // Signal completion
    this.commandComplete();
  }
}
