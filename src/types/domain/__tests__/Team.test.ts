import { describe, it, expect, beforeEach } from '@jest/globals'
import { Team, TeamDTO } from '../Team'
import { DomainError } from '../DomainError'
import { randomUUID } from 'crypto'

describe('Team', () => {
  describe('create', () => {
    let validDTO: TeamDTO

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        phaseId: randomUUID(),
        name: 'Team Name',
        agents: [randomUUID()]
      }
    })

    it('should create a Team successfully with valid DTO', () => {
      const result = Team.create(validDTO)

      expect(result.isOk()).toBe(true)
      const team = result._unsafeUnwrap()
      expect(team).toBeInstanceOf(Team)
      expect(team.id).toBe(validDTO.id)
      expect(team.phaseId).toBe(validDTO.phaseId)
      expect(team.name).toBe(validDTO.name)
      expect(team.agents).toEqual(validDTO.agents)
    })

    it('should return a DomainError if agents contain invalid UUIDs', () => {
      const invalidDTO: TeamDTO = { ...validDTO, agents: ['bad-uuid'] }
      const result = Team.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('agents')
    })

    it('should return a DomainError if name is empty', () => {
      const invalidDTO: TeamDTO = { ...validDTO, name: '' }
      const result = Team.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

    it('should return a DomainError if phaseId is missing', () => {
      const { phaseId: _p, ...dtoWithoutPhase } = validDTO
      const result = Team.create(dtoWithoutPhase as TeamDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('phaseId')
    })
  })
})
