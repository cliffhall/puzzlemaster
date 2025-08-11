import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { JobDTO, JobAPIMethods } from "../../../../types/domain";
import { JobProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { flattenResult } from "../../constants/AppConstants";
import { ipcMain } from "electron";

export class JobAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ JobAPICommand - Installing Job API Handlers", 2);
    const jobProxy = f.retrieveProxy(JobProxy.NAME) as JobProxy;

    // Create a job and return it
    ipcMain.handle(JobAPIMethods.CREATE_JOB, async (_, jobDTO: JobDTO) => {
      const result = await jobProxy.createJob(jobDTO);
      return flattenResult(result);
    });

    // Get a job by id
    ipcMain.handle(JobAPIMethods.GET_JOB, async (_, id: string) => {
      const result = await jobProxy.getJob(id);
      return flattenResult(result);
    });

    // Get all jobs
    ipcMain.handle(JobAPIMethods.GET_JOBS, async () => {
      const result = await jobProxy.getJobs();
      return flattenResult(result);
    });

    // Update a job
    ipcMain.handle(JobAPIMethods.UPDATE_JOB, async (_, jobDTO: JobDTO) => {
      const { id, ...updateData } = jobDTO;
      const result = await jobProxy.updateJob(id, updateData);
      return flattenResult(result);
    });

    // Delete a job
    ipcMain.handle(JobAPIMethods.DELETE_JOB, async (_, id: string) => {
      const result = await jobProxy.deleteJob(id);
      return flattenResult(result);
    });

    // Signal completion
    this.commandComplete();
  }
}
