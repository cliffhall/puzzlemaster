import { createTestRoleProxy } from "../../../../test/role-proxy-test-helper";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { RoleDTO } from "../../../../types/domain";
import { RoleProxy } from "../RoleProxy";
import { randomUUID } from "crypto";
import { PrismaClient } from "db";

describe("RoleProxy", () => {
  let testSetup: {
    prisma: PrismaClient;
    roleProxy: RoleProxy;
    cleanup: () => Promise<void>;
  };

  beforeEach(async () => {
    testSetup = await createTestRoleProxy();
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  describe("createRole", () => {
    it("should create a role in the database", async () => {
      // Set up test data
      const roleDTO: RoleDTO = {
        id: randomUUID(),
        name: "Test Role",
        description: "A test role description",
      };

      // Call the method under test
      const result = await testSetup.roleProxy.createRole(roleDTO);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const role = result.value;
        expect(role.id).toBe(roleDTO.id);
        expect(role.name).toBe(roleDTO.name);
        expect(role.description).toBe(roleDTO.description);
      }

      // Verify the role was created in the database
      const dbRole = await testSetup.prisma.role.findUnique({
        where: { id: roleDTO.id },
      });

      expect(dbRole).not.toBeNull();
      expect(dbRole?.name).toBe(roleDTO.name);
      expect(dbRole?.description).toBe(roleDTO.description);
    });

    it("should create a role without description", async () => {
      // Set up test data
      const roleDTO: RoleDTO = {
        id: randomUUID(),
        name: "Test Role Without Description",
      };

      // Call the method under test
      const result = await testSetup.roleProxy.createRole(roleDTO);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const role = result.value;
        expect(role.id).toBe(roleDTO.id);
        expect(role.name).toBe(roleDTO.name);
        expect(role.description).toBeUndefined();
      }
    });
  });

  describe("getRole", () => {
    it("should get a role by ID", async () => {
      // Set up test data
      const roleDTO: RoleDTO = {
        id: randomUUID(),
        name: "Test Role",
        description: "A test role description",
      };

      // Create the role first
      await testSetup.roleProxy.createRole(roleDTO);

      // Call the method under test
      const result = await testSetup.roleProxy.getRole(roleDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const role = result.value;
        expect(role.id).toBe(roleDTO.id);
        expect(role.name).toBe(roleDTO.name);
        expect(role.description).toBe(roleDTO.description);
      }
    });

    it("should return an error when role is not found", async () => {
      // Use a non-existent ID
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.roleProxy.getRole(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain(
          `Role with ID ${nonExistentId} not found`,
        );
      }
    });
  });

  describe("getRoles", () => {
    it("should get all roles", async () => {
      // Set up test data
      const role1DTO: RoleDTO = {
        id: randomUUID(),
        name: "Test Role 1",
        description: "First test role",
      };

      const role2DTO: RoleDTO = {
        id: randomUUID(),
        name: "Test Role 2",
        description: "Second test role",
      };

      // Create the roles first
      await testSetup.roleProxy.createRole(role1DTO);
      await testSetup.roleProxy.createRole(role2DTO);

      // Call the method under test
      const result = await testSetup.roleProxy.getRoles();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const roles = result.value;
        expect(roles).toHaveLength(2);

        const roleIds = roles.map((role) => role.id);
        expect(roleIds).toContain(role1DTO.id);
        expect(roleIds).toContain(role2DTO.id);
      }
    });

    it("should return an empty array when no roles exist", async () => {
      // Call the method under test
      const result = await testSetup.roleProxy.getRoles();

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const roles = result.value;
        expect(roles).toHaveLength(0);
      }
    });
  });

  describe("updateRole", () => {
    it("should update a role's name", async () => {
      // Set up test data
      const roleDTO: RoleDTO = {
        id: randomUUID(),
        name: "Original Role Name",
        description: "Original description",
      };

      // Create the role first
      await testSetup.roleProxy.createRole(roleDTO);

      // Call the method under test
      const result = await testSetup.roleProxy.updateRole(roleDTO.id, {
        name: "Updated Role Name",
      });

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const role = result.value;
        expect(role.id).toBe(roleDTO.id);
        expect(role.name).toBe("Updated Role Name");
        expect(role.description).toBe(roleDTO.description); // Should remain unchanged
      }

      // Verify the role was updated in the database
      const dbRole = await testSetup.prisma.role.findUnique({
        where: { id: roleDTO.id },
      });

      expect(dbRole?.name).toBe("Updated Role Name");
    });

    it("should update a role's description", async () => {
      // Set up test data
      const roleDTO: RoleDTO = {
        id: randomUUID(),
        name: "Test Role",
        description: "Original description",
      };

      // Create the role first
      await testSetup.roleProxy.createRole(roleDTO);

      // Call the method under test
      const result = await testSetup.roleProxy.updateRole(roleDTO.id, {
        description: "Updated description",
      });

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const role = result.value;
        expect(role.id).toBe(roleDTO.id);
        expect(role.name).toBe(roleDTO.name); // Should remain unchanged
        expect(role.description).toBe("Updated description");
      }
    });

    it("should clear a role's description when set to undefined", async () => {
      // Set up test data
      const roleDTO: RoleDTO = {
        id: randomUUID(),
        name: "Test Role",
        description: "Original description",
      };

      // Create the role first
      await testSetup.roleProxy.createRole(roleDTO);

      // Call the method under test
      const result = await testSetup.roleProxy.updateRole(roleDTO.id, {
        description: undefined,
      });

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        const role = result.value;
        expect(role.description).toBeUndefined();
      }
    });

    it("should return an error when role is not found", async () => {
      // Use a non-existent ID
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.roleProxy.updateRole(nonExistentId, {
        name: "Updated Name",
      });

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain(
          `Role with ID ${nonExistentId} not found`,
        );
      }
    });
  });

  describe("deleteRole", () => {
    it("should delete a role", async () => {
      // Set up test data
      const roleDTO: RoleDTO = {
        id: randomUUID(),
        name: "Test Role",
        description: "A test role to be deleted",
      };

      // Create the role first
      await testSetup.roleProxy.createRole(roleDTO);

      // Verify the role exists
      const beforeDelete = await testSetup.prisma.role.findUnique({
        where: { id: roleDTO.id },
      });
      expect(beforeDelete).not.toBeNull();

      // Call the method under test
      const result = await testSetup.roleProxy.deleteRole(roleDTO.id);

      // Verify the result
      expect(result.isOk()).toBe(true);

      if (result.isOk()) {
        expect(result.value).toBe(true);
      }

      // Verify the role was deleted from the database
      const afterDelete = await testSetup.prisma.role.findUnique({
        where: { id: roleDTO.id },
      });
      expect(afterDelete).toBeNull();
    });

    it("should return an error when role is not found", async () => {
      // Use a non-existent ID
      const nonExistentId = randomUUID();

      // Call the method under test
      const result = await testSetup.roleProxy.deleteRole(nonExistentId);

      // Verify the result
      expect(result.isErr()).toBe(true);

      if (result.isErr()) {
        expect(result.error.message).toContain(
          `Role with ID ${nonExistentId} not found`,
        );
      }
    });
  });
});
