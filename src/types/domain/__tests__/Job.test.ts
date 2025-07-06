import { describe, it, expect, beforeEach } from "vitest";
import { Job, JobDTO } from "../Job";
import { DomainError } from "../DomainError";
import { randomUUID } from "crypto";

describe("Job", () => {
  describe("create", () => {
    let validDTO: JobDTO;

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        phaseId: randomUUID(),
        name: "Job Name",
        description: "desc",
        tasks: [randomUUID()],
      };
    });

    it("should create a Job successfully with valid DTO", () => {
      const result = Job.create(validDTO);

      expect(result.isOk()).toBe(true);
      const job = result._unsafeUnwrap();
      expect(job).toBeInstanceOf(Job);
      expect(job.id).toBe(validDTO.id);
      expect(job.phaseId).toBe(validDTO.phaseId);
      expect(job.name).toBe(validDTO.name);
      expect(job.description).toBe(validDTO.description);
      expect(job.tasks).toEqual(validDTO.tasks);
    });

    it.each(["id", "phaseId"])(
      "should return a DomainError if %s is not a valid UUID",
      (field) => {
        const dto = { ...validDTO, [field]: "not-a-uuid" } as JobDTO;
        const result = Job.create(dto);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );

    it("should return a DomainError if tasks contain invalid UUIDs", () => {
      const invalidDTO: JobDTO = { ...validDTO, tasks: ["not-a-uuid"] };
      const result = Job.create(invalidDTO);

      expect(result.isErr()).toBe(true);
      const error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(DomainError);
      expect(error.message).toContain("tasks");
    });

    it.each(["id", "phaseId", "name", "tasks"] as const)(
      "should return a DomainError if %s is missing",
      (field) => {
        const { [field]: _omit, ...dto } = validDTO;
        const result = Job.create(dto as JobDTO);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );

    it("should return a DomainError if name is empty", () => {
      const invalidDTO: JobDTO = { ...validDTO, name: "" };
      const result = Job.create(invalidDTO);

      expect(result.isErr()).toBe(true);
      const error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(DomainError);
      expect(error.message).toContain("name");
    });

    it("should create a Job when tasks array is empty", () => {
      const dto: JobDTO = { ...validDTO, tasks: [] };
      const result = Job.create(dto);

      expect(result.isOk()).toBe(true);
      const job = result._unsafeUnwrap();
      expect(job.tasks).toEqual([]);
    });

    it("should create a Job without a description", () => {
      const { description: _omit, ...dto } = validDTO;
      const result = Job.create(dto as JobDTO);

      expect(result.isOk()).toBe(true);
      const job = result._unsafeUnwrap();
      expect(job.description).toBeUndefined();
    });
  });
});
