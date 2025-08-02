/**
 * Job
 * - A job is composed of one or more tasks that will complete a phase of a plan.
 */

import { z } from "zod";
import { Result, ok, err } from "neverthrow";
import { DomainError } from "./DomainError";

export const JobStatusSchema = z.enum([
  "PENDING",
  "RUNNING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
]);
export type JobStatus = z.infer<typeof JobStatusSchema>;

export const JobSchema = z.object({
  id: z.string().uuid(),
  phaseId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  status: JobStatusSchema.default("PENDING"),
  tasks: z.array(z.string().uuid()),
});

export type JobDTO = z.infer<typeof JobSchema>;

export class Job {
  private constructor(
    public readonly id: string,
    public readonly phaseId: string,
    public name: string,
    public description: string | undefined,
    public status: JobStatus,
    public tasks: string[],
  ) {}

  static create(dto: JobDTO): Result<Job, DomainError> {
    const parsed = JobSchema.safeParse(dto);
    if (!parsed.success) return err(new DomainError(parsed.error.message));
    const { id, phaseId, name, description, status, tasks } = parsed.data;
    return ok(new Job(id, phaseId, name, description, status, tasks));
  }
}
