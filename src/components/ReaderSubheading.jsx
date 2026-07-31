import React, { memo } from "react";
import Card from "./Card.jsx";

const ReaderSubheading = memo(({ item, title, fontFamily, font }) => {
  const displayTitle = title || item?.title || "";

  return (
    <Card
      style={{
        backgroundColor: "var(--surface-variant)",
        padding: "6px",
        margin: "8px 0",
      }}
      disableRipple
    >
      <div
        style={{
          textAlign: "center",
          fontSize: `${parseInt(font || 16) + 2}px`,
          fontWeight: 500,
        }}
      >
        {displayTitle}
      </div>
    </Card>
  );
});

export default ReaderSubheading;
