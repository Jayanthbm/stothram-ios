import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/appHeader.jsx";
import { CACHED_DATA_KEYS, DATA_URLS, SCREEN_NAMES } from "../constants.jsx";
import { ThemeContext } from "../context/themeContext.jsx";
import { dataHelper } from "../utils/dataUtils";
const SettingsScreen = () => {
  const { toggleDarkMode, darkmode, toggleDarkSwitch, darkSwitch } =
    useContext(ThemeContext);
  const navigate = useNavigate();
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

  const ListHeader = ({ title, icon }) => {
    return (
      <div className="list-header">
        <span className="list-header-title">{title}</span>
      </div>
    );
  };
  const ListItem = ({ title, subtitle, toggle, state }) => {
    // Provide default values for optional props
    const renderSubtitle = subtitle && (
      <span className="settings-item-subtitle">{subtitle}</span>
    );
    return (
      <div className="settings-item-container">
        <div className="settings-item">
          <span className="settings-item-title">{title}</span>
          {renderSubtitle}
        </div>
        {toggle && (
          <label class="switch">
            <input type="checkbox" checked={state} onChange={toggle} />
            <span class="slider round"></span>
          </label>
        )}
      </div>
    );
  };

  return (
    <>
      <AppHeader title={"Settings"} backAction={() => navigate(-1)} />
      <ListHeader title="General Settings" icon={"settings"} />
      <ListItem
        title="Dark theme"
        subtitle="Reduce glare and improve night viewing"
        toggle={toggleDarkMode}
        state={darkmode}
      />
      <ListItem
        title="Toggle in Every Page"
        subtitle="Show option to toggle dark mode in every screen"
        toggle={toggleDarkSwitch}
        state={darkSwitch}
      />

      <ListHeader title="Contributions" icon={"info"} />
      {contributions?.map(({ name, role }) => (
        <ListItem title={name} subtitle={role} key={name} />
      ))}
      <ListHeader title="Andriod App" icon={"info"} />
      <div style={{ textAlign: "center" }}>
        <a
          href="https://play.google.com/store/apps/details?id=com.jayanth.shotram"
          target="_blank"
        >
          Download Now
        </a>
      </div>
    </>
  );
};

export default SettingsScreen;
