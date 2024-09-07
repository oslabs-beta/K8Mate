import react, { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import { DateTime } from "luxon";
import React from 'react'

type SettingsContextType = {
    timezone: string,
    localTimezone: string,
    updateTimezone: (zone: string) => void,
    isDarkMode: boolean,
    toggleTheme: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

interface SettingsProviderProps {
    children: ReactNode; // ReactNode type covers all renderable children
  }

const SettingsProvider: React.FC<SettingsProviderProps> = ({children}) => {
    const [timezone, setTimezone] = useState<string>(DateTime.local().zoneName)
    const [localTimezone, setLocalTimezone] = useState<string>(DateTime.local().zoneName)

    const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

    
    useEffect(() => {
        // Load theme from localStorage or system preference
        const storedTheme = localStorage.getItem('theme');
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
        if (storedTheme === 'dark' || (!storedTheme && prefersDarkMode)) {
          document.documentElement.classList.add('dark');
          setIsDarkMode(true);
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, []);
    

    /* ------------- Helper functions ------------- */

    const updateTimezone = (zone: string) => {
        setTimezone(zone)
    }

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
    }

    return (
        <SettingsContext.Provider value={contextValue}>
            {children}
        </SettingsContext.Provider>
    )
}

export {SettingsProvider, SettingsContext}
