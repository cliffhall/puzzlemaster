/**
 * Task
 * - Part of a job assigned to a single agent for completion
 */

import { z } from 'zod'
import { Result, ok, err } from 'neverthrow'
import { DomainError } from './DomainError'

export const TaskSchema = z.object({
  id: z.string().uuid(),
  jobId: z.string().uuid(),
  agentId: z.string().uuid(),
  validatorId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional()
})

export type TaskDTO = z.infer<typeof TaskSchema>

export class Task {
  private constructor(
    public readonly id: string,
    public readonly jobId: string,
    public readonly agentId: string,
    public readonly validatorId: string,
    public name: string,
    public description: string | undefined
  ) {}

  static create(dto: TaskDTO): Result<Task, DomainError> {
    const parsed = TaskSchema.safeParse(dto)
    if (!parsed.success) return err(new DomainError(parsed.error.message))
    const { id, jobId, agentId, validatorId, name, description } = parsed.data
    return ok(new Task(id, jobId, agentId, validatorId, name, description))
  }
}
