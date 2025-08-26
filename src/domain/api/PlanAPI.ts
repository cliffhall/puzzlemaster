import {
  PlanDTO,
  CreatePlanDTO,
  PlanResult,
  PlanListResult,
  DeleteResult,
} from "../index";

export interface PlanAPI {
  createPlan: (planDTO: CreatePlanDTO) => Promise<PlanResult>;
  getPlan: (id: string) => Promise<PlanResult>;
  getPlans: () => Promise<PlanListResult>;
  updatePlan: (planDTO: PlanDTO) => Promise<PlanResult>;
  deletePlan: (id: string) => Promise<DeleteResult>;
}
