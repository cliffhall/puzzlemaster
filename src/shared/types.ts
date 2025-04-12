import { ElectronAPI } from '@electron-toolkit/preload'
/*
export type { TypedIpcMain, TypedIpcRenderer, TypedWebContents } from './electron-typed-ipc'
*/

export interface API {
  marco: () => string
}

declare global {
  export interface Window {
    electron: ElectronAPI
    api: API
  }
}
