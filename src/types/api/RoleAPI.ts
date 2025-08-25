import {
  RoleDTO,
  CreateRoleDTO,
  RoleResult,
  RoleListResult,
  DeleteResult,
} from "../domain";

export interface RoleAPI {
  createRole: (roleDTO: CreateRoleDTO) => Promise<RoleResult>;
  getRole: (id: string) => Promise<RoleResult>;
  getRoles: () => Promise<RoleListResult>;
  updateRole: (roleDTO: RoleDTO) => Promise<RoleResult>;
  deleteRole: (id: string) => Promise<DeleteResult>;
}
