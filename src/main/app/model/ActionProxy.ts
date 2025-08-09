import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { Action, ActionDTO } from "../../../types/domain/Action";
import { DomainError } from "../../../types/domain/DomainError";
import { Result, ok, err } from "neverthrow";
import { PrismaClient } from "db";

// For production code, use a singleton instance
const prisma = new PrismaClient();

export class ActionProxy extends Proxy {
  static NAME: string = "ActionProxy";
  private prismaClient: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    super(ActionProxy.NAME, process);
    this.prismaClient = prismaClient || prisma;
  }

  /**
   * Create a new action in the database
   * @param actionDTO The action data transfer object
   * @returns A Result containing the created action or a DomainError
   */
  public async createAction(
    actionDTO: ActionDTO,
  ): Promise<Result<Action, DomainError>> {
    try {
      const action = await this.prismaClient.action.create({
        data: {
          id: actionDTO.id,
          name: actionDTO.name,
          phase: {
            connect: { id: actionDTO.phaseId },
          },
          targetPhase: {
            connect: { id: actionDTO.targetPhaseId },
          },
          validator: {
            connect: { id: actionDTO.validatorId },
          },
        },
      });

      return Action.create({
        id: action.id,
        name: action.name,
        phaseId: action.phaseId,
        targetPhaseId: action.targetPhaseId,
        validatorId: action.validatorId,
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to create action", error));
    }
  }

  /**
   * Get an action by ID
   * @param id The action ID
   * @returns A Result containing the action or a DomainError
   */
  public async getAction(id: string): Promise<Result<Action, DomainError>> {
    try {
      const action = await this.prismaClient.action.findUnique({
        where: { id },
      });

      if (!action) {
        return err(new DomainError(`Action with ID ${id} not found`));
      }

      return Action.create({
        id: action.id,
        name: action.name,
        phaseId: action.phaseId,
        targetPhaseId: action.targetPhaseId,
        validatorId: action.validatorId,
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to get action", error));
    }
  }

  /**
   * Get all actions
   * @returns A Result containing an array of actions or a DomainError
   */
  public async getActions(): Promise<Result<Action[], DomainError>> {
    try {
      const actions = await this.prismaClient.action.findMany();

      const actionResults = actions.map((action) =>
        Action.create({
          id: action.id,
          name: action.name,
          phaseId: action.phaseId,
          targetPhaseId: action.targetPhaseId,
          validatorId: action.validatorId,
        }),
      );

      // Process the results using neverthrow's combinatorial functions
      // Use the .combine method to safely combine all results or return the first error
      return Result.combine(actionResults);
    } catch (error) {
      return err(DomainError.fromError("Failed to get actions", error));
    }
  }

  /**
   * Get actions by phase ID
   * @param phaseId The phase ID
   * @returns A Result containing an array of actions or a DomainError
   */
  public async getActionsByPhase(
    phaseId: string,
  ): Promise<Result<Action[], DomainError>> {
    try {
      const actions = await this.prismaClient.action.findMany({
        where: { phaseId },
      });

      const actionResults = actions.map((action) =>
        Action.create({
          id: action.id,
          name: action.name,
          phaseId: action.phaseId,
          targetPhaseId: action.targetPhaseId,
          validatorId: action.validatorId,
        }),
      );

      return Result.combine(actionResults);
    } catch (error) {
      return err(
        DomainError.fromError(
          `Failed to get actions for phase ${phaseId}`,
          error,
        ),
      );
    }
  }

  /**
   * Update an action
   * @param id The action ID
   * @param actionDTO The action data transfer object (can be only fields that changed)
   * @returns A Result containing the updated action or a DomainError
   */
  public async updateAction(
    id: string,
    actionDTO: Partial<ActionDTO>,
  ): Promise<Result<Action, DomainError>> {
    try {
      // First check if the action exists
      const existingAction = await this.prismaClient.action.findUnique({
        where: { id },
      });

      if (!existingAction) {
        return err(new DomainError(`Action with ID ${id} not found`));
      }

      // Prepare update data
      const updateData: {
        name?: string;
        phase?: { connect: { id: string } };
        targetPhase?: { connect: { id: string } };
        validator?: { connect: { id: string } };
      } = {};
      if (actionDTO.name) updateData.name = actionDTO.name;
      if (actionDTO.phaseId)
        updateData.phase = { connect: { id: actionDTO.phaseId } };
      if (actionDTO.targetPhaseId)
        updateData.targetPhase = { connect: { id: actionDTO.targetPhaseId } };
      if (actionDTO.validatorId)
        updateData.validator = { connect: { id: actionDTO.validatorId } };

      // Update the action
      const action = await this.prismaClient.action.update({
        where: { id },
        data: updateData,
      });

      return Action.create({
        id: action.id,
        name: action.name,
        phaseId: action.phaseId,
        targetPhaseId: action.targetPhaseId,
        validatorId: action.validatorId,
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to update action", error));
    }
  }

  /**
   * Delete an action
   * @param id The action ID
   * @returns A Result containing a success boolean or a DomainError
   */
  public async deleteAction(id: string): Promise<Result<boolean, DomainError>> {
    try {
      // First check if the action exists
      const existingAction = await this.prismaClient.action.findUnique({
        where: { id },
      });

      if (!existingAction) {
        return err(new DomainError(`Action with ID ${id} not found`));
      }

      // Delete the action
      await this.prismaClient.action.delete({
        where: { id },
      });

      return ok(true);
    } catch (error) {
      return err(DomainError.fromError("Failed to delete action", error));
    }
  }
}
