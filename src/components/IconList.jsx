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
}) {
  return (
    <button
      type="button"
      key={keyName}
      role="button"
      aria-label={title}
      aria-disabled={disabled}
      className={`
        icon-list
        ${disabled ? "icon-list--disabled" : ""}
      `}
      onClick={disabled ? undefined : onPress}
    >
      {/* Left icon */}
      {leftIcon && <span className="icon-list__left-icon">{leftIcon}</span>}

      {/* Text */}
      <span className="icon-list__text">
        <span className="icon-list__title">{title}</span>
        {subtitle && <span className="icon-list__subtitle">{subtitle}</span>}
      </span>

      {/* Right content (switch / chevron / etc.) */}
      {rightContent && <span className="icon-list__right">{rightContent}</span>}
    </button>
  );
}
