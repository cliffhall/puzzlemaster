import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { Validator, ValidatorDTO, DomainError } from "../../../domain";
import { Result, ok, err } from "neverthrow";
import { PrismaClient } from "db";

// For production code, use a singleton instance
const prisma = new PrismaClient();

export class ValidatorProxy extends Proxy {
  static NAME: string = "ValidatorProxy";
  private prismaClient: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    super(ValidatorProxy.NAME, process);
    this.prismaClient = prismaClient || prisma;
  }

  /**
   * Create a new validator in the database
   * @param validatorDTO The validator data transfer object
   * @returns A Result containing the created validator or a DomainError
   */
  public async createValidator(
    validatorDTO: ValidatorDTO,
  ): Promise<Result<Validator, DomainError>> {
    try {
      const validator = await this.prismaClient.validator.create({
        data: {
          id: validatorDTO.id,
          template: validatorDTO.template,
          resource: validatorDTO.resource,
        },
      });

      return Validator.create({
        id: validator.id,
        template: validator.template,
        resource: validator.resource,
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to create validator", error));
    }
  }

  /**
   * Get a validator by ID
   * @param id The validator ID
   * @returns A Result containing the validator or a DomainError
   */
  public async getValidator(
    id: string,
  ): Promise<Result<Validator, DomainError>> {
    try {
      const validator = await this.prismaClient.validator.findUnique({
        where: { id },
      });

      if (!validator) {
        return err(new DomainError(`Validator with ID ${id} not found`));
      }

      return Validator.create({
        id: validator.id,
        template: validator.template,
        resource: validator.resource,
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to get validator", error));
    }
  }

  /**
   * Get all validators
   * @returns A Result containing an array of validators or a DomainError
   */
  public async getValidators(): Promise<Result<Validator[], DomainError>> {
    try {
      const validators = await this.prismaClient.validator.findMany();

      const validatorResults = validators.map((validator) =>
        Validator.create({
          id: validator.id,
          template: validator.template,
          resource: validator.resource,
        }),
      );

      // Process the results using neverthrow's combinatorial functions
      // Use the .combine method to safely combine all results or return the first error
      return Result.combine(validatorResults);
    } catch (error) {
      return err(DomainError.fromError("Failed to get validators", error));
    }
  }

  /**
   * Update a validator
   * @param id The validator ID
   * @param validatorDTO The validator data transfer object (can be only fields that changed)
   * @returns A Result containing the updated validator or a DomainError
   */
  public async updateValidator(
    id: string,
    validatorDTO: Partial<ValidatorDTO>,
  ): Promise<Result<Validator, DomainError>> {
    try {
      // First check if the validator exists
      const existingValidator = await this.prismaClient.validator.findUnique({
        where: { id },
      });

      if (!existingValidator) {
        return err(new DomainError(`Validator with ID ${id} not found`));
      }

      // Prepare update data
      const updateData: {
        template?: string;
        resource?: string;
      } = {};
      if (validatorDTO.template) updateData.template = validatorDTO.template;
      if (validatorDTO.resource) updateData.resource = validatorDTO.resource;

      // Update the validator
      const validator = await this.prismaClient.validator.update({
        where: { id },
        data: updateData,
      });

      return Validator.create({
        id: validator.id,
        template: validator.template,
        resource: validator.resource,
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to update validator", error));
    }
  }

  /**
   * Delete a validator
   * @param id The validator ID
   * @returns A Result containing a success boolean or a DomainError
   */
  public async deleteValidator(
    id: string,
  ): Promise<Result<boolean, DomainError>> {
    try {
      // First check if the validator exists
      const existingValidator = await this.prismaClient.validator.findUnique({
        where: { id },
      });

      if (!existingValidator) {
        return err(new DomainError(`Validator with ID ${id} not found`));
      }

      // Delete the validator
      await this.prismaClient.validator.delete({
        where: { id },
      });

      return ok(true);
    } catch (error) {
      return err(DomainError.fromError("Failed to delete validator", error));
    }
  }
}
