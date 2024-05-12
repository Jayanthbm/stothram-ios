import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineProfile } from "react-icons/ai";
import { FiDatabase } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AdsenseBottom from "../components/adsenseBottom.jsx";
import AdsenseTop from "../components/adsenseTop.jsx";
import AppHeader from "../components/appHeader.jsx";
import { CACHED_DATA_KEYS, DATA_URLS, SCREEN_NAMES } from "../constants.jsx";
import { ThemeContext } from "../context/themeContext.jsx";
import {
  dataHelper,
  preFetcher,
  storeItem,
  storeJSON,
} from "../utils/dataUtils.jsx";

const HomeScreen = () => {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const { darkmode } = useContext(ThemeContext);
  const windowSize = useRef([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await dataHelper(
          CACHED_DATA_KEYS.HOME_SCREEN,
          DATA_URLS.HOME_SCREEN,
          SCREEN_NAMES.HOME_SCREEN,
        );
        if (fetchedData) {
          setTypes(fetchedData?.data);
          storeItem(CACHED_DATA_KEYS.UPI_ID, fetchedData?.UPI_ID);
          storeJSON(CACHED_DATA_KEYS.UPI_DATA, fetchedData?.upi_data);
          preFetcher(fetchedData?.data, SCREEN_NAMES.LIST_SCREEN);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handlePress = (type) => {
    navigate("/list", { state: { type } });
  };

  const icons = {
    profile: (
      <AiOutlineProfile color="#fff" size={80} style={{ paddingTop: 5 }} />
    ),
    database: <FiDatabase color="#fff" size={80} style={{ paddingTop: 5 }} />,
  };
  const TypeItem = ({ item, onClick }) => {
    const { title, icon, darkBackground, lightBackground } = item;
    return (
      <div
        className="card-item"
        style={{
          backgroundColor: darkmode ? darkBackground : lightBackground,
          borderColor: darkmode ? darkBackground : lightBackground,
        }}
        onClick={onClick}
      >
        {icons[icon]}
        <div className="card-title" style={{ color: "#fff" }}>
          {title}
        </div>
      </div>
    );
  };

  return (
    <>
      <AppHeader
        title={"Stothram"}
        settingsAction={() => navigate("/settings")}
      />
      <AdsenseTop />
      <div
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          height: windowSize.current[1] - 150,
        }}
      >
        <div className="card-container">
          {types.map((type) => (
            <TypeItem
              key={type.id}
              item={type}
              onClick={() => {
                handlePress(type);
              }}
            />
          ))}
        </div>
      </div>
      <AdsenseBottom />
    </>
  );
};

export default HomeScreen;
