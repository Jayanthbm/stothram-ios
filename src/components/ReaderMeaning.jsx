import React, { memo } from "react";

const ReaderMeaning = memo(({ line, lines, font }) => {
  const fontSize = font ? Math.max(11, parseInt(font) - 4) : 13;

  if (line) {
    return (
      <div
        style={{
          marginTop: "4px",
          marginBottom: "6px",
          paddingLeft: "8px",
          borderLeft: "2px solid var(--primary, #4b6b94)",
          fontStyle: "italic",
          opacity: 0.85,
          fontSize: `${fontSize}px`,
          lineHeight: `${fontSize + 6}px`,
          color: "var(--primary, #4b6b94)",
        }}
      >
        {line}
      </div>
    );
  }

  if (Array.isArray(lines) && lines.length > 0) {
    return (
      <div
        style={{
          marginTop: "8px",
          paddingTop: "6px",
          borderTop: "1px solid var(--outline-variant, #cccccc)",
        }}
      >
        {lines.map((itemLine, index) => (
          <div
            key={index}
            style={{
              fontStyle: "italic",
              opacity: 0.85,
              fontSize: `${fontSize}px`,
              lineHeight: `${fontSize + 6}px`,
              color: "var(--primary, #4b6b94)",
              marginBottom: "4px",
            }}
          >
            {itemLine}
          </div>
        ))}
      </div>
    );
  }

  return null;
});

export default ReaderMeaning;
