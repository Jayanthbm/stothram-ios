export const SCREEN_NAMES = {
  HOME_SCREEN: "HOME",
  LIST_SCREEN: "LIST",
  READER_SCREEN: "READER",
  SETTINGS_SCREEN: "SETTING",
  HOME: "HOME",
  LIST: "LIST",
  READER: "READER",
  SETTINGS: "SETTING",
};

export const API_URL = "https://stothram-api.jayanthbharadwajm.workers.dev/api";

export const DATA_URLS = {
  HOME_SCREEN: `${API_URL}/home-screen-data`,
  SETTINGS_SCREEN: `${API_URL}/setting-screen-data`,
  HOME: `${API_URL}/home-screen-data`,
  SETTINGS: `${API_URL}/setting-screen-data`,
};

export const CACHED_DATA_KEYS = {
  HOME_SCREEN: "CACHED_HOME_SCREEN",
  SETTINGS_SCREEN: "CACHED_SETTINGS_SCREEN",
  HOME: "CACHED_HOME_SCREEN",
  SETTINGS: "CACHED_SETTINGS_SCREEN",
  UPI_ID: "CACHED_UPI_ID",
  UPI_DATA: "CACHED_UPI_DATA",
  MONEY_POPUP: "CACHED_MONEY_POPUP",
  ENV: "ENV",
  DEVMENU: "DEV_MENU",
  CACHE_THRESHOLDS: "CACHE_THRESHOLDS",
  API_URL: "API_URL",
  API_URL_EDIT_MENU: "API_URL_EDIT_MENU",
  DATA_URLS: "DATA_URLS",
  MEANING_LANGUAGE: "MEANING_LANGUAGE",
};

const BASE_IMAGE_URL = "https://jayanthbm.github.io/stothram-data/images";

export const UPI_LOGO = `${BASE_IMAGE_URL}/upi.webp`;
