import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineProfile } from "react-icons/ai";
import { FiDatabase } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/appHeader.jsx";
import { CACHED_DATA_KEYS, DATA_URLS, SCREEN_NAMES } from "../constants.jsx";
import { ThemeContext } from "../context/themeContext.jsx";
import {
  dataHelper,
  preFetcher,
  storeItem,
  storeJSON,
} from "../utils/dataUtils.jsx";
import AppBar from "../components/AppBar.jsx";

const HomeScreen = () => {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const { darkmode, darkSwitch, toggleDarkMode } = useContext(ThemeContext);
  const windowSize = useRef([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await dataHelper(
          CACHED_DATA_KEYS.HOME_SCREEN,
          DATA_URLS.HOME_SCREEN,
          SCREEN_NAMES.HOME_SCREEN
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

  const rightIcons = useMemo(() => {
    const icons = [];
    if (darkSwitch) {
      icons.push({
        iconName: darkmode ? "light_mode" : "dark_mode",
        onPress: () => toggleDarkMode(),
      });
    }
    icons.push({
      iconName: "settings",
      onPress: () => navigate("/settings"),
    });
    return icons;
  }, [darkSwitch, darkmode, toggleDarkMode]);

  return (
    <>
      <AppBar showBack={false} title="Stothram" rightIcons={rightIcons} />
      <m3e-slider>
        <m3e-slider-thumb></m3e-slider-thumb>
      </m3e-slider>
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
    </>
  );
};

export default HomeScreen;
