import React, { useContext, useEffect, useState, useRef } from "react";
import AppBar from "../components/AppBar.jsx";
import IconList from "../components/IconList.jsx";
import MaterialSwitch from "../components/MaterialSwitch.jsx";
import ListHeader from "../components/ListHeader.jsx";
import BottomSheetModal from "../components/BottomSheetModal.jsx";

import {
  MdDarkMode,
  MdPalette,
  MdShare,
  MdFavorite,
  MdPeopleOutline,
  MdCode,
  MdApi,
  MdCached,
  MdAccessTime,
  MdHome,
  MdFormatListBulleted,
  MdMenuBook,
  MdSettings,
  MdCheckCircle,
  MdScience,
  MdRocketLaunch,
  MdBuild,
} from "react-icons/md";

import { ThemeContext } from "../context/themeContext.jsx";
import {
  dataHelper,
  getApiUrl,
  getCacheThresholds,
  getDynamicDataUrls,
  getItem,
  saveCacheThresholds,
  storeItem,
  updateApiUrl,
  DEFAULT_DATA_THRESHOLDS,
} from "../utils/dataUtils.jsx";
import { CACHED_DATA_KEYS, DATA_URLS, SCREEN_NAMES, API_URL } from "../constants.jsx";

const ENVS = ["dev", "stage", "prod"];
const ENV_LABELS = {
  dev: "Development",
  stage: "Staging",
  prod: "Production",
};

const CACHE_OPTIONS = [
  { label: "No Cache (Always fetch online)", value: 0 },
  { label: "15 Minutes", value: 15 * 60 * 1000 },
  { label: "1 Hour", value: 1 * 60 * 60 * 1000 },
  { label: "2 Hours", value: 2 * 60 * 60 * 1000 },
  { label: "6 Hours", value: 6 * 60 * 60 * 1000 },
  { label: "12 Hours", value: 12 * 60 * 60 * 1000 },
  { label: "1 Day", value: 24 * 60 * 60 * 1000 },
  { label: "7 Days", value: 7 * 24 * 60 * 60 * 1000 },
  { label: "15 Days", value: 15 * 24 * 60 * 60 * 1000 },
];

const formatCacheLabel = (value) => {
  const match = CACHE_OPTIONS.find((opt) => opt.value === value);
  if (match) return match.label;
  if (value === 0) return "No Cache";
  const hours = value / (1000 * 60 * 60);
  if (hours < 24) return `${hours} Hours`;
  const days = hours / 24;
  return `${days} Days`;
};

