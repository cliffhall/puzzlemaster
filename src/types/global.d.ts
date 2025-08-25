import { ElectronAPI } from "@electron-toolkit/preload";
import { PuzzleMasterAPI } from "./api";

declare global {
  interface Window {
    electron: ElectronAPI;
    puzzlemaster: PuzzleMasterAPI;
  }
}
