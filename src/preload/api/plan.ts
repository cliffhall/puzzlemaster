import { ipcRenderer } from "electron";
import { PlanAPI } from "../../domain/api/PlanAPI";
import { PlanAPIMethods, PlanDTO, CreatePlanDTO } from "../../domain";

export const plan: PlanAPI = {
  createPlan: (planDTO: CreatePlanDTO) =>
    ipcRenderer.invoke(PlanAPIMethods.CREATE_PLAN, planDTO),
  getPlan: (id: string) => ipcRenderer.invoke(PlanAPIMethods.GET_PLAN, id),
  getPlans: () => ipcRenderer.invoke(PlanAPIMethods.GET_PLANS),
  getPlanByProject: (projectId: string) =>
    ipcRenderer.invoke(PlanAPIMethods.GET_PLAN_BY_PROJECT, projectId),
  updatePlan: (planDTO: PlanDTO) =>
    ipcRenderer.invoke(PlanAPIMethods.UPDATE_PLAN, planDTO),
  deletePlan: (id: string) =>
    ipcRenderer.invoke(PlanAPIMethods.DELETE_PLAN, id),
};
