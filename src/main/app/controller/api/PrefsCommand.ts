import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { IAppFacade } from "../../AppFacade";
import { ipcMain } from "electron";

export class PrefsCommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ PrefsCommand - Installing Prefs API Handlers", 2);

    // Load preferences from file/storage
    ipcMain.handle("load-prefs", () => {
      return { theme: "dark", language: "en" };
    });

    // Save preferences to file/storage
    ipcMain.handle("save-prefs", (_event, prefs) => {
      console.log("Saving preferences:", prefs);
    });

    // Signal completion
    this.commandComplete();
  }
}
