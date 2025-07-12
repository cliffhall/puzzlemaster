import { ipcRenderer } from "electron";
import { API, Settings } from "../types/api";

export const api: API = {
  loadPreferences: () => ipcRenderer.invoke("load-prefs"),
  savePreferences: (prefs: Settings) => ipcRenderer.invoke("save-prefs", prefs),
  createDemoUser: () => ipcRenderer.invoke("create-demo-user"),
};
