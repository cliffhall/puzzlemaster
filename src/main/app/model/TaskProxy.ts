import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { Task, TaskDTO, TaskStatus, DomainError } from "../../../types/domain";
import { Result, ok, err } from "neverthrow";
import { PrismaClient } from "db";

// For production code, use a singleton instance
const prisma = new PrismaClient();

export class TaskProxy extends Proxy {
  static NAME: string = "TaskProxy";
  private prismaClient: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    super(TaskProxy.NAME, process);
    this.prismaClient = prismaClient || prisma;
  }

  /**
   * Create a new task in the database
   * @param taskDTO The task data transfer object
   * @returns A Result containing the created task or a DomainError
   */
  public async createTask(
    taskDTO: TaskDTO,
  ): Promise<Result<Task, DomainError>> {
    try {
      const task = await this.prismaClient.task.create({
        data: {
          id: taskDTO.id,
          name: taskDTO.name,
          description: taskDTO.description,
          status: taskDTO.status,
          job: {
            connect: { id: taskDTO.jobId },
          },
          agent: {
            connect: { id: taskDTO.agentId },
          },
          validator: {
            connect: { id: taskDTO.validatorId },
          },
        },
      });

      return Task.create({
        id: task.id,
        jobId: task.jobId,
        agentId: task.agentId,
        validatorId: task.validatorId,
        name: task.name,
        description: task.description || undefined,
        status: task.status as TaskStatus,
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to create task", error));
    }
  }

  /**
   * Get a task by ID
   * @param id The task ID
   * @returns A Result containing the task or a DomainError
   */
  public async getTask(id: string): Promise<Result<Task, DomainError>> {
    try {
      const task = await this.prismaClient.task.findUnique({
        where: { id },
      });

      if (!task) {
        return err(new DomainError(`Task with ID ${id} not found`));
      }

      return Task.create({
        id: task.id,
        jobId: task.jobId,
        agentId: task.agentId,
        validatorId: task.validatorId,
        name: task.name,
        description: task.description || undefined,
        status: task.status as TaskStatus,
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to get task", error));
    }
  }

  /**
   * Get all tasks
   * @returns A Result containing an array of tasks or a DomainError
   */
  public async getTasks(): Promise<Result<Task[], DomainError>> {
    try {
      const tasks = await this.prismaClient.task.findMany();

      const taskResults = tasks.map((task) =>
        Task.create({
          id: task.id,
          jobId: task.jobId,
          agentId: task.agentId,
          validatorId: task.validatorId,
          name: task.name,
          description: task.description || undefined,
          status: task.status as TaskStatus,
        }),
      );

      // Process the results using neverthrow's combinatorial functions
      // Use the .combine method to safely combine all results or return the first error
      return Result.combine(taskResults);
    } catch (error) {
      return err(DomainError.fromError("Failed to get tasks", error));
    }
  }

  /**
   * Update a task
   * @param id The task ID
   * @param taskDTO The task data transfer object (can be only fields that changed)
   * @returns A Result containing the updated task or a DomainError
   */
  public async updateTask(
    id: string,
    taskDTO: Partial<TaskDTO>,
  ): Promise<Result<Task, DomainError>> {
    try {
      // First check if the task exists
      const existingTask = await this.prismaClient.task.findUnique({
        where: { id },
      });

      if (!existingTask) {
        return err(new DomainError(`Task with ID ${id} not found`));
      }

      // Prepare update data
      const updateData: {
        name?: string;
        description?: string;
        status?: TaskStatus;
        job?: { connect: { id: string } };
        agent?: { connect: { id: string } };
        validator?: { connect: { id: string } };
      } = {};
      if (taskDTO.name) updateData.name = taskDTO.name;
      if (taskDTO.description !== undefined)
        updateData.description = taskDTO.description;
      if (taskDTO.status) updateData.status = taskDTO.status as TaskStatus;
      if (taskDTO.jobId) updateData.job = { connect: { id: taskDTO.jobId } };
      if (taskDTO.agentId)
        updateData.agent = { connect: { id: taskDTO.agentId } };
      if (taskDTO.validatorId)
        updateData.validator = { connect: { id: taskDTO.validatorId } };

      // Update the task
      const task = await this.prismaClient.task.update({
        where: { id },
        data: updateData,
      });

      return Task.create({
        id: task.id,
        jobId: task.jobId,
        agentId: task.agentId,
        validatorId: task.validatorId,
        name: task.name,
        description: task.description || undefined,
        status: task.status as TaskStatus,
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to update task", error));
    }
  }

  /**
   * Delete a task
   * @param id The task ID
   * @returns A Result containing a success boolean or a DomainError
   */
  public async deleteTask(id: string): Promise<Result<boolean, DomainError>> {
    try {
      // First check if the task exists
      const existingTask = await this.prismaClient.task.findUnique({
        where: { id },
      });

      if (!existingTask) {
        return err(new DomainError(`Task with ID ${id} not found`));
      }

      // Delete the task
      await this.prismaClient.task.delete({
        where: { id },
      });

      return ok(true);
    } catch (error) {
      return err(DomainError.fromError("Failed to delete task", error));
    }
  }
}
