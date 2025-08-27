import { createTestPlanProxy } from "./helpers/plan-proxy-test-helper";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { PlanDTO } from "../../../../domain";
import { PlanProxy } from "../PlanProxy";
import { randomUUID } from "crypto";
import { PrismaClient } from "db";

/**
 * Helper function to create test data (project and plan)
 * @returns An object containing the created IDs and the plan DTO
 */
async function createTestData(prisma: PrismaClient): Promise<{
  projectId: string;
  planId: string;
  planDTO: PlanDTO;
}> {
  // Create project
  const projectId = randomUUID();
  await prisma.project.create({
    data: {
      id: projectId,
      name: "Test Project",
    },
  });

  // Create plan DTO
  const planId = randomUUID();
  const planDTO: PlanDTO = {
    id: planId,
    projectId,
    description: "Test Plan Description",
    phases: [],
  };

  return { projectId, planId, planDTO };
}

describe("PlanProxy", () => {
  let testSetup: {
    prisma: PrismaClient;
    planProxy: PlanProxy;
    cleanup: () => Promise<void>;
  };

  beforeEach(async () => {
    testSetup = await createTestPlanProxy();
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  describe("createPlan", () => {
    it("should create a plan in the database", async () => {
      // Set up test data
      const { planDTO } = await createTestData(testSetup.prisma);

      // Call the method under test
      const result = await testSetup.planProxy.createPlan(planDTO);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const plan = result.value;
        expect(plan.id).toBe(planDTO.id);
        expect(plan.projectId).toBe(planDTO.projectId);
        expect(plan.description).toBe(planDTO.description);
        expect(plan.phases).toEqual([]);
      }

      // Verify the plan was created in the database
      const dbPlan = await testSetup.prisma.plan.findUnique({
        where: { id: planDTO.id },
      });

      expect(dbPlan).not.toBeNull();
      expect(dbPlan?.description).toBe(planDTO.description);
    });

  });

  describe("getPlan", () => {
    it("should retrieve a plan by ID", async () => {
      // Set up test data
      const { planDTO } = await createTestData(testSetup.prisma);
      await testSetup.planProxy.createPlan(planDTO);

      // Call the method under test
      const result = await testSetup.planProxy.getPlan(planDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const plan = result.value;
        expect(plan.id).toBe(planDTO.id);
        expect(plan.projectId).toBe(planDTO.projectId);
        expect(plan.description).toBe(planDTO.description);
        expect(plan.phases).toEqual([]);
      }
    });

    it("should return an error when plan is not found", async () => {
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.planProxy.getPlan(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain(
          `Plan with ID ${nonExistentId} not found`,
        );
      }
    });
  });

  describe("getPlans", () => {
    it("should retrieve all plans", async () => {
      // Set up test data - create multiple plans
      const { planDTO: planDTO1 } = await createTestData(testSetup.prisma);
      const { planDTO: planDTO2 } = await createTestData(testSetup.prisma);

      await testSetup.planProxy.createPlan(planDTO1);
      await testSetup.planProxy.createPlan(planDTO2);

      // Call the method under test
      const result = await testSetup.planProxy.getPlans();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const plans = result.value;
        expect(plans).toHaveLength(2);

        const planIds = plans.map((plan) => plan.id);
        expect(planIds).toContain(planDTO1.id);
        expect(planIds).toContain(planDTO2.id);
      }
    });

    it("should return empty array when no plans exist", async () => {
      // Call the method under test
      const result = await testSetup.planProxy.getPlans();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const plans = result.value;
        expect(plans).toHaveLength(0);
      }
    });
  });

  describe("updatePlan", () => {
    it("should update a plan's description", async () => {
      // Set up test data
      const { planDTO } = await createTestData(testSetup.prisma);
      await testSetup.planProxy.createPlan(planDTO);

      const updatedDescription = "Updated Plan Description";

      // Call the method under test
      const result = await testSetup.planProxy.updatePlan(planDTO.id, {
        description: updatedDescription,
      });

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const plan = result.value;
        expect(plan.id).toBe(planDTO.id);
        expect(plan.description).toBe(updatedDescription);
        expect(plan.projectId).toBe(planDTO.projectId);
      }

      // Verify the plan was updated in the database
      const dbPlan = await testSetup.prisma.plan.findUnique({
        where: { id: planDTO.id },
      });

      expect(dbPlan?.description).toBe(updatedDescription);
    });

    it("should update a plan's projectId", async () => {
      // Set up test data
      const { planDTO } = await createTestData(testSetup.prisma);
      await testSetup.planProxy.createPlan(planDTO);

      // Create another project
      const newProjectId = randomUUID();
      await testSetup.prisma.project.create({
        data: {
          id: newProjectId,
          name: "New Test Project",
        },
      });

      // Call the method under test
      const result = await testSetup.planProxy.updatePlan(planDTO.id, {
        projectId: newProjectId,
      });

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const plan = result.value;
        expect(plan.id).toBe(planDTO.id);
        expect(plan.projectId).toBe(newProjectId);
        expect(plan.description).toBe(planDTO.description);
      }
    });

    it("should return an error when plan is not found", async () => {
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.planProxy.updatePlan(nonExistentId, {
        description: "Updated Description",
      });

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain(
          `Plan with ID ${nonExistentId} not found`,
        );
      }
    });
  });

  describe("deletePlan", () => {
    it("should delete a plan", async () => {
      // Set up test data
      const { planDTO } = await createTestData(testSetup.prisma);
      await testSetup.planProxy.createPlan(planDTO);

      // Verify the plan exists
      const beforeDelete = await testSetup.prisma.plan.findUnique({
        where: { id: planDTO.id },
      });
      expect(beforeDelete).not.toBeNull();

      // Call the method under test
      const result = await testSetup.planProxy.deletePlan(planDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        expect(result.value).toBe(true);
      }

      // Verify the plan was deleted from the database
      const afterDelete = await testSetup.prisma.plan.findUnique({
        where: { id: planDTO.id },
      });
      expect(afterDelete).toBeNull();
    });

    it("should return an error when plan is not found", async () => {
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.planProxy.deletePlan(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain(
          `Plan with ID ${nonExistentId} not found`,
        );
      }
    });
  });
});
