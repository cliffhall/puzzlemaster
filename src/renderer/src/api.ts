import { loadPreferencesResult, savePreferencesResult, Settings } from '../../types/api'

export async function getPreferences(): loadPreferencesResult {
  const preferences = await window.api.loadPreferences()
  console.log('Fetched Preferences:', preferences)
  return preferences
}

export async function setPreferences(settings: Settings): savePreferencesResult {
  await window.api.savePreferences(settings)
  console.log('Saved Preferences:', settings)
}
