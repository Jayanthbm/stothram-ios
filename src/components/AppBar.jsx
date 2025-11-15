import React from "react";
import { useNavigate } from "react-router-dom";

const AppBar = ({ showBack = true, title = "Stothram", rightIcons = [] }) => {
  const navigate = useNavigate();

  const onBackPress = () => {
    // If history exists, go back, else go home
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  };

  return (
    <m3e-app-bar size="small" centered>
      {/* LEFT: Back Button */}
      {showBack && (
        <>
          <m3e-icon-button
            slot="leading-icon"
            aria-label="Back"
            onclick={onBackPress}
            id="backbutton"
          >
            <m3e-icon name="arrow_back"></m3e-icon>
          </m3e-icon-button>
          <m3e-tooltip for="backbutton" position="bottom">
            Go Back
          </m3e-tooltip>
        </>
      )}

      {/* TITLE */}
      <span slot="title">{title}</span>
      {/* RIGHT ICONS */}
      {rightIcons.map((item, index) => (
        <m3e-icon-button
          key={index}
          slot="trailing-icon"
          aria-label={item.ariaLabel || "Action"}
          variant={item.variant || "standard"}
          onclick={item.onPress}
        >
          <m3e-icon name={item.iconName}></m3e-icon>
        </m3e-icon-button>
      ))}
    </m3e-app-bar>
  );
};

export default AppBar;
