import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppHeader from "../components/appHeader.jsx";
import { SCREEN_NAMES } from "../constants.jsx";
import { ThemeContext } from "../context/themeContext.jsx";
import { dataHelper } from "../utils/dataUtils.jsx";

const ReaderScreen = () => {
  const { darkmode, font, updateFont } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { item } = state;
  const [title, setTitle] = useState("");
  const [displayTitle, setDisplayTitle] = useState("");
  const [readerData, setReaderData] = useState(null);

  // useEffect to fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await dataHelper(
          item?.title,
          item?.dataUrl,
          SCREEN_NAMES.READER_SCREEN
        );
        if (fetchedData) {
          setReaderData(fetchedData);
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

  const Paragraph = ({ data }) => {
    return (
      <div
        className="paragarph-container"
        style={{
          borderBottomColor: darkmode ? "#b8b6ab" : "#8f8f8f",
        }}
      >
        {data?.lines?.map((line, index) => {
          return (
            <span
              key={index}
              className="line"
              style={{
                color: darkmode ? "#fff" : "#000",
                fontSize: font,
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
      <div
        className="subheading-container"
        style={{
          backgroundColor: darkmode ? "#878683" : "#6200EE",
        }}
      >
        <span className="subheading-text">{data.title}</span>
      </div>
    );
  };
  return (
    <>
      <AppHeader
        title={displayTitle ? displayTitle : title}
        backAction={() => navigate(-1)}
      />
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
            return <Paragraph data={item} key={index} />;
          }
          if (item.type === "subheading") {
            return <Subheading data={item} key={index} />;
          }
          return null;
        })}
      </div>
    </>
  );
};

export default ReaderScreen;