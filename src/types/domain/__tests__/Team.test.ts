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

    it.each(['agents', 'id', 'phaseId'])('should return a DomainError if %s is not a valid UUID', field => {
      const dto = field === 'agents'
        ? ({ ...validDTO, agents: ['bad-uuid'] } as TeamDTO)
        : ({ ...validDTO, [field]: 'bad-uuid' } as TeamDTO)
      const result = Team.create(dto)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(field)
    })

    it.each(['name', 'agents', 'id', 'phaseId'])('should return a DomainError if %s is missing', field => {
      const { [field]: _omit, ...dto } = validDTO as any
      const result = Team.create(dto as TeamDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(field)
    })

    it('should return a DomainError if name is empty', () => {
      const invalidDTO: TeamDTO = { ...validDTO, name: '' }
      const result = Team.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })
  })
})
