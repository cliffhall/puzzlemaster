import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createTestAgentProxy } from "../../../../test/agent-proxy-test-helper";
import { randomUUID } from "crypto";
import { AgentDTO } from "../../../../types/domain/Agent";
import { PrismaClient } from "db";
import { AgentProxy } from "../AgentProxy";

/**
 * Helper function to create test data (team, role, and agent)
 * @returns An object containing the created IDs and the agent DTO
 */
async function createTestData(prisma: PrismaClient): Promise<{
  teamId: string;
  roleId: string;
  agentId: string;
  agentDTO: AgentDTO;
}> {
  // Create team with all required related entities
  const teamId = randomUUID();
  await prisma.team.create({
    data: {
      id: teamId,
      name: "Test Team",
      phase: {
        create: {
          id: randomUUID(),
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
      },
    },
  });

  // Create role with unique name
  const roleId = randomUUID();
  const uniqueRoleName = `Test Role ${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  await prisma.role.create({
    data: {
      id: roleId,
      name: uniqueRoleName,
    },
  });

  // Create agent DTO
  const agentId = randomUUID();
  const agentDTO: AgentDTO = {
    id: agentId,
    name: "Test Agent",
    teamId,
    roleId,
    tasks: [],
  };

  return { teamId, roleId, agentId, agentDTO };
}

describe("AgentProxy", () => {
  let testSetup: {
    prisma: PrismaClient;
    agentProxy: AgentProxy;
    cleanup: () => Promise<void>;
  };

  beforeEach(async () => {
    testSetup = await createTestAgentProxy();
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  describe("createAgent", () => {
    it("should create an agent in the database", async () => {
      // Set up test data
      const { agentDTO } = await createTestData(testSetup.prisma);

      // Call the method under test
      const result = await testSetup.agentProxy.createAgent(agentDTO);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const agent = result.value;
        expect(agent.id).toBe(agentDTO.id);
        expect(agent.name).toBe(agentDTO.name);
        expect(agent.teamId).toBe(agentDTO.teamId);
        expect(agent.roleId).toBe(agentDTO.roleId);
      }

      // Verify the agent was created in the database
      const dbAgent = await testSetup.prisma.agent.findUnique({
        where: { id: agentDTO.id },
      });

      expect(dbAgent).not.toBeNull();
      expect(dbAgent?.name).toBe(agentDTO.name);
    });
  });

  describe("getAgent", () => {
    it("should retrieve an agent from the database", async () => {
      // Set up test data
      const { agentDTO } = await createTestData(testSetup.prisma);

      // Create the agent in the database
      await testSetup.agentProxy.createAgent(agentDTO);

      // Call the method under test
      const result = await testSetup.agentProxy.getAgent(agentDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const agent = result.value;
        expect(agent.id).toBe(agentDTO.id);
        expect(agent.name).toBe(agentDTO.name);
        expect(agent.teamId).toBe(agentDTO.teamId);
        expect(agent.roleId).toBe(agentDTO.roleId);
        expect(agent.tasks).toEqual([]);
      }
    });

    it("should return an error when agent does not exist", async () => {
      // Generate a random ID that doesn't exist in the database
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.agentProxy.getAgent(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        const error = result.error;
        expect(error.message).toBe(`Agent with ID ${nonExistentId} not found`);
      }
    });
  });

  describe("getAgents", () => {
    it("should retrieve all agents from the database", async () => {
      // Set up test data for multiple agents
      const { agentDTO: agent1DTO } = await createTestData(testSetup.prisma);
      const { agentDTO: agent2DTO } = await createTestData(testSetup.prisma);

      // Create the agents in the database
      await testSetup.agentProxy.createAgent(agent1DTO);
      await testSetup.agentProxy.createAgent(agent2DTO);

      // Call the method under test
      const result = await testSetup.agentProxy.getAgents();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const agents = result.value;
        expect(agents.length).toBe(2);

        // Find the agents in the result by ID
        const foundAgent1 = agents.find((agent) => agent.id === agent1DTO.id);
        const foundAgent2 = agents.find((agent) => agent.id === agent2DTO.id);

        // Verify both agents were found
        expect(foundAgent1).toBeDefined();
        expect(foundAgent2).toBeDefined();

        // Verify agent properties
        if (foundAgent1) {
          expect(foundAgent1.name).toBe(agent1DTO.name);
          expect(foundAgent1.teamId).toBe(agent1DTO.teamId);
          expect(foundAgent1.roleId).toBe(agent1DTO.roleId);
        }

        if (foundAgent2) {
          expect(foundAgent2.name).toBe(agent2DTO.name);
          expect(foundAgent2.teamId).toBe(agent2DTO.teamId);
          expect(foundAgent2.roleId).toBe(agent2DTO.roleId);
        }
      }
    });

    it("should return an empty array when no agents exist", async () => {
      // Call the method under test (without creating any agents)
      const result = await testSetup.agentProxy.getAgents();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const agents = result.value;
        expect(agents).toEqual([]);
      }
    });
  });

  describe("updateAgent", () => {
    it("should update an agent's name", async () => {
      // Set up test data
      const { agentDTO } = await createTestData(testSetup.prisma);

      // Create the agent in the database
      await testSetup.agentProxy.createAgent(agentDTO);

      // Prepare update data
      const updatedName = "Updated Agent Name";

      // Call the method under test
      const result = await testSetup.agentProxy.updateAgent(agentDTO.id, {
        name: updatedName,
      });

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const updatedAgent = result.value;
        expect(updatedAgent.id).toBe(agentDTO.id);
        expect(updatedAgent.name).toBe(updatedName);
        expect(updatedAgent.teamId).toBe(agentDTO.teamId);
        expect(updatedAgent.roleId).toBe(agentDTO.roleId);
      }

      // Verify the agent was updated in the database
      const dbAgent = await testSetup.prisma.agent.findUnique({
        where: { id: agentDTO.id },
      });

      expect(dbAgent).not.toBeNull();
      expect(dbAgent?.name).toBe(updatedName);
    });

    it("should update an agent's team", async () => {
      // Set up test data for the original agent
      const { agentDTO } = await createTestData(testSetup.prisma);

      // Create the agent in the database
      await testSetup.agentProxy.createAgent(agentDTO);

      // Create a new team for the update
      const newTeamId = randomUUID();
      await testSetup.prisma.team.create({
        data: {
          id: newTeamId,
          name: "New Test Team",
          phase: {
            create: {
              id: randomUUID(),
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
          },
        },
      });

      // Call the method under test
      const result = await testSetup.agentProxy.updateAgent(agentDTO.id, {
        teamId: newTeamId,
      });

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const updatedAgent = result.value;
        expect(updatedAgent.id).toBe(agentDTO.id);
        expect(updatedAgent.name).toBe(agentDTO.name);
        expect(updatedAgent.teamId).toBe(newTeamId);
        expect(updatedAgent.roleId).toBe(agentDTO.roleId);
      }

      // Verify the agent was updated in the database
      const dbAgent = await testSetup.prisma.agent.findUnique({
        where: { id: agentDTO.id },
      });

      expect(dbAgent).not.toBeNull();
      expect(dbAgent?.teamId).toBe(newTeamId);
    });

    it("should update an agent's role", async () => {
      // Set up test data for the original agent
      const { agentDTO } = await createTestData(testSetup.prisma);

      // Create the agent in the database
      await testSetup.agentProxy.createAgent(agentDTO);

      // Create a new role for the update
      const newRoleId = randomUUID();
      const uniqueRoleName = `New Test Role ${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await testSetup.prisma.role.create({
        data: {
          id: newRoleId,
          name: uniqueRoleName,
        },
      });

      // Call the method under test
      const result = await testSetup.agentProxy.updateAgent(agentDTO.id, {
        roleId: newRoleId,
      });

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const updatedAgent = result.value;
        expect(updatedAgent.id).toBe(agentDTO.id);
        expect(updatedAgent.name).toBe(agentDTO.name);
        expect(updatedAgent.teamId).toBe(agentDTO.teamId);
        expect(updatedAgent.roleId).toBe(newRoleId);
      }

      // Verify the agent was updated in the database
      const dbAgent = await testSetup.prisma.agent.findUnique({
        where: { id: agentDTO.id },
      });

      expect(dbAgent).not.toBeNull();
      expect(dbAgent?.roleId).toBe(newRoleId);
    });

    it("should return an error when agent does not exist", async () => {
      // Generate a random ID that doesn't exist in the database
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.agentProxy.updateAgent(nonExistentId, {
        name: "Updated Name",
      });

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        const error = result.error;
        expect(error.message).toBe(`Agent with ID ${nonExistentId} not found`);
      }
    });
  });

  describe("deleteAgent", () => {
    it("should delete an agent from the database", async () => {
      // Set up test data
      const { agentDTO } = await createTestData(testSetup.prisma);

      // Create the agent in the database
      await testSetup.agentProxy.createAgent(agentDTO);

      // Verify the agent exists before deletion
      const agentBeforeDeletion = await testSetup.prisma.agent.findUnique({
        where: { id: agentDTO.id },
      });
      expect(agentBeforeDeletion).not.toBeNull();

      // Call the method under test
      const result = await testSetup.agentProxy.deleteAgent(agentDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        expect(result.value).toBe(true);
      }

      // Verify the agent was deleted from the database
      const agentAfterDeletion = await testSetup.prisma.agent.findUnique({
        where: { id: agentDTO.id },
      });
      expect(agentAfterDeletion).toBeNull();
    });

    it("should return an error when agent does not exist", async () => {
      // Generate a random ID that doesn't exist in the database
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.agentProxy.deleteAgent(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        const error = result.error;
        expect(error.message).toBe(`Agent with ID ${nonExistentId} not found`);
      }
    });
  });
});
