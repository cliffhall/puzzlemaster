/**
 * Action
 * - An action that an agent can take to trigger a change to another phase of a plan
 */

import { z } from "zod";
import { Result, ok, err } from "neverthrow";
import { DomainError } from "./DomainError";

export const ActionSchema = z.object({
  id: z.string().uuid(),
  targetPhaseId: z.string().uuid(),
  validatorId: z.string().uuid(),
  name: z.string().min(1),
});

export type ActionDTO = z.infer<typeof ActionSchema>;

export class Action {
  private constructor(
    public readonly id: string,
    public targetPhaseId: string,
    public validatorId: string,
    public name: string,
  ) {}

  static create(dto: ActionDTO): Result<Action, DomainError> {
    const parsed = ActionSchema.safeParse(dto);
    if (!parsed.success) return err(new DomainError(parsed.error.message));
    const { id, targetPhaseId, validatorId, name } = parsed.data;
    return ok(new Action(id, targetPhaseId, validatorId, name));
  }
}
