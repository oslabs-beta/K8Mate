import React from 'react'
import ReactDOM from 'react-dom/client'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

import { AlertsProvider } from './pages/Alerts/AlertsContext.tsx'
import { SettingsProvider } from './contexts/SettingsContext.tsx'


/* =================================================================== */

const root = document.getElementById("root") as Element;

if (root) {
  createRoot(root).render(
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
} else console.log('Error');