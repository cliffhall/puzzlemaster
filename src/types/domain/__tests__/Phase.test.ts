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

    it('should return a DomainError if teamId is not a valid UUID', () => {
      const invalidDTO: PhaseDTO = { ...validDTO, teamId: 'not-a-uuid' }
      const result = Phase.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('teamId')
    })

    it('should return a DomainError if actions contain invalid UUIDs', () => {
      const invalidDTO: PhaseDTO = { ...validDTO, actions: ['bad-uuid'] }
      const result = Phase.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('actions')
    })

    it('should return a DomainError if id is not a valid UUID', () => {
      const invalidDTO: PhaseDTO = { ...validDTO, id: 'bad-uuid' }
      const result = Phase.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('id')
    })

    it('should return a DomainError if jobId is not a valid UUID', () => {
      const invalidDTO: PhaseDTO = { ...validDTO, jobId: 'bad-uuid' }
      const result = Phase.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('jobId')
    })

    it('should return a DomainError if teamId is missing', () => {
      const { teamId: _t, ...dto } = validDTO
      const result = Phase.create(dto as PhaseDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('teamId')
    })

    it('should return a DomainError if jobId is missing', () => {
      const { jobId: _j, ...dto } = validDTO
      const result = Phase.create(dto as PhaseDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('jobId')
    })

    it('should return a DomainError if name is missing', () => {
      const { name: _n, ...dto } = validDTO
      const result = Phase.create(dto as PhaseDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

    it('should return a DomainError if actions are missing', () => {
      const { actions: _a, ...dto } = validDTO
      const result = Phase.create(dto as PhaseDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('actions')
    })

    it('should return a DomainError if name is empty', () => {
      const invalidDTO: PhaseDTO = { ...validDTO, name: '' }
      const result = Phase.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

    it('should return a DomainError if id is missing', () => {
      const { id: _id, ...dtoWithoutId } = validDTO
      const result = Phase.create(dtoWithoutId as PhaseDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('id')
    })
  })
})
