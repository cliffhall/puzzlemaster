import { WindowStates } from "../domain";

export interface WindowAPI {
  isMaximized: () => Promise<boolean>;
  onWindowStateChange: (
    cb: (state: WindowStates) => void,
  ) => () => void;
}
