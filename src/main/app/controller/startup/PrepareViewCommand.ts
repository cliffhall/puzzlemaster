import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import { app, shell, BrowserWindow } from "electron";
import { EnvProxy } from "../../model";
import { IAppFacade } from "../../AppFacade";
import { join } from "path";

export class PrepareViewCommand extends AsyncCommand {
  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade;
    f.log("⚙️ PrepareViewCommand - Creating Main App Window", 2);

    const envProxy = f.retrieveProxy(EnvProxy.NAME) as EnvProxy;

    function createWindow(): void {
      const mainWindow = new BrowserWindow({
        width: 900,
        height: 670,
        minWidth: 769,
        show: false,
        title: "Puzzlemaster",
        titleBarStyle: "hidden",
        titleBarOverlay: {
          height: 45,
        },
        ...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
        autoHideMenuBar: true,
        webPreferences: {
          preload: join(__dirname, "../preload/index.js"),
          contextIsolation: true,
          sandbox: false,
        },
      });

      mainWindow.on("ready-to-show", () => {
        mainWindow.show();
      });

      mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return { action: "deny" };
      });

      // HMR for renderer base on electron-vite cli.
      // Load the remote URL for development or the local html file for production.
      //const url = envProxy.varByKey('ELECTRON_RENDERER_URL');
      const url = envProxy.getVar("ELECTRON_RENDERER_URL");

      if (envProxy.isDev() && url) {
        mainWindow.loadURL(url);
        mainWindow.webContents.openDevTools({ mode: "detach" });
      } else {
        const path = join(__dirname, "../renderer/index.html");
        mainWindow.loadFile(path);
      }
    }

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.whenReady().then(() => {
      // Set app user model id for windows
      electronApp.setAppUserModelId("com.futurescale.puzzlemaster");

      // Default open or close DevTools by F12 in development
      // and ignore CommandOrControl + R in production.
      // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
      app.on("browser-window-created", (_, window) => {
        optimizer.watchWindowShortcuts(window);
      });

      // Quit when all windows are closed, except on macOS
      app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
          app.quit();
        }
      });

      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
      });

      // Create window
      createWindow();
    });

    // Signal completion
    this.commandComplete();
  }
}
