import { ElectronAPI } from "@electron-toolkit/preload";
import { API } from "../preload/api";

declare global {
  interface Window {
    electron: ElectronAPI;
    api: API;
  }
}
