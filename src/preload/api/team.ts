import { ipcRenderer } from "electron";
import { TeamAPI } from "../../domain/api/TeamAPI";
import { TeamAPIMethods, TeamDTO, CreateTeamDTO } from "../../domain";

export const team: TeamAPI = {
  createTeam: (teamDTO: CreateTeamDTO) =>
    ipcRenderer.invoke(TeamAPIMethods.CREATE_TEAM, teamDTO),
  getTeam: (id: string) => ipcRenderer.invoke(TeamAPIMethods.GET_TEAM, id),
  getTeams: () => ipcRenderer.invoke(TeamAPIMethods.GET_TEAMS),
  updateTeam: (teamDTO: TeamDTO) =>
    ipcRenderer.invoke(TeamAPIMethods.UPDATE_TEAM, teamDTO),
  deleteTeam: (id: string) =>
    ipcRenderer.invoke(TeamAPIMethods.DELETE_TEAM, id),
};
