import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { Task, TaskDTO, TaskStatus, DomainError } from "../../../domain";
import { Result, ok, err } from "neverthrow";
import { PrismaClient } from "db";

export class TaskProxy extends Proxy {
  static NAME: string = "TaskProxy";
  private prismaClient: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    super(TaskProxy.NAME, process);
    this.prismaClient = prismaClient;
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
      const createData = {
        id: taskDTO.id,
        name: taskDTO.name,
        description: taskDTO.description,
        status: taskDTO.status as TaskStatus,
        job: {
          connect: { id: taskDTO.jobId },
        },
        ...(taskDTO.agentId && { agentId: taskDTO.agentId }),
        ...(taskDTO.validatorId && { validatorId: taskDTO.validatorId }),
      };

      const task = await this.prismaClient.task.create({
        data: createData,
      });

      return Task.create({
        id: task.id,
        jobId: task.jobId,
        agentId: task.agentId || undefined,
        validatorId: task.validatorId || undefined,
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
        agentId: task.agentId || undefined,
        validatorId: task.validatorId || undefined,
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
          agentId: task.agentId || undefined,
          validatorId: task.validatorId || undefined,
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
   * Get task counts grouped by job ID
   * @returns A Result containing a record of jobId -> count or a DomainError
   */
  public async getTaskCountsByJob(): Promise<
    Result<Record<string, number>, DomainError>
  > {
    try {
      const counts = await this.prismaClient.task.groupBy({
        by: ["jobId"],
        _count: {
          id: true,
        },
      });

      const result: Record<string, number> = {};
      for (const count of counts) {
        result[count.jobId] = count._count.id;
      }

      return ok(result);
    } catch (error) {
      return err(
        DomainError.fromError("Failed to get task counts by job", error),
      );
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
      // First, check if the task exists
      const existingTask = await this.prismaClient.task.findUnique({
        where: { id },
      });

      if (!existingTask) {
        return err(new DomainError(`Task with ID ${id} not found`));
      }

      // Prepare update data
      const updateData = {
        ...(taskDTO.name && { name: taskDTO.name }),
        ...(taskDTO.description !== undefined && {
          description: taskDTO.description,
        }),
        ...(taskDTO.status && { status: taskDTO.status as TaskStatus }),
        ...(taskDTO.jobId && { job: { connect: { id: taskDTO.jobId } } }),
        ...(taskDTO.agentId !== undefined && { agentId: taskDTO.agentId }),
        ...(taskDTO.validatorId !== undefined && {
          validatorId: taskDTO.validatorId,
        }),
      };

      // Update the task
      const task = await this.prismaClient.task.update({
        where: { id },
        data: updateData,
      });

      return Task.create({
        id: task.id,
        jobId: task.jobId,
        agentId: task.agentId || undefined,
        validatorId: task.validatorId || undefined,
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
      // First, check if the task exists
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
