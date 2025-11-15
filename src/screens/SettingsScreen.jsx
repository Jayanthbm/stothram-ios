import React, { useContext, useEffect, useState } from "react";
import AppBar from "../components/AppBar.jsx";
import { ThemeContext } from "../context/themeContext.jsx";
import { CACHED_DATA_KEYS, DATA_URLS, SCREEN_NAMES } from "../constants.jsx";
import { dataHelper } from "../utils/dataUtils";

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

  // Helper to pick icons based on role
  const getRoleIcon = (role) => {
    if (role === "Editor") return "edit";
    if (role === "Developer") return "code";
    return "person";
  };

  const ListHeader = ({ title, icon }) => {
    return (
      <m3e-list-item size="small">
        <m3e-icon slot="leading-icon" name={icon}></m3e-icon>
        {title}
      </m3e-list-item>
    );
  };
  const ListItem = ({ title, subtitle, toggle, state, icon = "person" }) => {
    return (
      <m3e-list onClick={toggle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: 2,
            paddingRight: 5,
            alignItems: "center",
          }}
        >
          <m3e-list-item>
            <m3e-icon slot="leading-icon" name={icon}></m3e-icon>
            {title}
            <span slot="supporting-text">{subtitle}</span>
          </m3e-list-item>

          {toggle && (
            <m3e-switch
              icons="selected"
              checked={state}
              onChange={toggle}
            ></m3e-switch>
          )}
        </div>
      </m3e-list>
    );
  };

  return (
    <>
      <AppBar showBack={true} title="Settings" />

      {/* GENERAL SETTINGS */}
      <ListHeader title="General Settings" icon="settings" />

      <m3e-card>
        <ListItem
          title="Dark theme"
          subtitle="Reduce glare and improve night viewing"
          toggle={toggleDarkMode}
          state={darkmode}
          icon={darkmode ? "light_mode" : "dark_mode"}
        />
        <m3e-divider></m3e-divider>

        <ListItem
          title="Toggle in Every Page"
          subtitle="Show option to toggle dark mode in every screen"
          toggle={toggleDarkSwitch}
          state={darkSwitch}
          icon="visibility"
        />
      </m3e-card>

      <ListHeader title="Contributions" icon={"info"} />
      <m3e-card>
        {contributions?.map(({ name, role }, index) => (
          <>
            <ListItem
              key={name}
              title={name}
              subtitle={role}
              icon={getRoleIcon(role)}
            />
            {index !== contributions.length - 1 && <m3e-divider></m3e-divider>}
          </>
        ))}
      </m3e-card>

      {/* ANDROID APP SECTION */}
      <ListHeader title="Android App" icon="android" />
      <m3e-card style={{ padding: "16px", textAlign: "center" }}>
        <a
          href="https://play.google.com/store/apps/details?id=com.jayanth.shotram"
          target="_blank"
          style={{
            color: "var(--md-sys-color-primary)",
            fontWeight: "600",
            fontSize: "16px",
            textDecoration: "none",
          }}
        >
          Download Now
        </a>
      </m3e-card>

      {/* FOOTER */}
      <div
        style={{ marginTop: "32px", marginBottom: "40px", textAlign: "center" }}
      >
        <span
          style={{
            color: "var(--md-sys-color-on-surface-variant)",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          Made with
        </span>

        <span className="heart-pulse" style={{ margin: "0 6px" }}>
          ❤️
        </span>

        <span
          style={{
            color: "var(--md-sys-color-on-surface-variant)",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          in India 🇮🇳
        </span>
      </div>
    </>
  );
};

export default SettingsScreen;
