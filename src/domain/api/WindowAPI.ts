import { WindowStates } from "../index";

export interface WindowAPI {
  isMaximized: () => Promise<boolean>;
  onWindowStateChange: (cb: (state: WindowStates) => void) => () => void;
}
