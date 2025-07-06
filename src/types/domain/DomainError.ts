/**
 * DomainError
 * - An error generated when creating or interacting with a domain entity.
 */

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}
