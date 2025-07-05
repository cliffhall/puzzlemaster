import { describe, it, expect, beforeEach } from '@jest/globals'
import { Task, TaskDTO } from '../Task'
import { DomainError } from '../DomainError'
import { randomUUID } from 'crypto'

describe('Task', () => {
  describe('create', () => {
    let validDTO: TaskDTO

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        jobId: randomUUID(),
        agentId: randomUUID(),
        validatorId: randomUUID(),
        name: 'Test Task',
        description: 'Task description'
      }
    })

    it('should create a Task successfully with valid DTO', () => {
      const result = Task.create(validDTO)

      expect(result.isOk()).toBe(true)
      const task = result._unsafeUnwrap()
      expect(task).toBeInstanceOf(Task)
      expect(task.id).toBe(validDTO.id)
      expect(task.jobId).toBe(validDTO.jobId)
      expect(task.agentId).toBe(validDTO.agentId)
      expect(task.validatorId).toBe(validDTO.validatorId)
      expect(task.name).toBe(validDTO.name)
      expect(task.description).toBe(validDTO.description)
    })

    it('should return a DomainError if validatorId is not a valid UUID', () => {
      const invalidDTO: TaskDTO = { ...validDTO, validatorId: 'bad-uuid' }
      const result = Task.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('validatorId')
    })

    it('should return a DomainError if name is empty', () => {
      const invalidDTO: TaskDTO = { ...validDTO, name: '' }
      const result = Task.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

    it('should return a DomainError if id is missing', () => {
      const { id: _id, ...dtoWithoutId } = validDTO
      const result = Task.create(dtoWithoutId as TaskDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('id')
    })
  })
})
