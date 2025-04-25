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

declare global {
  interface ProcessEnv {
    [key: string]: string | undefined
    DATABASE_URL: string
    API_KEY?: string
  }
}
