import { useNavigate } from "react-router-dom";
import "./AppBar.css";

import { FiChevronLeft } from "react-icons/fi";
import { useContext } from "react";
import { ThemeContext } from "../context/themeContext";
import MaterialSlider from "./MaterialSlider";
const ICON_SIZE = 26;
const ICON_TOUCH = 44;
const RIGHT_WIDTH = ICON_TOUCH * 2;

export default function AppBar({
  showBack = true,
  title = "Stothram",
  rightIcons = [],
  slider = false,
}) {
  const navigate = useNavigate();
  const { font, updateFont } = useContext(ThemeContext);

  const onBackPress = () => {
    navigate(-1);
  };

  return (
    <div className="appbar-wrapper">
      {/* ===== TOP BAR ===== */}
      <div className="appbar">
        {/* LEFT */}
        <div className="appbar__side">
          {showBack ? (
            <button
              className="appbar__icon-btn"
              onClick={onBackPress}
              aria-label="Go back"
            >
              <span className="appbar__icon">
                <FiChevronLeft size={ICON_SIZE} />
              </span>
            </button>
          ) : (
            <div className="appbar__icon-btn" />
          )}
        </div>

        {/* TITLE */}
        <div className="appbar__title-container">
          <div className="appbar__title" title={title}>
            {title}
          </div>
        </div>

        {/* RIGHT */}
        <div className="appbar__right" style={{ width: RIGHT_WIDTH }}>
          {Array(2 - rightIcons.length)
            .fill(0)
            .map((_, i) => (
              <div key={`ph-${i}`} className="appbar__icon-btn" />
            ))}

          {rightIcons.slice(0, 2).map((item, index) => (
            <button
              key={index}
              className="appbar__icon-btn"
              onClick={item.onPress}
              aria-label="App bar action"
            >
              <span className="appbar__icon">{item.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== SLIDER ROW ===== */}
      {slider && (
        <div className="appbar-slider">
          <MaterialSlider
            value={font}
            onValueChange={updateFont}
            min={15}
            max={30}
            step={1}
          />
        </div>
      )}
    </div>
  );
}
