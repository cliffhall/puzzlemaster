/**
 * Project
 * - A project with an implementation plan that can be executed by teams of agents
 */

import { z } from "zod";
import { Result, ok, err } from "neverthrow";
import { DomainError } from "./DomainError";

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
});

export type ProjectDTO = z.infer<typeof ProjectSchema>;

export enum ProjectAPIMethods {
  CREATE_PROJECT = "create-project",
  GET_PROJECT = "get-project",
  GET_PROJECTS = "get-projects",
  UPDATE_PROJECT = "update-project",
  DELETE_PROJECT = "delete-project",
}

export class Project {
  private constructor(
    public readonly id: string,
    public name: string,
    public description?: string,
  ) {}

  static create(dto: ProjectDTO): Result<Project, DomainError> {
    const parsed = ProjectSchema.safeParse(dto);
    if (!parsed.success) return err(new DomainError(parsed.error.message));
    const { id, name, description } = parsed.data;
    return ok(new Project(id, name, description));
  }
}
