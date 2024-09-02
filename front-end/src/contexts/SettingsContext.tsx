import react, { createContext, useState, useEffect, useRef } from 'react';
import { DateTime } from "luxon";
import React from 'react'

const SettingsContext = createContext()


const SettingsProvider = ({children}) => {
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

    const updateTimezone = (zone) => {
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

    const contextValue = {
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
