import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { Project, ProjectDTO, DomainError } from "../../../domain";
import { Result, ok, err } from "neverthrow";
import { PrismaClient } from "db";

export class ProjectProxy extends Proxy {
  static NAME: string = "ProjectProxy";
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    super(ProjectProxy.NAME, process);
    this.prismaClient = prismaClient;
  }

  /**
   * Create a new project in the database
   * @param projectDTO The project data transfer object
   * @returns A Result containing the created project or a DomainError
   */
  public async createProject(
    projectDTO: ProjectDTO,
  ): Promise<Result<Project, DomainError>> {
    try {
      const project = await this.prismaClient.project.create({
        data: {
          id: projectDTO.id,
          name: projectDTO.name,
          description: projectDTO.description,
        },
      });

      return Project.create({
        id: project.id,
        name: project.name,
        description: project.description || undefined,
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to create project", error));
    }
  }

  /**
   * Get a project by ID
   * @param id The project ID
   * @returns A Result containing the project or a DomainError
   */
  public async getProject(id: string): Promise<Result<Project, DomainError>> {
    try {
      const project = await this.prismaClient.project.findUnique({
        where: { id },
      });

      if (!project) {
        return err(new DomainError(`Project with ID ${id} not found`));
      }

      return Project.create({
        id: project.id,
        name: project.name,
        description: project.description || undefined,
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to get project", error));
    }
  }

  /**
   * Get all projects
   * @returns A Result containing an array of projects or a DomainError
   */
  public async getProjects(): Promise<Result<Project[], DomainError>> {
    try {
      const projects = await this.prismaClient.project.findMany();

      const projectResults = projects.map((project) =>
        Project.create({
          id: project.id,
          name: project.name,
          description: project.description || undefined,
        }),
      );

      // Process the results using neverthrow's combinatorial functions
      // Use the .combine method to safely combine all results or return the first error
      return Result.combine(projectResults);
    } catch (error) {
      return err(DomainError.fromError("Failed to get projects", error));
    }
  }

  /**
   * Update a project
   * @param id The project ID
   * @param projectDTO The project data transfer object (can be only fields that changed)
   * @returns A Result containing the updated project or a DomainError
   */
  public async updateProject(
    id: string,
    projectDTO: Partial<ProjectDTO>,
  ): Promise<Result<Project, DomainError>> {
    try {
      // First check if the project exists
      const existingProject = await this.prismaClient.project.findUnique({
        where: { id },
      });

      if (!existingProject) {
        return err(new DomainError(`Project with ID ${id} not found`));
      }

      // Prepare update data
      const updateData: {
        name?: string;
        description?: string | null;
      } = {};
      if (projectDTO.name) updateData.name = projectDTO.name;
      if ("description" in projectDTO) {
        updateData.description = projectDTO.description || null;
      }

      // Update the project
      const project = await this.prismaClient.project.update({
        where: { id },
        data: updateData,
      });

      return Project.create({
        id: project.id,
        name: project.name,
        description: project.description || undefined,
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to update project", error));
    }
  }

  /**
   * Delete a project
   * @param id The project ID
   * @returns A Result containing a success boolean or a DomainError
   */
  public async deleteProject(
    id: string,
  ): Promise<Result<boolean, DomainError>> {
    try {
      // First check if the project exists
      const existingProject = await this.prismaClient.project.findUnique({
        where: { id },
      });

      if (!existingProject) {
        return err(new DomainError(`Project with ID ${id} not found`));
      }

      // Delete the project
      await this.prismaClient.project.delete({
        where: { id },
      });

      return ok(true);
    } catch (error) {
      return err(DomainError.fromError("Failed to delete project", error));
    }
  }
}
