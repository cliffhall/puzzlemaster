import { describe, it, expect, beforeEach } from "vitest";
import { Project, ProjectDTO } from "../Project";
import { DomainError } from "../DomainError";
import { randomUUID } from "crypto";

describe("Project", () => {
  describe("create", () => {
    let validDTO: ProjectDTO;

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        planId: randomUUID(),
        name: "Test Project",
        description: "A project description",
      };
    });

    it("should create a Project successfully with valid DTO", () => {
      const result = Project.create(validDTO);

      expect(result.isOk()).toBe(true);
      const project = result._unsafeUnwrap();
      expect(project).toBeInstanceOf(Project);
      expect(project.id).toBe(validDTO.id);
      expect(project.planId).toBe(validDTO.planId);
      expect(project.name).toBe(validDTO.name);
      expect(project.description).toBe(validDTO.description);
    });

    it.each(["id", "planId"])(
      "should return a DomainError if %s is not a valid UUID",
      (field) => {
        const dto = { ...validDTO, [field]: "not-a-uuid" } as ProjectDTO;
        const result = Project.create(dto);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );

    it("should return a DomainError if name is empty", () => {
      const invalidDTO: ProjectDTO = { ...validDTO, name: "" };
      const result = Project.create(invalidDTO);

      expect(result.isErr()).toBe(true);
      const error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(DomainError);
      expect(error.message).toContain("name");
    });

    it("should create a Project without a description", () => {
      const { description: _omit, ...dto } = validDTO;
      const result = Project.create(dto as ProjectDTO);

      expect(result.isOk()).toBe(true);
      const project = result._unsafeUnwrap();
      expect(project.description).toBeUndefined();
    });

    it.each(["id", "planId", "name"] as const)(
      "should return a DomainError if %s is missing",
      (field) => {
        const { [field]: _omit, ...dto } = validDTO;
        const result = Project.create(dto as ProjectDTO);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );
  });
});
