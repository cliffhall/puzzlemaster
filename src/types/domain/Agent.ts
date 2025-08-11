/**
 * Agent
 * - An agent with a specific role and assigned task list
 */

import { z } from "zod";
import { Result, ok, err } from "neverthrow";
import { DomainError } from "./DomainError";

export const AgentSchema = z.object({
  id: z.string().uuid(),
  teamId: z.string().uuid(),
  roleId: z.string().uuid(),
  name: z.string().min(1),
  tasks: z.array(z.string().uuid()),
});

export type AgentDTO = z.infer<typeof AgentSchema>;

export type AgentResult =
  | { success: true; data: Agent }
  | { success: false; error: string };

export type AgentListResult =
  | { success: true; data: Agent[] }
  | { success: false; error: string };

export enum AgentAPIMethods {
  CREATE_AGENT = "create-agent",
  GET_AGENT = "get-agent",
  GET_AGENTS = "get-agents",
  UPDATE_AGENT = "update-agent",
  DELETE_AGENT = "delete-agent",
}

export class Agent {
  private constructor(
    public readonly id: string,
    public readonly teamId: string,
    public readonly roleId: string,
    public name: string,
    public tasks: string[],
  ) {}

  static create(dto: AgentDTO): Result<Agent, DomainError> {
    const parsed = AgentSchema.safeParse(dto);
    if (!parsed.success) return err(new DomainError(parsed.error.message));
    const { id, teamId, roleId, name, tasks } = parsed.data;
    return ok(new Agent(id, teamId, roleId, name, tasks));
  }
}
