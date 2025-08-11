export * from "./Action";
export * from "./Agent";
export * from "./Job";
export * from "./Phase";
export * from "./Plan";
export * from "./Project";
export * from "./Role";
export * from "./Task";
export * from "./Team";
export * from "./Validator";
export * from "./DomainError";
export type DeleteResult =
  | { success: true; data: boolean }
  | { success: false; error: string };
