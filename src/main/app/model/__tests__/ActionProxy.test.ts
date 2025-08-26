import { createTestActionProxy } from "./helpers/action-proxy-test-helper";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ActionDTO } from "../../../../domain";
import { ActionProxy } from "../ActionProxy";
import { randomUUID } from "crypto";
import { PrismaClient } from "db";

/**
 * Helper function to create test data (phase, validator, and action)
 * @returns An object containing the created IDs and the action DTO
 */
async function createTestData(prisma: PrismaClient): Promise<{
  phaseId: string;
  targetPhaseId: string;
  validatorId: string;
  actionId: string;
  actionDTO: ActionDTO;
}> {
  try {
    // Create a project with a nested plan and phases
    const projectId = randomUUID();
    const planId = randomUUID();
    const phaseId = randomUUID();
    const targetPhaseId = randomUUID();

    await prisma.project.create({
      data: {
        id: projectId,
        name: "Test Project",
        plan: {
          create: {
            id: planId,
            phases: {
              create: [
                {
                  id: phaseId,
                  name: "Source Phase",
                },
                {
                  id: targetPhaseId,
                  name: "Target Phase",
                },
              ],
            },
          },
        },
      },
    });

    // Create validator
    const validatorId = randomUUID();
    await prisma.validator.create({
      data: {
        id: validatorId,
        template: "Test Template",
        resource: "Test Resource",
      },
    });

    // Create action DTO
    const actionId = randomUUID();
    const actionDTO: ActionDTO = {
      id: actionId,
      name: "Test Action",
      phaseId,
      targetPhaseId,
      validatorId,
    };

    return { phaseId, targetPhaseId, validatorId, actionId, actionDTO };
  } catch (error) {
    console.error("Error in createTestData:", error);
    throw error;
  }
}

