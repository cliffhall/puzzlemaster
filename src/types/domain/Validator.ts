/**
 * Validator
 * - A prompt template intended to validate whether a task is complete or if action can be taken.
 */

import { z } from "zod";
import { Result, ok, err } from "neverthrow";
import { DomainError } from "./DomainError";

export const ValidatorSchema = z.object({
  id: z.string().uuid(),
  template: z.string().min(1),
  resource: z.string().min(1),
});

export type ValidatorDTO = z.infer<typeof ValidatorSchema>;

export enum ValidatorAPIMethods {
  CREATE_VALIDATOR = "create-validator",
  GET_VALIDATOR = "get-validator",
  GET_VALIDATORS = "get-validators",
  UPDATE_VALIDATOR = "update-validator",
  DELETE_VALIDATOR = "delete-validator",
}

export class Validator {
  private constructor(
    public readonly id: string,
    public template: string,
    public resource: string,
  ) {}

  static create(dto: ValidatorDTO): Result<Validator, DomainError> {
    const parsed = ValidatorSchema.safeParse(dto);
    if (!parsed.success) return err(new DomainError(parsed.error.message));
    const { id, template, resource } = parsed.data;
    return ok(new Validator(id, template, resource));
  }
}
