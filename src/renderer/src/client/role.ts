import {
  Role,
  RoleResult,
  RoleListResult,
  DeleteResult,
  CreateRoleDTO,
  RoleDTO,
} from "../../../domain";

export async function createRole(
  roleData: CreateRoleDTO,
): Promise<Role | undefined> {
  const result: RoleResult =
    await window.puzzlemaster.role.createRole(roleData);
  let returnValue: Role | undefined;

  if (result.success) {
    console.log("Created Role:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getRole(id: string): Promise<Role | undefined> {
  const result: RoleResult = await window.puzzlemaster.role.getRole(id);
  let returnValue: Role | undefined;

  if (result.success) {
    console.log("Retrieved Role:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function getRoles(): Promise<Role[] | undefined> {
  const result: RoleListResult = await window.puzzlemaster.role.getRoles();
  let returnValue: Role[] | undefined;

  if (result.success) {
    console.log("Retrieved Roles:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function updateRole(roleData: RoleDTO): Promise<Role | undefined> {
  const result: RoleResult =
    await window.puzzlemaster.role.updateRole(roleData);
  let returnValue: Role | undefined;

  if (result.success) {
    console.log("Updated Role:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}

export async function deleteRole(id: string): Promise<boolean | undefined> {
  const result: DeleteResult = await window.puzzlemaster.role.deleteRole(id);
  let returnValue: boolean | undefined;

  if (result.success) {
    console.log("Deleted Role:", result.data);
    returnValue = result.data;
  } else {
    console.log("Error:", result.error);
    returnValue = undefined;
  }

  return returnValue;
}
