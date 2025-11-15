import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DARK_MODE_KEY = "@darkmode";
const DARK_MODE_TOGGLE_KEY = "@darkmodetoggle";
const FONT_SIZE_KEY = "@fontSize";

export const ThemeContext = React.createContext({
  darkmode: false,
  toggleDarkMode: () => {},
  darkSwitch: false,
  toggleDarkSwitch: () => {},
  viewType: "card",
  toggleViewType: () => {},
  font: 24,
  updateFont: () => { },
  showAlert: () => { },
});

export const ThemeProvider = ({ children }) => {
  const [darkmode, setDarkMode] = useState(false);
  const [darkSwitch, setDarkSwitch] = useState(false);
  const [viewType, setViewType] = useState("card");
  const [font, setFont] = useState(24);

  useEffect(() => {
    function init() {
      const savedDarkMode = localStorage.getItem(DARK_MODE_KEY);
      const savedDarkModeToggle = localStorage.getItem(DARK_MODE_TOGGLE_KEY);
      const savedFontSize = localStorage.getItem(FONT_SIZE_KEY);

      const setTheme = (darkModeValue, darkSwitchValue) => {
        const darkMode = darkModeValue === "true";
        const darkSwitch = darkSwitchValue === "true";

        setDarkMode(darkMode);
        setDarkSwitch(darkSwitch);
      };

      if (savedDarkMode !== null) {
        setTheme(savedDarkMode, savedDarkModeToggle);
      } else {
        const colorScheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "true"
          : "false";
        localStorage.setItem(DARK_MODE_KEY, colorScheme);
        setTheme(colorScheme, colorScheme);
      }

      if (savedDarkModeToggle === null) {
        localStorage.setItem(DARK_MODE_TOGGLE_KEY, "true");
      }

      if (savedFontSize !== null) {
        setFont(parseInt(savedFontSize, 10));
      } else {
        localStorage.setItem(FONT_SIZE_KEY, "24");
      }
    }

    init();
  }, []);

  const showToast = (message) => {
    // toast.dismiss();
    // return toast(message);
    M3eSnackbar.open(message, true);
  };

  return (
    <ThemeContext.Provider
      value={{
        darkmode,
        toggleDarkMode: () => {
          localStorage.setItem(DARK_MODE_KEY, JSON.stringify(!darkmode));
          setDarkMode(!darkmode);
          showToast(!darkmode ? "Dark Mode Enabled" : "Light Mode Enabled");
        },
        darkSwitch,
        toggleDarkSwitch: () => {
          localStorage.setItem(
            DARK_MODE_TOGGLE_KEY,
            JSON.stringify(!darkSwitch),
          );
          setDarkSwitch(!darkSwitch);
          showToast(
            !darkSwitch
              ? "Toggle in Every Page Enabled"
              : "Toggle in Every Page Disabled",
          );
        },
        viewType,
        toggleViewType: () => {
          setViewType((currentType) =>
            currentType === "card" ? "list" : "card",
          );
        },
        font,
        updateFont: (size) => {
          localStorage.setItem(FONT_SIZE_KEY, size.toString());
          setFont(size);
        },
        showAlert: (message) => {
          showToast(message);
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
