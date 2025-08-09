import {
  LoadPreferencesResult,
  SavePreferencesResult,
  CreateDemoUserResult,
  Settings,
  DemoUser,
} from "../../types/api";

export async function createDemoUser(): CreateDemoUserResult {
  const user: DemoUser = await window.api.createDemoUser();
  console.log("Created Demo User:", user);
  return user;
}

export async function getPreferences(): LoadPreferencesResult {
  const preferences = await window.api.loadPreferences();
  console.log("Fetched Preferences:", preferences);
  return preferences;
}

export async function setPreferences(
  settings: Settings,
): SavePreferencesResult {
  await window.api.savePreferences(settings);
  console.log("Saved Preferences:", settings);
}
