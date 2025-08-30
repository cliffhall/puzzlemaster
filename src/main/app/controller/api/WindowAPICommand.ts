import {
  INotification,
  SimpleCommand,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { ipcMain, BrowserWindow } from "electron";
import { WindowAPIMethods } from "../../../../domain";
import { IAppFacade } from "../../AppFacade";

export class WindowAPICommand extends SimpleCommand {
  public static readonly NAME: string = "WindowAPICommand";

  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ WindowAPICommand - Installing Window API Handlers", 3);

    // Handler for checking if window is maximized
    ipcMain.handle(WindowAPIMethods.IS_MAXIMIZED, async () => {
      const mainWindow = BrowserWindow.getFocusedWindow();
      return mainWindow ? mainWindow.isFullScreen() : false;
    });
  }
}
