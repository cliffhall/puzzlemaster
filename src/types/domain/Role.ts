/**
 * Role
 * - An agent's role within a team.
 */

import { z } from "zod";
import { Result, ok, err } from "neverthrow";
import { DomainError } from "./DomainError";

export const RoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
});

export type RoleDTO = z.infer<typeof RoleSchema>;

export type RoleResult =
  | { success: true; data: Role }
  | { success: false; error: string };

export type RoleListResult =
  | { success: true; data: Role[] }
  | { success: false; error: string };

export enum RoleAPIMethods {
  CREATE_ROLE = "create-role",
  GET_ROLE = "get-role",
  GET_ROLES = "get-roles",
  UPDATE_ROLE = "update-role",
  DELETE_ROLE = "delete-role",
}

export class Role {
  private constructor(
    public readonly id: string,
    public name: string,
    public description?: string,
  ) {}

  static create(dto: RoleDTO): Result<Role, DomainError> {
    const parsed = RoleSchema.safeParse(dto);
    if (!parsed.success) return err(new DomainError(parsed.error.message));
    const { id, name, description } = parsed.data;
    return ok(new Role(id, name, description));
  }
}
