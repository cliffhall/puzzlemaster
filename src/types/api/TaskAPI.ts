import { TaskDTO, TaskResult, TaskListResult, DeleteResult } from "../domain";

export interface TaskAPI {
  createTask: (taskDTO: TaskDTO) => Promise<TaskResult>;
  getTask: (id: string) => Promise<TaskResult>;
  getTasks: () => Promise<TaskListResult>;
  updateTask: (taskDTO: TaskDTO) => Promise<TaskResult>;
  deleteTask: (id: string) => Promise<DeleteResult>;
}