const SettingsScreen = () => {
  const { toggleDarkMode, darkmode, toggleDarkSwitch, darkSwitch } =
    useContext(ThemeContext);
  const [contributions, setContributions] = useState([]);

  const [devMenu, setDevMenu] = useState(false);
  const [showEnvModal, setShowEnvModal] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState("prod");
  const [thresholds, setThresholds] = useState(DEFAULT_DATA_THRESHOLDS);
  const [selectedScreenForThreshold, setSelectedScreenForThreshold] = useState(null);

  const [apiEditMenu, setApiEditMenu] = useState(false);
  const [currentApiUrl, setCurrentApiUrl] = useState(API_URL);
  const [inputApiUrl, setInputApiUrl] = useState(API_URL);
  const [showApiModal, setShowApiModal] = useState(false);

  const fetchData = async () => {
    try {
      const dynamicUrls = getDynamicDataUrls();
      const settingsUrl = dynamicUrls?.SETTINGS_SCREEN || dynamicUrls?.SETTINGS || DATA_URLS.SETTINGS_SCREEN;
      const fetchedData = await dataHelper(
        CACHED_DATA_KEYS.SETTINGS_SCREEN,
        settingsUrl,
        SCREEN_NAMES.SETTINGS_SCREEN
      );
      if (fetchedData) {
        setContributions(
          Array.isArray(fetchedData?.contributions)
            ? fetchedData.contributions
            : []
        );
      }

      const devValue = getItem(CACHED_DATA_KEYS.DEVMENU) || "0";
      setDevMenu(devValue === "1");

      const env = getItem(CACHED_DATA_KEYS.ENV) || "prod";
      setSelectedEnv(env);

      const currentThresholds = getCacheThresholds();
      setThresholds(currentThresholds);

      const apiMenuValue = getItem(CACHED_DATA_KEYS.API_URL_EDIT_MENU) || "0";
      setApiEditMenu(apiMenuValue === "1");

      const storedApi = getApiUrl();
      setCurrentApiUrl(storedApi);
      setInputApiUrl(storedApi);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.jayanth.shotram";

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

  const clearLastFetchCache = (force = false, shouldRestart = true) => {
    try {
      const keysToPreserve = new Set([
        CACHED_DATA_KEYS.DEVMENU,
        CACHED_DATA_KEYS.ENV,
        CACHED_DATA_KEYS.CACHE_THRESHOLDS,
        CACHED_DATA_KEYS.API_URL,
        CACHED_DATA_KEYS.API_URL_EDIT_MENU,
        CACHED_DATA_KEYS.DATA_URLS,
        "@darkmode",
        "@darkmodetoggle",
        "@fontSize",
      ]);

      if (!force) {
        keysToPreserve.add(CACHED_DATA_KEYS.SETTINGS_SCREEN);
        keysToPreserve.add(`${CACHED_DATA_KEYS.SETTINGS_SCREEN}_lastFetchTime`);
      }

      const allKeys = Object.keys(localStorage);
      const keysToRemove = allKeys.filter((key) => !keysToPreserve.has(key));
      keysToRemove.forEach((key) => localStorage.removeItem(key));

      const message = force
        ? `${keysToRemove.length} entries removed`
        : `${keysToRemove.length} entries removed (Settings preserved)`;
      alert(`Cache Cleared ✅\n${message}`);

      if (shouldRestart) {
        window.location.reload();
      }
    } catch (e) {
      console.error("Cache clear failed", e);
    }
  };

  const toggleDevMenu = () => {
    let devValue = devMenu ? "0" : "1";
    if (heartTapTimeout.current) clearTimeout(heartTapTimeout.current);

    storeItem(CACHED_DATA_KEYS.DEVMENU, devValue);
    setDevMenu(devValue === "1");

    if (devValue === "0") {
      storeItem(CACHED_DATA_KEYS.ENV, "prod");
      updateApiUrl(API_URL);
      setCurrentApiUrl(API_URL);
      setInputApiUrl(API_URL);
      clearLastFetchCache(true, true);
    }
  };

  const toggleApiEditMenu = () => {
    let apiVal = apiEditMenu ? "0" : "1";
    if (flagTapTimeout.current) clearTimeout(flagTapTimeout.current);

    storeItem(CACHED_DATA_KEYS.API_URL_EDIT_MENU, apiVal);
    setApiEditMenu(apiVal === "1");

    if (apiVal === "0") {
      updateApiUrl(API_URL);
      setCurrentApiUrl(API_URL);
      setInputApiUrl(API_URL);
      clearLastFetchCache(true, true);
    }
  };

  const switchEnv = (env) => {
    if (env === selectedEnv) return;
    storeItem(CACHED_DATA_KEYS.ENV, env);
    setSelectedEnv(env);
    clearLastFetchCache(true, true);
  };

  const updateThresholdValue = (screenType, newValue) => {
    const updated = { ...thresholds, [screenType]: newValue };
    setThresholds(updated);
    saveCacheThresholds(updated);
    alert("Cache timing updated ✅");
  };

  const handleSaveApiUrl = () => {
    if (!inputApiUrl || !inputApiUrl.trim()) {
      alert("Please enter a valid API URL");
      return;
    }
    setShowApiModal(false);
    updateApiUrl(inputApiUrl);
    setCurrentApiUrl(inputApiUrl);
    clearLastFetchCache(true, true);
  };

  const handleResetApiUrl = () => {
    setShowApiModal(false);
    setInputApiUrl(API_URL);
    setCurrentApiUrl(API_URL);
    updateApiUrl(API_URL);
    clearLastFetchCache(true, true);
  };

  const heartTapCount = useRef(0);
  const heartTapTimeout = useRef(null);

  const flagTapCount = useRef(0);
  const flagTapTimeout = useRef(null);

  const onHeartClick = () => {
    heartTapCount.current += 1;
    if (heartTapTimeout.current) clearTimeout(heartTapTimeout.current);

    heartTapTimeout.current = setTimeout(() => {
      heartTapCount.current = 0;
    }, 2000);

    if (heartTapCount.current === 5) {
      heartTapCount.current = 0;
      toggleDevMenu();
    }
  };

  const onFlagClick = () => {
    flagTapCount.current += 1;
    if (flagTapTimeout.current) clearTimeout(flagTapTimeout.current);

    flagTapTimeout.current = setTimeout(() => {
      flagTapCount.current = 0;
    }, 2000);

    if (flagTapCount.current === 5) {
      flagTapCount.current = 0;
      toggleApiEditMenu();
    }
  };

  const getEnvIcon = (env) => {
    if (env === "dev") return <MdBuild size={22} />;
    if (env === "stage") return <MdScience size={22} />;
    return <MdRocketLaunch size={22} />;
  };

  return (
    <>
      <AppBar showBack title="Settings" rightIcons={[]} />
      <div className="app-content" style={{ paddingBottom: 60 }}>
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

        {!devMenu && (
          <>
            <ListHeader title="Contributions" />
            {contributions.map(({ name, role }, index) => (
              <IconList
                key={`${name}-${index}`}
                leftIcon={<MdPeopleOutline size={22} />}
                title={name}
                subtitle={role}
              />
            ))}
          </>
        )}

        {devMenu && (
          <>
            <ListHeader title="Dev Menu" />

            <IconList
              leftIcon={<MdCode size={22} />}
              title="Dev Menu"
              subtitle="Enable or disable developer options"
              rightContent={
                <MaterialSwitch value={devMenu} onValueChange={toggleDevMenu} />
              }
            />

            {apiEditMenu && (
              <IconList
                leftIcon={<MdApi size={22} />}
                title="Edit API URL"
                subtitle={`Current: ${currentApiUrl}`}
                onPress={() => setShowApiModal(true)}
              />
            )}

            <IconList
              leftIcon={getEnvIcon(selectedEnv)}
              title="Environment"
              subtitle={`Selected environment ${selectedEnv}`}
              onPress={() => setShowEnvModal(true)}
            />

            <IconList
              leftIcon={<MdCached size={22} />}
              title="Clear Cache"
              subtitle="Clear app cache"
              onPress={() => clearLastFetchCache(false, true)}
            />

            <ListHeader title="Cache Timings" />
            <IconList
              leftIcon={<MdHome size={22} />}
              title="Home Screen Cache"
              subtitle={`Current: ${formatCacheLabel(thresholds.HOME)}`}
              onPress={() => setSelectedScreenForThreshold("HOME")}
            />
            <IconList
              leftIcon={<MdFormatListBulleted size={22} />}
              title="List Screen Cache"
              subtitle={`Current: ${formatCacheLabel(thresholds.LIST)}`}
              onPress={() => setSelectedScreenForThreshold("LIST")}
            />
            <IconList
              leftIcon={<MdMenuBook size={22} />}
              title="Reader Screen Cache"
              subtitle={`Current: ${formatCacheLabel(thresholds.READER)}`}
              onPress={() => setSelectedScreenForThreshold("READER")}
            />
            <IconList
              leftIcon={<MdSettings size={22} />}
              title="Settings Screen Cache"
              subtitle={`Current: ${formatCacheLabel(thresholds.SETTING)}`}
              onPress={() => setSelectedScreenForThreshold("SETTING")}
            />
          </>
        )}

        {/* ---------- Share ---------- */}
        <ListHeader title="Support" />

        <div className="share-card" onClick={shareApp}>
          <MdShare size={22} />
          <span>Share app with friends & family</span>
        </div>

        {/* ---------- Made with ---------- */}
        <div className="made-with">
          <span>Made with</span>
          <span
            className="heart"
            onClick={onHeartClick}
            style={{ cursor: "pointer", margin: "0 6px" }}
          >
            <MdFavorite size={20} color="var(--error, red)" />
          </span>
          <span
            onClick={onFlagClick}
            style={{ cursor: "pointer" }}
          >
            in India 🇮🇳
          </span>
        </div>
      </div>

      {/* Environment Selector Modal */}
      <BottomSheetModal
        title="Select Environment"
        visible={showEnvModal}
        closeModal={() => setShowEnvModal(false)}
      >
        {ENVS.map((item) => (
          <IconList
            key={`env-${item}`}
            leftIcon={getEnvIcon(item)}
            title={ENV_LABELS[item]}
            subtitle={
              selectedEnv === item
                ? "Currently selected"
                : `Switch to ${item} environment`
            }
            onPress={() => {
              setShowEnvModal(false);
              switchEnv(item);
            }}
            disabled={selectedEnv === item}
            rightContent={
              selectedEnv === item ? (
                <MdCheckCircle size={24} color="var(--primary)" />
              ) : null
            }
          />
        ))}
      </BottomSheetModal>

      {/* Cache Threshold Modal */}
      <BottomSheetModal
        title={`Select Cache Duration for ${selectedScreenForThreshold || ""}`}
        visible={!!selectedScreenForThreshold}
        closeModal={() => setSelectedScreenForThreshold(null)}
      >
        {CACHE_OPTIONS.map((opt) => {
          const isSelected =
            selectedScreenForThreshold &&
            thresholds[selectedScreenForThreshold] === opt.value;
          return (
            <IconList
              key={`cache-opt-${opt.value}`}
              leftIcon={<MdAccessTime size={22} />}
              title={opt.label}
              subtitle={isSelected ? "Currently active" : "Tap to apply"}
              disabled={isSelected}
              onPress={() => {
                const screenKey = selectedScreenForThreshold;
                setSelectedScreenForThreshold(null);
                updateThresholdValue(screenKey, opt.value);
              }}
              rightContent={
                isSelected ? (
                  <MdCheckCircle size={24} color="var(--primary)" />
                ) : null
              }
            />
          );
        })}
      </BottomSheetModal>

      {/* Edit API URL Modal */}
      <BottomSheetModal
        title="Edit Base API URL"
        visible={showApiModal}
        closeModal={() => setShowApiModal(false)}
      >
        <div style={{ padding: "12px 4px" }}>
          <input
            type="text"
            style={{
              width: "100%",
              boxSizing: "border-box",
              backgroundColor: "var(--surface-variant)",
              color: "var(--on-surface)",
              borderRadius: "12px",
              padding: "12px 14px",
              fontSize: "15px",
              border: "1px solid var(--outline)",
              marginBottom: "16px",
            }}
            value={inputApiUrl}
            onChange={(e) => setInputApiUrl(e.target.value)}
            placeholder="https://your-api-endpoint.dev/api"
            autoCapitalize="none"
            autoCorrect="off"
          />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={handleResetApiUrl}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                backgroundColor: "var(--surface-variant)",
                border: "none",
                color: "var(--error, red)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reset Default
            </button>
            <button
              onClick={handleSaveApiUrl}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                backgroundColor: "var(--primary)",
                border: "none",
                color: "var(--on-primary, #ffffff)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Save & Restart
            </button>
          </div>
        </div>
      </BottomSheetModal>
    </>
  );
};

export default SettingsScreen;
