import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { DomainError } from "../../../types/domain/DomainError";
import { Team, TeamDTO } from "../../../types/domain/Team";
import { Result, ok, err } from "neverthrow";
import { PrismaClient } from "db";

// For production code, use a singleton instance
const prisma = new PrismaClient();

export class TeamProxy extends Proxy {
  static NAME: string = "TeamProxy";
  private prismaClient: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    super(TeamProxy.NAME, process);
    this.prismaClient = prismaClient || prisma;
  }

  /**
   * Create a new team in the database
   * @param teamDTO The team data transfer object
   * @returns A Result containing the created team or a DomainError
   */
  public async createTeam(
    teamDTO: TeamDTO,
  ): Promise<Result<Team, DomainError>> {
    try {
      const team = await this.prismaClient.team.create({
        data: {
          id: teamDTO.id,
          name: teamDTO.name,
          phase: {
            connect: { id: teamDTO.phaseId },
          },
        },
      });

      return Team.create({
        id: team.id,
        name: team.name,
        phaseId: team.phaseId,
        agents: [],
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to create team", error));
    }
  }

  /**
   * Get a team by ID
   * @param id The team ID
   * @returns A Result containing the team or a DomainError
   */
  public async getTeam(id: string): Promise<Result<Team, DomainError>> {
    try {
      const team = await this.prismaClient.team.findUnique({
        where: { id },
        include: {
          agents: true,
        },
      });

      if (!team) {
        return err(new DomainError(`Team with ID ${id} not found`));
      }

      return Team.create({
        id: team.id,
        name: team.name,
        phaseId: team.phaseId,
        agents: team.agents.map((agent) => agent.id),
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to get team", error));
    }
  }

  /**
   * Get all teams
   * @returns A Result containing an array of teams or a DomainError
   */
  public async getTeams(): Promise<Result<Team[], DomainError>> {
    try {
      const teams = await this.prismaClient.team.findMany({
        include: {
          agents: true,
        },
      });

      const teamResults = teams.map((team) =>
        Team.create({
          id: team.id,
          name: team.name,
          phaseId: team.phaseId,
          agents: team.agents.map((agent) => agent.id),
        }),
      );

      // Process the results using neverthrow's combinatorial functions
      // Use the .combine method to safely combine all results or return the first error
      return Result.combine(teamResults);
    } catch (error) {
      return err(DomainError.fromError("Failed to get teams", error));
    }
  }

  /**
   * Update a team
   * @param id The team ID
   * @param teamDTO The team data transfer object (can be only fields that changed)
   * @returns A Result containing the updated team or a DomainError
   */
  public async updateTeam(
    id: string,
    teamDTO: Partial<TeamDTO>,
  ): Promise<Result<Team, DomainError>> {
    try {
      // First check if the team exists
      const existingTeam = await this.prismaClient.team.findUnique({
        where: { id },
        include: {
          agents: true,
        },
      });

      if (!existingTeam) {
        return err(new DomainError(`Team with ID ${id} not found`));
      }

      // Prepare update data
      const updateData: {
        name?: string;
        phase?: { connect: { id: string } };
      } = {};
      if (teamDTO.name) updateData.name = teamDTO.name;
      if (teamDTO.phaseId)
        updateData.phase = { connect: { id: teamDTO.phaseId } };

      // Update the team
      const team = await this.prismaClient.team.update({
        where: { id },
        data: updateData,
        include: {
          agents: true,
        },
      });

      return Team.create({
        id: team.id,
        name: team.name,
        phaseId: team.phaseId,
        agents: team.agents.map((agent) => agent.id),
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to update team", error));
    }
  }

  /**
   * Delete a team
   * @param id The team ID
   * @returns A Result containing a success boolean or a DomainError
   */
  public async deleteTeam(id: string): Promise<Result<boolean, DomainError>> {
    try {
      // First check if the team exists
      const existingTeam = await this.prismaClient.team.findUnique({
        where: { id },
      });

      if (!existingTeam) {
        return err(new DomainError(`Team with ID ${id} not found`));
      }

      // Delete the team
      await this.prismaClient.team.delete({
        where: { id },
      });

      return ok(true);
    } catch (error) {
      return err(DomainError.fromError("Failed to delete team", error));
    }
  }
}
