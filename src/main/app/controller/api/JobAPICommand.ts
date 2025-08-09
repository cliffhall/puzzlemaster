import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { JobDTO } from "../../../../types/domain/Job";
import { JobProxy } from "../../model/JobProxy";
import { IAppFacade } from "../../AppFacade";
import { ipcMain } from "electron";

export class JobAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ JobAPICommand - Installing Job API Handlers", 2);
    const jobProxy = f.retrieveProxy(JobProxy.NAME) as JobProxy;

    // Create a job and return it
    ipcMain.handle("create-job", async (_, jobDTO: JobDTO) => {
      return await jobProxy.createJob(jobDTO);
    });

    // Get a job by id
    ipcMain.handle("get-job", async (_, id: string) => {
      return await jobProxy.getJob(id);
    });

    // Get all jobs
    ipcMain.handle("get-jobs", async () => {
      return await jobProxy.getJobs();
    });

    // Update a job
    ipcMain.handle("update-job", async (_, jobDTO: JobDTO) => {
      const { id, ...updateData } = jobDTO;
      return await jobProxy.updateJob(id, updateData);
    });

    // Delete a job
    ipcMain.handle("delete-job", async (_, id: string) => {
      return await jobProxy.deleteJob(id);
    });

    // Signal completion
    this.commandComplete();
  }
}
