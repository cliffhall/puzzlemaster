import {
  ProjectDTO,
  ProjectResult,
  ProjectListResult,
  DeleteResult,
} from "../domain";

export interface ProjectAPI {
  createProject: (projectDTO: ProjectDTO) => Promise<ProjectResult>;
  getProject: (id: string) => Promise<ProjectResult>;
  getProjects: () => Promise<ProjectListResult>;
  updateProject: (projectDTO: ProjectDTO) => Promise<ProjectResult>;
  deleteProject: (id: string) => Promise<DeleteResult>;
}
