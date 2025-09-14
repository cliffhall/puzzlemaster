import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { TaskDTO, TaskAPIMethods } from "../../../../domain";
import { TaskProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { flattenResult } from "../../constants/AppConstants";
import { ipcMain } from "electron";

export class TaskAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ TaskAPICommand - Installing Task API Handlers", 3);
    const taskProxy = f.retrieveProxy(TaskProxy.NAME) as TaskProxy;

    // Create a task and return it
    ipcMain.handle(TaskAPIMethods.CREATE_TASK, async (_, taskDTO: TaskDTO) => {
      f.log(`️👉 Task API method ${TaskAPIMethods.CREATE_TASK} invoked`, 0);
      const result = await taskProxy.createTask(taskDTO);
      return flattenResult(result);
    });

    // Get a task by id
    ipcMain.handle(TaskAPIMethods.GET_TASK, async (_, id: string) => {
      f.log(`️👉 Task API method ${TaskAPIMethods.GET_TASK} invoked`, 0);
      const result = await taskProxy.getTask(id);
      return flattenResult(result);
    });

    // Get all tasks
    ipcMain.handle(TaskAPIMethods.GET_TASKS, async () => {
      f.log(`️👉 Task API method ${TaskAPIMethods.GET_TASKS} invoked`, 0);
      const result = await taskProxy.getTasks();
      return flattenResult(result);
    });

    // Get task counts grouped by job ID
    ipcMain.handle(TaskAPIMethods.GET_TASK_COUNTS_BY_JOB, async () => {
      f.log(
        `️👉 Task API method ${TaskAPIMethods.GET_TASK_COUNTS_BY_JOB} invoked`,
        0,
      );
      const result = await taskProxy.getTaskCountsByJob();
      return flattenResult(result);
    });

    // Update a task
    ipcMain.handle(TaskAPIMethods.UPDATE_TASK, async (_, taskDTO: TaskDTO) => {
      f.log(`️👉 Task API method ${TaskAPIMethods.UPDATE_TASK} invoked`, 0);
      const { id, ...updateData } = taskDTO;
      const result = await taskProxy.updateTask(id, updateData);
      return flattenResult(result);
    });

    // Delete a task
    ipcMain.handle(TaskAPIMethods.DELETE_TASK, async (_, id: string) => {
      f.log(`️👉 Task API method ${TaskAPIMethods.DELETE_TASK} invoked`, 0);
      const result = await taskProxy.deleteTask(id);
      return flattenResult(result);
    });

    // Signal completion
    this.commandComplete();
  }
}
