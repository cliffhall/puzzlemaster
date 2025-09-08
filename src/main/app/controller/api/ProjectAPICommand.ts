import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { ProjectDTO, ProjectAPIMethods } from "../../../../domain";
import { ProjectProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { flattenResult } from "../../constants/AppConstants";
import { ipcMain } from "electron";

export class ProjectAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ ProjectAPICommand - Installing Project API Handlers", 3);
    const projectProxy = f.retrieveProxy(ProjectProxy.NAME) as ProjectProxy;

    // Create a project and return it
    ipcMain.handle(
      ProjectAPIMethods.CREATE_PROJECT,
      async (_, projectDTO: ProjectDTO) => {
        f.log(
          `️👉 Project API method ${ProjectAPIMethods.CREATE_PROJECT} invoked`,
          0,
        );
        const result = await projectProxy.createProject(projectDTO);
        return flattenResult(result);
      },
    );

    // Get a project by id
    ipcMain.handle(ProjectAPIMethods.GET_PROJECT, async (_, id: string) => {
      f.log(
        `️👉 Project API method ${ProjectAPIMethods.GET_PROJECT} invoked`,
        0,
      );
      const result = await projectProxy.getProject(id);
      return flattenResult(result);
    });

    // Get all projects
    ipcMain.handle(ProjectAPIMethods.GET_PROJECTS, async () => {
      f.log(
        `️👉 Project API method ${ProjectAPIMethods.GET_PROJECTS} invoked`,
        0,
      );
      const result = await projectProxy.getProjects();
      return flattenResult(result);
    });

    // Update a project
    ipcMain.handle(
      ProjectAPIMethods.UPDATE_PROJECT,
      async (_, projectDTO: ProjectDTO) => {
        f.log(
          `️👉 Project API method ${ProjectAPIMethods.UPDATE_PROJECT} invoked`,
          0,
        );
        const { id, ...updateData } = projectDTO;
        const result = await projectProxy.updateProject(id, updateData);
        return flattenResult(result);
      },
    );

    // Delete a project
    ipcMain.handle(ProjectAPIMethods.DELETE_PROJECT, async (_, id: string) => {
      f.log(
        `️👉 Project API method ${ProjectAPIMethods.DELETE_PROJECT} invoked`,
        0,
      );
      const result = await projectProxy.deleteProject(id);
      return flattenResult(result);
    });

    // Signal completion
    this.commandComplete();
  }
}
