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

    it.each([
      ['projectId', { ...validDTO, projectId: 'bad-uuid' }],
      ['id', { ...validDTO, id: 'bad-uuid' }]
    ])('should return a DomainError if %s is not a valid UUID', (_field, dto) => {
      const result = Plan.create(dto as PlanDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(_field)
    })

    it('should return a DomainError if phases contain invalid UUIDs', () => {
      const invalidDTO: PlanDTO = { ...validDTO, phases: ['bad-uuid'] }
      const result = Plan.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('phases')
    })

    it.each([
      ['projectId', () => { const { projectId: _p, ...dto } = validDTO; return dto as PlanDTO }],
      ['phases', () => { const { phases: _ph, ...dto } = validDTO; return dto as PlanDTO }],
      ['id', () => { const { id: _id, ...dto } = validDTO; return dto as PlanDTO }]
    ])('should return a DomainError if %s is missing', (field, dtoBuilder) => {
      const dto = dtoBuilder()
      const result = Plan.create(dto)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(field)
    })
  })
})
