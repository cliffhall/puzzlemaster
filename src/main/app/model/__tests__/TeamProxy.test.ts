import { createTestTeamProxy } from "../../../../test/team-proxy-test-helper";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { TeamDTO } from "../../../../domain";
import { TeamProxy } from "../TeamProxy";
import { randomUUID } from "crypto";
import { PrismaClient } from "db";

/**
 * Helper function to create test data (phase and team)
 * @returns An object containing the created IDs and the team DTO
 */
async function createTestData(prisma: PrismaClient): Promise<{
  phaseId: string;
  teamId: string;
  teamDTO: TeamDTO;
}> {
  // Create phase with all required related entities
  const phaseId = randomUUID();
  await prisma.phase.create({
    data: {
      id: phaseId,
      name: "Test Phase",
      plan: {
        create: {
          id: randomUUID(),
          project: {
            create: {
              id: randomUUID(),
              name: "Test Project",
            },
          },
        },
      },
    },
  });

  // Create team DTO
  const teamId = randomUUID();
  const teamDTO: TeamDTO = {
    id: teamId,
    name: "Test Team",
    phaseId,
    agents: [],
  };

  return { phaseId, teamId, teamDTO };
}

describe("TeamProxy", () => {
  let testSetup: {
    prisma: PrismaClient;
    teamProxy: TeamProxy;
    cleanup: () => Promise<void>;
  };

  beforeEach(async () => {
    testSetup = await createTestTeamProxy();
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  describe("createTeam", () => {
    it("should create a team in the database", async () => {
      // Set up test data
      const { teamDTO } = await createTestData(testSetup.prisma);

      // Call the method under test
      const result = await testSetup.teamProxy.createTeam(teamDTO);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const team = result.value;
        expect(team.id).toBe(teamDTO.id);
        expect(team.name).toBe(teamDTO.name);
        expect(team.phaseId).toBe(teamDTO.phaseId);
        expect(team.agents).toEqual([]);
      }

      // Verify the team was created in the database
      const dbTeam = await testSetup.prisma.team.findUnique({
        where: { id: teamDTO.id },
      });

      expect(dbTeam).not.toBeNull();
      expect(dbTeam?.name).toBe(teamDTO.name);
    });
  });

  describe("getTeam", () => {
    it("should retrieve a team by ID", async () => {
      // Set up test data
      const { teamDTO } = await createTestData(testSetup.prisma);

      // Create the team first
      await testSetup.teamProxy.createTeam(teamDTO);

      // Call the method under test
      const result = await testSetup.teamProxy.getTeam(teamDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const team = result.value;
        expect(team.id).toBe(teamDTO.id);
        expect(team.name).toBe(teamDTO.name);
        expect(team.phaseId).toBe(teamDTO.phaseId);
        expect(team.agents).toEqual([]);
      }
    });

    it("should return an error when team does not exist", async () => {
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.teamProxy.getTeam(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain(
          `Team with ID ${nonExistentId} not found`,
        );
      }
    });
  });

  describe("getTeams", () => {
    it("should retrieve all teams", async () => {
      // Set up test data
      const { teamDTO: team1DTO } = await createTestData(testSetup.prisma);
      const { teamDTO: team2DTO } = await createTestData(testSetup.prisma);

      // Create teams
      await testSetup.teamProxy.createTeam(team1DTO);
      await testSetup.teamProxy.createTeam(team2DTO);

      // Call the method under test
      const result = await testSetup.teamProxy.getTeams();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const teams = result.value;
        expect(teams).toHaveLength(2);

        const team1 = teams.find((t) => t.id === team1DTO.id);
        const team2 = teams.find((t) => t.id === team2DTO.id);

        expect(team1).toBeDefined();
        expect(team1?.name).toBe(team1DTO.name);
        expect(team1?.phaseId).toBe(team1DTO.phaseId);

        expect(team2).toBeDefined();
        expect(team2?.name).toBe(team2DTO.name);
        expect(team2?.phaseId).toBe(team2DTO.phaseId);
      }
    });

    it("should return an empty array when no teams exist", async () => {
      // Call the method under test
      const result = await testSetup.teamProxy.getTeams();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const teams = result.value;
        expect(teams).toHaveLength(0);
      }
    });
  });

  describe("updateTeam", () => {
    it("should update a team's name", async () => {
      // Set up test data
      const { teamDTO } = await createTestData(testSetup.prisma);

      // Create the team first
      await testSetup.teamProxy.createTeam(teamDTO);

      const updatedName = "Updated Team Name";

      // Call the method under test
      const result = await testSetup.teamProxy.updateTeam(teamDTO.id, {
        name: updatedName,
      });

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const team = result.value;
        expect(team.id).toBe(teamDTO.id);
        expect(team.name).toBe(updatedName);
        expect(team.phaseId).toBe(teamDTO.phaseId);
      }

      // Verify the team was updated in the database
      const dbTeam = await testSetup.prisma.team.findUnique({
        where: { id: teamDTO.id },
      });

      expect(dbTeam?.name).toBe(updatedName);
    });

    it("should update a team's phase", async () => {
      // Set up test data
      const { teamDTO } = await createTestData(testSetup.prisma);

      // Create another phase
      const newPhaseId = randomUUID();
      await testSetup.prisma.phase.create({
        data: {
          id: newPhaseId,
          name: "New Test Phase",
          plan: {
            create: {
              id: randomUUID(),
              project: {
                create: {
                  id: randomUUID(),
                  name: "New Test Project",
                },
              },
            },
          },
        },
      });

      // Create the team first
      await testSetup.teamProxy.createTeam(teamDTO);

      // Call the method under test
      const result = await testSetup.teamProxy.updateTeam(teamDTO.id, {
        phaseId: newPhaseId,
      });

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const team = result.value;
        expect(team.id).toBe(teamDTO.id);
        expect(team.name).toBe(teamDTO.name);
        expect(team.phaseId).toBe(newPhaseId);
      }
    });

    it("should return an error when team does not exist", async () => {
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.teamProxy.updateTeam(nonExistentId, {
        name: "Updated Name",
      });

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain(
          `Team with ID ${nonExistentId} not found`,
        );
      }
    });
  });

  describe("deleteTeam", () => {
    it("should delete a team from the database", async () => {
      // Set up test data
      const { teamDTO } = await createTestData(testSetup.prisma);

      // Create the team first
      await testSetup.teamProxy.createTeam(teamDTO);

      // Verify the team exists
      const teamBeforeDelete = await testSetup.prisma.team.findUnique({
        where: { id: teamDTO.id },
      });
      expect(teamBeforeDelete).not.toBeNull();

      // Call the method under test
      const result = await testSetup.teamProxy.deleteTeam(teamDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        expect(result.value).toBe(true);
      }

      // Verify the team was deleted from the database
      const teamAfterDelete = await testSetup.prisma.team.findUnique({
        where: { id: teamDTO.id },
      });
      expect(teamAfterDelete).toBeNull();
    });

    it("should return an error when team does not exist", async () => {
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.teamProxy.deleteTeam(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain(
          `Team with ID ${nonExistentId} not found`,
        );
      }
    });
  });
});
