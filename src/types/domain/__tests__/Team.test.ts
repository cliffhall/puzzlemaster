import { describe, it, expect, beforeEach } from "vitest";
import { Team, TeamDTO } from "../Team";
import { DomainError } from "../DomainError";
import { randomUUID } from "crypto";

describe("Team", () => {
  describe("create", () => {
    let validDTO: TeamDTO;

    beforeEach(() => {
      validDTO = {
        id: randomUUID(),
        phaseId: randomUUID(),
        name: "Team Name",
        agents: [randomUUID()],
      };
    });

    it("should create a Team successfully with valid DTO", () => {
      const result = Team.create(validDTO);

      expect(result.isOk()).toBe(true);
      const team = result._unsafeUnwrap();
      expect(team).toBeInstanceOf(Team);
      expect(team.id).toBe(validDTO.id);
      expect(team.phaseId).toBe(validDTO.phaseId);
      expect(team.name).toBe(validDTO.name);
      expect(team.agents).toEqual(validDTO.agents);
    });

    it.each(["id", "phaseId"])(
      "should return a DomainError if %s is not a valid UUID",
      (field) => {
        const dto = { ...validDTO, [field]: "not-a-uuid" } as TeamDTO;
        const result = Team.create(dto);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );

    it("should return a DomainError if agents contain invalid UUIDs", () => {
      const invalidDTO: TeamDTO = { ...validDTO, agents: ["not-a-uuid"] };
      const result = Team.create(invalidDTO);

      expect(result.isErr()).toBe(true);
      const error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(DomainError);
      expect(error.message).toContain("agents");
    });

    it("should create a Team when agents array is empty", () => {
      const dto: TeamDTO = { ...validDTO, agents: [] };
      const result = Team.create(dto);

      expect(result.isOk()).toBe(true);
      const team = result._unsafeUnwrap();
      expect(team.agents).toEqual([]);
    });

    it.each(["id", "phaseId", "name", "agents"] as const)(
      "should return a DomainError if %s is missing",
      (field) => {
        const { [field]: _omit, ...dto } = validDTO;
        const result = Team.create(dto as TeamDTO);

        expect(result.isErr()).toBe(true);
        const error = result._unsafeUnwrapErr();
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toContain(field);
      },
    );

    it("should return a DomainError if name is empty", () => {
      const invalidDTO: TeamDTO = { ...validDTO, name: "" };
      const result = Team.create(invalidDTO);

      expect(result.isErr()).toBe(true);
      const error = result._unsafeUnwrapErr();
      expect(error).toBeInstanceOf(DomainError);
      expect(error.message).toContain("name");
    });
  });
});
