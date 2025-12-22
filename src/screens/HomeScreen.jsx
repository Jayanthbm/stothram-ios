import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { MdMenuBook } from "react-icons/md";
import { LuListMusic } from "react-icons/lu";
import { FaStackExchange } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { CACHED_DATA_KEYS, DATA_URLS, SCREEN_NAMES } from "../constants.jsx";
import { ThemeContext } from "../context/themeContext.jsx";
import {
  dataHelper,
  preFetcher,
  storeItem,
  storeJSON,
} from "../utils/dataUtils.jsx";
import Card from "../components/Card.jsx";
import AppBar from "../components/AppBar.jsx";

const HomeScreen = () => {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);
  const {
    darkmode,
    darkSwitch: showDarkSwitch,
    toggleDarkMode,
  } = useContext(ThemeContext);
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

    icons.push({
      icon: <FiSettings size={26} />,
      onPress: () => navigate("/settings"),
    });

    return icons;
  }, [showDarkSwitch, darkmode, toggleDarkMode, navigate]);

  const CARD_MARGIN = 10;
  const CARD_HEIGHT = 130;

  const containerWidth = window.innerWidth - 30;
  const CARD_WIDTH = (containerWidth - CARD_MARGIN * 3) / 2;

  const ICON_SIZE = Math.min(CARD_WIDTH * 0.5, 60);

  const icons = {
    "book-open-page-variant-outline": <MdMenuBook size={ICON_SIZE} />,
    "book-music-outline": <LuListMusic size={ICON_SIZE} />,
    "stack-exchange": <FaStackExchange size={ICON_SIZE} />,
  };
  const TypeItem = ({ item, index, total, onClick }) => {
    const isLastOdd = total % 2 !== 0 && index === total - 1;

    return (
      <Card
        onClick={onClick}
        style={{
          width: isLastOdd ? containerWidth - CARD_MARGIN * 2 : CARD_WIDTH,
          height: CARD_HEIGHT,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          {icons[item.icon_new]}
          <div className="card-title">{item.title}</div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <AppBar showBack={false} title="Stothram" rightIcons={rightIcons} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: windowSize.current[1] - 150,
        }}
      >
        <div className="list-wrapper">
          <div className="card-container">
            {types.map((type, index) => (
              <TypeItem
                key={type.id}
                item={type}
                index={index}
                total={types.length}
                onClick={() => handlePress(type)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeScreen;
