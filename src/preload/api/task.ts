import { ipcRenderer } from "electron";
import { TaskAPI } from "../../domain/api/TaskAPI";
import { TaskAPIMethods, TaskDTO, CreateTaskDTO } from "../../domain";

export const task: TaskAPI = {
  createTask: (taskDTO: CreateTaskDTO) =>
    ipcRenderer.invoke(TaskAPIMethods.CREATE_TASK, taskDTO),
  getTask: (id: string) => ipcRenderer.invoke(TaskAPIMethods.GET_TASK, id),
  getTasks: () => ipcRenderer.invoke(TaskAPIMethods.GET_TASKS),
  updateTask: (taskDTO: TaskDTO) =>
    ipcRenderer.invoke(TaskAPIMethods.UPDATE_TASK, taskDTO),
  deleteTask: (id: string) =>
    ipcRenderer.invoke(TaskAPIMethods.DELETE_TASK, id),
};
