import { describe, it, expect, beforeEach } from '@jest/globals'
import { Validator, ValidatorDTO } from '../Validator'
import { DomainError } from '../DomainError'
import { randomUUID } from 'crypto'

describe('Validator', () => {
  describe('create', () => {
    let validDTO: ValidatorDTO

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        template: 'Prompt',
        resource: 'model'
      }
    })

    it('should create a Validator successfully with valid DTO', () => {
      const result = Validator.create(validDTO)

      expect(result.isOk()).toBe(true)
      const validator = result._unsafeUnwrap()
      expect(validator).toBeInstanceOf(Validator)
      expect(validator.id).toBe(validDTO.id)
      expect(validator.template).toBe(validDTO.template)
      expect(validator.resource).toBe(validDTO.resource)
    })

    it('should return a DomainError if template is empty', () => {
      const invalidDTO: ValidatorDTO = { ...validDTO, template: '' }
      const result = Validator.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('template')
    })

    it('should return a DomainError if id is not a valid UUID', () => {
      const invalidDTO: ValidatorDTO = { ...validDTO, id: 'bad-uuid' }
      const result = Validator.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('id')
    })

    it('should return a DomainError if resource is missing', () => {
      const { resource: _r, ...dtoWithoutResource } = validDTO
      const result = Validator.create(dtoWithoutResource as ValidatorDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('resource')
    })

    it('should return a DomainError if resource is empty', () => {
      const invalidDTO: ValidatorDTO = { ...validDTO, resource: '' }
      const result = Validator.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('resource')
    })

    it('should return a DomainError if template is missing', () => {
      const { template: _t, ...dto } = validDTO
      const result = Validator.create(dto as ValidatorDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('template')
    })

    it('should return a DomainError if id is missing', () => {
      const { id: _i, ...dto } = validDTO
      const result = Validator.create(dto as ValidatorDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('id')
    })
  })
})
