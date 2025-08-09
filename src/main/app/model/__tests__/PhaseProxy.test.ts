import { createTestPhaseProxy } from "../../../../test/phase-proxy-test-helper";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { PhaseDTO } from "../../../../types/domain";
import { PhaseProxy } from "../PhaseProxy";
import { randomUUID } from "crypto";
import { PrismaClient } from "db";

/**
 * Helper function to create test data (project, plan, and phase)
 * @returns An object containing the created IDs and the phase DTO
 */
async function createTestData(prisma: PrismaClient): Promise<{
  projectId: string;
  planId: string;
  phaseId: string;
  phaseDTO: PhaseDTO;
}> {
  // Create project
  const projectId = randomUUID();
  await prisma.project.create({
    data: {
      id: projectId,
      name: "Test Project",
    },
  });

  // Create plan
  const planId = randomUUID();
  await prisma.plan.create({
    data: {
      id: planId,
      projectId,
      description: "Test Plan",
    },
  });

  // Create phase DTO
  const phaseId = randomUUID();
  const phaseDTO: PhaseDTO = {
    id: phaseId,
    name: "Test Phase",
    planId,
    actions: [],
  };

  return { projectId, planId, phaseId, phaseDTO };
}

describe("PhaseProxy", () => {
  let testSetup: {
    prisma: PrismaClient;
    phaseProxy: PhaseProxy;
    cleanup: () => Promise<void>;
  };

  beforeEach(async () => {
    testSetup = await createTestPhaseProxy();
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  describe("createPhase", () => {
    it("should create a phase in the database", async () => {
      // Set up test data
      const { phaseDTO } = await createTestData(testSetup.prisma);

      // Call the method under test
      const result = await testSetup.phaseProxy.createPhase(phaseDTO);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const phase = result.value;
        expect(phase.id).toBe(phaseDTO.id);
        expect(phase.name).toBe(phaseDTO.name);
        expect(phase.planId).toBe(phaseDTO.planId);
        expect(phase.actions).toEqual([]);
      }

      // Verify the phase was created in the database
      const dbPhase = await testSetup.prisma.phase.findUnique({
        where: { id: phaseDTO.id },
      });

      expect(dbPhase).not.toBeNull();
      expect(dbPhase?.name).toBe(phaseDTO.name);
    });
  });

  describe("getPhase", () => {
    it("should return a phase when it exists", async () => {
      // Set up test data
      const { phaseDTO } = await createTestData(testSetup.prisma);

      // Create the phase first
      await testSetup.phaseProxy.createPhase(phaseDTO);

      // Call the method under test
      const result = await testSetup.phaseProxy.getPhase(phaseDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const phase = result.value;
        expect(phase.id).toBe(phaseDTO.id);
        expect(phase.name).toBe(phaseDTO.name);
        expect(phase.planId).toBe(phaseDTO.planId);
      }
    });

    it("should return an error when phase does not exist", async () => {
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.phaseProxy.getPhase(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain("not found");
      }
    });
  });

  describe("getPhases", () => {
    it("should return all phases", async () => {
      // Set up test data - create multiple phases
      const { phaseDTO: phaseDTO1 } = await createTestData(testSetup.prisma);
      const { phaseDTO: phaseDTO2 } = await createTestData(testSetup.prisma);

      // Create the phases
      await testSetup.phaseProxy.createPhase(phaseDTO1);
      await testSetup.phaseProxy.createPhase(phaseDTO2);

      // Call the method under test
      const result = await testSetup.phaseProxy.getPhases();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const phases = result.value;
        expect(phases).toHaveLength(2);

        const phaseIds = phases.map((phase) => phase.id);
        expect(phaseIds).toContain(phaseDTO1.id);
        expect(phaseIds).toContain(phaseDTO2.id);
      }
    });

    it("should return an empty array when no phases exist", async () => {
      // Call the method under test
      const result = await testSetup.phaseProxy.getPhases();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const phases = result.value;
        expect(phases).toHaveLength(0);
      }
    });
  });

  describe("updatePhase", () => {
    it("should update a phase when it exists", async () => {
      // Set up test data
      const { phaseDTO } = await createTestData(testSetup.prisma);

      // Create the phase first
      await testSetup.phaseProxy.createPhase(phaseDTO);

      // Update data
      const updateData = { name: "Updated Phase Name" };

      // Call the method under test
      const result = await testSetup.phaseProxy.updatePhase(
        phaseDTO.id,
        updateData,
      );

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const phase = result.value;
        expect(phase.id).toBe(phaseDTO.id);
        expect(phase.name).toBe(updateData.name);
        expect(phase.planId).toBe(phaseDTO.planId);
      }

      // Verify the phase was updated in the database
      const dbPhase = await testSetup.prisma.phase.findUnique({
        where: { id: phaseDTO.id },
      });

      expect(dbPhase?.name).toBe(updateData.name);
    });

    it("should return an error when phase does not exist", async () => {
      const nonExistentId = randomUUID();
      const updateData = { name: "Updated Phase Name" };

      // Call the method under test
      const result = await testSetup.phaseProxy.updatePhase(
        nonExistentId,
        updateData,
      );

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain("not found");
      }
    });
  });

  describe("deletePhase", () => {
    it("should delete a phase when it exists", async () => {
      // Set up test data
      const { phaseDTO } = await createTestData(testSetup.prisma);

      // Create the phase first
      await testSetup.phaseProxy.createPhase(phaseDTO);

      // Call the method under test
      const result = await testSetup.phaseProxy.deletePhase(phaseDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        expect(result.value).toBe(true);
      }

      // Verify the phase was deleted from the database
      const dbPhase = await testSetup.prisma.phase.findUnique({
        where: { id: phaseDTO.id },
      });

      expect(dbPhase).toBeNull();
    });

    it("should return an error when phase does not exist", async () => {
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.phaseProxy.deletePhase(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain("not found");
      }
    });
  });
});
