import { IAppFacade } from "../../AppFacade";
import { ipcMain } from "electron";
import {
  INotification,
  SimpleCommand,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { DbDemoProxy } from "../../model/DbDemoProxy";

export class DbDemoCommand extends SimpleCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ DbDemoCommand - Installing DbDemo API Handlers", 2);

    // Create a demo user and return it
    ipcMain.handle("create-demo-user", async () => {
      const dbDemoProxy = f.retrieveProxy(DbDemoProxy.NAME) as DbDemoProxy;
      return await dbDemoProxy.createDemoUser();
    });
  }
}
