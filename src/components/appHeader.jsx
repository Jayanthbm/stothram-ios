import React, { useContext, useState } from "react";
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

const Modal = ({ handleCloseDialog }) => {
  return (
    <div className="modal active">
      <div className="modal-content">
        <h2>Modal Title</h2>
        <p>This is the modal content.</p>
        <button onClick={handleCloseDialog}>Close Modal</button>
      </div>
    </div>
  );
};

const AppHeader = ({ title, backAction, settingsAction, toggleView }) => {
  const { darkmode, viewType, toggleViewType, darkSwitch, toggleDarkMode } =
    useContext(ThemeContext);
  const [showDailog, setShowDialog] = useState(true);

  const handleShowDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };
  return (
    <div className="app-header">
      {backAction && (
        <span className="back-button" onClick={backAction}>
          <FiChevronLeft className="icon-style" />
        </span>
      )}

      <span className="app-header-title">{title}</span>
      <div className="right-content">
        <span onClick={handleShowDialog}>
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
              <FiSun color="#f1e408" className="icon-style" />
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

      {showDailog && <Modal handleCloseDialog={handleCloseDialog} />}
    </div>
  );
};

export default AppHeader;
