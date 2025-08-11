import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { ProjectDTO, ProjectAPIMethods } from "../../../../types/domain";
import { ProjectProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { ipcMain } from "electron";

export class ProjectAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ ProjectAPICommand - Installing Project API Handlers", 2);
    const projectProxy = f.retrieveProxy(ProjectProxy.NAME) as ProjectProxy;

    // Create a project and return it
    ipcMain.handle(
      ProjectAPIMethods.CREATE_PROJECT,
      async (_, projectDTO: ProjectDTO) => {
        const result = await projectProxy.createProject(projectDTO);
        if (result.isOk()) return { success: true, data: result.value };
        return { success: false, error: result.error.message };
      },
    );

    // Get a project by id
    ipcMain.handle(ProjectAPIMethods.GET_PROJECT, async (_, id: string) => {
      const result = await projectProxy.getProject(id);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Get all projects
    ipcMain.handle(ProjectAPIMethods.GET_PROJECTS, async () => {
      const result = await projectProxy.getProjects();
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Update a project
    ipcMain.handle(
      ProjectAPIMethods.UPDATE_PROJECT,
      async (_, projectDTO: ProjectDTO) => {
        const { id, ...updateData } = projectDTO;
        const result = await projectProxy.updateProject(id, updateData);
        if (result.isOk()) return { success: true, data: result.value };
        return { success: false, error: result.error.message };
      },
    );

    // Delete a project
    ipcMain.handle(ProjectAPIMethods.DELETE_PROJECT, async (_, id: string) => {
      const result = await projectProxy.deleteProject(id);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Signal completion
    this.commandComplete();
  }
}
