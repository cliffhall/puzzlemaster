import { describe, it, expect, beforeEach } from '@jest/globals'
import { Job, JobDTO } from '../Job'
import { DomainError } from '../DomainError'
import { randomUUID } from 'crypto'

describe('Job', () => {
  describe('create', () => {
    let validDTO: JobDTO

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        phaseId: randomUUID(),
        name: 'Job Name',
        description: 'desc',
        tasks: [randomUUID()]
      }
    })

    it('should create a Job successfully with valid DTO', () => {
      const result = Job.create(validDTO)

      expect(result.isOk()).toBe(true)
      const job = result._unsafeUnwrap()
      expect(job).toBeInstanceOf(Job)
      expect(job.id).toBe(validDTO.id)
      expect(job.phaseId).toBe(validDTO.phaseId)
      expect(job.name).toBe(validDTO.name)
      expect(job.description).toBe(validDTO.description)
      expect(job.tasks).toEqual(validDTO.tasks)
    })

    it('should return a DomainError if phaseId is not a valid UUID', () => {
      const invalidDTO: JobDTO = { ...validDTO, phaseId: 'bad-uuid' }
      const result = Job.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('phaseId')
    })

    it('should return a DomainError if tasks contain invalid UUIDs', () => {
      const invalidDTO: JobDTO = { ...validDTO, tasks: ['bad-uuid'] }
      const result = Job.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('tasks')
    })

    it('should return a DomainError if id is not a valid UUID', () => {
      const invalidDTO: JobDTO = { ...validDTO, id: 'bad-uuid' }
      const result = Job.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('id')
    })

    it('should return a DomainError if phaseId is missing', () => {
      const { phaseId: _p, ...dto } = validDTO
      const result = Job.create(dto as JobDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('phaseId')
    })

    it('should return a DomainError if name is missing', () => {
      const { name: _n, ...dto } = validDTO
      const result = Job.create(dto as JobDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

    it('should return a DomainError if tasks are missing', () => {
      const { tasks: _t, ...dto } = validDTO
      const result = Job.create(dto as JobDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('tasks')
    })

    it('should return a DomainError if name is empty', () => {
      const invalidDTO: JobDTO = { ...validDTO, name: '' }
      const result = Job.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

    it('should return a DomainError if id is missing', () => {
      const { id: _id, ...dtoWithoutId } = validDTO
      const result = Job.create(dtoWithoutId as JobDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('id')
    })
  })
})
