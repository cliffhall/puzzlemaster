import { describe, it, expect, beforeEach } from '@jest/globals'
import { Role, RoleDTO } from '../Role'
import { DomainError } from '../DomainError'
import { randomUUID } from 'crypto'

describe('Role', () => {
  describe('create', () => {
    let validDTO: RoleDTO

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        name: 'Role Name',
        description: 'desc'
      }
    })

    it('should create a Role successfully with valid DTO', () => {
      const result = Role.create(validDTO)

      expect(result.isOk()).toBe(true)
      const role = result._unsafeUnwrap()
      expect(role).toBeInstanceOf(Role)
      expect(role.id).toBe(validDTO.id)
      expect(role.name).toBe(validDTO.name)
      expect(role.description).toBe(validDTO.description)
    })

    it.each([
      ['id', { ...validDTO, id: 'bad-uuid' }]
    ])('should return a DomainError if %s is not a valid UUID', (_field, dto) => {
      const result = Role.create(dto as RoleDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(_field)
    })

    it('should return a DomainError if name is empty', () => {
      const invalidDTO: RoleDTO = { ...validDTO, name: '' }
      const result = Role.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

    it.each([
      ['name', () => { const { name: _n, ...dto } = validDTO; return dto as RoleDTO }],
      ['id', () => { const { id: _id, ...dto } = validDTO; return dto as RoleDTO }]
    ])('should return a DomainError if %s is missing', (field, dtoBuilder) => {
      const dto = dtoBuilder()
      const result = Role.create(dto)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(field)
    })
  })
})
