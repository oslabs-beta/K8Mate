import React from 'react'
import ReactDOM from 'react-dom/client'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AlertsProvider } from './pages/Alerts/AlertsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AlertsProvider>
    <BrowserRouter>
     <App />
    </BrowserRouter>
    </AlertsProvider>
  </StrictMode>,
)
