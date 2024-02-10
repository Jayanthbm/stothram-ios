import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppHeader from "../components/appHeader.jsx";

import godLogo from "../assets/god.webp";
import { SCREEN_NAMES } from "../constants.jsx";
import { ThemeContext } from "../context/themeContext.jsx";
import { dataHelper, preFetcher } from "../utils/dataUtils.jsx";
import AdsenseBottom from "../components/adsenseBottom.jsx";
import AdsenseTop from "../components/adsenseTop.jsx";
const ListScreen = () => {
  const { viewType } = useContext(ThemeContext);
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

  return (
    <>
      <AppHeader
        title={title}
        backAction={() => navigate(-1)}
        toggleView={true}
      />
      <AdsenseTop />
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
      <AdsenseBottom />
    </>
  );
};

export default ListScreen;
