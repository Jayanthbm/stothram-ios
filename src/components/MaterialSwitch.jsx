// src/components/MaterialSwitch.jsx

import "./MaterialSwitch.css";

export default function MaterialSwitch({
  value,
  onValueChange,
  disabled = false,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label="Toggle setting"
      disabled={disabled}
      className={`
        material-switch
        ${value ? "material-switch--on" : ""}
        ${disabled ? "material-switch--disabled" : ""}
      `}
      onClick={() => {
        if (!disabled) onValueChange(!value);
      }}
    >
      <span className="material-switch__track">
        <span className="material-switch__thumb" />
      </span>
    </button>
  );
}
