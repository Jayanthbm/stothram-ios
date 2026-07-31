import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  MdTranslate,
  MdCheckCircle,
  MdOutlineLightMode,
  MdOutlineDarkMode,
  MdBook,
  MdOutlineBook,
  MdSubtitles,
} from "react-icons/md";

import AppBar from "../components/AppBar.jsx";
import BottomSheetModal from "../components/BottomSheetModal.jsx";
import IconList from "../components/IconList.jsx";
import NoDataCard from "../components/NoDataCard.jsx";
import ReaderParagraph from "../components/ReaderParagraph.jsx";
import ReaderSubheading from "../components/ReaderSubheading.jsx";
import ReaderAudioButton from "../components/ReaderAudioButton.jsx";

import { ThemeContext } from "../context/themeContext.jsx";
import { dataHelper, getItem, storeItem } from "../utils/dataUtils.jsx";
import { CACHED_DATA_KEYS, SCREEN_NAMES } from "../constants.jsx";
import {
  extractAudioUrl,
  getAvailableLanguages,
  getAvailableMeaningLanguages,
  getFontForLanguage,
  hasMeaningsInContent,
} from "../utils/readerUtils.jsx";
import { stopAudioTrack } from "../services/audioService.js";

const LANGUAGE_MAPPER = { kn: "Kannada", en: "English" };

