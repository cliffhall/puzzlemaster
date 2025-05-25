export type Settings = { theme: string; language: string }

export type loadPreferencesResult = Promise<Settings>
export type savePreferencesResult = Promise<void>

export interface API {
  loadPreferences: () => loadPreferencesResult
  savePreferences: (prefs: { theme: string; language: string }) => savePreferencesResult
}
