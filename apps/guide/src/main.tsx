import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
// Side-effect import: triggers Stops.parse() at boot so any seed-data error
// surfaces immediately instead of when Phase 3 first reads a stop.
import './content'
import App from './App'
import { registerServiceWorker } from './pwa/registerSW'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

registerServiceWorker((registration) => {
  window.dispatchEvent(
    new CustomEvent('tfg:update-ready', { detail: registration }),
  )
})
