import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { TaskDTO, TaskAPIMethods } from "../../../../types/domain";
import { TaskProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { ipcMain } from "electron";

export class TaskAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ TaskAPICommand - Installing Task API Handlers", 2);
    const taskProxy = f.retrieveProxy(TaskProxy.NAME) as TaskProxy;

    // Create a task and return it
    ipcMain.handle(TaskAPIMethods.CREATE_TASK, async (_, taskDTO: TaskDTO) => {
      return taskProxy.createTask(taskDTO);
    });

    // Get a task by id
    ipcMain.handle(TaskAPIMethods.GET_TASK, async (_, id: string) => {
      return taskProxy.getTask(id);
    });

    // Get all tasks
    ipcMain.handle(TaskAPIMethods.GET_TASKS, async () => {
      return taskProxy.getTasks();
    });

    // Update a task
    ipcMain.handle(TaskAPIMethods.UPDATE_TASK, async (_, taskDTO: TaskDTO) => {
      const { id, ...updateData } = taskDTO;
      return taskProxy.updateTask(id, updateData);
    });

    // Delete a task
    ipcMain.handle(TaskAPIMethods.DELETE_TASK, async (_, id: string) => {
      return taskProxy.deleteTask(id);
    });

    // Signal completion
    this.commandComplete();
  }
}
