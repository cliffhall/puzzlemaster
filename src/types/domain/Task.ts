/**
 * Task
 * - Part of a job assigned to a single agent for completion
 */

import { z } from "zod";
import { Result, ok, err } from "neverthrow";
import { DomainError } from "./DomainError";

export const TaskStatusSchema = z.enum([
  "PENDING",
  "RUNNING",
  "COMPLETED",
  "FAILED",
]);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

export const TaskSchema = z.object({
  id: z.string().uuid(),
  jobId: z.string().uuid(),
  agentId: z.string().uuid(),
  validatorId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  status: TaskStatusSchema.default("PENDING"),
});

export type TaskDTO = z.infer<typeof TaskSchema>;

export enum TaskAPIMethods {
  CREATE_TASK = "create-task",
  GET_TASK = "get-task",
  GET_TASKS = "get-tasks",
  UPDATE_TASK = "update-task",
  DELETE_TASK = "delete-task",
}

export class Task {
  private constructor(
    public readonly id: string,
    public readonly jobId: string,
    public readonly agentId: string,
    public readonly validatorId: string,
    public name: string,
    public description: string | undefined,
    public status: TaskStatus, // Added status property
  ) {}

  static create(dto: TaskDTO): Result<Task, DomainError> {
    const parsed = TaskSchema.safeParse(dto);
    if (!parsed.success) return err(new DomainError(parsed.error.message));
    const { id, jobId, agentId, validatorId, name, description, status } =
      parsed.data;
    return ok(
      new Task(id, jobId, agentId, validatorId, name, description, status),
    );
  }
}
