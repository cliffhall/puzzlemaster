import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { api } from "./api";
import { DomainError } from "../types/domain/DomainError";

try {
  contextBridge.exposeInMainWorld("electron", electronAPI);
  contextBridge.exposeInMainWorld("api", api);
} catch (error) {
  console.error(DomainError.narrowError(error));
}
