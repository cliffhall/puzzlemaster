import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { PrismaClient } from "db";
import { CreateDemoUserResult } from "../../../types/api";

const prisma = new PrismaClient();

export class DbDemoProxy extends Proxy {
  static NAME: string = "DbDemoProxy";

  constructor() {
    super(DbDemoProxy.NAME, process);
  }

  public async createDemoUser(): Promise<CreateDemoUserResult> {
    const user = await prisma.user.create({
      data: {
        name: "Alice",
        email: "alice@prisma.io",
      },
    });
    console.log(user);
    return user;
  }
}
