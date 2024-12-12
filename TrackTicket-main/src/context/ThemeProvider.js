import React, {createContext, useState, useEffect, useMemo} from 'react';
import {Appearance} from 'react-native';
import {
  MD3LightTheme as DefaultTheme,
  MD3DarkTheme as DarkTheme,
} from 'react-native-paper';
// Define custom themes with onboarding background colors
const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
    error: '#d9534f',
    blue: '#4a51a3', // Deep Blue
    green: '#388E3C',
    appColor: '#343448',
    appDark: '#353766',
    btn:"#f3735e"

  },
  roundness: 8,
};

const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#343448',
    error: '#d9534f',
    green: '#388E3C',
    appColor: '#343448',
    appDark: 'rgb(71, 71, 90)',
    
    btn:"#f3735e"
  },
  roundness: 8,
};

const ThemeContext = createContext();

const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  useEffect(() => {
    // Update theme when system theme changes
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme);
    });
    return () => subscription.remove();
  }, []);

  const currentTheme = useMemo(() => {
    return theme === 'dark' ? darkTheme : lightTheme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{theme: currentTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export {ThemeContext, ThemeProvider};
