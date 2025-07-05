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

    it.each([
      ['validatorId', { ...validDTO, validatorId: 'bad-uuid' }],
      ['id', { ...validDTO, id: 'bad-uuid' }],
      ['jobId', { ...validDTO, jobId: 'bad-uuid' }],
      ['agentId', { ...validDTO, agentId: 'bad-uuid' }]
    ])('should return a DomainError if %s is not a valid UUID', (_field, dto) => {
      const result = Task.create(dto as TaskDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(_field)
    })

    it.each([
      ['jobId', () => { const { jobId: _j, ...dto } = validDTO; return dto as TaskDTO }],
      ['agentId', () => { const { agentId: _a, ...dto } = validDTO; return dto as TaskDTO }],
      ['validatorId', () => { const { validatorId: _v, ...dto } = validDTO; return dto as TaskDTO }],
      ['name', () => { const { name: _n, ...dto } = validDTO; return dto as TaskDTO }],
      ['id', () => { const { id: _id, ...dto } = validDTO; return dto as TaskDTO }]
    ])('should return a DomainError if %s is missing', (field, dtoBuilder) => {
      const dto = dtoBuilder()
      const result = Task.create(dto)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(field)
    })

    it('should return a DomainError if name is empty', () => {
      const invalidDTO: TaskDTO = { ...validDTO, name: '' }
      const result = Task.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

  })
})