const ReaderScreen = () => {
  const {
    font,
    darkmode,
    darkSwitch: showDarkSwitch,
    toggleDarkMode,
  } = useContext(ThemeContext);

  const { state } = useLocation();
  const { item } = state || {};

  const [displayTitle, setDisplayTitle] = useState("");
  const [readerData, setReaderData] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState("kn");
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const [showMeanings, setShowMeanings] = useState(false);
  const [meaningLanguage, setMeaningLanguage] = useState(null);
  const [meaningLanguages, setMeaningLanguages] = useState([]);
  const [showMeaningLanguageModal, setShowMeaningLanguageModal] = useState(false);

  const contentRef = useRef(null);

  // Load saved meaning language on mount
  useEffect(() => {
    const savedLang = getItem(CACHED_DATA_KEYS.MEANING_LANGUAGE);
    if (savedLang) {
      setMeaningLanguage(savedLang);
    }
  }, []);

  // Cleanup audio track on unmount
  useEffect(() => {
    return () => {
      stopAudioTrack();
    };
  }, []);

  const handleSelectMeaningLanguage = (lang) => {
    setMeaningLanguage(lang);
    setShowMeaningLanguageModal(false);
    storeItem(CACHED_DATA_KEYS.MEANING_LANGUAGE, lang);
  };

  const hasMeanings = useMemo(() => {
    return hasMeaningsInContent(readerData);
  }, [readerData]);

  // Dynamic Right Icons (Max 3 icons)
  const rightIcons = useMemo(() => {
    const icons = [];
    const hasMeaningLangIcon = hasMeanings && meaningLanguages.length > 1;
    const hasTranslateIcon = languages && languages.length > 1;

    const hideThemeForThreeIcons =
      hasMeanings && hasMeaningLangIcon && hasTranslateIcon;

    if (showDarkSwitch && !hideThemeForThreeIcons) {
      icons.push({
        icon: darkmode ? (
          <MdOutlineLightMode size={26} />
        ) : (
          <MdOutlineDarkMode size={26} />
        ),
        onPress: toggleDarkMode,
      });
    }

    if (hasMeanings) {
      icons.push({
        icon: showMeanings ? <MdBook size={24} /> : <MdOutlineBook size={24} />,
        onPress: () => setShowMeanings((prev) => !prev),
      });

      if (hasMeaningLangIcon) {
        icons.push({
          icon: <MdSubtitles size={24} />,
          onPress: () => setShowMeaningLanguageModal(true),
        });
      }
    }

    if (hasTranslateIcon) {
      icons.push({
        icon: <MdTranslate size={24} />,
        onPress: () => setShowLanguageModal(true),
      });
    }

    return icons.slice(0, 3);
  }, [
    showDarkSwitch,
    darkmode,
    toggleDarkMode,
    hasMeanings,
    showMeanings,
    meaningLanguages,
    languages,
  ]);

  // Fetch reader data
  useEffect(() => {
    if (!item?.dataUrl) return;

    const fetchData = async () => {
      try {
        const fetchedData = await dataHelper(
          item.title,
          item.dataUrl,
          SCREEN_NAMES.READER_SCREEN
        );
        if (fetchedData) {
          setReaderData(fetchedData);
          setDisplayTitle(
            fetchedData.title || item?.displayTitle || item?.title
          );

          const defaultLang = fetchedData.defaultLanguage || "kn";
          const availableLangs = getAvailableLanguages(
            fetchedData.supportedLanguages
          );
          const availableMeaningLangs =
            getAvailableMeaningLanguages(fetchedData);

          setLanguages(availableLangs);
          setCurrentLanguage(defaultLang);
          setMeaningLanguages(availableMeaningLangs);
        }
      } catch (error) {
        console.error("Error fetching reader data:", error);
      }
    };

    setDisplayTitle(item?.displayTitle || item?.title);
    fetchData();
  }, [item]);

  const renderItem = (contentItem, index) => {
    const contentType = contentItem.type || "paragraph";
    const fontFamily = getFontForLanguage(
      readerData?.fonts,
      currentLanguage,
      contentType
    );

    if (contentType === "paragraph") {
      return (
        <ReaderParagraph
          key={index}
          item={contentItem}
          globalAudio={readerData?.audio}
          fontFamily={fontFamily}
          font={font}
          currentLanguage={currentLanguage}
          showMeanings={showMeanings}
          meaningLanguage={meaningLanguage}
          fonts={readerData?.fonts}
        />
      );
    }

    if (contentType === "subheading") {
      return (
        <ReaderSubheading
          key={index}
          item={contentItem}
          title={contentItem.title}
          fontFamily={fontFamily}
          font={font}
        />
      );
    }

    return null;
  };

  const topAudioUrl = useMemo(() => {
    const rootUrl =
      extractAudioUrl(readerData?.audio) ||
      extractAudioUrl(readerData?.audioUrl) ||
      extractAudioUrl(readerData?.audio_url) ||
      extractAudioUrl(item?.audioUrl) ||
      extractAudioUrl(item?.audio);

    if (rootUrl) return rootUrl;

    if (Array.isArray(readerData?.content)) {
      for (const contentItem of readerData.content) {
        const pUrl =
          extractAudioUrl(contentItem?.audio) ||
          extractAudioUrl(contentItem?.audioUrl);
        if (pUrl) return pUrl;
      }
    }
    return null;
  }, [readerData, item]);

  return (
    <>
      <AppBar
        title={displayTitle || item?.title}
        rightIcons={rightIcons}
        slider={true}
      />

      <div className="app-content-slider">
        {/* Top Main Audio Player */}
        <ReaderAudioButton
          audioUrl={topAudioUrl}
          isTopPlayer={true}
          title={item?.title}
          displayTitle={displayTitle}
        />

        <div ref={contentRef} className="reader-content">
          {readerData?.content?.length ? (
            readerData.content.map(renderItem)
          ) : (
            <NoDataCard title="No content available" />
          )}
        </div>
      </div>

      {/* Language Modal */}
      <BottomSheetModal
        title="Choose Language"
        visible={showLanguageModal}
        closeModal={() => setShowLanguageModal(false)}
      >
        {languages?.map((language) => (
          <IconList
            key={language}
            title={LANGUAGE_MAPPER[language] || language.toUpperCase()}
            subtitle={`Switch to ${LANGUAGE_MAPPER[language] || language}`}
            leftIcon={<MdTranslate size={22} />}
            rightContent={
              currentLanguage === language ? (
                <MdCheckCircle size={22} color="var(--primary)" />
              ) : null
            }
            onPress={() => {
              setCurrentLanguage(language);
              setShowLanguageModal(false);
            }}
          />
        ))}
      </BottomSheetModal>

      {/* Meaning Language Modal */}
      <BottomSheetModal
        title="Choose Meaning Language"
        visible={showMeaningLanguageModal}
        closeModal={() => setShowMeaningLanguageModal(false)}
      >
        {meaningLanguages?.map((lang) => (
          <IconList
            key={lang}
            title={LANGUAGE_MAPPER[lang] || lang.toUpperCase()}
            subtitle={`Display meanings in ${LANGUAGE_MAPPER[lang] || lang}`}
            leftIcon={<MdSubtitles size={22} />}
            rightContent={
              (meaningLanguage || currentLanguage) === lang ? (
                <MdCheckCircle size={22} color="var(--primary)" />
              ) : null
            }
            onPress={() => handleSelectMeaningLanguage(lang)}
          />
        ))}
      </BottomSheetModal>
    </>
  );
};

export default ReaderScreen;
