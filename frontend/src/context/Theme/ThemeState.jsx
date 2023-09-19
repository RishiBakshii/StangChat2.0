import React, { useEffect, useState } from 'react'
import { ThemeContext } from './ThemeContext';

export const ThemeState= ({children}) => {


    const [isDarkTheme, setIsDarkTheme] = useState(localStorage.getItem('theme')==='true'?true:false);

    const changeTheme = () => {
      setIsDarkTheme((prevIsDarkTheme) => {
        const newIsDarkTheme = !prevIsDarkTheme;
        localStorage.setItem("theme", newIsDarkTheme.toString());
        return newIsDarkTheme;
      });
    };
    

  return (
    <ThemeContext.Provider value={{isDarkTheme,changeTheme}}>
        {children}
    </ThemeContext.Provider>
  )
}