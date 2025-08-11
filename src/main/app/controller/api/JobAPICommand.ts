import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { JobDTO, JobAPIMethods } from "../../../../types/domain";
import { JobProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { ipcMain } from "electron";

export class JobAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ JobAPICommand - Installing Job API Handlers", 2);
    const jobProxy = f.retrieveProxy(JobProxy.NAME) as JobProxy;

    // Create a job and return it
    ipcMain.handle(JobAPIMethods.CREATE_JOB, async (_, jobDTO: JobDTO) => {
      const result = await jobProxy.createJob(jobDTO);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Get a job by id
    ipcMain.handle(JobAPIMethods.GET_JOB, async (_, id: string) => {
      const result = await jobProxy.getJob(id);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Get all jobs
    ipcMain.handle(JobAPIMethods.GET_JOBS, async () => {
      const result = await jobProxy.getJobs();
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Update a job
    ipcMain.handle(JobAPIMethods.UPDATE_JOB, async (_, jobDTO: JobDTO) => {
      const { id, ...updateData } = jobDTO;
      const result = await jobProxy.updateJob(id, updateData);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Delete a job
    ipcMain.handle(JobAPIMethods.DELETE_JOB, async (_, id: string) => {
      const result = await jobProxy.deleteJob(id);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Signal completion
    this.commandComplete();
  }
}
