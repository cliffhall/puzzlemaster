import Versions from './components/Versions'
import electronLogo from './assets/puzzle-box.svg'
import { ElectronAPI } from '@electron-toolkit/preload'
import { API } from '../../shared/types'
declare global {
  export interface Window {
    electron: ElectronAPI
    api: API
  }
}
function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const marco = (): void => console.log(window.api.marco())

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={marco}>
            Marco
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
