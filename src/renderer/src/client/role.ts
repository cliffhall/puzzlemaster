import { Role, RoleResult } from "../../../types/domain";

export async function createRole(): Promise<Role | undefined> {
  const result: RoleResult = await window.puzzlemaster.role.createRole({
    name: "Coder",
    description: "A typescript coder",
  });

  if (result.success) {
    console.log("Created Role:", result.data);
    return result.data;
  }
  console.log("Error:", result.error);
  return undefined;
}
