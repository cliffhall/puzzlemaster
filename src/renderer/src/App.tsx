import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { ReactElement } from 'react'
import '@mantine/core/styles.css'

import Home from './components/Home'

function App(): ReactElement {
  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </MantineProvider>
  )
}

export default App
