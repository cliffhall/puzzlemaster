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
      return jobProxy.createJob(jobDTO);
    });

    // Get a job by id
    ipcMain.handle(JobAPIMethods.GET_JOB, async (_, id: string) => {
      return jobProxy.getJob(id);
    });

    // Get all jobs
    ipcMain.handle(JobAPIMethods.GET_JOBS, async () => {
      return jobProxy.getJobs();
    });

    // Update a job
    ipcMain.handle(JobAPIMethods.UPDATE_JOB, async (_, jobDTO: JobDTO) => {
      const { id, ...updateData } = jobDTO;
      return jobProxy.updateJob(id, updateData);
    });

    // Delete a job
    ipcMain.handle(JobAPIMethods.DELETE_JOB, async (_, id: string) => {
      return jobProxy.deleteJob(id);
    });

    // Signal completion
    this.commandComplete();
  }
}
