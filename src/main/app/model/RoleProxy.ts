import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { DomainError } from "../../../types/domain/DomainError";
import { Role, RoleDTO } from "../../../types/domain/Role";
import { Result, ok, err } from "neverthrow";
import { PrismaClient } from "db";

// For production code, use a singleton instance
const prisma = new PrismaClient();

export class RoleProxy extends Proxy {
  static NAME: string = "RoleProxy";
  private prismaClient: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    super(RoleProxy.NAME, process);
    this.prismaClient = prismaClient || prisma;
  }

  /**
   * Create a new role in the database
   * @param roleDTO The role data transfer object
   * @returns A Result containing the created role or a DomainError
   */
  public async createRole(
    roleDTO: RoleDTO,
  ): Promise<Result<Role, DomainError>> {
    try {
      const role = await this.prismaClient.role.create({
        data: {
          id: roleDTO.id,
          name: roleDTO.name,
          description: roleDTO.description,
        },
      });

      return Role.create({
        id: role.id,
        name: role.name,
        description: role.description || undefined,
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to create role", error));
    }
  }

  /**
   * Get a role by ID
   * @param id The role ID
   * @returns A Result containing the role or a DomainError
   */
  public async getRole(id: string): Promise<Result<Role, DomainError>> {
    try {
      const role = await this.prismaClient.role.findUnique({
        where: { id },
      });

      if (!role) {
        return err(new DomainError(`Role with ID ${id} not found`));
      }

      return Role.create({
        id: role.id,
        name: role.name,
        description: role.description || undefined,
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to get role", error));
    }
  }

  /**
   * Get all roles
   * @returns A Result containing an array of roles or a DomainError
   */
  public async getRoles(): Promise<Result<Role[], DomainError>> {
    try {
      const roles = await this.prismaClient.role.findMany();

      const roleResults = roles.map((role) =>
        Role.create({
          id: role.id,
          name: role.name,
          description: role.description || undefined,
        }),
      );

      // Process the results using neverthrow's combinatorial functions
      // Use the .combine method to safely combine all results or return the first error
      return Result.combine(roleResults);
    } catch (error) {
      return err(DomainError.fromError("Failed to get roles", error));
    }
  }

  /**
   * Update a role
   * @param id The role ID
   * @param roleDTO The role data transfer object (can be only fields that changed)
   * @returns A Result containing the updated role or a DomainError
   */
  public async updateRole(
    id: string,
    roleDTO: Partial<RoleDTO>,
  ): Promise<Result<Role, DomainError>> {
    try {
      // First check if the role exists
      const existingRole = await this.prismaClient.role.findUnique({
        where: { id },
      });

      if (!existingRole) {
        return err(new DomainError(`Role with ID ${id} not found`));
      }

      // Prepare update data
      const updateData: {
        name?: string;
        description?: string | null;
      } = {};
      if (roleDTO.name !== undefined) updateData.name = roleDTO.name;
      if ("description" in roleDTO) {
        updateData.description = roleDTO.description || null;
      }

      // Update the role
      const role = await this.prismaClient.role.update({
        where: { id },
        data: updateData,
      });

      return Role.create({
        id: role.id,
        name: role.name,
        description: role.description || undefined,
      });
    } catch (error) {
      return err(DomainError.fromError("Failed to update role", error));
    }
  }

  /**
   * Delete a role
   * @param id The role ID
   * @returns A Result containing a success boolean or a DomainError
   */
  public async deleteRole(id: string): Promise<Result<boolean, DomainError>> {
    try {
      // First check if the role exists
      const existingRole = await this.prismaClient.role.findUnique({
        where: { id },
      });

      if (!existingRole) {
        return err(new DomainError(`Role with ID ${id} not found`));
      }

      // Delete the role
      await this.prismaClient.role.delete({
        where: { id },
      });

      return ok(true);
    } catch (error) {
      return err(DomainError.fromError("Failed to delete role", error));
    }
  }
}
