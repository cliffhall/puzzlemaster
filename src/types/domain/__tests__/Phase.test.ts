import { describe, it, expect, beforeEach } from '@jest/globals'
import { Phase, PhaseDTO } from '../Phase'
import { DomainError } from '../DomainError'
import { randomUUID } from 'crypto'

describe('Phase', () => {
  describe('create', () => {
    let validDTO: PhaseDTO

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        teamId: randomUUID(),
        jobId: randomUUID(),
        name: 'Test Phase',
        actions: [randomUUID()]
      }
    })

    it('should create a Phase successfully with valid DTO', () => {
      const result = Phase.create(validDTO)

      expect(result.isOk()).toBe(true)
      const phase = result._unsafeUnwrap()
      expect(phase).toBeInstanceOf(Phase)
      expect(phase.id).toBe(validDTO.id)
      expect(phase.teamId).toBe(validDTO.teamId)
      expect(phase.jobId).toBe(validDTO.jobId)
      expect(phase.name).toBe(validDTO.name)
      expect(phase.actions).toEqual(validDTO.actions)
    })

    it.each(['teamId', 'id', 'jobId'])('should return a DomainError if %s is not a valid UUID', field => {
      const dto = { ...validDTO, [field]: 'bad-uuid' } as PhaseDTO
      const result = Phase.create(dto)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(field)
    })

    it('should return a DomainError if actions contain invalid UUIDs', () => {
      const invalidDTO: PhaseDTO = { ...validDTO, actions: ['bad-uuid'] }
      const result = Phase.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('actions')
    })

    it('should create a Phase when actions array is empty', () => {
      const dto: PhaseDTO = { ...validDTO, actions: [] }
      const result = Phase.create(dto)

      expect(result.isOk()).toBe(true)
      const phase = result._unsafeUnwrap()
      expect(phase.actions).toEqual([])
    })

    it.each(['teamId', 'jobId', 'name', 'actions', 'id'])('should return a DomainError if %s is missing', field => {
      const { [field]: _omit, ...dto } = validDTO as any
      const result = Phase.create(dto as PhaseDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(field)
    })

    it('should return a DomainError if name is empty', () => {
      const invalidDTO: PhaseDTO = { ...validDTO, name: '' }
      const result = Phase.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

  })
})
