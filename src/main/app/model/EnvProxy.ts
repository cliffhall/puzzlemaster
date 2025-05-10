import { Proxy } from '@puremvc/puremvc-typescript-multicore-framework'

export class EnvProxy extends Proxy {
  static NAME: string = 'EnvProxy'
  public cwd: string
  public env: ProcessEnv

  /**
   * Constructor
   *
   * - extracts the config values needed from the environment vars
   * - exposes the environment variables in a named property
   * - calls the provided halt function if a required input is missing
   *
   * @param cwd
   * @param env
   * @param halt
   */
  constructor(cwd: string, env: ProcessEnv, halt: (message: string) => void) {
    super(EnvProxy.NAME, null)
    const msg: string = 'EnvProxy - You must configure: '

    // Get the environment
    this.cwd = cwd
    this.env = env

    // The required environment vars
    const required = new Map([
      ['apiBaseUrl', 'API_BASE_URL'],
      ['testVar', 'TEST_VAR']
    ])

    // Fetch the required, halt with message if not set
    required.forEach((value, key) => {
      this[key] = env[value] || halt(msg + value)
    })

    // Conditionally required environment vars
    /*
      const value = 'REDIS_URL'
      this.useRedis = String(env['USE_REDIS']).toLowerCase() === 'true'
      if (this.useRedis) this.redisUrl = env[value] || halt(msg + value)
    */
  }
}
