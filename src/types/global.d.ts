import { ElectronAPI } from "@electron-toolkit/preload";
import { PuzzleMasterAPI } from "../domain/api";

declare global {
  interface Window {
    electron: ElectronAPI;
    puzzlemaster: PuzzleMasterAPI;
  }
}
