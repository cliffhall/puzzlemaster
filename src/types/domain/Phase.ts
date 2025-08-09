/**
 * Phase
 * - A phase of a project's implementation plan. has an associated team and a job to complete before other phases can commence
 */

import { z } from "zod";
import { Result, ok, err } from "neverthrow";
import { DomainError } from "./DomainError";

export const PhaseSchema = z.object({
  id: z.string().uuid(),
  planId: z.string().uuid(),
  name: z.string().min(1),
  actions: z.array(z.string().uuid()),
  // teamId and jobId have been removed
});

export type PhaseDTO = z.infer<typeof PhaseSchema>;

export class Phase {
  private constructor(
    public readonly id: string,
    public readonly planId: string,
    public name: string,
    public actions: string[],
    // teamId and jobId have been removed
  ) {}

  static create(dto: PhaseDTO): Result<Phase, DomainError> {
    const parsed = PhaseSchema.safeParse(dto);
    if (!parsed.success) return err(new DomainError(parsed.error.message));
    const { id, planId, name, actions } = parsed.data;
    return ok(new Phase(id, planId, name, actions));
  }
}
