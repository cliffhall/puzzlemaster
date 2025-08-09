import { describe, it, expect, beforeEach } from "vitest";
import { Action, ActionDTO } from "../Action";
import { DomainError } from "../DomainError";
import { randomUUID } from "crypto";

describe("Action", () => {
  describe("create", () => {
    let validDTO: ActionDTO;

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        phaseId: randomUUID(), // Added required field
        targetPhaseId: randomUUID(),
        validatorId: randomUUID(),
        name: "Valid Action Name",
      };
    });

    it("should create an Action successfully with valid DTO", () => {
      const result = Action.create(validDTO);

      expect(result.isOk()).toBe(true);
      const action = result._unsafeUnwrap();
      expect(action).toBeInstanceOf(Action);
      expect(action.id).toBe(validDTO.id);
      expect(action.phaseId).toBe(validDTO.phaseId); // Added assertion
      expect(action.targetPhaseId).toBe(validDTO.targetPhaseId);
      expect(action.validatorId).toBe(validDTO.validatorId);
      expect(action.name).toBe(validDTO.name);
    });

    it.each([
      { field: "id", value: "not-a-uuid" },
      { field: "phaseId", value: "not-a-uuid" },
      { field: "targetPhaseId", value: "not-a-uuid" },
      { field: "validatorId", value: "not-a-uuid" },
      { field: "name", value: "" },
    ])(
      "should return a DomainError if $field is invalid",
      ({ field, value }) => {
        const invalidDTO = { ...validDTO, [field]: value };
        const result = Action.create(invalidDTO as ActionDTO);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );

    // Refactored for conciseness
    it.each(["id", "phaseId", "targetPhaseId", "validatorId", "name"] as const)(
      "should return a DomainError if %s is missing",
      (field) => {
        const { [field]: _omit, ...dto } = validDTO;
        const result = Action.create(dto as ActionDTO);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );
  });
});
