import {
  TaskDTO,
  CreateTaskDTO,
  TaskResult,
  TaskListResult,
  TaskCountsResult,
  DeleteResult,
} from "../index";

export interface TaskAPI {
  createTask: (taskDTO: CreateTaskDTO) => Promise<TaskResult>;
  getTask: (id: string) => Promise<TaskResult>;
  getTasks: () => Promise<TaskListResult>;
  getTaskCountsByJob: () => Promise<TaskCountsResult>;
  updateTask: (taskDTO: TaskDTO) => Promise<TaskResult>;
  deleteTask: (id: string) => Promise<DeleteResult>;
}
