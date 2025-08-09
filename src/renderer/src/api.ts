import { CreateDemoUserResult, DemoUser } from "../../types/api";

export async function createDemoUser(): CreateDemoUserResult {
  const user: DemoUser = await window.api.createDemoUser();
  console.log("Created Demo User:", user);
  return user;
}
