/**
 * Action
 * - An action that an agent can take to trigger a change to another phase of a plan
 */

import { z } from "zod";
import { Result, ok, err } from "neverthrow";
import { DomainError } from "./DomainError";

export const ActionSchema = z.object({
  id: z.string().uuid(),
  phaseId: z.string().uuid(),
  targetPhaseId: z.string().uuid(),
  validatorId: z.string().uuid(),
  name: z.string().min(1),
});

export const CreateActionSchema = ActionSchema.omit({ id: true });

export type ActionDTO = z.infer<typeof ActionSchema>;
export type CreateActionDTO = z.infer<typeof CreateActionSchema>;

export type ActionResult =
  | { success: true; data: Action }
  | { success: false; error: string };

export type ActionListResult =
  | { success: true; data: Action[] }
  | { success: false; error: string };

export enum ActionAPIMethods {
  CREATE_ACTION = "create-action",
  GET_ACTION = "get-action",
  GET_ACTIONS = "get-actions",
  GET_ACTIONS_BY_PHASE = "get-actions-by-phase",
  UPDATE_ACTION = "update-action",
  DELETE_ACTION = "delete-action",
}

export class Action {
  private constructor(
    public readonly id: string,
    public readonly phaseId: string,
    public targetPhaseId: string,
    public validatorId: string,
    public name: string,
  ) {}

  static create(dto: ActionDTO): Result<Action, DomainError> {
    const parsed = ActionSchema.safeParse(dto);
    if (!parsed.success) return err(new DomainError(parsed.error.message));
    const { id, phaseId, targetPhaseId, validatorId, name } = parsed.data;
    return ok(new Action(id, phaseId, targetPhaseId, validatorId, name));
  }
}
