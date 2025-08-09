import { ipcRenderer } from "electron";
import { API } from "../types/api";

export const api: API = {
  createDemoUser: () => ipcRenderer.invoke("create-demo-user"),
};
