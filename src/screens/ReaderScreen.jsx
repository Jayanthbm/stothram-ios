import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PdfReaderComponent from "../components/PdfReader.jsx";
import AdsenseBottom from "../components/adsenseBottom.jsx";
import AdsenseTop from "../components/adsenseTop.jsx";
import AppHeader from "../components/appHeader.jsx";
import { SCREEN_NAMES } from "../constants.jsx";
import { ThemeContext } from "../context/themeContext.jsx";
import { dataHelper } from "../utils/dataUtils.jsx";

const ReaderScreen = () => {
  const { font, updateFont } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { item } = state;
  const [title, setTitle] = useState("");
  const [displayTitle, setDisplayTitle] = useState("");
  const [readerData, setReaderData] = useState(null);
  const [pdfReader, setPdfReader] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [fetchedData, setFetchedData] = useState(null);
  const [languages, setLanguages] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState(null);
  // useEffect to fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await dataHelper(
          item?.title,
          item?.dataUrl,
          SCREEN_NAMES.READER_SCREEN,
        );
        setFetchedData(fetchedData);
        if (fetchedData) {
          if (typeof fetchedData === "string") {
            setPdfReader(true);
          }
          if (fetchedData.translations) {
            const languages = Object.keys(fetchedData.translations);
            setLanguages(languages);
            const currentLanguage = languages[0];
            setCurrentLanguage(currentLanguage);
          } else {
            setReaderData(fetchedData);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    setDisplayTitle(item.displayTitle);
    setTitle(item?.title);
    if (item?.dataUrl) {
      fetchData();
    }
  }, [item]);

  useEffect(() => {
    if (currentLanguage && fetchedData.translations !== undefined) {
      setReaderData(fetchedData["translations"][currentLanguage]);
      setDisplayTitle(fetchedData["translations"][currentLanguage].title);
    }
  }, [currentLanguage]);
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const Paragraph = ({
    data,
    index,
    highlightedIndex,
    onClick,
    onTouchStart,
  }) => {
    return (
      <div
        className={`paragarph-container ${
          highlightedIndex === index ? "active-paragraph" : ""
        }`}
        onClick={onClick}
        onTouchStart={onTouchStart}
      >
        {data?.lines?.map((line, index) => {
          return (
            <span
              key={index}
              className="line"
              style={{
                fontSize: font,
                display: "block",
              }}
            >
              {line}
            </span>
          );
        })}
      </div>
    );
  };

  const Subheading = ({ data }) => {
    return (
      <div className="subheading-container">
        <span className="subheading-text">{data.title}</span>
      </div>
    );
  };
  const transalateAction = (language) => {
    setCurrentLanguage(language);
  };
  return (
    <>
      <AppHeader
        title={displayTitle ? displayTitle : title}
        backAction={() => navigate(-1)}
        languages={languages}
        selectedLanguage={currentLanguage}
        transalateAction={transalateAction}
      />
      <AdsenseTop />
      {pdfReader ? (
        <>{readerData && <PdfReaderComponent url={readerData} />}</>
      ) : (
        <>
          <div className="font-slider-container">
            <input
              type="range"
              min="15"
              max="40"
              step="1"
              value={font}
              onChange={(e) => {
                updateFont(parseInt(e.target.value));
              }}
              className="font-slider"
            />
          </div>
          <div>
            {readerData?.content?.map((item, index) => {
              if (item?.type === "paragraph") {
                return (
                  <Paragraph
                    data={item}
                    key={index}
                    onClick={() => {
                      setHighlightedIndex(index);
                    }}
                    highlightedIndex={highlightedIndex}
                    index={index}
                    onTouchStart={() => {
                      setHighlightedIndex(index);
                    }}
                  />
                );
              }
              if (item.type === "subheading") {
                return <Subheading data={item} key={index} />;
              }
              return null;
            })}
          </div>
        </>
      )}

      <AdsenseBottom />
    </>
  );
};

export default ReaderScreen;
