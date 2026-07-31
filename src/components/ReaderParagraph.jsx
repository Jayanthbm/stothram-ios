import React, { memo } from "react";
import Card from "./Card.jsx";
import ReaderAudioButton from "./ReaderAudioButton.jsx";
import ReaderMeaning from "./ReaderMeaning.jsx";
import { resolveAudioData, resolveMeaningLines } from "../utils/readerUtils.jsx";
import { getFontFamily } from "../utils/commonUtils.jsx";

const ReaderParagraph = memo(
  ({
    item,
    globalAudio,
    fontFamily,
    font,
    currentLanguage,
    showMeanings = false,
    meaningLanguage,
    fonts,
  }) => {
    const primaryText = item.text || item.lines || [];
    const transliteratedText = item.transliterations?.[currentLanguage]?.text;

    const isTransliterationSelected =
      currentLanguage !== "kn" &&
      Array.isArray(transliteratedText) &&
      transliteratedText.length > 0;

    const renderLines = isTransliterationSelected
      ? transliteratedText
      : primaryText;

    const meaningLines = resolveMeaningLines(
      item.meanings,
      meaningLanguage || currentLanguage
    );
    const hasMeaningLines =
      showMeanings && Array.isArray(meaningLines) && meaningLines.length > 0;

    const audioData = resolveAudioData(globalAudio, item.audio);

    return (
      <Card disableRipple>
        {renderLines.map((line, index) => {
          let meaningForLine = null;
          if (hasMeaningLines) {
            const textCount = renderLines.length;
            const meaningCount = meaningLines.length;

            if (meaningCount >= textCount) {
              meaningForLine = meaningLines[index];
            } else {
              if (index < meaningCount - 1) {
                meaningForLine = meaningLines[index];
              } else if (index === textCount - 1) {
                meaningForLine = meaningLines[meaningCount - 1];
              }
            }
          }

          const fontStyleFamily = getFontFamily(
            line,
            fontFamily || item.fontFamily,
            fonts
          );
          const fontSize =
            fontFamily === "brhknde" || item.fontFamily === "brhknde"
              ? parseInt(font) + 2
              : parseInt(font);
          const lineHeight =
            fontFamily === "brhknde" || item.fontFamily === "brhknde"
              ? `${fontSize + 16}px`
              : `${fontSize + 14}px`;

          return line?.trim() ? (
            <div key={index} style={{ marginBottom: "6px" }}>
              <div
                className="reader-text"
                style={{
                  fontFamily: fontStyleFamily,
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight,
                }}
              >
                {line}
              </div>
              {meaningForLine ? (
                <ReaderMeaning line={meaningForLine} font={font} />
              ) : null}
            </div>
          ) : (
            <div key={`gap-${index}`} style={{ height: "8px" }} />
          );
        })}

        {hasMeaningLines && meaningLines.length > renderLines.length && (
          <ReaderMeaning
            lines={meaningLines.slice(renderLines.length)}
            font={font}
          />
        )}

        <ReaderAudioButton
          audioUrl={audioData.url}
          start={audioData.start}
          end={audioData.end}
        />
      </Card>
    );
  }
);

export default ReaderParagraph;
