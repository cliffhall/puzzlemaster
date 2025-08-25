import {
  Project,
  ProjectResult,
  ProjectListResult,
  DeleteResult,
  ProjectDTO,
  CreateProjectDTO,
} from "../../../types/domain";

export async function createProject(
  projectData: CreateProjectDTO,
): Promise<Project | undefined> {
  const result: ProjectResult =
    await window.puzzlemaster.project.createProject(projectData);
  let returnValue: Project | undefined;

  if (result.success) {
    console.log("Created Project:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getProject(id: string): Promise<Project | undefined> {
  const result: ProjectResult =
    await window.puzzlemaster.project.getProject(id);
  let returnValue: Project | undefined;

  if (result.success) {
    console.log("Retrieved Project:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getProjects(): Promise<Project[] | undefined> {
  const result: ProjectListResult =
    await window.puzzlemaster.project.getProjects();
  let returnValue: Project[] | undefined;

  if (result.success) {
    console.log("Retrieved Projects:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function updateProject(
  projectData: ProjectDTO,
): Promise<Project | undefined> {
  const result: ProjectResult =
    await window.puzzlemaster.project.updateProject(projectData);
  let returnValue: Project | undefined;

  if (result.success) {
    console.log("Updated Project:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function deleteProject(id: string): Promise<boolean | undefined> {
  const result: DeleteResult =
    await window.puzzlemaster.project.deleteProject(id);
  let returnValue: boolean | undefined;

  if (result.success) {
    console.log("Deleted Project:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}
