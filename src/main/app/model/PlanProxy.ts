import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { Plan, PlanDTO, DomainError } from "../../../domain";
import { Result, ok, err } from "neverthrow";
import { PrismaClient } from "db";

// For production code, use a singleton instance
const prisma = new PrismaClient();

export class PlanProxy extends Proxy {
  static NAME: string = "PlanProxy";
  private prismaClient: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    super(PlanProxy.NAME, process);
    this.prismaClient = prismaClient || prisma;
  }

  /**
   * Create a new plan in the database
   * @param planDTO The plan data transfer object
   * @returns A Result containing the created plan or a DomainError
   */
  public async createPlan(
    planDTO: PlanDTO,
  ): Promise<Result<Plan, DomainError>> {
    try {
      const plan = await this.prismaClient.plan.create({
        data: {
          id: planDTO.id,
          projectId: planDTO.projectId,
          description: planDTO.description,
        },
      });

      return Plan.create({
        id: plan.id,
        projectId: plan.projectId,
        description: plan.description,
        phases: [],
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to create plan", error));
    }
  }

  /**
   * Get a plan by ID
   * @param id The plan ID
   * @returns A Result containing the plan or a DomainError
   */
  public async getPlan(id: string): Promise<Result<Plan, DomainError>> {
    try {
      const plan = await this.prismaClient.plan.findUnique({
        where: { id },
        include: {
          phases: true,
        },
      });

      if (!plan) {
        return err(new DomainError(`Plan with ID ${id} not found`));
      }

      return Plan.create({
        id: plan.id,
        projectId: plan.projectId,
        description: plan.description,
        phases: plan.phases.map((phase) => phase.id),
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to get plan", error));
    }
  }

  /**
   * Get all plans
   * @returns A Result containing an array of plans or a DomainError
   */
  public async getPlans(): Promise<Result<Plan[], DomainError>> {
    try {
      const plans = await this.prismaClient.plan.findMany({
        include: {
          phases: true,
        },
      });

      const planResults = plans.map((plan) =>
        Plan.create({
          id: plan.id,
          projectId: plan.projectId,
          description: plan.description,
          phases: plan.phases.map((phase) => phase.id),
        }),
      );

      // Process the results using neverthrow's combinatorial functions
      // Use the .combine method to safely combine all results or return the first error
      return Result.combine(planResults);
    } catch (error) {
      return err(DomainError.fromError("Failed to get plans", error));
    }
  }

  /**
   * Update a plan
   * @param id The plan ID
   * @param planDTO The plan data transfer object (can be only fields that changed)
   * @returns A Result containing the updated plan or a DomainError
   */
  public async updatePlan(
    id: string,
    planDTO: Partial<PlanDTO>,
  ): Promise<Result<Plan, DomainError>> {
    try {
      // First check if the plan exists
      const existingPlan = await this.prismaClient.plan.findUnique({
        where: { id },
        include: {
          phases: true,
        },
      });

      if (!existingPlan) {
        return err(new DomainError(`Plan with ID ${id} not found`));
      }

      // Prepare update data
      const updateData: {
        projectId?: string;
        description?: string;
      } = {};
      if (planDTO.projectId) updateData.projectId = planDTO.projectId;
      if (planDTO.description !== undefined)
        updateData.description = planDTO.description;

      // Update the plan
      const plan = await this.prismaClient.plan.update({
        where: { id },
        data: updateData,
        include: {
          phases: true,
        },
      });

      return Plan.create({
        id: plan.id,
        projectId: plan.projectId,
        description: plan.description,
        phases: plan.phases.map((phase) => phase.id),
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to update plan", error));
    }
  }

  /**
   * Delete a plan
   * @param id The plan ID
   * @returns A Result containing a success boolean or a DomainError
   */
  public async deletePlan(id: string): Promise<Result<boolean, DomainError>> {
    try {
      // First check if the plan exists
      const existingPlan = await this.prismaClient.plan.findUnique({
        where: { id },
      });

      if (!existingPlan) {
        return err(new DomainError(`Plan with ID ${id} not found`));
      }

      // Delete the plan
      await this.prismaClient.plan.delete({
        where: { id },
      });

      return ok(true);
    } catch (error) {
      return err(DomainError.fromError("Failed to delete plan", error));
    }
  }
}
