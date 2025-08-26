import { describe, it, expect, beforeEach } from "vitest";
import { Phase, PhaseDTO } from "../Phase";
import { DomainError } from "../DomainError";
import { randomUUID } from "crypto";

describe("Phase", () => {
  describe("create", () => {
    let validDTO: PhaseDTO;

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        planId: randomUUID(), // Added planId
        name: "Test Phase",
        actions: [randomUUID()],
        // Removed teamId and jobId
      };
    });

    it("should create a Phase successfully with valid DTO", () => {
      const result = Phase.create(validDTO);

      expect(result.isOk()).toBe(true);
      const phase = result._unsafeUnwrap();
      expect(phase).toBeInstanceOf(Phase);
      expect(phase.id).toBe(validDTO.id);
      expect(phase.planId).toBe(validDTO.planId); // Added assertion
      expect(phase.name).toBe(validDTO.name);
      expect(phase.actions).toEqual(validDTO.actions);
      // Removed assertions for teamId and jobId
    });

    it.each([
      { field: "id", value: "not-a-uuid" },
      { field: "planId", value: "not-a-uuid" },
      { field: "actions", value: ["not-a-uuid"] },
      { field: "name", value: "" },
    ])(
      "should return a DomainError if $field is invalid",
      ({ field, value }) => {
        const dto = { ...validDTO, [field]: value } as PhaseDTO;
        const result = Phase.create(dto);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );

    it("should create a Phase when actions array is empty", () => {
      const dto: PhaseDTO = { ...validDTO, actions: [] };
      const result = Phase.create(dto);

      expect(result.isOk()).toBe(true);
      const phase = result._unsafeUnwrap();
      expect(phase.actions).toEqual([]);
    });

    it.each(["id", "planId", "name", "actions"] as const)(
      "should return a DomainError if %s is missing",
      (field) => {
        const { [field]: _omit, ...dto } = validDTO;
        const result = Phase.create(dto as PhaseDTO);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );
  });
});
