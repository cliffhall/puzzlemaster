import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { PlanDTO, PlanAPIMethods } from "../../../../types/domain";
import { PlanProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { flattenResult } from "../../constants/AppConstants";
import { ipcMain } from "electron";

export class PlanAPICommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ PlanAPICommand - Installing Plan API Handlers", 2);
    const planProxy = f.retrieveProxy(PlanProxy.NAME) as PlanProxy;

    // Create a plan and return it
    ipcMain.handle(PlanAPIMethods.CREATE_PLAN, async (_, planDTO: PlanDTO) => {
      const result = await planProxy.createPlan(planDTO);
      return flattenResult(result);
    });

    // Get a plan by id
    ipcMain.handle(PlanAPIMethods.GET_PLAN, async (_, id: string) => {
      const result = await planProxy.getPlan(id);
      return flattenResult(result);
    });

    // Get all plans
    ipcMain.handle(PlanAPIMethods.GET_PLANS, async () => {
      const result = await planProxy.getPlans();
      return flattenResult(result);
    });

    // Update a plan
    ipcMain.handle(PlanAPIMethods.UPDATE_PLAN, async (_, planDTO: PlanDTO) => {
      const { id, ...updateData } = planDTO;
      const result = await planProxy.updatePlan(id, updateData);
      return flattenResult(result);
    });

    // Delete a plan
    ipcMain.handle(PlanAPIMethods.DELETE_PLAN, async (_, id: string) => {
      const result = await planProxy.deletePlan(id);
      return flattenResult(result);
    });

    // Signal completion
    this.commandComplete();
  }
}
