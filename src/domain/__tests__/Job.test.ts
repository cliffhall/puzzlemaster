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
        status: "PENDING", // Added status
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
      expect(job.status).toBe("PENDING"); // Added assertion
      expect(job.tasks).toEqual(validDTO.tasks);
    });

    it("should default status to PENDING if not provided", () => {
      const { status, ...dto } = validDTO;
      // The type assertion `as JobDTO` tells TypeScript that this is a valid
      // input for the create method at runtime, as Zod\'s .default() will handle it.
      const result = Job.create(dto as JobDTO);
      expect(result.isOk()).toBe(true);
      const job = result._unsafeUnwrap();
      expect(job.status).toBe("PENDING");
    });

    it.each([
      { field: "id", value: "not-a-uuid" },
      { field: "phaseId", value: "not-a-uuid" },
      { field: "tasks", value: ["not-a-uuid"] },
      { field: "name", value: "" },
    ])(
      "should return a DomainError if $field is invalid",
      ({ field, value }) => {
        const dto = { ...validDTO, [field]: value } as JobDTO;
        const result = Job.create(dto);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );

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
