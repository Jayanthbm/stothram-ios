import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import godLogo from "../assets/god.webp";
import { SCREEN_NAMES } from "../constants.jsx";
import { ThemeContext } from "../context/themeContext.jsx";
import { dataHelper, preFetcher } from "../utils/dataUtils.jsx";
import AppBar from "../components/AppBar.jsx";
const ListScreen = () => {
  const { viewType, darkSwitch, toggleDarkMode, toggleViewType, darkmode } =
    useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { type } = state;
  const [title, setTitle] = useState("");
  const [dataUrl, setDataUrl] = useState(null);
  const [list, setList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState(list);
  const [rendered, setRendered] = useState(false);
  // Set Title and Data URL
  useEffect(() => {
    setTitle(type?.title);
    setDataUrl(type?.dataUrl);
  }, [type]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await dataHelper(
        title,
        dataUrl,
        SCREEN_NAMES.LIST_SCREEN
      );
      if (fetchedData) {
        setList(fetchedData?.data);
        // Prefetch data for the Reader screen
        preFetcher(fetchedData?.data, SCREEN_NAMES.READER_SCREEN);
      }
    };

    if (dataUrl) {
      fetchData();
    }
  }, [dataUrl, title]);

  // Update Filtered Data when List Changes
  useEffect(() => {
    setFilteredData(list);
  }, [list]);

  // Filter Data based on Search Text
  const filterData = (data, searchText) => {
    return data.filter((item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  // Handle Search Input
  const handleSearch = (text) => {
    setSearchValue(text);
    const newData = filterData(list, text);
    setFilteredData(newData);
    setRendered(true);
  };

  // Handle Item Click
  const handlePress = (item) => {
    navigate("/reader", { state: { item } });
  };

  const CardView = ({ item, onClick }) => {
    const { displayTitle } = item;
    return (
      <div className="card-item" onClick={onClick}>
        <img src={godLogo} alt={"god"} className="card-image" />
        <div className="card-title">{displayTitle}</div>
      </div>
    );
  };

  const ListView = ({ item, onClick }) => {
    const { displayTitle } = item;
    return (
      <div className="list-item" onClick={onClick}>
        <div className="list-title">{displayTitle}</div>
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
      iconName: viewType === "card" ? "view_list" : "view_module",
      onPress: () => toggleViewType(),
    });
    return icons;
  }, [darkSwitch, darkmode, toggleDarkMode, toggleViewType, viewType]);

  return (
    <>
      <AppBar showBack={true} title={title} rightIcons={rightIcons} />
      <div className={"search-container"}>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
          placeholder="Search"
        />
      </div>
      <div
        className={`${
          viewType === "list" ? "list-container" : "card-container"
        }`}
      >
        {filteredData.map((item, index) => {
          if (viewType === "list") {
            return (
              <ListView
                key={index}
                item={item}
                onClick={() => handlePress(item)}
              />
            );
          }
          if (viewType === "card") {
            return (
              <CardView
                key={index}
                item={item}
                onClick={() => handlePress(item)}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
      {rendered && filteredData.length === 0 && (
        <div className="no-data">No data found</div>
      )}
    </>
  );
};

export default ListScreen;