describe("ActionProxy", () => {
  let testSetup: {
    prisma: PrismaClient;
    actionProxy: ActionProxy;
    cleanup: () => Promise<void>;
  };

  beforeEach(async () => {
    testSetup = await createTestActionProxy();
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  describe("createAction", () => {
    it("should create an action in the database", async () => {
      // Set up test data
      const { actionDTO } = await createTestData(testSetup.prisma);

      // Call the method under test
      const result = await testSetup.actionProxy.createAction(actionDTO);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const action = result.value;
        expect(action.id).toBe(actionDTO.id);
        expect(action.name).toBe(actionDTO.name);
        expect(action.phaseId).toBe(actionDTO.phaseId);
        expect(action.targetPhaseId).toBe(actionDTO.targetPhaseId);
        expect(action.validatorId).toBe(actionDTO.validatorId);
      }

      // Verify the action was created in the database
      const dbAction = await testSetup.prisma.action.findUnique({
        where: { id: actionDTO.id },
      });

      expect(dbAction).not.toBeNull();
      expect(dbAction?.name).toBe(actionDTO.name);
    });

    it("should return an error when creation fails with invalid data", async () => {
      // Create an action with an invalid validator ID
      const invalidActionDTO: ActionDTO = {
        id: randomUUID(),
        name: "Invalid Action",
        phaseId: randomUUID(), // Non-existent phase ID
        targetPhaseId: randomUUID(), // Non-existent target phase ID
        validatorId: randomUUID(), // Non-existent validator ID
      };

      // Call the method under test
      const result = await testSetup.actionProxy.createAction(invalidActionDTO);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        const error = result.error;
        expect(error.message).toContain("Failed to create action");
      }
    });
  });

  describe("getAction", () => {
    it("should retrieve an action from the database", async () => {
      // Set up test data
      const { actionDTO } = await createTestData(testSetup.prisma);

      // Create the action in the database
      await testSetup.actionProxy.createAction(actionDTO);

      // Call the method under test
      const result = await testSetup.actionProxy.getAction(actionDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const action = result.value;
        expect(action.id).toBe(actionDTO.id);
        expect(action.name).toBe(actionDTO.name);
        expect(action.phaseId).toBe(actionDTO.phaseId);
        expect(action.targetPhaseId).toBe(actionDTO.targetPhaseId);
        expect(action.validatorId).toBe(actionDTO.validatorId);
      }
    });

    it("should return an error when action does not exist", async () => {
      // Generate a random ID that doesn't exist in the database
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.actionProxy.getAction(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        const error = result.error;
        expect(error.message).toBe(`Action with ID ${nonExistentId} not found`);
      }
    });
  });

  describe("getActions", () => {
    it("should retrieve all actions from the database", async () => {
      // Set up test data for multiple actions
      const { actionDTO: action1DTO } = await createTestData(testSetup.prisma);
      const { actionDTO: action2DTO } = await createTestData(testSetup.prisma);

      // Create the actions in the database
      await testSetup.actionProxy.createAction(action1DTO);
      await testSetup.actionProxy.createAction(action2DTO);

      // Call the method under test
      const result = await testSetup.actionProxy.getActions();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const actions = result.value;
        expect(actions.length).toBe(2);

        // Find the actions in the result by ID
        const foundAction1 = actions.find(
          (action) => action.id === action1DTO.id,
        );
        const foundAction2 = actions.find(
          (action) => action.id === action2DTO.id,
        );

        // Verify both actions were found
        expect(foundAction1).toBeDefined();
        expect(foundAction2).toBeDefined();

        // Verify action properties
        if (foundAction1) {
          expect(foundAction1.name).toBe(action1DTO.name);
          expect(foundAction1.phaseId).toBe(action1DTO.phaseId);
          expect(foundAction1.targetPhaseId).toBe(action1DTO.targetPhaseId);
          expect(foundAction1.validatorId).toBe(action1DTO.validatorId);
        }

        if (foundAction2) {
          expect(foundAction2.name).toBe(action2DTO.name);
          expect(foundAction2.phaseId).toBe(action2DTO.phaseId);
          expect(foundAction2.targetPhaseId).toBe(action2DTO.targetPhaseId);
          expect(foundAction2.validatorId).toBe(action2DTO.validatorId);
        }
      }
    });

    it("should return an empty array when no actions exist", async () => {
      // Call the method under test (without creating any actions)
      const result = await testSetup.actionProxy.getActions();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const actions = result.value;
        expect(actions).toEqual([]);
      }
    });
  });

  describe("getActionsByPhase", () => {
    it("should retrieve actions for a specific phase", async () => {
      // Set up test data for the first action
      const { actionDTO: action1DTO, phaseId } = await createTestData(
        testSetup.prisma,
      );

      // Create the first action in the database
      await testSetup.actionProxy.createAction(action1DTO);

      // Create a second action with the same phaseId
      // We need to create a validator for the second action
      const validatorId = randomUUID();
      await testSetup.prisma.validator.create({
        data: {
          id: validatorId,
          template: "Second Test Template",
          resource: "Second Test Resource",
        },
      });

      // Get the plan ID from the first phase
      const planId = (await testSetup.prisma.phase.findUnique({
        where: { id: phaseId },
        select: { planId: true },
      }))!.planId;

      // Create a target phase for the second action
      const targetPhaseId = randomUUID();
      await testSetup.prisma.phase.create({
        data: {
          id: targetPhaseId,
          name: "Second Target Phase",
          planId, // Use the same plan as the first phase
        },
      });

      // Create the second action DTO
      const action2DTO: ActionDTO = {
        id: randomUUID(),
        name: "Second Test Action",
        phaseId, // Same phase ID as action1
        targetPhaseId,
        validatorId,
      };

      // Create the second action in the database
      await testSetup.actionProxy.createAction(action2DTO);

      // Call the method under test
      const result = await testSetup.actionProxy.getActionsByPhase(phaseId);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const actions = result.value;
        expect(actions.length).toBe(2);

        // All actions should have the same phaseId
        actions.forEach((action) => {
          expect(action.phaseId).toBe(phaseId);
        });

        // Verify we can find both actions
        const foundAction1 = actions.find(
          (action) => action.id === action1DTO.id,
        );
        const foundAction2 = actions.find(
          (action) => action.id === action2DTO.id,
        );

        expect(foundAction1).toBeDefined();
        expect(foundAction2).toBeDefined();
      }
    });

    it("should return an empty array when no actions exist for the phase", async () => {
      // Create a phase with no actions using nested creation
      const projectId = randomUUID();
      const planId = randomUUID();
      const emptyPhaseId = randomUUID();

      await testSetup.prisma.project.create({
        data: {
          id: projectId,
          name: "Empty Project",
          plan: {
            create: {
              id: planId,
              phases: {
                create: [
                  {
                    id: emptyPhaseId,
                    name: "Empty Phase",
                  },
                ],
              },
            },
          },
        },
      });

      // Call the method under test
      const result =
        await testSetup.actionProxy.getActionsByPhase(emptyPhaseId);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const actions = result.value;
        expect(actions).toEqual([]);
      }
    });
  });

  describe("updateAction", () => {
    it("should update an action's name", async () => {
      // Set up test data
      const { actionDTO } = await createTestData(testSetup.prisma);

      // Create the action in the database
      await testSetup.actionProxy.createAction(actionDTO);

      // Prepare update data
      const updatedName = "Updated Action Name";

      // Call the method under test
      const result = await testSetup.actionProxy.updateAction(actionDTO.id, {
        name: updatedName,
      });

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const updatedAction = result.value;
        expect(updatedAction.id).toBe(actionDTO.id);
        expect(updatedAction.name).toBe(updatedName);
        expect(updatedAction.phaseId).toBe(actionDTO.phaseId);
        expect(updatedAction.targetPhaseId).toBe(actionDTO.targetPhaseId);
        expect(updatedAction.validatorId).toBe(actionDTO.validatorId);
      }

      // Verify the action was updated in the database
      const dbAction = await testSetup.prisma.action.findUnique({
        where: { id: actionDTO.id },
      });

      expect(dbAction).not.toBeNull();
      expect(dbAction?.name).toBe(updatedName);
    });

    it("should update an action's target phase", async () => {
      // Set up test data
      const { actionDTO } = await createTestData(testSetup.prisma);

      // Create the action in the database
      await testSetup.actionProxy.createAction(actionDTO);

      // Create a new target phase using nested creation
      const projectId = randomUUID();
      const planId = randomUUID();
      const newTargetPhaseId = randomUUID();

      await testSetup.prisma.project.create({
        data: {
          id: projectId,
          name: "New Project",
          plan: {
            create: {
              id: planId,
              phases: {
                create: [
                  {
                    id: newTargetPhaseId,
                    name: "New Target Phase",
                  },
                ],
              },
            },
          },
        },
      });

      // Call the method under test
      const result = await testSetup.actionProxy.updateAction(actionDTO.id, {
        targetPhaseId: newTargetPhaseId,
      });

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const updatedAction = result.value;
        expect(updatedAction.id).toBe(actionDTO.id);
        expect(updatedAction.name).toBe(actionDTO.name);
        expect(updatedAction.phaseId).toBe(actionDTO.phaseId);
        expect(updatedAction.targetPhaseId).toBe(newTargetPhaseId);
        expect(updatedAction.validatorId).toBe(actionDTO.validatorId);
      }

      // Verify the action was updated in the database
      const dbAction = await testSetup.prisma.action.findUnique({
        where: { id: actionDTO.id },
      });

      expect(dbAction).not.toBeNull();
      expect(dbAction?.targetPhaseId).toBe(newTargetPhaseId);
    });

    it("should return an error when action does not exist", async () => {
      // Generate a random ID that doesn't exist in the database
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.actionProxy.updateAction(nonExistentId, {
        name: "Updated Name",
      });

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        const error = result.error;
        expect(error.message).toBe(`Action with ID ${nonExistentId} not found`);
      }
    });
  });

  describe("deleteAction", () => {
    it("should delete an action from the database", async () => {
      // Set up test data
      const { actionDTO } = await createTestData(testSetup.prisma);

      // Create the action in the database
      await testSetup.actionProxy.createAction(actionDTO);

      // Verify the action exists before deletion
      const actionBeforeDeletion = await testSetup.prisma.action.findUnique({
        where: { id: actionDTO.id },
      });
      expect(actionBeforeDeletion).not.toBeNull();

      // Call the method under test
      const result = await testSetup.actionProxy.deleteAction(actionDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        expect(result.value).toBe(true);
      }

      // Verify the action was deleted from the database
      const actionAfterDeletion = await testSetup.prisma.action.findUnique({
        where: { id: actionDTO.id },
      });
      expect(actionAfterDeletion).toBeNull();
    });

    it("should return an error when action does not exist", async () => {
      // Generate a random ID that doesn't exist in the database
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.actionProxy.deleteAction(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        const error = result.error;
        expect(error.message).toBe(`Action with ID ${nonExistentId} not found`);
      }
    });
  });
});
