import { describe, it, expect, beforeEach } from '@jest/globals'
import { Plan, PlanDTO } from '../Plan'
import { DomainError } from '../DomainError'
import { randomUUID } from 'crypto'

describe('Plan', () => {
  describe('create', () => {
    let validDTO: PlanDTO

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        projectId: randomUUID(),
        phases: [randomUUID()],
        description: 'plan desc'
      }
    })

    it('should create a Plan successfully with valid DTO', () => {
      const result = Plan.create(validDTO)

      expect(result.isOk()).toBe(true)
      const plan = result._unsafeUnwrap()
      expect(plan).toBeInstanceOf(Plan)
      expect(plan.id).toBe(validDTO.id)
      expect(plan.projectId).toBe(validDTO.projectId)
      expect(plan.phases).toEqual(validDTO.phases)
      expect(plan.description).toBe(validDTO.description)
    })

    it('should return a DomainError if projectId is not a valid UUID', () => {
      const invalidDTO: PlanDTO = { ...validDTO, projectId: 'bad-uuid' }
      const result = Plan.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('projectId')
    })

    it('should return a DomainError if phases contain invalid UUIDs', () => {
      const invalidDTO: PlanDTO = { ...validDTO, phases: ['bad-uuid'] }
      const result = Plan.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('phases')
    })

    it('should return a DomainError if id is not a valid UUID', () => {
      const invalidDTO: PlanDTO = { ...validDTO, id: 'bad-uuid' }
      const result = Plan.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('id')
    })

    it('should return a DomainError if projectId is missing', () => {
      const { projectId: _p, ...dto } = validDTO
      const result = Plan.create(dto as PlanDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('projectId')
    })

    it('should return a DomainError if phases are missing', () => {
      const { phases: _ph, ...dto } = validDTO
      const result = Plan.create(dto as PlanDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('phases')
    })

    it('should return a DomainError if id is missing', () => {
      const { id: _id, ...dtoWithoutId } = validDTO
      const result = Plan.create(dtoWithoutId as PlanDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('id')
    })
  })
})
