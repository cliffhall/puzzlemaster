import { useState, useEffect } from "react";
import { WindowStates } from "../../../domain";
import { getIsMaximized } from "../client";

export const useWindowState = (): boolean => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (window.puzzlemaster) {
      // Fetch initial state on first call
      getIsMaximized()
        .then((val) => {
          if (typeof val === "boolean") setIsMaximized(val);
        })
        .catch(() => {
          // ignore initial fetch errors
        });

      const handleWindowStateChange = (state: WindowStates): void => {
        setIsMaximized(state === WindowStates.MAXIMIZED);
      };
      const unsubscribe = window.puzzlemaster.window.onWindowStateChange(
        handleWindowStateChange,
      );
      return () => {
        if (typeof unsubscribe === "function") unsubscribe();
      };
    }
    return undefined;
  }, []); // Empty dependency array ensures this effect runs only once

  return isMaximized;
};
