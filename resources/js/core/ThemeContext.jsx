import { createContext, useContext, useState, useCallback } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [dark, setDark] = useState(false);
    const toggleDark = useCallback(() => setDark((p) => !p), []);
    return (
        <ThemeContext.Provider value={{ dark, toggleDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
