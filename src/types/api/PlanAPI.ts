import {
  PlanDTO,
  CreatePlanDTO,
  PlanResult,
  PlanListResult,
  DeleteResult,
} from "../domain";

export interface PlanAPI {
  createPlan: (planDTO: CreatePlanDTO) => Promise<PlanResult>;
  getPlan: (id: string) => Promise<PlanResult>;
  getPlans: () => Promise<PlanListResult>;
  updatePlan: (planDTO: PlanDTO) => Promise<PlanResult>;
  deletePlan: (id: string) => Promise<DeleteResult>;
}
