import { z } from 'zod'
import { Result, ok, err } from 'neverthrow'
import { DomainError } from './DomainError'

export const JobSchema = z.object({
  id: z.string().uuid(),
  phaseId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  tasks: z.array(z.string().uuid())
})

export type JobDTO = z.infer<typeof JobSchema>

export class Job {
  private constructor(
    public readonly id: string,
    public readonly phaseId: string,
    public name: string,
    public description: string | undefined,
    public tasks: string[]
  ) {}

  static create(dto: JobDTO): Result<Job, DomainError> {
    const parsed = JobSchema.safeParse(dto)
    if (!parsed.success) return err(new DomainError(parsed.error.message))
    const { id, phaseId, name, description, tasks } = parsed.data
    return ok(new Job(id, phaseId, name, description, tasks))
  }
}
