import { createTestValidatorProxy } from "./helpers/validator-proxy-test-helper";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ValidatorDTO } from "../../../../domain";
import { ValidatorProxy } from "../ValidatorProxy";
import { randomUUID } from "crypto";
import { PrismaClient } from "db";

describe("ValidatorProxy", () => {
  let testSetup: {
    prisma: PrismaClient;
    validatorProxy: ValidatorProxy;
    cleanup: () => Promise<void>;
  };

  beforeEach(async () => {
    testSetup = await createTestValidatorProxy();
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  describe("createValidator", () => {
    it("should create a validator in the database", async () => {
      // Set up test data
      const validatorDTO: ValidatorDTO = {
        id: randomUUID(),
        template: "Test template for validation",
        resource: "test-resource",
      };

      // Call the method under test
      const result =
        await testSetup.validatorProxy.createValidator(validatorDTO);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const validator = result.value;
        expect(validator.id).toBe(validatorDTO.id);
        expect(validator.template).toBe(validatorDTO.template);
        expect(validator.resource).toBe(validatorDTO.resource);
      }

      // Verify the validator was created in the database
      const dbValidator = await testSetup.prisma.validator.findUnique({
        where: { id: validatorDTO.id },
      });

      expect(dbValidator).not.toBeNull();
      expect(dbValidator?.template).toBe(validatorDTO.template);
      expect(dbValidator?.resource).toBe(validatorDTO.resource);
    });
  });

  describe("getValidator", () => {
    it("should retrieve a validator by ID", async () => {
      // Set up test data
      const validatorDTO: ValidatorDTO = {
        id: randomUUID(),
        template: "Test template for validation",
        resource: "test-resource",
      };

      // Create the validator first
      await testSetup.validatorProxy.createValidator(validatorDTO);

      // Call the method under test
      const result = await testSetup.validatorProxy.getValidator(
        validatorDTO.id,
      );

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const validator = result.value;
        expect(validator.id).toBe(validatorDTO.id);
        expect(validator.template).toBe(validatorDTO.template);
        expect(validator.resource).toBe(validatorDTO.resource);
      }
    });

    it("should return an error when validator is not found", async () => {
      // Use a non-existent ID
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.validatorProxy.getValidator(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain(
          `Validator with ID ${nonExistentId} not found`,
        );
      }
    });
  });

  describe("getValidators", () => {
    it("should retrieve all validators", async () => {
      // Set up test data
      const validator1DTO: ValidatorDTO = {
        id: randomUUID(),
        template: "First test template",
        resource: "first-resource",
      };

      const validator2DTO: ValidatorDTO = {
        id: randomUUID(),
        template: "Second test template",
        resource: "second-resource",
      };

      // Create validators
      await testSetup.validatorProxy.createValidator(validator1DTO);
      await testSetup.validatorProxy.createValidator(validator2DTO);

      // Call the method under test
      const result = await testSetup.validatorProxy.getValidators();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const validators = result.value;
        expect(validators).toHaveLength(2);

        const validator1 = validators.find((v) => v.id === validator1DTO.id);
        const validator2 = validators.find((v) => v.id === validator2DTO.id);

        expect(validator1).toBeDefined();
        expect(validator1?.template).toBe(validator1DTO.template);
        expect(validator1?.resource).toBe(validator1DTO.resource);

        expect(validator2).toBeDefined();
        expect(validator2?.template).toBe(validator2DTO.template);
        expect(validator2?.resource).toBe(validator2DTO.resource);
      }
    });

    it("should return an empty array when no validators exist", async () => {
      // Call the method under test
      const result = await testSetup.validatorProxy.getValidators();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const validators = result.value;
        expect(validators).toHaveLength(0);
      }
    });
  });

  describe("updateValidator", () => {
    it("should update a validator's template", async () => {
      // Set up test data
      const validatorDTO: ValidatorDTO = {
        id: randomUUID(),
        template: "Original template",
        resource: "test-resource",
      };

      // Create the validator first
      await testSetup.validatorProxy.createValidator(validatorDTO);

      // Call the method under test
      const result = await testSetup.validatorProxy.updateValidator(
        validatorDTO.id,
        {
          template: "Updated template",
        },
      );

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const validator = result.value;
        expect(validator.id).toBe(validatorDTO.id);
        expect(validator.template).toBe("Updated template");
        expect(validator.resource).toBe(validatorDTO.resource);
      }

      // Verify the validator was updated in the database
      const dbValidator = await testSetup.prisma.validator.findUnique({
        where: { id: validatorDTO.id },
      });

      expect(dbValidator?.template).toBe("Updated template");
    });

    it("should update a validator's resource", async () => {
      // Set up test data
      const validatorDTO: ValidatorDTO = {
        id: randomUUID(),
        template: "Test template",
        resource: "original-resource",
      };

      // Create the validator first
      await testSetup.validatorProxy.createValidator(validatorDTO);

      // Call the method under test
      const result = await testSetup.validatorProxy.updateValidator(
        validatorDTO.id,
        {
          resource: "updated-resource",
        },
      );

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const validator = result.value;
        expect(validator.id).toBe(validatorDTO.id);
        expect(validator.template).toBe(validatorDTO.template);
        expect(validator.resource).toBe("updated-resource");
      }

      // Verify the validator was updated in the database
      const dbValidator = await testSetup.prisma.validator.findUnique({
        where: { id: validatorDTO.id },
      });

      expect(dbValidator?.resource).toBe("updated-resource");
    });

    it("should update both template and resource", async () => {
      // Set up test data
      const validatorDTO: ValidatorDTO = {
        id: randomUUID(),
        template: "Original template",
        resource: "original-resource",
      };

      // Create the validator first
      await testSetup.validatorProxy.createValidator(validatorDTO);

      // Call the method under test
      const result = await testSetup.validatorProxy.updateValidator(
        validatorDTO.id,
        {
          template: "Updated template",
          resource: "updated-resource",
        },
      );

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const validator = result.value;
        expect(validator.id).toBe(validatorDTO.id);
        expect(validator.template).toBe("Updated template");
        expect(validator.resource).toBe("updated-resource");
      }
    });

    it("should return an error when validator is not found", async () => {
      // Use a non-existent ID
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.validatorProxy.updateValidator(
        nonExistentId,
        {
          template: "Updated template",
        },
      );

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain(
          `Validator with ID ${nonExistentId} not found`,
        );
      }
    });
  });

  describe("deleteValidator", () => {
    it("should delete a validator", async () => {
      // Set up test data
      const validatorDTO: ValidatorDTO = {
        id: randomUUID(),
        template: "Test template",
        resource: "test-resource",
      };

      // Create the validator first
      await testSetup.validatorProxy.createValidator(validatorDTO);

      // Verify the validator exists
      const beforeDelete = await testSetup.prisma.validator.findUnique({
        where: { id: validatorDTO.id },
      });
      expect(beforeDelete).not.toBeNull();

      // Call the method under test
      const result = await testSetup.validatorProxy.deleteValidator(
        validatorDTO.id,
      );

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        expect(result.value).toBe(true);
      }

      // Verify the validator was deleted from the database
      const afterDelete = await testSetup.prisma.validator.findUnique({
        where: { id: validatorDTO.id },
      });
      expect(afterDelete).toBeNull();
    });

    it("should return an error when validator is not found", async () => {
      // Use a non-existent ID
      const nonExistentId = randomUUID();

      // Call the method under test
      const result =
        await testSetup.validatorProxy.deleteValidator(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain(
          `Validator with ID ${nonExistentId} not found`,
        );
      }
    });
  });
});
