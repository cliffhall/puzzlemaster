import { describe, it, expect, beforeEach } from '@jest/globals'
import { Agent, AgentDTO } from '../Agent'
import { DomainError } from '../DomainError'
import { randomUUID } from 'crypto'

describe('Agent', () => {
  describe('create', () => {
    let validDTO: AgentDTO

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        teamId: randomUUID(),
        roleId: randomUUID(),
        name: 'Agent Name',
        tasks: [randomUUID()]
      }
    })

    it('should create an Agent successfully with valid DTO', () => {
      const result = Agent.create(validDTO)

      expect(result.isOk()).toBe(true)
      const agent = result._unsafeUnwrap()
      expect(agent).toBeInstanceOf(Agent)
      expect(agent.id).toBe(validDTO.id)
      expect(agent.teamId).toBe(validDTO.teamId)
      expect(agent.roleId).toBe(validDTO.roleId)
      expect(agent.name).toBe(validDTO.name)
      expect(agent.tasks).toEqual(validDTO.tasks)
    })

    it.each([
      ['teamId', { ...validDTO, teamId: 'bad-uuid' }],
      ['id', { ...validDTO, id: 'bad-uuid' }],
      ['roleId', { ...validDTO, roleId: 'bad-uuid' }]
    ])('should return a DomainError if %s is not a valid UUID', (_field, dto) => {
      const result = Agent.create(dto as AgentDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(_field)
    })

    it('should return a DomainError if tasks contain invalid UUIDs', () => {
      const invalidDTO: AgentDTO = { ...validDTO, tasks: ['bad-uuid'] }
      const result = Agent.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('tasks')
    })

    it('should return a DomainError if name is empty', () => {
      const invalidDTO: AgentDTO = { ...validDTO, name: '' }
      const result = Agent.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

    it.each([
      ['teamId', () => { const { teamId: _t, ...dto } = validDTO; return dto as AgentDTO }],
      ['roleId', () => { const { roleId: _r, ...dto } = validDTO; return dto as AgentDTO }],
      ['name', () => { const { name: _n, ...dto } = validDTO; return dto as AgentDTO }],
      ['tasks', () => { const { tasks: _tsk, ...dto } = validDTO; return dto as AgentDTO }],
      ['id', () => { const { id: _id, ...dto } = validDTO; return dto as AgentDTO }]
    ])('should return a DomainError if %s is missing', (field, dtoBuilder) => {
      const dto = dtoBuilder()
      const result = Agent.create(dto)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(field)
    })
  })
})
