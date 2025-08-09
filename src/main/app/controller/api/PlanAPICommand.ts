import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { PlanDTO, PlanAPIMethods } from "../../../../types/domain";
import { PlanProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { ipcMain } from "electron";

export class PlanAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ PlanAPICommand - Installing Plan API Handlers", 2);
    const planProxy = f.retrieveProxy(PlanProxy.NAME) as PlanProxy;

    // Create a plan and return it
    ipcMain.handle(PlanAPIMethods.CREATE_PLAN, async (_, planDTO: PlanDTO) => {
      return await planProxy.createPlan(planDTO);
    });

    // Get a plan by id
    ipcMain.handle(PlanAPIMethods.GET_PLAN, async (_, id: string) => {
      return await planProxy.getPlan(id);
    });

    // Get all plans
    ipcMain.handle(PlanAPIMethods.GET_PLANS, async () => {
      return await planProxy.getPlans();
    });

    // Update a plan
    ipcMain.handle(PlanAPIMethods.UPDATE_PLAN, async (_, planDTO: PlanDTO) => {
      const { id, ...updateData } = planDTO;
      return await planProxy.updatePlan(id, updateData);
    });

    // Delete a plan
    ipcMain.handle(PlanAPIMethods.DELETE_PLAN, async (_, id: string) => {
      return await planProxy.deletePlan(id);
    });

    // Signal completion
    this.commandComplete();
  }
}
