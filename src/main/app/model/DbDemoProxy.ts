import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
//import { DomainError } from "../../../types/domain/";
import { CreateDemoUserResult } from "../../../types/api";
import { PrismaClient } from "db";
//import { err } from "neverthrow";

const prisma = new PrismaClient();

export class DbDemoProxy extends Proxy {
  static NAME: string = "DbDemoProxy";

  constructor() {
    super(DbDemoProxy.NAME, process);
  }

  public async createDemoUser(): Promise<CreateDemoUserResult> {
    try {
      const user = await prisma.user.create({
        data: {
          name: "Alice",
          email: "alice@prisma.io",
        },
      });
      console.log(user);
      return user;
    } catch (error) {
      // TODO result should be wrapped properly so it can be success or error
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(`Failed to create demo user: ${errorMessage}`);
      throw new Error(`Failed to create demo user: ${errorMessage}`);
      //return err(DomainError.fromError("Failed create demo user", error));
    }
  }
}
