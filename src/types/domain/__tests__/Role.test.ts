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

    it('should return a DomainError if name is empty', () => {
      const invalidDTO: RoleDTO = { ...validDTO, name: '' }
      const result = Role.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

    it('should return a DomainError if id is not a valid UUID', () => {
      const invalidDTO: RoleDTO = { ...validDTO, id: 'bad-uuid' }
      const result = Role.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('id')
    })

    it('should return a DomainError if name is missing', () => {
      const { name: _n, ...dtoWithoutName } = validDTO
      const result = Role.create(dtoWithoutName as RoleDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

    it('should return a DomainError if id is missing', () => {
      const { id: _id, ...dto } = validDTO
      const result = Role.create(dto as RoleDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('id')
    })
  })
})
