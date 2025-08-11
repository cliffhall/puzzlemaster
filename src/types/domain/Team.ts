/**
 * Team
 * - One or more agents assigned to complete a job associated with a single phase of a plan
 */

import { z } from "zod";
import { Result, ok, err } from "neverthrow";
import { DomainError } from "./DomainError";

export const TeamSchema = z.object({
  id: z.string().uuid(),
  phaseId: z.string().uuid(),
  name: z.string().min(1),
  agents: z.array(z.string().uuid()),
});

export type TeamDTO = z.infer<typeof TeamSchema>;

export type TeamResult =
  | { success: true; data: Team }
  | { success: false; error: string };

export type TeamListResult =
  | { success: true; data: Team[] }
  | { success: false; error: string };

export enum TeamAPIMethods {
  CREATE_TEAM = "create-team",
  GET_TEAM = "get-team",
  GET_TEAMS = "get-teams",
  UPDATE_TEAM = "update-team",
  DELETE_TEAM = "delete-team",
}

export class Team {
  private constructor(
    public readonly id: string,
    public readonly phaseId: string,
    public name: string,
    public agents: string[],
  ) {}

  static create(dto: TeamDTO): Result<Team, DomainError> {
    const parsed = TeamSchema.safeParse(dto);
    if (!parsed.success) return err(new DomainError(parsed.error.message));
    const { id, phaseId, name, agents } = parsed.data;
    return ok(new Team(id, phaseId, name, agents));
  }
}
