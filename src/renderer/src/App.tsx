import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { ReactElement } from "react";
import { mantineTheme } from "./theme";
import "@mantine/core/styles.css";

import Landing from "./components/pages/Landing";

function App(): ReactElement {
  return (
    <MantineProvider theme={mantineTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
