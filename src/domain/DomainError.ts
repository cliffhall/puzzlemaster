/**
 * DomainError
 * - An error generated when creating or interacting with a domain entity.
 */

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }

  /**
   * Utility method to narrow an unknown error to a string message
   * @param error The unknown error to narrow
   * @returns A string representation of the error
   */
  static narrowError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  /**
   * Create a DomainError from an unknown error with a context message
   * @param contextMessage The context message to prepend to the error
   * @param error The unknown error to narrow
   * @returns A new DomainError with formatted message
   */
  static fromError(contextMessage: string, error: unknown): DomainError {
    const errorMessage = DomainError.narrowError(error);
    return new DomainError(`${contextMessage}: ${errorMessage}`);
  }
}
