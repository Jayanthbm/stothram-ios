// src/components/MaterialSlider.jsx

import "./MaterialSlider.css";

export default function MaterialSlider({
  value = 24,
  onValueChange,
  min = 16,
  max = 36,
  step = 1,
}) {
  return (
    <div className="material-slider">
      <input
        type="range"
        className="material-slider__input"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        aria-label="Adjust value"
      />
    </div>
  );
}
