import { useState, useMemo } from "react";
import "./Card.css";

export default function Card({
  title,
  subtitle,
  children,
  style,
  onClick,
  onPressIn,
  onPressOut,
  disabled = false,
  variant = "elevated", // 'outlined' | 'elevated'
  disableRipple = false,
}) {
  const [pressed, setPressed] = useState(false);

  const className = useMemo(() => {
    return [
      "card",
      variant === "outlined" ? "card--outlined" : "card--elevated",
      pressed ? "card--pressed" : "",
      disabled ? "card--disabled" : "",
    ].join(" ");
  }, [variant, pressed, disabled]);

  return (
    <div
      className={className}
      style={style}
      role="button"
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
      onTouchStart={(e) => {
        setPressed(true);
        onPressIn?.(e);
      }}
      onTouchEnd={(e) => {
        setPressed(false);
        onPressOut?.(e);
      }}
      onMouseDown={(e) => {
        setPressed(true);
        onPressIn?.(e);
      }}
      onMouseUp={(e) => {
        setPressed(false);
        onPressOut?.(e);
      }}
    >
      {!disableRipple && !disabled && <span className="card__ripple" />}

      {title && <div className="card__title">{title}</div>}

      {subtitle && <div className="card__subtitle">{subtitle}</div>}

      <div className="card__body">{children}</div>
    </div>
  );
}
