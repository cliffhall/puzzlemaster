import { createTestTaskProxy } from "./helpers/task-proxy-test-helper";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { TaskDTO } from "../../../../domain";
import { TaskProxy } from "../TaskProxy";
import { randomUUID } from "crypto";
import { PrismaClient } from "db";

/**
 * Helper function to create test data (job, agent, validator, and task)
 * @returns An object containing the created IDs and the task DTO
 */
async function createTestData(prisma: PrismaClient): Promise<{
  jobId: string;
  agentId: string;
  validatorId: string;
  taskId: string;
  taskDTO: TaskDTO;
}> {
  // Create project, plan, phase, and job hierarchy
  const projectId = randomUUID();
  await prisma.project.create({
    data: {
      id: projectId,
      name: "Test Project",
    },
  });

  const planId = randomUUID();
  await prisma.plan.create({
    data: {
      id: planId,
      projectId,
      description: "Test plan description",
    },
  });

  const phaseId = randomUUID();
  await prisma.phase.create({
    data: {
      id: phaseId,
      name: "Test Phase",
      planId,
    },
  });

  const jobId = randomUUID();
  await prisma.job.create({
    data: {
      id: jobId,
      name: "Test Job",
      phaseId,
    },
  });

  // Create team and role for agent
  const teamId = randomUUID();
  await prisma.team.create({
    data: {
      id: teamId,
      name: "Test Team",
      phaseId,
    },
  });

  const roleId = randomUUID();
  const uniqueRoleName = `Test Role ${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  await prisma.role.create({
    data: {
      id: roleId,
      name: uniqueRoleName,
    },
  });

  // Create agent
  const agentId = randomUUID();
  await prisma.agent.create({
    data: {
      id: agentId,
      name: "Test Agent",
      teamId,
      roleId,
    },
  });

  // Create validator
  const validatorId = randomUUID();
  await prisma.validator.create({
    data: {
      id: validatorId,
      template: "Test Validator Template",
      resource: "Test validation resource",
    },
  });

  // Create task DTO
  const taskId = randomUUID();
  const taskDTO: TaskDTO = {
    id: taskId,
    name: "Test Task",
    description: "Test task description",
    status: "PENDING",
    jobId,
    agentId,
    validatorId,
  };

  return { jobId, agentId, validatorId, taskId, taskDTO };
}

describe("TaskProxy", () => {
  let testSetup: {
    prisma: PrismaClient;
    taskProxy: TaskProxy;
    cleanup: () => Promise<void>;
  };

  beforeEach(async () => {
    testSetup = await createTestTaskProxy();
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  describe("createTask", () => {
    it("should create a task in the database", async () => {
      // Set up test data
      const { taskDTO } = await createTestData(testSetup.prisma);

      // Call the method under test
      const result = await testSetup.taskProxy.createTask(taskDTO);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const task = result.value;
        expect(task.id).toBe(taskDTO.id);
        expect(task.name).toBe(taskDTO.name);
        expect(task.description).toBe(taskDTO.description);
        expect(task.status).toBe(taskDTO.status);
        expect(task.jobId).toBe(taskDTO.jobId);
        expect(task.agentId).toBe(taskDTO.agentId);
        expect(task.validatorId).toBe(taskDTO.validatorId);
      }

      // Verify the task was created in the database
      const dbTask = await testSetup.prisma.task.findUnique({
        where: { id: taskDTO.id },
      });

      expect(dbTask).not.toBeNull();
      expect(dbTask?.name).toBe(taskDTO.name);
      expect(dbTask?.description).toBe(taskDTO.description);
      expect(dbTask?.status).toBe(taskDTO.status);
    });
  });

  describe("getTask", () => {
    it("should retrieve a task by ID", async () => {
      // Set up test data
      const { taskDTO } = await createTestData(testSetup.prisma);

      // Create the task first
      await testSetup.taskProxy.createTask(taskDTO);

      // Call the method under test
      const result = await testSetup.taskProxy.getTask(taskDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const task = result.value;
        expect(task.id).toBe(taskDTO.id);
        expect(task.name).toBe(taskDTO.name);
        expect(task.description).toBe(taskDTO.description);
        expect(task.status).toBe(taskDTO.status);
        expect(task.jobId).toBe(taskDTO.jobId);
        expect(task.agentId).toBe(taskDTO.agentId);
        expect(task.validatorId).toBe(taskDTO.validatorId);
      }
    });

    it("should return an error when task is not found", async () => {
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.taskProxy.getTask(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain(
          `Task with ID ${nonExistentId} not found`,
        );
      }
    });
  });

  describe("getTasks", () => {
    it("should retrieve all tasks", async () => {
      // Set up test data
      const { taskDTO: task1DTO } = await createTestData(testSetup.prisma);
      const { taskDTO: task2DTO } = await createTestData(testSetup.prisma);

      // Create the tasks
      await testSetup.taskProxy.createTask(task1DTO);
      await testSetup.taskProxy.createTask(task2DTO);

      // Call the method under test
      const result = await testSetup.taskProxy.getTasks();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const tasks = result.value;
        expect(tasks.length).toBeGreaterThanOrEqual(2);

        const task1 = tasks.find((t) => t.id === task1DTO.id);
        const task2 = tasks.find((t) => t.id === task2DTO.id);

        expect(task1).toBeDefined();
        expect(task2).toBeDefined();
        expect(task1?.name).toBe(task1DTO.name);
        expect(task2?.name).toBe(task2DTO.name);
      }
    });

    it("should return an empty array when no tasks exist", async () => {
      // Call the method under test
      const result = await testSetup.taskProxy.getTasks();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const tasks = result.value;
        expect(tasks).toEqual([]);
      }
    });
  });

  describe("getTaskCountsByJob", () => {
    it("should return task counts grouped by job ID", async () => {
      // Set up test data with multiple tasks for different jobs
      const { taskDTO: task1DTO } = await createTestData(testSetup.prisma);
      const { taskDTO: task2DTO } = await createTestData(testSetup.prisma);
      const { taskDTO: task3DTO } = await createTestData(testSetup.prisma);

      // Create task3 with same jobId as task1 to test counting
      task3DTO.jobId = task1DTO.jobId;

      // Create the tasks
      await testSetup.taskProxy.createTask(task1DTO);
      await testSetup.taskProxy.createTask(task2DTO);
      await testSetup.taskProxy.createTask(task3DTO);

      // Call the method under test
      const result = await testSetup.taskProxy.getTaskCountsByJob();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const counts = result.value;
        expect(counts[task1DTO.jobId]).toBe(2); // task1 and task3
        expect(counts[task2DTO.jobId]).toBe(1); // task2 only
      }
    });

    it("should return an empty object when no tasks exist", async () => {
      // Call the method under test
      const result = await testSetup.taskProxy.getTaskCountsByJob();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const counts = result.value;
        expect(counts).toEqual({});
      }
    });
  });

  describe("updateTask", () => {
    it("should update a task successfully", async () => {
      // Set up test data
      const { taskDTO } = await createTestData(testSetup.prisma);

      // Create the task first
      await testSetup.taskProxy.createTask(taskDTO);

      // Call the method under test
      const result = await testSetup.taskProxy.updateTask(taskDTO.id, {
        name: "Updated Task Name",
        description: "Updated description",
        status: "RUNNING",
      });

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const task = result.value;
        expect(task.id).toBe(taskDTO.id);
        expect(task.name).toBe("Updated Task Name");
        expect(task.description).toBe("Updated description");
        expect(task.status).toBe("RUNNING");
        expect(task.jobId).toBe(taskDTO.jobId);
        expect(task.agentId).toBe(taskDTO.agentId);
        expect(task.validatorId).toBe(taskDTO.validatorId);
      }

      // Verify the task was updated in the database
      const dbTask = await testSetup.prisma.task.findUnique({
        where: { id: taskDTO.id },
      });

      expect(dbTask?.name).toBe("Updated Task Name");
      expect(dbTask?.description).toBe("Updated description");
      expect(dbTask?.status).toBe("RUNNING");
    });

    it("should return an error when trying to update non-existent task", async () => {
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.taskProxy.updateTask(nonExistentId, {
        name: "Updated Name",
      });

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain(
          `Task with ID ${nonExistentId} not found`,
        );
      }
    });
  });

  describe("deleteTask", () => {
    it("should delete a task successfully", async () => {
      // Set up test data
      const { taskDTO } = await createTestData(testSetup.prisma);

      // Create the task first
      await testSetup.taskProxy.createTask(taskDTO);

      // Verify the task exists
      const taskExists = await testSetup.prisma.task.findUnique({
        where: { id: taskDTO.id },
      });
      expect(taskExists).not.toBeNull();

      // Call the method under test
      const result = await testSetup.taskProxy.deleteTask(taskDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        expect(result.value).toBe(true);
      }

      // Verify the task was deleted from the database
      const deletedTask = await testSetup.prisma.task.findUnique({
        where: { id: taskDTO.id },
      });
      expect(deletedTask).toBeNull();
    });

    it("should return an error when trying to delete non-existent task", async () => {
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.taskProxy.deleteTask(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain(
          `Task with ID ${nonExistentId} not found`,
        );
      }
    });
  });

  describe("optional agentId and validatorId", () => {
    it("should create a task without agentId and validatorId", async () => {
      // Create basic job hierarchy without agent/validator
      const projectId = randomUUID();
      await testSetup.prisma.project.create({
        data: { id: projectId, name: "Test Project" },
      });

      const planId = randomUUID();
      await testSetup.prisma.plan.create({
        data: { id: planId, projectId, description: "Test plan" },
      });

      const phaseId = randomUUID();
      await testSetup.prisma.phase.create({
        data: { id: phaseId, name: "Test Phase", planId },
      });

      const jobId = randomUUID();
      await testSetup.prisma.job.create({
        data: { id: jobId, name: "Test Job", phaseId },
      });

      // Create task DTO without agentId and validatorId
      const taskId = randomUUID();
      const taskDTO = {
        id: taskId,
        name: "Task Without Agent/Validator",
        description: "Testing optional fields",
        status: "PENDING" as const,
        jobId,
        // agentId and validatorId are intentionally omitted
      };

      // Call the method under test
      const result = await testSetup.taskProxy.createTask(taskDTO);

      // Verify the result
      if (result.isErr()) {
        console.log(
          "Error creating task without agentId/validatorId:",
          result.error.message,
        );
      }
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const task = result.value;
        expect(task.id).toBe(taskDTO.id);
        expect(task.name).toBe(taskDTO.name);
        expect(task.description).toBe(taskDTO.description);
        expect(task.status).toBe(taskDTO.status);
        expect(task.jobId).toBe(taskDTO.jobId);
        expect(task.agentId).toBeUndefined();
        expect(task.validatorId).toBeUndefined();
      }

      // Verify the task was created in the database
      const dbTask = await testSetup.prisma.task.findUnique({
        where: { id: taskDTO.id },
      });

      expect(dbTask).not.toBeNull();
      expect(dbTask?.name).toBe(taskDTO.name);
      expect(dbTask?.agentId).toBeNull();
      expect(dbTask?.validatorId).toBeNull();
    });

    it("should retrieve a task that has no agentId/validatorId", async () => {
      // Create task without agent/validator (using same setup as previous test)
      const projectId = randomUUID();
      await testSetup.prisma.project.create({
        data: { id: projectId, name: "Test Project" },
      });

      const planId = randomUUID();
      await testSetup.prisma.plan.create({
        data: { id: planId, projectId, description: "Test plan" },
      });

      const phaseId = randomUUID();
      await testSetup.prisma.phase.create({
        data: { id: phaseId, name: "Test Phase", planId },
      });

      const jobId = randomUUID();
      await testSetup.prisma.job.create({
        data: { id: jobId, name: "Test Job", phaseId },
      });

      const taskId = randomUUID();
      const taskDTO = {
        id: taskId,
        name: "Task Without Agent/Validator",
        status: "PENDING" as const,
        jobId,
      };

      // Create the task first
      await testSetup.taskProxy.createTask(taskDTO);

      // Call the method under test
      const result = await testSetup.taskProxy.getTask(taskDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const task = result.value;
        expect(task.id).toBe(taskDTO.id);
        expect(task.name).toBe(taskDTO.name);
        expect(task.jobId).toBe(taskDTO.jobId);
        expect(task.agentId).toBeUndefined();
        expect(task.validatorId).toBeUndefined();
      }
    });
  });
});
