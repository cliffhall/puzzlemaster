import {
  Team,
  TeamResult,
  TeamListResult,
  DeleteResult,
  TeamDTO,
  CreateTeamDTO,
} from "../../../domain";

export async function createTeam(
  teamData: CreateTeamDTO,
): Promise<Team | undefined> {
  const result: TeamResult =
    await window.puzzlemaster.team.createTeam(teamData);
  let returnValue: Team | undefined;

  if (result.success) {
    console.log("Created Team:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getTeam(id: string): Promise<Team | undefined> {
  const result: TeamResult = await window.puzzlemaster.team.getTeam(id);
  let returnValue: Team | undefined;

  if (result.success) {
    console.log("Retrieved Team:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getTeams(): Promise<Team[] | undefined> {
  const result: TeamListResult = await window.puzzlemaster.team.getTeams();
  let returnValue: Team[] | undefined;

  if (result.success) {
    console.log("Retrieved Teams:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function updateTeam(teamData: TeamDTO): Promise<Team | undefined> {
  const result: TeamResult =
    await window.puzzlemaster.team.updateTeam(teamData);
  let returnValue: Team | undefined;

  if (result.success) {
    console.log("Updated Team:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function deleteTeam(id: string): Promise<boolean | undefined> {
  const result: DeleteResult = await window.puzzlemaster.team.deleteTeam(id);
  let returnValue: boolean | undefined;

  if (result.success) {
    console.log("Deleted Team:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}
