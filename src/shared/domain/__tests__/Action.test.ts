import { describe, it, expect, beforeEach } from '@jest/globals'
import { Action, ActionDTO } from '../Action'
import { DomainError } from '../DomainError'
import { randomUUID } from 'crypto'

describe('Action', () => {
  describe('create', () => {
    let validDTO: ActionDTO

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        targetPhaseId: randomUUID(),
        validatorId: randomUUID(),
        name: 'Valid Action Name'
      }
    })

    it('should create an Action successfully with valid DTO', () => {
      const result = Action.create(validDTO)

      expect(result.isOk()).toBe(true)
      const action = result._unsafeUnwrap()
      expect(action).toBeInstanceOf(Action)
      expect(action.id).toBe(validDTO.id)
      expect(action.targetPhaseId).toBe(validDTO.targetPhaseId)
      expect(action.validatorId).toBe(validDTO.validatorId)
      expect(action.name).toBe(validDTO.name)
    })

    it('should return a DomainError if id is not a valid UUID', () => {
      const invalidDTO: ActionDTO = { ...validDTO, id: 'not-a-uuid' }
      const result = Action.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('id')
    })

    it('should return a DomainError if targetPhaseId is not a valid UUID', () => {
      const invalidDTO: ActionDTO = { ...validDTO, targetPhaseId: 'not-a-uuid' }
      const result = Action.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('targetPhaseId')
    })

    it('should return a DomainError if validatorId is not a valid UUID', () => {
      const invalidDTO: ActionDTO = { ...validDTO, validatorId: 'not-a-uuid' }
      const result = Action.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('validatorId')
    })

    it('should return a DomainError if name is empty', () => {
      const invalidDTO: ActionDTO = { ...validDTO, name: '' }
      const result = Action.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

    it('should return a DomainError if name is missing', () => {
      // Create a new object that omits the 'name' property
      const { name: _name, ...dtoWithoutName } = validDTO

      // We cast to ActionDTO because Action.create expects it,
      // but we are intentionally testing an invalid structure.
      const result = Action.create(dtoWithoutName as ActionDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name') // Zod will report 'name' as required
    })

    it('should return a DomainError if id is missing', () => {
      const dtoMissingId = {
        // 'id' property is intentionally missing
        targetPhaseId: randomUUID(),
        validatorId: randomUUID(),
        name: 'Test Action'
      }

      // We cast to ActionDTO because Action.create expects it,
      // and we are testing its behavior with an object we know is missing 'id'.
      const result = Action.create(dtoMissingId as ActionDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('id')
    })
  })
})
