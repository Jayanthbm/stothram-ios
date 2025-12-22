import React, { useContext, useEffect, useState } from "react";
import AppBar from "../components/AppBar.jsx";
import IconList from "../components/IconList.jsx";
import MaterialSwitch from "../components/MaterialSwitch.jsx";
import ListHeader from "../components/ListHeader.jsx";

import {
  MdDarkMode,
  MdPalette,
  MdShare,
  MdFavorite,
  MdPeopleOutline,
} from "react-icons/md";

import { ThemeContext } from "../context/themeContext.jsx";
import { dataHelper } from "../utils/dataUtils";
import { CACHED_DATA_KEYS, DATA_URLS, SCREEN_NAMES } from "../constants.jsx";

const SettingsScreen = () => {
  const { toggleDarkMode, darkmode, toggleDarkSwitch, darkSwitch } =
    useContext(ThemeContext);
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await dataHelper(
          CACHED_DATA_KEYS.SETTINGS_SCREEN,
          DATA_URLS.SETTINGS_SCREEN,
          SCREEN_NAMES.SETTINGS_SCREEN
        );
        // Update state with fetched contributions
        if (fetchedData) {
          setContributions(fetchedData?.contributions);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const PLAY_STORE_URL = "https://jayanthbm.github.io/stothram-ios/";

  const shareApp = async () => {
    const text = `Check out this amazing Stothram app 🙏\n\n${PLAY_STORE_URL}`;

    if (navigator.share) {
      await navigator.share({
        title: "Stothram App",
        text,
        url: PLAY_STORE_URL,
      });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Link copied to clipboard");
    }
  };

  return (
    <>
      <AppBar showBack title="Settings" rightIcons={[]} />
      <div className="app-content">
        <ListHeader title="General Settings" />

        <IconList
          leftIcon={<MdDarkMode size={22} />}
          title="Dark theme"
          subtitle="Reduce glare and improve night viewing"
          rightContent={
            <MaterialSwitch value={darkmode} onValueChange={toggleDarkMode} />
          }
        />

        <IconList
          leftIcon={<MdPalette size={22} />}
          title="Toggle in every page"
          subtitle="Show dark mode toggle across screens"
          rightContent={
            <MaterialSwitch
              value={darkSwitch}
              onValueChange={toggleDarkSwitch}
            />
          }
        />

        {/* Available roles Developer,Editor, */}
        <ListHeader title="Contributions" />

        {contributions.map(({ name, role }, index) => (
          <IconList
            key={`${name}-${index}`}
            leftIcon={<MdPeopleOutline size={22} />}
            title={name}
            subtitle={role}
          />
        ))}

        {/* ---------- Share ---------- */}
        <ListHeader title="Support" />

        <div className="share-card" onClick={shareApp}>
          <MdShare size={22} />
          <span>Share app with friends & family</span>
        </div>

        {/* ---------- Made with ---------- */}
        <div className="made-with">
          <span>Made with</span>
          <span className="heart">
            <MdFavorite size={20} />
          </span>
          <span>in India 🇮🇳</span>
        </div>
      </div>
    </>
  );
};

export default SettingsScreen;
