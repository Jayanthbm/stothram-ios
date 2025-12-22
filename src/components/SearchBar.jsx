// src/components/SearchBar.jsx

import { useState } from "react";
import { MdSearch, MdClose } from "react-icons/md";
import "./SearchBar.css";

export default function SearchBar({
  placeholder = "Search",
  value,
  onChangeText,
  onClear,
  style,
  disabled = false,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={`
        search-bar
        ${isFocused ? "search-bar--focused" : ""}
        ${disabled ? "search-bar--disabled" : ""}
      `}
      style={style}
    >
      {/* Search icon */}
      <MdSearch size={20} className="search-bar__icon" aria-hidden />

      {/* Input */}
      <input
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        aria-label="Search field"
        onChange={(e) => onChangeText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="search-bar__input"
        {...props}
      />

      {/* Clear button */}
      {value?.length > 0 && (
        <button
          type="button"
          className="search-bar__clear"
          aria-label="Clear search"
          onClick={onClear}
        >
          <MdClose size={18} />
        </button>
      )}
    </div>
  );
}
