import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { ProjectDTO } from "../../../../types/domain";
import { ProjectProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { ipcMain } from "electron";

export class ProjectAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ ProjectAPICommand - Installing Project API Handlers", 2);
    const projectProxy = f.retrieveProxy(ProjectProxy.NAME) as ProjectProxy;

    // Create a project and return it
    ipcMain.handle("create-project", async (_, projectDTO: ProjectDTO) => {
      return await projectProxy.createProject(projectDTO);
    });

    // Get a project by id
    ipcMain.handle("get-project", async (_, id: string) => {
      return await projectProxy.getProject(id);
    });

    // Get all projects
    ipcMain.handle("get-projects", async () => {
      return await projectProxy.getProjects();
    });

    // Update a project
    ipcMain.handle("update-project", async (_, projectDTO: ProjectDTO) => {
      const { id, ...updateData } = projectDTO;
      return await projectProxy.updateProject(id, updateData);
    });

    // Delete a project
    ipcMain.handle("delete-project", async (_, id: string) => {
      return await projectProxy.deleteProject(id);
    });

    // Signal completion
    this.commandComplete();
  }
}
