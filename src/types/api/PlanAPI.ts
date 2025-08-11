import { PlanDTO, PlanResult, PlanListResult, DeleteResult } from "../domain";

export interface PlanAPI {
  createPlan: (planDTO: PlanDTO) => Promise<PlanResult>;
  getPlan: (id: string) => Promise<PlanResult>;
  getPlans: () => Promise<PlanListResult>;
  updatePlan: (planDTO: PlanDTO) => Promise<PlanResult>;
  deletePlan: (id: string) => Promise<DeleteResult>;
}
