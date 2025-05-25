import { ipcRenderer } from 'electron'
import { API } from '../types/api'

export const api: API = {
  loadPreferences: () => ipcRenderer.invoke('load-prefs'),
  savePreferences: (prefs: { theme: string; language: string }) =>
    ipcRenderer.invoke('save-prefs', prefs)
}
