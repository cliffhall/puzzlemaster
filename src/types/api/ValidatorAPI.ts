import {
  ValidatorDTO,
  CreateValidatorDTO,
  ValidatorResult,
  ValidatorListResult,
  DeleteResult,
} from "../domain";

export interface ValidatorAPI {
  createValidator: (
    validatorDTO: CreateValidatorDTO,
  ) => Promise<ValidatorResult>;
  getValidator: (id: string) => Promise<ValidatorResult>;
  getValidators: () => Promise<ValidatorListResult>;
  updateValidator: (validatorDTO: ValidatorDTO) => Promise<ValidatorResult>;
  deleteValidator: (id: string) => Promise<DeleteResult>;
}
