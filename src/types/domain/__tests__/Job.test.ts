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

    it.each([
      ['phaseId', { ...validDTO, phaseId: 'bad-uuid' }],
      ['id', { ...validDTO, id: 'bad-uuid' }]
    ])('should return a DomainError if %s is not a valid UUID', (_field, dto) => {
      const result = Job.create(dto as JobDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(_field)
    })

    it('should return a DomainError if tasks contain invalid UUIDs', () => {
      const invalidDTO: JobDTO = { ...validDTO, tasks: ['bad-uuid'] }
      const result = Job.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('tasks')
    })

    it.each([
      ['phaseId', () => { const { phaseId: _p, ...dto } = validDTO; return dto as JobDTO }],
      ['name', () => { const { name: _n, ...dto } = validDTO; return dto as JobDTO }],
      ['tasks', () => { const { tasks: _t, ...dto } = validDTO; return dto as JobDTO }],
      ['id', () => { const { id: _id, ...dto } = validDTO; return dto as JobDTO }]
    ])('should return a DomainError if %s is missing', (field, dtoBuilder) => {
      const dto = dtoBuilder()
      const result = Job.create(dto)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain(field)
    })

    it('should return a DomainError if name is empty', () => {
      const invalidDTO: JobDTO = { ...validDTO, name: '' }
      const result = Job.create(invalidDTO)

      expect(result.isErr()).toBe(true)
      const error = result._unsafeUnwrapErr()
      expect(error).toBeInstanceOf(DomainError)
      expect(error.message).toContain('name')
    })

  })
})
