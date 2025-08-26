import {
  Action,
  ActionResult,
  ActionListResult,
  DeleteResult,
  ActionDTO,
  CreateActionDTO,
} from "../../../domain";

export async function createAction(
  actionData: CreateActionDTO,
): Promise<Action | undefined> {
  const result: ActionResult =
    await window.puzzlemaster.action.createAction(actionData);
  let returnValue: Action | undefined;

  if (result.success) {
    console.log("Created Action:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getAction(id: string): Promise<Action | undefined> {
  const result: ActionResult = await window.puzzlemaster.action.getAction(id);
  let returnValue: Action | undefined;

  if (result.success) {
    console.log("Retrieved Action:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getActions(): Promise<Action[] | undefined> {
  const result: ActionListResult =
    await window.puzzlemaster.action.getActions();
  let returnValue: Action[] | undefined;

  if (result.success) {
    console.log("Retrieved Actions:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getActionsByPhase(
  phaseId: string,
): Promise<Action[] | undefined> {
  const result: ActionListResult =
    await window.puzzlemaster.action.getActionsByPhase(phaseId);
  let returnValue: Action[] | undefined;

  if (result.success) {
    console.log("Retrieved Actions by Phase:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function updateAction(
  actionData: ActionDTO,
): Promise<Action | undefined> {
  const result: ActionResult =
    await window.puzzlemaster.action.updateAction(actionData);
  let returnValue: Action | undefined;

  if (result.success) {
    console.log("Updated Action:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function deleteAction(id: string): Promise<boolean | undefined> {
  const result: DeleteResult =
    await window.puzzlemaster.action.deleteAction(id);
  let returnValue: boolean | undefined;

  if (result.success) {
    console.log("Deleted Action:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}
