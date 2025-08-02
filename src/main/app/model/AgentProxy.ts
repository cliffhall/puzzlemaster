import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { PrismaClient } from "db";
import { Agent, AgentDTO } from "../../../types/domain/Agent";
import { Result, ok, err } from "neverthrow";
import { DomainError } from "../../../types/domain/DomainError";

// For production code, use a singleton instance
const prisma = new PrismaClient();

export class AgentProxy extends Proxy {
  static NAME: string = "AgentProxy";
  private prismaClient: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    super(AgentProxy.NAME, process);
    this.prismaClient = prismaClient || prisma;
  }

  /**
   * Create a new agent in the database
   * @param agentDTO The agent data transfer object
   * @returns A Result containing the created agent or a DomainError
   */
  public async createAgent(
    agentDTO: AgentDTO,
  ): Promise<Result<Agent, DomainError>> {
    try {
      const agent = await this.prismaClient.agent.create({
        data: {
          id: agentDTO.id,
          name: agentDTO.name,
          team: {
            connect: { id: agentDTO.teamId },
          },
          role: {
            connect: { id: agentDTO.roleId },
          },
        },
      });

      return Agent.create({
        id: agent.id,
        name: agent.name,
        teamId: agent.teamId,
        roleId: agent.roleId,
        tasks: [],
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to create agent", error));
    }
  }

  /**
   * Get an agent by ID
   * @param id The agent ID
   * @returns A Result containing the agent or a DomainError
   */
  public async getAgent(id: string): Promise<Result<Agent, DomainError>> {
    try {
      const agent = await this.prismaClient.agent.findUnique({
        where: { id },
        include: {
          tasks: true,
        },
      });

      if (!agent) {
        return err(new DomainError(`Agent with ID ${id} not found`));
      }

      return Agent.create({
        id: agent.id,
        name: agent.name,
        teamId: agent.teamId,
        roleId: agent.roleId,
        tasks: agent.tasks.map((task) => task.id),
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to get agent", error));
    }
  }

  /**
   * Get all agents
   * @returns A Result containing an array of agents or a DomainError
   */
  public async getAgents(): Promise<Result<Agent[], DomainError>> {
    try {
      const agents = await this.prismaClient.agent.findMany({
        include: {
          tasks: true,
        },
      });

      const agentResults = agents.map((agent) =>
        Agent.create({
          id: agent.id,
          name: agent.name,
          teamId: agent.teamId,
          roleId: agent.roleId,
          tasks: agent.tasks.map((task) => task.id),
        }),
      );

      // Process the results using neverthrow's combinatorial functions
      // Use the .combine method to safely combine all results or return the first error
      return Result.combine(agentResults);
    } catch (error) {
      return err(DomainError.fromError("Failed to get agents", error));
    }
  }

  /**
   * Update an agent
   * @param id The agent ID
   * @param agentDTO The agent data transfer object
   * @returns A Result containing the updated agent or a DomainError
   */
  public async updateAgent(
    id: string,
    agentDTO: Partial<AgentDTO>,
  ): Promise<Result<Agent, DomainError>> {
    try {
      // First check if the agent exists
      const existingAgent = await this.prismaClient.agent.findUnique({
        where: { id },
        include: {
          tasks: true,
        },
      });

      if (!existingAgent) {
        return err(new DomainError(`Agent with ID ${id} not found`));
      }

      // Prepare update data
      const updateData: {
        name?: string;
        team?: { connect: { id: string } };
        role?: { connect: { id: string } };
      } = {};
      if (agentDTO.name) updateData.name = agentDTO.name;
      if (agentDTO.teamId)
        updateData.team = { connect: { id: agentDTO.teamId } };
      if (agentDTO.roleId)
        updateData.role = { connect: { id: agentDTO.roleId } };

      // Update the agent
      const agent = await this.prismaClient.agent.update({
        where: { id },
        data: updateData,
        include: {
          tasks: true,
        },
      });

      return Agent.create({
        id: agent.id,
        name: agent.name,
        teamId: agent.teamId,
        roleId: agent.roleId,
        tasks: agent.tasks.map((task) => task.id),
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to update agent", error));
    }
  }

  /**
   * Delete an agent
   * @param id The agent ID
   * @returns A Result containing a success boolean or a DomainError
   */
  public async deleteAgent(id: string): Promise<Result<boolean, DomainError>> {
    try {
      // First check if the agent exists
      const existingAgent = await this.prismaClient.agent.findUnique({
        where: { id },
      });

      if (!existingAgent) {
        return err(new DomainError(`Agent with ID ${id} not found`));
      }

      // Delete the agent
      await this.prismaClient.agent.delete({
        where: { id },
      });

      return ok(true);
    } catch (error) {
      return err(DomainError.fromError("Failed to delete agent", error));
    }
  }
}
