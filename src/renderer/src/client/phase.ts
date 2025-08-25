import {
  Phase,
  PhaseResult,
  PhaseListResult,
  DeleteResult,
  PhaseDTO,
  CreatePhaseDTO,
} from "../../../types/domain";

export async function createPhase(
  phaseData: CreatePhaseDTO,
): Promise<Phase | undefined> {
  const result: PhaseResult =
    await window.puzzlemaster.phase.createPhase(phaseData);
  let returnValue: Phase | undefined;

  if (result.success) {
    console.log("Created Phase:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getPhase(id: string): Promise<Phase | undefined> {
  const result: PhaseResult = await window.puzzlemaster.phase.getPhase(id);
  let returnValue: Phase | undefined;

  if (result.success) {
    console.log("Retrieved Phase:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getPhases(): Promise<Phase[] | undefined> {
  const result: PhaseListResult = await window.puzzlemaster.phase.getPhases();
  let returnValue: Phase[] | undefined;

  if (result.success) {
    console.log("Retrieved Phases:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function updatePhase(
  phaseData: PhaseDTO,
): Promise<Phase | undefined> {
  const result: PhaseResult =
    await window.puzzlemaster.phase.updatePhase(phaseData);
  let returnValue: Phase | undefined;

  if (result.success) {
    console.log("Updated Phase:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function deletePhase(id: string): Promise<boolean | undefined> {
  const result: DeleteResult = await window.puzzlemaster.phase.deletePhase(id);
  let returnValue: boolean | undefined;

  if (result.success) {
    console.log("Deleted Phase:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}
