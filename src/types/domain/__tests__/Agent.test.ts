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

    it('should return a DomainError if teamId is not a valid UUID', () => {
      const invalidDTO: AgentDTO = { ...validDTO, teamId: 'bad-uuid' }
      const result = Agent.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('teamId')
    })

    it('should return a DomainError if tasks contain invalid UUIDs', () => {
      const invalidDTO: AgentDTO = { ...validDTO, tasks: ['bad-uuid'] }
      const result = Agent.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('tasks')
    })

    it('should return a DomainError if id is missing', () => {
      const { id: _id, ...dtoWithoutId } = validDTO
      const result = Agent.create(dtoWithoutId as AgentDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('id')
    })
  })
})
