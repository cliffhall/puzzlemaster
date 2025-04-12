import { ElectronAPI } from '@electron-toolkit/preload'

export interface API {
  marco: () => string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
