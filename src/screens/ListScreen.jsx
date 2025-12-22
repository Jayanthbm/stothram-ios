import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { FiGrid, FiList } from "react-icons/fi";
import { LuNotepadText } from "react-icons/lu";
import { MdSearchOff } from "react-icons/md";
import { SCREEN_NAMES } from "../constants.jsx";
import { ThemeContext } from "../context/themeContext.jsx";
import { dataHelper, preFetcher } from "../utils/dataUtils.jsx";

import AppBar from "../components/AppBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Card from "../components/Card.jsx";
import NoDataCard from "../components/NoDataCard.jsx";
import IconList from "../components/IconList.jsx";

const ListScreen = () => {
  const {
    viewType,
    toggleViewType,
    darkmode,
    darkSwitch: showDarkSwitch,
    toggleDarkMode,
  } = useContext(ThemeContext);

  const navigate = useNavigate();
  const { state } = useLocation();
  const { type } = state || {};

  const [title, setTitle] = useState("");
  const [dataUrl, setDataUrl] = useState(null);
  const [list, setList] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  /* -------------------- Init -------------------- */

  useEffect(() => {
    if (type) {
      setTitle(type.title);
      setDataUrl(type.dataUrl);
    }
  }, [type]);

  useEffect(() => {
    if (!dataUrl) return;

    const load = async () => {
      const result = await dataHelper(title, dataUrl, SCREEN_NAMES.LIST_SCREEN);
      if (result?.data) {
        setList(result.data);
        preFetcher(result.data, SCREEN_NAMES.READER_SCREEN);
      }
    };

    load();
  }, [dataUrl, title]);

  /* -------------------- Search -------------------- */

  const filteredData = useMemo(() => {
    if (!searchValue.trim()) return list;
    return list.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [list, searchValue]);

  const handlePress = (item) => {
    navigate("/reader", { state: { item } });
  };

  /* -------------------- Views -------------------- */

  const CARD_MARGIN = 10;
  const CARD_HEIGHT = 130;

  const containerWidth = window.innerWidth - 30;
  const CARD_WIDTH = (containerWidth - CARD_MARGIN * 3) / 2;
  const ICON_SIZE = Math.min(CARD_WIDTH * 0.5, 60);
  const CardView = ({ item, index, total }) => {
    const isLastOdd = total % 2 !== 0 && index === total - 1;
    return (
      <Card
        onClick={() => handlePress(item)}
        style={{
          width: isLastOdd ? containerWidth - CARD_MARGIN * 2 : CARD_WIDTH,
          height: CARD_HEIGHT,
        }}
      >
        <div className="card-grid-content">
          <LuNotepadText size={ICON_SIZE} />
          <div className="card-title">{item.displayTitle}</div>
        </div>
      </Card>
    );
  };

  const ListView = ({ item }) => (
    <IconList
      leftIcon={<LuNotepadText size={22} />}
      title={item.displayTitle}
      onPress={() => handlePress(item)}
    />
  );

  /* -------------------- AppBar icons -------------------- */

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
      icon: viewType === "card" ? <FiList size={26} /> : <FiGrid size={26} />,
      onPress: toggleViewType,
    });

    return icons;
  }, [showDarkSwitch, darkmode, toggleDarkMode, viewType, toggleViewType]);

  /* -------------------- Render -------------------- */

  return (
    <>
      <AppBar showBack title={title} rightIcons={rightIcons} />

      <div className="app-content">
        <SearchBar
          value={searchValue}
          onChangeText={setSearchValue}
          onClear={() => setSearchValue("")}
          placeholder={`Search ${title}`}
        />
      </div>

      <div
        className={viewType === "list" ? "list-container" : "card-container"}
      >
        {filteredData.map((item, index) =>
          viewType === "list" ? (
            <ListView key={index} item={item} />
          ) : (
            <CardView
              key={index}
              item={item}
              index={index}
              total={item.length}
            />
          )
        )}
      </div>

      {filteredData.length === 0 && searchValue && (
        <NoDataCard
          title={`No data found in ${title}`}
          icon={<MdSearchOff size={48} />}
          actionLabel="Clear"
          onActionPress={() => setSearchValue("")}
        />
      )}
    </>
  );
};;

export default ListScreen;
