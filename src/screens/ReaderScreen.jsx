import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MdTranslate,
  MdCheckCircle,
  MdOutlineLightMode,
  MdOutlineDarkMode,
} from "react-icons/md";

import AppBar from "../components/AppBar.jsx";
import Card from "../components/Card.jsx";
import BottomSheetModal from "../components/BottomSheetModal.jsx";
import IconList from "../components/IconList.jsx";
import NoDataCard from "../components/NoDataCard.jsx";
import MaterialSlider from "../components/MaterialSlider.jsx";

import { ThemeContext } from "../context/themeContext.jsx";
import { dataHelper } from "../utils/dataUtils.jsx";
import { SCREEN_NAMES } from "../constants.jsx";

const LANGUAGE_MAPPER = { kn: "Kannada", en: "English" };
const FONT_WEIGHTS = { brhknde: 600 };

const ReaderScreen = () => {
  const {
    font,
    updateFont,
    darkmode,
    darkSwitch: showDarkSwitch,
    toggleDarkMode,
  } = useContext(ThemeContext);

  const navigate = useNavigate();
  const { state } = useLocation();
  const { item, type } = state || {};

  const [title, setTitle] = useState("");
  const [displayTitle, setDisplayTitle] = useState("");
  const [readerData, setReaderData] = useState(null);
  const [fetchedData, setFetchedData] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const contentRef = useRef(null);

  /* -------------------- Fetch -------------------- */

  useEffect(() => {
    if (!item?.dataUrl) return;

    const fetchData = async () => {
      const result = await dataHelper(
        item.title,
        item.dataUrl,
        SCREEN_NAMES.READER_SCREEN
      );

      if (!result) return;

      setFetchedData(result);

      if (result.translations) {
        const langs = Object.keys(result.translations);
        setLanguages(langs);
        setCurrentLanguage(langs[0]);
      } else {
        setReaderData(result);
      }
    };

    setTitle(item.title);
    setDisplayTitle(item.displayTitle);
    fetchData();
  }, [item]);

  /* -------------------- Language switch -------------------- */

  useEffect(() => {
    if (currentLanguage && fetchedData?.translations) {
      const next = fetchedData.translations[currentLanguage];
      setReaderData(next);
      setDisplayTitle(next.title);
    }
  }, [currentLanguage, fetchedData]);

  /* -------------------- Scroll -------------------- */

  const handleScroll = () => {
    if (!contentRef.current) return;
    setShowScrollTop(contentRef.current.scrollTop > 250);
  };

  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* -------------------- AppBar Icons -------------------- */

  const rightIcons = useMemo(() => {
    const icons = [];

    if (showDarkSwitch) {
      icons.push({
        icon: darkmode ? (
          <MdOutlineLightMode size={26} />
        ) : (
          <MdOutlineDarkMode size={26} />
        ),
        onPress: toggleDarkMode,
      });
    }

    if (languages.length > 1) {
      icons.push({
        icon: <MdTranslate size={24} />,
        onPress: () => setShowLanguageModal(true),
      });
    }

    return icons;
  }, [languages, showDarkSwitch, darkmode, toggleDarkMode]);

  /* -------------------- Render content -------------------- */

  const renderItem = (item, index) => {
    if (item.type === "paragraph") {
      return (
        <Card key={index} disableRipple>
          {item.lines.map((line, idx) =>
            line?.trim() ? (
              <div
                key={idx}
                style={{
                  fontFamily: item.fontFamily,
                  fontWeight: FONT_WEIGHTS[item.fontFamily] || 700,
                  fontSize: item.fontFamily === "brhknde" ? font + 2 : font,
                  lineHeight:
                    item.fontFamily === "brhknde"
                      ? `${font + 16}px`
                      : `${font + 14}px`,
                }}
              >
                {line}
              </div>
            ) : (
              <div key={idx} style={{ height: 8 }} />
            )
          )}
        </Card>
      );
    }

    if (item.type === "subheading") {
      return (
        <Card
          key={index}
          style={{
            backgroundColor: "var(--surface-variant)",
            padding: 6,
          }}
          disableRipple
        >
          <div
            style={{
              textAlign: "center",
              fontSize: font + 2,
              fontWeight: 500,
            }}
          >
            {item.title}
          </div>
        </Card>
      );
    }

    return null;
  };

  return (
    <>
      <AppBar
        title={displayTitle || title}
        rightIcons={rightIcons}
        slider={true}
      />
      <div className="app-content-slider">
        <div
          ref={contentRef}
          className="reader-content"
          onScroll={handleScroll}
        >
          {readerData?.content?.length ? (
            readerData.content.map(renderItem)
          ) : (
            <NoDataCard title="No content available" />
          )}
        </div>
      </div>

      {/* Language Picker */}
      <BottomSheetModal
        title="Choose Language"
        visible={showLanguageModal}
        closeModal={() => setShowLanguageModal(false)}
      >
        {languages.map((lang) => (
          <IconList
            key={lang}
            title={LANGUAGE_MAPPER[lang] || lang.toUpperCase()}
            subtitle={`Switch to ${LANGUAGE_MAPPER[lang] || lang}`}
            leftIcon={<MdTranslate size={22} />}
            rightContent={
              currentLanguage === lang && (
                <MdCheckCircle size={22} color="var(--primary)" />
              )
            }
            onPress={() => {
              setCurrentLanguage(lang);
              setShowLanguageModal(false);
            }}
          />
        ))}
      </BottomSheetModal>
    </>
  );
};

export default ReaderScreen;
