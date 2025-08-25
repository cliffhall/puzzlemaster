import { useState, useEffect } from "react";
import { WindowStates } from "../../../types/domain";

export const useWindowState = (): boolean => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (window.puzzlemaster) {
      const handleWindowStateChange = (state: WindowStates): void => {
        setIsMaximized(state === WindowStates.MAXIMIZED);
      };
      return window.puzzlemaster.window.onWindowStateChange(
        handleWindowStateChange,
      );
    }
    return undefined;
  }, []); // Empty dependency array ensures this effect runs only once

  return isMaximized;
};
