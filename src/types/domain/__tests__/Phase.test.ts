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

    it.each([
      ['teamId', { ...validDTO, teamId: 'not-a-uuid' }],
      ['id', { ...validDTO, id: 'bad-uuid' }],
      ['jobId', { ...validDTO, jobId: 'bad-uuid' }]
    ])('should return a DomainError if %s is not a valid UUID', (_field, dto) => {
      const result = Phase.create(dto as PhaseDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(_field)
    })

    it('should return a DomainError if actions contain invalid UUIDs', () => {
      const invalidDTO: PhaseDTO = { ...validDTO, actions: ['bad-uuid'] }
      const result = Phase.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('actions')
    })

    it.each([
      ['teamId', () => { const { teamId: _t, ...dto } = validDTO; return dto as PhaseDTO }],
      ['jobId', () => { const { jobId: _j, ...dto } = validDTO; return dto as PhaseDTO }],
      ['name', () => { const { name: _n, ...dto } = validDTO; return dto as PhaseDTO }],
      ['actions', () => { const { actions: _a, ...dto } = validDTO; return dto as PhaseDTO }],
      ['id', () => { const { id: _id, ...dto } = validDTO; return dto as PhaseDTO }]
    ])('should return a DomainError if %s is missing', (field, dtoBuilder) => {
      const dto = dtoBuilder()
      const result = Phase.create(dto)

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
