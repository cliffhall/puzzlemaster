import { ipcRenderer } from "electron";
import { PlanAPI } from "../../types/api/PlanAPI";
import { PlanAPIMethods, PlanDTO } from "../../types/domain";

export const plan: PlanAPI = {
  createPlan: (planDTO: PlanDTO) =>
    ipcRenderer.invoke(PlanAPIMethods.CREATE_PLAN, planDTO),
  getPlan: (id: string) => ipcRenderer.invoke(PlanAPIMethods.GET_PLAN, id),
  getPlans: () => ipcRenderer.invoke(PlanAPIMethods.GET_PLANS),
  updatePlan: (planDTO: PlanDTO) =>
    ipcRenderer.invoke(PlanAPIMethods.UPDATE_PLAN, planDTO),
  deletePlan: (id: string) =>
    ipcRenderer.invoke(PlanAPIMethods.DELETE_PLAN, id),
};
