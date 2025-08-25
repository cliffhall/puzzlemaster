import {
  ProjectDTO,
  CreateProjectDTO,
  ProjectResult,
  ProjectListResult,
  DeleteResult,
} from "../domain";

export interface ProjectAPI {
  createProject: (projectDTO: CreateProjectDTO) => Promise<ProjectResult>;
  getProject: (id: string) => Promise<ProjectResult>;
  getProjects: () => Promise<ProjectListResult>;
  updateProject: (projectDTO: ProjectDTO) => Promise<ProjectResult>;
  deleteProject: (id: string) => Promise<DeleteResult>;
}
