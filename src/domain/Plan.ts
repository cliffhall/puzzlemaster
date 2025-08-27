/**
 * Plan
 * - A project's plan, to be implemented in one or more phases
 */

import { z } from "zod";
import { Result, ok, err } from "neverthrow";
import { DomainError } from "./DomainError";

export const PlanSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  phases: z.array(z.string().uuid()),
  description: z.string(),
});

export const CreatePlanSchema = PlanSchema.omit({ id: true });

export type PlanDTO = z.infer<typeof PlanSchema>;
export type CreatePlanDTO = z.infer<typeof CreatePlanSchema>;

export type PlanResult =
  | { success: true; data: Plan }
  | { success: false; error: string };

export type PlanListResult =
  | { success: true; data: Plan[] }
  | { success: false; error: string };

export enum PlanAPIMethods {
  CREATE_PLAN = "create-plan",
  GET_PLAN = "get-plan",
  GET_PLANS = "get-plans",
  UPDATE_PLAN = "update-plan",
  DELETE_PLAN = "delete-plan",
}

export class Plan {
  private constructor(
    public readonly id: string,
    public readonly projectId: string,
    public description: string,
    public phases: string[],
  ) {}

  static create(dto: PlanDTO): Result<Plan, DomainError> {
    const parsed = PlanSchema.safeParse(dto);
    if (!parsed.success) return err(new DomainError(parsed.error.message));
    const { id, projectId, description, phases } = parsed.data;
    return ok(new Plan(id, projectId, description, phases));
  }
}
