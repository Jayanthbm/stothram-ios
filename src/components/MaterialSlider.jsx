// src/components/MaterialSlider.jsx
import { MdAdd, MdRemove } from "react-icons/md";
import "./MaterialSlider.css";

export default function MaterialSlider({
  value = 24,
  onValueChange,
  min = 16,
  max = 36,
  step = 1,
}) {
  const decrease = () => {
    if (value > min) onValueChange(value - step);
  };

  const increase = () => {
    if (value < max) onValueChange(value + step);
  };

  return (
    <div className="material-slider">
      {/* Minus */}
      <button
        className="material-slider__btn"
        onClick={decrease}
        disabled={value <= min}
        aria-label="Decrease"
      >
        <MdRemove size={20} />
      </button>

      {/* Slider */}
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

      {/* Plus */}
      <button
        className="material-slider__btn"
        onClick={increase}
        disabled={value >= max}
        aria-label="Increase"
      >
        <MdAdd size={20} />
      </button>
    </div>
  );
}
