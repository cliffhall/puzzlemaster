import {
  Validator,
  ValidatorResult,
  ValidatorListResult,
  DeleteResult,
  ValidatorDTO,
  CreateValidatorDTO,
} from "../../../types/domain";

export async function createValidator(
  validatorData: CreateValidatorDTO,
): Promise<Validator | undefined> {
  const result: ValidatorResult =
    await window.puzzlemaster.validator.createValidator(validatorData);
  let returnValue: Validator | undefined;

  if (result.success) {
    console.log("Created Validator:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getValidator(id: string): Promise<Validator | undefined> {
  const result: ValidatorResult =
    await window.puzzlemaster.validator.getValidator(id);
  let returnValue: Validator | undefined;

  if (result.success) {
    console.log("Retrieved Validator:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getValidators(): Promise<Validator[] | undefined> {
  const result: ValidatorListResult =
    await window.puzzlemaster.validator.getValidators();
  let returnValue: Validator[] | undefined;

  if (result.success) {
    console.log("Retrieved Validators:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function updateValidator(
  validatorData: ValidatorDTO,
): Promise<Validator | undefined> {
  const result: ValidatorResult =
    await window.puzzlemaster.validator.updateValidator(validatorData);
  let returnValue: Validator | undefined;

  if (result.success) {
    console.log("Updated Validator:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function deleteValidator(
  id: string,
): Promise<boolean | undefined> {
  const result: DeleteResult =
    await window.puzzlemaster.validator.deleteValidator(id);
  let returnValue: boolean | undefined;

  if (result.success) {
    console.log("Deleted Validator:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}
