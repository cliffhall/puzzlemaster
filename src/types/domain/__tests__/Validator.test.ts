import { describe, it, expect, beforeEach } from "vitest";
import { Validator, ValidatorDTO } from "../Validator";
import { DomainError } from "../DomainError";
import { randomUUID } from "crypto";

describe("Validator", () => {
  describe("create", () => {
    let validDTO: ValidatorDTO;

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        template: "Prompt",
        resource: "model",
      };
    });

    it("should create a Validator successfully with valid DTO", () => {
      const result = Validator.create(validDTO);

      expect(result.isOk()).toBe(true);
      const validator = result._unsafeUnwrap();
      expect(validator).toBeInstanceOf(Validator);
      expect(validator.id).toBe(validDTO.id);
      expect(validator.template).toBe(validDTO.template);
      expect(validator.resource).toBe(validDTO.resource);
    });

    it.each([
      { field: "id", value: "not-a-uuid" },
      { field: "template", value: "" },
      { field: "resource", value: "" },
    ])(
      "should return a DomainError if $field is invalid",
      ({ field, value }) => {
        const dto = { ...validDTO, [field]: value } as ValidatorDTO;
        const result = Validator.create(dto);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );

    it.each(["id", "resource", "template"] as const)(
      "should return a DomainError if %s is missing",
      (field) => {
        const { [field]: _omit, ...dto } = validDTO;
        const result = Validator.create(dto as ValidatorDTO);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );
  });
});
