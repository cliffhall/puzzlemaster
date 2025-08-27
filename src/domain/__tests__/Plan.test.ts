import { describe, it, expect, beforeEach } from "vitest";
import { Plan, PlanDTO } from "../Plan";
import { DomainError } from "../DomainError";
import { randomUUID } from "crypto";

describe("Plan", () => {
  describe("create", () => {
    let validDTO: PlanDTO;

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        projectId: randomUUID(),
        phases: [randomUUID()],
        description: "plan desc",
      };
    });

    it("should create a Plan successfully with valid DTO", () => {
      const result = Plan.create(validDTO);

      expect(result.isOk()).toBe(true);
      const plan = result._unsafeUnwrap();
      expect(plan).toBeInstanceOf(Plan);
      expect(plan.id).toBe(validDTO.id);
      expect(plan.projectId).toBe(validDTO.projectId);
      expect(plan.phases).toEqual(validDTO.phases);
      expect(plan.description).toBe(validDTO.description);
    });

    it.each([
      { field: "id", value: "not-a-uuid" },
      { field: "projectId", value: "not-a-uuid" },
      { field: "phases", value: ["not-a-uuid"] },
    ])(
      "should return a DomainError if $field is invalid",
      ({ field, value }) => {
        const dto = { ...validDTO, [field]: value } as PlanDTO;
        const result = Plan.create(dto);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );

    it("should create a Plan when phases array is empty", () => {
      const dto: PlanDTO = { ...validDTO, phases: [] };
      const result = Plan.create(dto);

      expect(result.isOk()).toBe(true);
      const plan = result._unsafeUnwrap();
      expect(plan.phases).toEqual([]);
    });

    it("should return a DomainError if description is missing", () => {
      const { description: _omit, ...dto } = validDTO;
      const result = Plan.create(dto as PlanDTO);

      expect(result.isErr()).toBe(true);
      const error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(DomainError);
      expect(error.message).toContain("description");
    });

    it.each(["id", "projectId", "phases"] as const)(
      "should return a DomainError if %s is missing",
      (field) => {
        const { [field]: _omit, ...dto } = validDTO;
        const result = Plan.create(dto as PlanDTO);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );
  });
});
