import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { ReactElement } from "react";
import { mantineTheme } from "./theme";

import Home from "./components/pages/Home";

function App(): ReactElement {
  return (
    <MantineProvider theme={mantineTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
