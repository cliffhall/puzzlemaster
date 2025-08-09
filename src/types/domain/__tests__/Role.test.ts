import { describe, it, expect, beforeEach } from "vitest";
import { Role, RoleDTO } from "../Role";
import { DomainError } from "../DomainError";
import { randomUUID } from "crypto";

describe("Role", () => {
  describe("create", () => {
    let validDTO: RoleDTO;

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        name: "Role Name",
        description: "desc",
      };
    });

    it("should create a Role successfully with valid DTO", () => {
      const result = Role.create(validDTO);

      expect(result.isOk()).toBe(true);
      const role = result._unsafeUnwrap();
      expect(role).toBeInstanceOf(Role);
      expect(role.id).toBe(validDTO.id);
      expect(role.name).toBe(validDTO.name);
      expect(role.description).toBe(validDTO.description);
    });

    it.each([
      { field: "id", value: "not-a-uuid" },
      { field: "name", value: "" },
    ])(
      "should return a DomainError if $field is invalid",
      ({ field, value }) => {
        const dto = { ...validDTO, [field]: value } as RoleDTO;
        const result = Role.create(dto);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );

    it("should create a Role without a description", () => {
      const { description: _omit, ...dto } = validDTO;
      const result = Role.create(dto as RoleDTO);

      expect(result.isOk()).toBe(true);
      const role = result._unsafeUnwrap();
      expect(role.description).toBeUndefined();
    });

    it.each(["id", "name"] as const)(
      "should return a DomainError if %s is missing",
      (field) => {
        const { [field]: _omit, ...dto } = validDTO;
        const result = Role.create(dto as RoleDTO);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );
  });
});
