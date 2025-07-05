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

    it.each(['projectId', 'id'])('should return a DomainError if %s is not a valid UUID', field => {
      const dto = { ...validDTO, [field]: 'bad-uuid' } as PlanDTO
      const result = Plan.create(dto)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(field)
    })

    it('should return a DomainError if phases contain invalid UUIDs', () => {
      const invalidDTO: PlanDTO = { ...validDTO, phases: ['bad-uuid'] }
      const result = Plan.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('phases')
    })

    it.each(['projectId', 'phases', 'id'])('should return a DomainError if %s is missing', field => {
      const { [field]: _omit, ...dto } = validDTO as any
      const result = Plan.create(dto as PlanDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(field)
    })
  })
})
