import { ipcRenderer } from "electron";
import { ProjectAPI } from "../../types/api/ProjectAPI";
import { ProjectAPIMethods, ProjectDTO, CreateProjectDTO } from "../../types/domain";

export const project: ProjectAPI = {
  createProject: (projectDTO: CreateProjectDTO) =>
    ipcRenderer.invoke(ProjectAPIMethods.CREATE_PROJECT, projectDTO),
  getProject: (id: string) =>
    ipcRenderer.invoke(ProjectAPIMethods.GET_PROJECT, id),
  getProjects: () => ipcRenderer.invoke(ProjectAPIMethods.GET_PROJECTS),
  updateProject: (projectDTO: ProjectDTO) =>
    ipcRenderer.invoke(ProjectAPIMethods.UPDATE_PROJECT, projectDTO),
  deleteProject: (id: string) =>
    ipcRenderer.invoke(ProjectAPIMethods.DELETE_PROJECT, id),
};
