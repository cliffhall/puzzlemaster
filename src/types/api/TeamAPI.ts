import {
  TeamDTO,
  CreateTeamDTO,
  TeamResult,
  TeamListResult,
  DeleteResult,
} from "../domain";

export interface TeamAPI {
  createTeam: (teamDTO: CreateTeamDTO) => Promise<TeamResult>;
  getTeam: (id: string) => Promise<TeamResult>;
  getTeams: () => Promise<TeamListResult>;
  updateTeam: (teamDTO: TeamDTO) => Promise<TeamResult>;
  deleteTeam: (id: string) => Promise<DeleteResult>;
}
