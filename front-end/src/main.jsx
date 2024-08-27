import React from 'react'
import ReactDOM from 'react-dom/client'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

import { AlertsProvider } from './pages/Alerts/AlertsContext.jsx'
import { SettingsProvider } from './contexts/SettingsContext.jsx'


/* =================================================================== */

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SettingsProvider>
      <AlertsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AlertsProvider>
    </SettingsProvider>
  </StrictMode>
);
