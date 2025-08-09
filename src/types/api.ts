export type DemoUser = { id: number; name: string | null; email: string };

export type CreateDemoUserResult = Promise<DemoUser>;

export interface API {
  createDemoUser: () => CreateDemoUserResult;
}
