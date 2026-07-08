import { createContext, useContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {

    const [mode, setMode] = useState(
        localStorage.getItem('themeMode') || 'light'
    );

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        localStorage.setItem('themeMode', newMode);
        setMode(newMode);
    };

    // Создаём MUI тему на основе mode
    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: {
                main: mode === 'light' ? '#CC00CC' : '#FF44FF',
            },
            background: {
                default: mode === 'light' ? '#FFFFFF' : '#121212',
                paper: mode === 'light' ? '#F5F5F5' : '#1E1E1E',
            },
        },
        shape: {
            borderRadius: 8,
        },
        typography: {
            fontFamily: 'Roboto, sans-serif',
        },
    }), [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);