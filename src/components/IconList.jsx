// src/components/IconList.jsx

import "./IconList.css";

export default function IconList({
  leftIcon,
  keyName = "",
  title,
  subtitle = "",
  onPress,
  rightContent,
  disabled = false,
  id,
}) {
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onPress) onPress(e);
    }
  };

  return (
    <div
      key={keyName}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={title}
      aria-disabled={disabled}
      className={`
        icon-list
        ${disabled ? "icon-list--disabled" : ""}
      `}
      onClick={disabled ? undefined : onPress}
      onKeyDown={handleKeyDown}
    >
      {/* Left icon */}
      {leftIcon && <span className="icon-list__left-icon">{leftIcon}</span>}

      {/* Text */}
      <div className="icon-list__text">
        {id && <div className="chip">{id}</div>}

        <span className="icon-list__title">{title}</span>

        {subtitle && <span className="icon-list__subtitle">{subtitle}</span>}
      </div>

      {/* Right content (switch / chevron / etc.) */}
      {rightContent && <span className="icon-list__right">{rightContent}</span>}
    </div>
  );
}
