import { createTestJobProxy } from "./helpers/job-proxy-test-helper";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { JobDTO } from "../../../../domain";
import { JobProxy } from "../JobProxy";
import { randomUUID } from "crypto";
import { PrismaClient } from "db";

/**
 * Helper function to create test data (project, plan, phase, and job)
 * @returns An object containing the created IDs and the job DTO
 */
async function createTestData(prisma: PrismaClient): Promise<{
  projectId: string;
  planId: string;
  phaseId: string;
  jobId: string;
  jobDTO: JobDTO;
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
      description: "Test plan description",
    },
  });

  // Create phase
  const phaseId = randomUUID();
  await prisma.phase.create({
    data: {
      id: phaseId,
      name: "Test Phase",
      planId,
    },
  });

  // Create job DTO
  const jobId = randomUUID();
  const jobDTO: JobDTO = {
    id: jobId,
    name: "Test Job",
    description: "Test job description",
    status: "PENDING",
    phaseId,
    tasks: [],
  };

  return { projectId, planId, phaseId, jobId, jobDTO };
}

describe("JobProxy", () => {
  let testSetup: {
    prisma: PrismaClient;
    jobProxy: JobProxy;
    cleanup: () => Promise<void>;
  };

  beforeEach(async () => {
    testSetup = await createTestJobProxy();
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  describe("createJob", () => {
    it("should create a job in the database", async () => {
      // Set up test data
      const { jobDTO } = await createTestData(testSetup.prisma);

      // Call the method under test
      const result = await testSetup.jobProxy.createJob(jobDTO);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const job = result.value;
        expect(job.id).toBe(jobDTO.id);
        expect(job.name).toBe(jobDTO.name);
        expect(job.description).toBe(jobDTO.description);
        expect(job.status).toBe(jobDTO.status);
        expect(job.phaseId).toBe(jobDTO.phaseId);
        expect(job.tasks).toEqual([]);
      }

      // Verify the job was created in the database
      const dbJob = await testSetup.prisma.job.findUnique({
        where: { id: jobDTO.id },
      });

      expect(dbJob).not.toBeNull();
      expect(dbJob?.name).toBe(jobDTO.name);
      expect(dbJob?.description).toBe(jobDTO.description);
      expect(dbJob?.status).toBe(jobDTO.status);
    });
  });

  describe("getJob", () => {
    it("should retrieve a job by ID", async () => {
      // Set up test data
      const { jobDTO } = await createTestData(testSetup.prisma);

      // Create the job first
      await testSetup.jobProxy.createJob(jobDTO);

      // Call the method under test
      const result = await testSetup.jobProxy.getJob(jobDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const job = result.value;
        expect(job.id).toBe(jobDTO.id);
        expect(job.name).toBe(jobDTO.name);
        expect(job.description).toBe(jobDTO.description);
        expect(job.status).toBe(jobDTO.status);
        expect(job.phaseId).toBe(jobDTO.phaseId);
      }
    });

    it("should return an error when job is not found", async () => {
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.jobProxy.getJob(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain("not found");
      }
    });
  });

  describe("getJobs", () => {
    it("should retrieve all jobs", async () => {
      // Set up test data - create multiple jobs
      const { jobDTO: jobDTO1 } = await createTestData(testSetup.prisma);
      const { jobDTO: jobDTO2 } = await createTestData(testSetup.prisma);

      // Create the jobs
      await testSetup.jobProxy.createJob(jobDTO1);
      await testSetup.jobProxy.createJob(jobDTO2);

      // Call the method under test
      const result = await testSetup.jobProxy.getJobs();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const jobs = result.value;
        expect(jobs).toHaveLength(2);

        const job1 = jobs.find((job) => job.id === jobDTO1.id);
        const job2 = jobs.find((job) => job.id === jobDTO2.id);

        expect(job1).toBeDefined();
        expect(job1?.name).toBe(jobDTO1.name);
        expect(job2).toBeDefined();
        expect(job2?.name).toBe(jobDTO2.name);
      }
    });

    it("should return an empty array when no jobs exist", async () => {
      // Call the method under test
      const result = await testSetup.jobProxy.getJobs();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const jobs = result.value;
        expect(jobs).toHaveLength(0);
      }
    });
  });

  describe("updateJob", () => {
    it("should update a job's properties", async () => {
      // Set up test data
      const { jobDTO } = await createTestData(testSetup.prisma);

      // Create the job first
      await testSetup.jobProxy.createJob(jobDTO);

      // Update data
      const updateData = {
        name: "Updated Job Name",
        description: "Updated description",
        status: "RUNNING" as const,
      };

      // Call the method under test
      const result = await testSetup.jobProxy.updateJob(jobDTO.id, updateData);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const job = result.value;
        expect(job.name).toBe(updateData.name);
        expect(job.description).toBe(updateData.description);
        expect(job.status).toBe(updateData.status);
        expect(job.phaseId).toBe(jobDTO.phaseId); // Should remain unchanged
      }

      // Verify the job was updated in the database
      const dbJob = await testSetup.prisma.job.findUnique({
        where: { id: jobDTO.id },
      });

      expect(dbJob?.name).toBe(updateData.name);
      expect(dbJob?.description).toBe(updateData.description);
      expect(dbJob?.status).toBe(updateData.status);
    });

    it("should return an error when job is not found", async () => {
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.jobProxy.updateJob(nonExistentId, {
        name: "Updated Name",
      });

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain("not found");
      }
    });
  });

  describe("deleteJob", () => {
    it("should delete a job", async () => {
      // Set up test data
      const { jobDTO } = await createTestData(testSetup.prisma);

      // Create the job first
      await testSetup.jobProxy.createJob(jobDTO);

      // Call the method under test
      const result = await testSetup.jobProxy.deleteJob(jobDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        expect(result.value).toBe(true);
      }

      // Verify the job was deleted from the database
      const dbJob = await testSetup.prisma.job.findUnique({
        where: { id: jobDTO.id },
      });

      expect(dbJob).toBeNull();
    });

    it("should return an error when job is not found", async () => {
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.jobProxy.deleteJob(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain("not found");
      }
    });
  });
});
