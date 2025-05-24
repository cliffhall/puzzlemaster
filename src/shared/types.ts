import { ElectronAPI } from '@electron-toolkit/preload'

export interface API {
  marco: () => string
}

declare global {
  export interface Window {
    electron: ElectronAPI
    api: API
  }
}
