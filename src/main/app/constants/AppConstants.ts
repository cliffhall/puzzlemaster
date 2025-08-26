import { Result } from "neverthrow";
import { DomainError } from "../../../domain";

// Multiton key
export const MULTITON_KEY = "Puzzlemaster App";

// Notifications
export const STARTUP = `${MULTITON_KEY} | app/startup`;

// Utility function to flatten neverthrow Result objects for IPC
export function flattenResult<T>(
  result: Result<T, DomainError>,
): { success: true; data: T } | { success: false; error: string } {
  if (result.isOk()) {
    return { success: true, data: result.value };
  }
  return { success: false, error: result.error.message };
}
