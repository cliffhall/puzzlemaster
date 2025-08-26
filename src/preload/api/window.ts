import { ipcRenderer } from "electron";
import { WindowAPI } from "../../domain/api/WindowAPI";
import { WindowAPIMethods, WindowEvents, WindowStates } from "../../domain";
import IpcRendererEvent = Electron.IpcRendererEvent;

export const window: WindowAPI = {
  isMaximized: () => ipcRenderer.invoke(WindowAPIMethods.IS_MAXIMIZED),
  onWindowStateChange: (callback) => {
    const handler = (_event: IpcRendererEvent, state: WindowStates): void => {
      callback(state);
    };
    ipcRenderer.on(WindowEvents.WINDOW_STATE, handler);
    return (): void => {
      ipcRenderer.removeListener(WindowEvents.WINDOW_STATE, handler);
    };
  },
};
