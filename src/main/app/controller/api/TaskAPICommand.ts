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
      const result = await taskProxy.createTask(taskDTO);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Get a task by id
    ipcMain.handle(TaskAPIMethods.GET_TASK, async (_, id: string) => {
      const result = await taskProxy.getTask(id);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Get all tasks
    ipcMain.handle(TaskAPIMethods.GET_TASKS, async () => {
      const result = await taskProxy.getTasks();
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Update a task
    ipcMain.handle(TaskAPIMethods.UPDATE_TASK, async (_, taskDTO: TaskDTO) => {
      const { id, ...updateData } = taskDTO;
      const result = await taskProxy.updateTask(id, updateData);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Delete a task
    ipcMain.handle(TaskAPIMethods.DELETE_TASK, async (_, id: string) => {
      const result = await taskProxy.deleteTask(id);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Signal completion
    this.commandComplete();
  }
}
