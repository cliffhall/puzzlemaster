import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { TaskDTO, TaskAPIMethods } from "../../../../types/domain";
import { TaskProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { flattenResult } from "../../constants/AppConstants";
import { ipcMain } from "electron";

export class TaskAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ TaskAPICommand - Installing Task API Handlers", 2);
    const taskProxy = f.retrieveProxy(TaskProxy.NAME) as TaskProxy;

    // Create a task and return it
    ipcMain.handle(TaskAPIMethods.CREATE_TASK, async (_, taskDTO: TaskDTO) => {
      const result = await taskProxy.createTask(taskDTO);
      return flattenResult(result);
    });

    // Get a task by id
    ipcMain.handle(TaskAPIMethods.GET_TASK, async (_, id: string) => {
      const result = await taskProxy.getTask(id);
      return flattenResult(result);
    });

    // Get all tasks
    ipcMain.handle(TaskAPIMethods.GET_TASKS, async () => {
      const result = await taskProxy.getTasks();
      return flattenResult(result);
    });

    // Update a task
    ipcMain.handle(TaskAPIMethods.UPDATE_TASK, async (_, taskDTO: TaskDTO) => {
      const { id, ...updateData } = taskDTO;
      const result = await taskProxy.updateTask(id, updateData);
      return flattenResult(result);
    });

    // Delete a task
    ipcMain.handle(TaskAPIMethods.DELETE_TASK, async (_, id: string) => {
      const result = await taskProxy.deleteTask(id);
      return flattenResult(result);
    });

    // Signal completion
    this.commandComplete();
  }
}
