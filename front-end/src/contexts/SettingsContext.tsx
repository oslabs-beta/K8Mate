import react, { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import { DateTime } from "luxon";
import React from 'react'
import * as settingsService from '../services/settingsService.js'

type SettingsContextType = {
  timezone: string,
  localTimezone: string,
  updateTimezone: (zone: string) => void,
  isDarkMode: boolean,
  toggleTheme: () => void,
  uri: string,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

interface SettingsProviderProps {
    children: ReactNode; // ReactNode type covers all renderable children
  }

const SettingsProvider: React.FC<SettingsProviderProps> = ({children}) => {
  const [timezone, setTimezone] = useState<string>(DateTime.local().zoneName);
  const [localTimezone, setLocalTimezone] = useState<string>(DateTime.local().zoneName);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [uri, setUri] = useState<string>('');

  useEffect(() => {
    // Load theme from localStorage or system preference
    const fetchSettingData = async () => {
      const storedTheme = localStorage.getItem('theme');
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

      const savedUri = await settingsService.index()
      console.log('Fetched savedUri:', savedUri)
      
      if (savedUri && savedUri.SUPABASE_URI) setUri(savedUri.SUPABASE_URI);
      else { console.error('SUPABASE_URI is undefined or missing in the response:', savedUri); }
  
      if (storedTheme === 'dark' || (!storedTheme && prefersDarkMode)) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      } else { document.documentElement.classList.remove('dark'); }
    }
    
    fetchSettingData();
  }, []);

  /* ------------- Helper functions ------------- */

  const updateTimezone = (zone: string) => { setTimezone(zone); }

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
    const newMode = !prevMode;
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    return newMode;
    });
  };

  const contextValue: SettingsContextType = {
    timezone,
    localTimezone,
    updateTimezone,
    isDarkMode,
    toggleTheme,
    uri,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export {SettingsProvider, SettingsContext}
