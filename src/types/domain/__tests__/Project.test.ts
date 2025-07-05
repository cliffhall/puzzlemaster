import { describe, it, expect, beforeEach } from '@jest/globals'
import { Project, ProjectDTO } from '../Project'
import { DomainError } from '../DomainError'
import { randomUUID } from 'crypto'

describe('Project', () => {
  describe('create', () => {
    let validDTO: ProjectDTO

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        planId: randomUUID(),
        name: 'Test Project',
        description: 'A project description'
      }
    })

    it('should create a Project successfully with valid DTO', () => {
      const result = Project.create(validDTO)

      expect(result.isOk()).toBe(true)
      const project = result._unsafeUnwrap()
      expect(project).toBeInstanceOf(Project)
      expect(project.id).toBe(validDTO.id)
      expect(project.planId).toBe(validDTO.planId)
      expect(project.name).toBe(validDTO.name)
      expect(project.description).toBe(validDTO.description)
    })

    it.each([
      ['planId', { ...validDTO, planId: 'bad-uuid' }],
      ['id', { ...validDTO, id: 'bad-uuid' }]
    ])('should return a DomainError if %s is not a valid UUID', (_field, dto) => {
      const result = Project.create(dto as ProjectDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(_field)
    })

    it('should return a DomainError if name is empty', () => {
      const invalidDTO: ProjectDTO = { ...validDTO, name: '' }
      const result = Project.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

    it.each([
      ['planId', () => { const { planId: _p, ...dto } = validDTO; return dto as ProjectDTO }],
      ['name', () => { const { name: _n, ...dto } = validDTO; return dto as ProjectDTO }],
      ['id', () => { const { id: _id, ...dto } = validDTO; return dto as ProjectDTO }]
    ])('should return a DomainError if %s is missing', (field, dtoBuilder) => {
      const dto = dtoBuilder()
      const result = Project.create(dto)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(field)
    })
  })
})
