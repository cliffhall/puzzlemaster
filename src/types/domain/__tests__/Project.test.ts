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

    it('should return a DomainError if planId is not a valid UUID', () => {
      const invalidDTO: ProjectDTO = { ...validDTO, planId: 'bad-uuid' }
      const result = Project.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('planId')
    })

    it('should return a DomainError if name is empty', () => {
      const invalidDTO: ProjectDTO = { ...validDTO, name: '' }
      const result = Project.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

    it('should return a DomainError if id is not a valid UUID', () => {
      const invalidDTO: ProjectDTO = { ...validDTO, id: 'bad-uuid' }
      const result = Project.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('id')
    })

    it('should return a DomainError if planId is missing', () => {
      const { planId: _p, ...dto } = validDTO
      const result = Project.create(dto as ProjectDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('planId')
    })

    it('should return a DomainError if name is missing', () => {
      const { name: _n, ...dto } = validDTO
      const result = Project.create(dto as ProjectDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

    it('should return a DomainError if id is missing', () => {
      const { id: _id, ...dtoWithoutId } = validDTO
      const result = Project.create(dtoWithoutId as ProjectDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('id')
    })
  })
})
