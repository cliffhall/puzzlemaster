import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { api } from "./api";

try {
  contextBridge.exposeInMainWorld("electron", electronAPI);
  contextBridge.exposeInMainWorld("api", api);
} catch (error) {
  console.error(error);
}
