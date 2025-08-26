import { ipcRenderer } from "electron";
import { RoleAPI } from "../../domain/api/RoleAPI";
import { CreateRoleDTO, RoleAPIMethods, RoleDTO } from "../../domain";

export const role: RoleAPI = {
  createRole: (roleDTO: CreateRoleDTO) =>
    ipcRenderer.invoke(RoleAPIMethods.CREATE_ROLE, roleDTO),
  getRole: (id: string) => ipcRenderer.invoke(RoleAPIMethods.GET_ROLE, id),
  getRoles: () => ipcRenderer.invoke(RoleAPIMethods.GET_ROLES),
  updateRole: (roleDTO: RoleDTO) =>
    ipcRenderer.invoke(RoleAPIMethods.UPDATE_ROLE, roleDTO),
  deleteRole: (id: string) =>
    ipcRenderer.invoke(RoleAPIMethods.DELETE_ROLE, id),
};
