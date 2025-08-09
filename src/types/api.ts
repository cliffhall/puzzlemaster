export type Settings = { theme: string; language: string };
export type DemoUser = { id: number; name: string | null; email: string };

export type LoadPreferencesResult = Promise<Settings>;
export type SavePreferencesResult = Promise<void>;
export type CreateDemoUserResult = Promise<DemoUser>;

export interface API {
  loadPreferences: () => LoadPreferencesResult;
  savePreferences: (prefs: Settings) => SavePreferencesResult;
  createDemoUser: () => CreateDemoUserResult;
}
