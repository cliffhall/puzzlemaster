import {
  TaskDTO,
  CreateTaskDTO,
  TaskResult,
  TaskListResult,
  DeleteResult,
} from "../domain";

export interface TaskAPI {
  createTask: (taskDTO: CreateTaskDTO) => Promise<TaskResult>;
  getTask: (id: string) => Promise<TaskResult>;
  getTasks: () => Promise<TaskListResult>;
  updateTask: (taskDTO: TaskDTO) => Promise<TaskResult>;
  deleteTask: (id: string) => Promise<DeleteResult>;
}
