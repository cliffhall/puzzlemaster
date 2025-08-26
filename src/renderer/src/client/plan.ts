import {
  Plan,
  PlanResult,
  PlanListResult,
  DeleteResult,
  PlanDTO,
  CreatePlanDTO,
} from "../../../domain";

export async function createPlan(
  planData: CreatePlanDTO,
): Promise<Plan | undefined> {
  const result: PlanResult =
    await window.puzzlemaster.plan.createPlan(planData);
  let returnValue: Plan | undefined;

  if (result.success) {
    console.log("Created Plan:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getPlan(id: string): Promise<Plan | undefined> {
  const result: PlanResult = await window.puzzlemaster.plan.getPlan(id);
  let returnValue: Plan | undefined;

  if (result.success) {
    console.log("Retrieved Plan:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getPlans(): Promise<Plan[] | undefined> {
  const result: PlanListResult = await window.puzzlemaster.plan.getPlans();
  let returnValue: Plan[] | undefined;

  if (result.success) {
    console.log("Retrieved Plans:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function updatePlan(planData: PlanDTO): Promise<Plan | undefined> {
  const result: PlanResult =
    await window.puzzlemaster.plan.updatePlan(planData);
  let returnValue: Plan | undefined;

  if (result.success) {
    console.log("Updated Plan:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function deletePlan(id: string): Promise<boolean | undefined> {
  const result: DeleteResult = await window.puzzlemaster.plan.deletePlan(id);
  let returnValue: boolean | undefined;

  if (result.success) {
    console.log("Deleted Plan:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}
