import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { ReactElement } from "react";
import { mantineTheme } from "./theme";
import "@mantine/core/styles.css";

import { Shell } from "./components/Shell/Shell";

function App(): ReactElement {
  return (
    <MantineProvider theme={mantineTheme} defaultColorScheme="light">
      <Router>
        <Routes>
          <Route path="/" element={<Shell />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
