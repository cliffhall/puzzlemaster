import { IAppFacade } from '../../AppFacade'
import { ipcMain } from 'electron'
import { INotification, SimpleCommand } from '@puremvc/puremvc-typescript-multicore-framework'

export class PrefsCommand extends SimpleCommand {

  public override execute(_note: INotification): void {
    const f: IAppFacade = this.facade as IAppFacade
    f.log('⚙️ PrefsCommand - Installing Prefs API Handlers', 2)

    // Load preferences from file/storage
    ipcMain.handle('load-prefs', () => {
      return { theme: 'dark', language: 'en' }
    })

    // Save preferences to file/storage
    ipcMain.handle('save-prefs', (_event, prefs) => {
      console.log('Saving preferences:', prefs)
    })

  }
}
