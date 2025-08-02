import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createTestAgentProxy } from "../../../../test/agent-proxy-test-helper";
import { randomUUID } from "crypto";
import { AgentDTO } from "../../../../types/domain/Agent";
import { PrismaClient } from "db";
import { AgentProxy } from "../AgentProxy";

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
      // First create required related entities (team and role)
      const teamId = randomUUID();
      const roleId = randomUUID();

      await testSetup.prisma.team.create({
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

      await testSetup.prisma.role.create({
        data: {
          id: roleId,
          name: "Test Role",
        },
      });

      // Create the agent DTO
      const agentDTO: AgentDTO = {
        id: randomUUID(),
        name: "Test Agent",
        teamId,
        roleId,
        tasks: [],
      };

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
      // Setup: Create an agent in the database
      // (Similar setup code as in the createAgent test)
      // Test implementation would go here
    });

    it("should return an error when agent does not exist", async () => {
      // Test implementation would go here
    });
  });

  // Additional test cases for getAgents, updateAgent, deleteAgent would go here
});
