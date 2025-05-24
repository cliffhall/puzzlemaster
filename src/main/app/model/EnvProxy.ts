import { Proxy } from '@puremvc/puremvc-typescript-multicore-framework'
import { is } from '@electron-toolkit/utils'

export class EnvProxy extends Proxy {
  static NAME: string = 'EnvProxy'

  constructor() {
    super(EnvProxy.NAME, process)
  }

  public isDev(): boolean {
    return is.dev
  }

  public getVar(key): string | undefined {
    return process.env[key]
  }
}
