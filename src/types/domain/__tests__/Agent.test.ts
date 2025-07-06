import { describe, it, expect, beforeEach } from "vitest";
import { Agent, AgentDTO } from "../Agent";
import { DomainError } from "../DomainError";
import { randomUUID } from "crypto";

describe("Agent", () => {
  describe("create", () => {
    let validDTO: AgentDTO;

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        teamId: randomUUID(),
        roleId: randomUUID(),
        name: "Agent Name",
        tasks: [randomUUID()],
      };
    });

    it("should create an Agent successfully with valid DTO", () => {
      const result = Agent.create(validDTO);

      expect(result.isOk()).toBe(true);
      const agent = result._unsafeUnwrap();
      expect(agent).toBeInstanceOf(Agent);
      expect(agent.id).toBe(validDTO.id);
      expect(agent.teamId).toBe(validDTO.teamId);
      expect(agent.roleId).toBe(validDTO.roleId);
      expect(agent.name).toBe(validDTO.name);
      expect(agent.tasks).toEqual(validDTO.tasks);
    });

    it.each(["id", "teamId", "roleId"])(
      "should return a DomainError if %s is not a valid UUID",
      (field) => {
        const dto = { ...validDTO, [field]: "not-a-uuid" } as AgentDTO;
        const result = Agent.create(dto);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );

    it("should return a DomainError if tasks contain invalid UUIDs", () => {
      const invalidDTO: AgentDTO = { ...validDTO, tasks: ["not-a-uuid"] };
      const result = Agent.create(invalidDTO);

      expect(result.isErr()).toBe(true);
      const error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(DomainError);
      expect(error.message).toContain("tasks");
    });

    it("should create an Agent when tasks array is empty", () => {
      const dto: AgentDTO = { ...validDTO, tasks: [] };
      const result = Agent.create(dto);

      expect(result.isOk()).toBe(true);
      const agent = result._unsafeUnwrap();
      expect(agent.tasks).toEqual([]);
    });

    it("should return a DomainError if name is empty", () => {
      const invalidDTO: AgentDTO = { ...validDTO, name: "" };
      const result = Agent.create(invalidDTO);

      expect(result.isErr()).toBe(true);
      const error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(DomainError);
      expect(error.message).toContain("name");
    });

    it.each(["id", "teamId", "roleId", "name", "tasks"] as const)(
      "should return a DomainError if %s is missing",
      (field) => {
        const { [field]: _omit, ...dto } = validDTO;
        const result = Agent.create(dto as AgentDTO);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );
  });
});
