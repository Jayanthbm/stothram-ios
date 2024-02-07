import React, { useContext } from "react";
import { FaRupeeSign } from "react-icons/fa";
import {
  FiChevronLeft,
  FiGrid,
  FiList,
  FiMoon,
  FiSettings,
  FiSun,
} from "react-icons/fi";
import { ThemeContext } from "../context/themeContext.jsx";
const AppHeader = ({ title, backAction, settingsAction, toggleView }) => {
  const { darkmode, viewType, toggleViewType, darkSwitch, toggleDarkMode } =
    useContext(ThemeContext);
  return (
    <div className={`app-header ${darkmode ? "dark" : "light"}`}>
      {backAction && (
        <span className="back-button" onClick={backAction}>
          <FiChevronLeft className="icon-style" />
        </span>
      )}

      <span className="app-header-title">{title}</span>
      <div className="right-content">
        <span onClick={() => console.log("clicked")}>
          <FaRupeeSign className="icon-style" />
        </span>
        {toggleView && (
          <span onClick={toggleViewType}>
            {viewType === "card" ? (
              <FiList className="icon-style" />
            ) : (
              <FiGrid className="icon-style" />
            )}
          </span>
        )}
        {darkSwitch && (
          <span onClick={toggleDarkMode}>
            {darkmode ? (
              <FiSun color="orange" className="icon-style" />
            ) : (
              <FiMoon className="icon-style" />
            )}
          </span>
        )}
        {settingsAction && (
          <span onClick={settingsAction}>
            <FiSettings className="icon-style" />
          </span>
        )}
      </div>
    </div>
  );
};

export default AppHeader;
