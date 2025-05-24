/**
 * DomainError
 * - A domain-specific error
 */

export class DomainError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DomainError'
  }
}
