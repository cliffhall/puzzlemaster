import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { Phase, PhaseDTO, DomainError } from "../../../domain";
import { Result, ok, err } from "neverthrow";
import { PrismaClient } from "db";

// For production code, use a singleton instance
const prisma = new PrismaClient();

export class PhaseProxy extends Proxy {
  static NAME: string = "PhaseProxy";
  private prismaClient: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    super(PhaseProxy.NAME, process);
    this.prismaClient = prismaClient || prisma;
  }

  /**
   * Create a new phase in the database
   * @param phaseDTO The phase data transfer object
   * @returns A Result containing the created phase or a DomainError
   */
  public async createPhase(
    phaseDTO: PhaseDTO,
  ): Promise<Result<Phase, DomainError>> {
    try {
      const phase = await this.prismaClient.phase.create({
        data: {
          id: phaseDTO.id,
          name: phaseDTO.name,
          plan: {
            connect: { id: phaseDTO.planId },
          },
        },
      });

      return Phase.create({
        id: phase.id,
        name: phase.name,
        planId: phase.planId,
        actions: [],
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to create phase", error));
    }
  }

  /**
   * Get a phase by ID
   * @param id The phase ID
   * @returns A Result containing the phase or a DomainError
   */
  public async getPhase(id: string): Promise<Result<Phase, DomainError>> {
    try {
      const phase = await this.prismaClient.phase.findUnique({
        where: { id },
        include: {
          actions: true,
        },
      });

      if (!phase) {
        return err(new DomainError(`Phase with ID ${id} not found`));
      }

      return Phase.create({
        id: phase.id,
        name: phase.name,
        planId: phase.planId,
        actions: phase.actions.map((action) => action.id),
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to get phase", error));
    }
  }

  /**
   * Get all phases
   * @returns A Result containing an array of phases or a DomainError
   */
  public async getPhases(): Promise<Result<Phase[], DomainError>> {
    try {
      const phases = await this.prismaClient.phase.findMany({
        include: {
          actions: true,
        },
      });

      const phaseResults = phases.map((phase) =>
        Phase.create({
          id: phase.id,
          name: phase.name,
          planId: phase.planId,
          actions: phase.actions.map((action) => action.id),
        }),
      );

      // Process the results using neverthrow's combinatorial functions
      // Use the .combine method to safely combine all results or return the first error
      return Result.combine(phaseResults);
    } catch (error) {
      return err(DomainError.fromError("Failed to get phases", error));
    }
  }

  /**
   * Update a phase
   * @param id The phase ID
   * @param phaseDTO The phase data transfer object (can be only fields that changed)
   * @returns A Result containing the updated phase or a DomainError
   */
  public async updatePhase(
    id: string,
    phaseDTO: Partial<PhaseDTO>,
  ): Promise<Result<Phase, DomainError>> {
    try {
      // First check if the phase exists
      const existingPhase = await this.prismaClient.phase.findUnique({
        where: { id },
        include: {
          actions: true,
        },
      });

      if (!existingPhase) {
        return err(new DomainError(`Phase with ID ${id} not found`));
      }

      // Prepare update data
      const updateData: {
        name?: string;
        plan?: { connect: { id: string } };
      } = {};
      if (phaseDTO.name) updateData.name = phaseDTO.name;
      if (phaseDTO.planId)
        updateData.plan = { connect: { id: phaseDTO.planId } };

      // Update the phase
      const phase = await this.prismaClient.phase.update({
        where: { id },
        data: updateData,
        include: {
          actions: true,
        },
      });

      return Phase.create({
        id: phase.id,
        name: phase.name,
        planId: phase.planId,
        actions: phase.actions.map((action) => action.id),
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to update phase", error));
    }
  }

  /**
   * Delete a phase
   * @param id The phase ID
   * @returns A Result containing a success boolean or a DomainError
   */
  public async deletePhase(id: string): Promise<Result<boolean, DomainError>> {
    try {
      // First check if the phase exists
      const existingPhase = await this.prismaClient.phase.findUnique({
        where: { id },
      });

      if (!existingPhase) {
        return err(new DomainError(`Phase with ID ${id} not found`));
      }

      // Delete the phase
      await this.prismaClient.phase.delete({
        where: { id },
      });

      return ok(true);
    } catch (error) {
      return err(DomainError.fromError("Failed to delete phase", error));
    }
  }
}
