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
      const result = await planProxy.createPlan(planDTO);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Get a plan by id
    ipcMain.handle(PlanAPIMethods.GET_PLAN, async (_, id: string) => {
      const result = await planProxy.getPlan(id);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Get all plans
    ipcMain.handle(PlanAPIMethods.GET_PLANS, async () => {
      const result = await planProxy.getPlans();
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Update a plan
    ipcMain.handle(PlanAPIMethods.UPDATE_PLAN, async (_, planDTO: PlanDTO) => {
      const { id, ...updateData } = planDTO;
      const result = await planProxy.updatePlan(id, updateData);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Delete a plan
    ipcMain.handle(PlanAPIMethods.DELETE_PLAN, async (_, id: string) => {
      const result = await planProxy.deletePlan(id);
      if (result.isOk()) return { success: true, data: result.value };
      return { success: false, error: result.error.message };
    });

    // Signal completion
    this.commandComplete();
  }
}
