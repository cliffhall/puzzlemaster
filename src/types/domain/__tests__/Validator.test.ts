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

    it.each([
      ['id', { ...validDTO, id: 'bad-uuid' }]
    ])('should return a DomainError if %s is not a valid UUID', (_field, dto) => {
      const result = Validator.create(dto as ValidatorDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(_field)
    })

    it('should return a DomainError if template is empty', () => {
      const invalidDTO: ValidatorDTO = { ...validDTO, template: '' }
      const result = Validator.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('template')
    })

    it.each([
      ['resource', () => { const { resource: _r, ...dto } = validDTO; return dto as ValidatorDTO }],
      ['template', () => { const { template: _t, ...dto } = validDTO; return dto as ValidatorDTO }],
      ['id', () => { const { id: _i, ...dto } = validDTO; return dto as ValidatorDTO }]
    ])('should return a DomainError if %s is missing', (field, dtoBuilder) => {
      const dto = dtoBuilder()
      const result = Validator.create(dto)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(field)
    })

    it('should return a DomainError if resource is empty', () => {
      const invalidDTO: ValidatorDTO = { ...validDTO, resource: '' }
      const result = Validator.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('resource')
    })
  })
})
