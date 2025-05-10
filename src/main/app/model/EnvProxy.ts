import { Proxy } from '@puremvc/puremvc-typescript-multicore-framework'
import { is } from '@electron-toolkit/utils'

export class EnvProxy extends Proxy {
  static NAME: string = 'EnvProxy'
  public cwd: string
  public env: ProcessEnv
  public missingVars: string[] = []
  public isProduction: boolean

  /**
   * Constructor
   *
   * - extracts the config values needed from the environment vars
   * - exposes the environment variables in a named property
   * - calls the provided halt function if a required input is missing
   *
   * @param cwd
   * @param env
   * @param warnlogger
   */
  constructor(cwd: string, env: ProcessEnv, warnlogger: (message: string, indent: number) => void) {
    super(EnvProxy.NAME, null)
    const warnMsg: string = 'EnvProxy - Missing environment variable: '

    // Determine if we're in production or development
    this.isProduction = !is.dev

    // Get the environment
    this.cwd = cwd
    this.env = env

    // Default values for production environment
    const defaults = new Map([
      ['API_BASE_URL', 'https://api.openai.com/v1/'],
      ['TEST_VAR', 'default']
    ])

    // The required environment vars
    const required = new Map([
      ['apiBaseUrl', 'API_BASE_URL'],
      ['testVar', 'TEST_VAR']
    ])

    // Fetch the required, use defaults instead of halting in production
    required.forEach((envKey, propKey) => {
      if (env[envKey]) {
        // Use the environment variable if it exists
        this[propKey] = env[envKey]
      } else if (this.isProduction) {
        // In production, use default and log warning
        const defaultValue = defaults.get(envKey)
        warnlogger(`${warnMsg}${envKey}, using default value "${defaultValue}"`, 2)
        this[propKey] = defaultValue
        this.missingVars.push(envKey)
      } else {
        // In development, log the issue but don't halt
        warnlogger(`${warnMsg}${envKey}`, 2)
        this[propKey] = defaults.get(envKey)
        this.missingVars.push(envKey)
      }
    })

    // Conditionally required environment vars
    /*
      const value = 'REDIS_URL'
      this.useRedis = String(env['USE_REDIS']).toLowerCase() === 'true'
      if (this.useRedis) this.redisUrl = env[value] || halt(msg + value)
    */
  }

  /**
   * Validates that all required environment variables are present
   * Returns true if all required vars are present, false otherwise
   */
  public validate(): boolean {
    return this.missingVars.length === 0
  }

  /**
   * Gets a list of missing environment variables
   */
  public getMissingVars(): string[] {
    return [...this.missingVars]
  }
}
