import { z } from 'zod'
import { Result, ok, err } from 'neverthrow'
import { DomainError } from './DomainError'

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  planId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional()
})

export type ProjectDTO = z.infer<typeof ProjectSchema>

export class Project {
  private constructor(
    public readonly id: string,
    public readonly planId: string,
    public name: string,
    public description?: string
  ) {}

  static create(dto: ProjectDTO): Result<Project, DomainError> {
    const parsed = ProjectSchema.safeParse(dto)
    if (!parsed.success) return err(new DomainError(parsed.error.message))
    const { id, planId, name, description } = parsed.data
    return ok(new Project(id, planId, name, description))
  }
}
