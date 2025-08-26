import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { puzzleMasterAPI } from "./api";
import { DomainError } from "../domain";

try {
  contextBridge.exposeInMainWorld("electron", electronAPI);
  contextBridge.exposeInMainWorld("puzzlemaster", puzzleMasterAPI);
} catch (error) {
  console.error(DomainError.narrowError(error));
}
