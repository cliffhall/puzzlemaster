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
        return projectProxy.createProject(projectDTO);
      },
    );

    // Get a project by id
    ipcMain.handle(ProjectAPIMethods.GET_PROJECT, async (_, id: string) => {
      return projectProxy.getProject(id);
    });

    // Get all projects
    ipcMain.handle(ProjectAPIMethods.GET_PROJECTS, async () => {
      return projectProxy.getProjects();
    });

    // Update a project
    ipcMain.handle(
      ProjectAPIMethods.UPDATE_PROJECT,
      async (_, projectDTO: ProjectDTO) => {
        const { id, ...updateData } = projectDTO;
        return projectProxy.updateProject(id, updateData);
      },
    );

    // Delete a project
    ipcMain.handle(ProjectAPIMethods.DELETE_PROJECT, async (_, id: string) => {
      return projectProxy.deleteProject(id);
    });

    // Signal completion
    this.commandComplete();
  }
}
