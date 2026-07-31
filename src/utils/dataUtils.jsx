import { API_URL, CACHED_DATA_KEYS, DATA_URLS } from "../constants.jsx";

// Default constants for data thresholds
export const DEFAULT_DATA_THRESHOLDS = {
  HOME: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
  LIST: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
  READER: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
  SETTING: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
};

export const DATA_THRESHOLDS = { ...DEFAULT_DATA_THRESHOLDS };

/**
 * Initialize cache thresholds in localStorage if not present
 */
export const initCacheThresholds = () => {
  try {
    const existing = getJSON(CACHED_DATA_KEYS.CACHE_THRESHOLDS);
    if (!existing) {
      storeJSON(
        CACHED_DATA_KEYS.CACHE_THRESHOLDS,
        DEFAULT_DATA_THRESHOLDS
      );
    }
  } catch (error) {
    console.error("Error initializing cache thresholds:", error);
  }
};

/**
 * Get dynamic cache thresholds from localStorage
 */
export const getCacheThresholds = () => {
  try {
    const custom = getJSON(CACHED_DATA_KEYS.CACHE_THRESHOLDS);
    return { ...DEFAULT_DATA_THRESHOLDS, ...(custom || {}) };
  } catch (error) {
    console.error("Error fetching cache thresholds:", error);
    return DEFAULT_DATA_THRESHOLDS;
  }
};

/**
 * Save custom cache thresholds to localStorage
 */
export const saveCacheThresholds = (thresholds) => {
  try {
    storeJSON(CACHED_DATA_KEYS.CACHE_THRESHOLDS, thresholds);
  } catch (error) {
    console.error("Error saving cache thresholds:", error);
  }
};

/**
 * Initialize API_URL and DATA_URLS in localStorage if not present
 */
export const initApiUrlToStorage = () => {
  try {
    const existingApiUrl = getItem(CACHED_DATA_KEYS.API_URL);
    if (!existingApiUrl) {
      storeItem(CACHED_DATA_KEYS.API_URL, API_URL);
      storeJSON(CACHED_DATA_KEYS.DATA_URLS, DATA_URLS);
    }
  } catch (error) {
    console.error("Error initializing API URL:", error);
  }
};

/**
 * Get current API_URL from localStorage
 */
export const getApiUrl = () => {
  try {
    const stored = getItem(CACHED_DATA_KEYS.API_URL);
    return stored || API_URL;
  } catch (error) {
    console.error("Error getting API URL:", error);
    return API_URL;
  }
};

/**
 * Get dynamic DATA_URLS from localStorage
 */
export const getDynamicDataUrls = () => {
  try {
    const stored = getJSON(CACHED_DATA_KEYS.DATA_URLS);
    return stored || DATA_URLS;
  } catch (error) {
    console.error("Error getting dynamic DATA_URLS:", error);
    return DATA_URLS;
  }
};

/**
 * Update API_URL in localStorage and recalculate DATA_URLS
 */
export const updateApiUrl = (newApiUrl) => {
  try {
    const baseUrl = newApiUrl.trim().replace(/\/+$/, "");
    storeItem(CACHED_DATA_KEYS.API_URL, baseUrl);
    const updatedDataUrls = {
      HOME: `${baseUrl}/home-screen-data`,
      SETTINGS: `${baseUrl}/setting-screen-data`,
      HOME_SCREEN: `${baseUrl}/home-screen-data`,
      SETTINGS_SCREEN: `${baseUrl}/setting-screen-data`,
    };
    storeJSON(CACHED_DATA_KEYS.DATA_URLS, updatedDataUrls);
    return updatedDataUrls;
  } catch (error) {
    console.error("Error updating API URL:", error);
    return DATA_URLS;
  }
};

/**
 * Store a key-value pair in local storage.
 */
export const storeItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retrieve the value associated with the given key from local storage.
 */
export const getItem = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Store a key-value pair as JSON in local storage.
 */
export const storeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retrieve the JSON value associated with the given key from local storage.
 */
export const getJSON = (key) => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;
    return JSON.parse(value);
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Check if the device is connected to the internet.
 */
export const isInternetConnected = () => {
  try {
    return navigator.onLine;
  } catch (error) {
    console.error("Error checking internet connection:", error);
    return false;
  }
};

/**
 * Helper function to compare the time difference between current time and last fetch time.
 */
export const compareTimeDifference = (currentTime, lastFetchTime, threshold) => {
  const timeDifference = lastFetchTime
    ? currentTime - parseInt(lastFetchTime)
    : threshold;

  return timeDifference > threshold;
};

/**
 * Helper function to handle data fetching and caching.
 */
export const dataHelper = async (KEYNAME, URL, SCREEN_TYPE) => {
  try {
    const screenKey = (SCREEN_TYPE || "HOME").toUpperCase().replace("_SCREEN", "");
    const thresholds = getCacheThresholds();
    const threshold =
      thresholds[screenKey] ?? DEFAULT_DATA_THRESHOLDS[screenKey] ?? DEFAULT_DATA_THRESHOLDS.HOME;

    if (threshold === 0) {
      const freshData = await fetchAndStoreData(KEYNAME, URL);
      if (freshData) return freshData;
    }

    const cachedData = getJSON(KEYNAME);
    const lastFetchTime = getItem(`${KEYNAME}_lastFetchTime`);

    if (cachedData) {
      const currentTime = new Date().getTime();
      const shouldFetchFromOnline = compareTimeDifference(
        currentTime,
        lastFetchTime,
        threshold
      );
      if (!lastFetchTime || shouldFetchFromOnline) {
        fetchAndStoreData(KEYNAME, URL);
      }
      return cachedData;
    } else {
      const data = await fetchAndStoreData(KEYNAME, URL);
      return data;
    }
  } catch (error) {
    console.error(`Error fetching ${SCREEN_TYPE} data:`, error);
    return null;
  }
};

/**
 * Helper function to fetch and store data in localStorage.
 * Automatically replaces default API URL base with current custom API URL if set.
 */
export const fetchAndStoreData = async (KEYNAME, URL) => {
  try {
    const isConnected = isInternetConnected();
    const env = getItem(CACHED_DATA_KEYS.ENV) || "prod";
    const baseUrl = getApiUrl();

    let targetUrl = URL;

    if (baseUrl) {
      if (targetUrl.startsWith(API_URL)) {
        targetUrl = targetUrl.replace(API_URL, baseUrl);
      } else if (targetUrl.startsWith("https://jayanthbm.github.io/stothram-data")) {
        targetUrl = targetUrl.replace("https://jayanthbm.github.io/stothram-data", baseUrl);
      }
    }

    let newURL;
    if (targetUrl.includes("https://") || targetUrl.includes("http://")) {
      newURL = `${targetUrl}${targetUrl.includes("?") ? "&" : "?"}env=${env}`;
    } else {
      const cleanUrl = targetUrl.startsWith("/") ? targetUrl : `/${targetUrl}`;
      console.log("cleanUrl",cleanUrl)
      newURL = `${baseUrl}${cleanUrl}${cleanUrl.includes("?") ? "&" : "?"}env=${env}`;
    }

    if (isConnected) {
      if (URL.endsWith(".pdf")) {
        return fetchAndStorePDF(KEYNAME, URL);
      } else {
        const response = await fetch(newURL);
        const data = await response.json();
        storeJSON(KEYNAME, data);
        storeItem(`${KEYNAME}_lastFetchTime`, new Date().getTime().toString());
        return data;
      }
    } else {
      console.log("No internet connection. Data fetching skipped.");
      return null;
    }
  } catch (error) {
    console.error(`Error fetching data from online (${KEYNAME}):`, error);
    return null;
  }
};

/**
 * Helper function to fetch and store PDF URL in localStorage
 */
export const fetchAndStorePDF = async (KEYNAME, URL) => {
  try {
    const isConnected = isInternetConnected();

    if (isConnected) {
      storeItem(KEYNAME, URL);
      storeItem(`${KEYNAME}_lastFetchTime`, new Date().getTime().toString());
      return URL;
    } else {
      console.log("No internet connection. Data fetching skipped.");
      return null;
    }
  } catch (error) {
    console.error(`Error fetching PDF URL from online (${KEYNAME}):`, error);
    return null;
  }
};

/**
 * Prefetch data for multiple data objects asynchronously.
 */
export const preFetcher = async (dataArray, SCREEN_TYPE) => {
  try {
    if (!Array.isArray(dataArray)) return false;
    const fetchPromises = dataArray.map((dataObject) =>
      dataObject.dataUrl
        ? dataHelper(dataObject.title, dataObject.dataUrl, SCREEN_TYPE)
        : Promise.resolve(null)
    );

    await Promise.all(fetchPromises);
    return true;
  } catch (error) {
    console.error("Error in preFetcher:", error);
    return false;
  }
};

/**
 * Get OS Info
 */
export const getOSInfo = () => {
  const userAgent = navigator.userAgent;
  let os = "Unknown";

  if (/windows phone/i.test(userAgent)) {
    os = "Windows Phone";
  } else if (/android/i.test(userAgent)) {
    os = "Android";
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    os = "iOS";
  } else if (/mac os/i.test(userAgent)) {
    os = "macOS";
  } else if (/windows/i.test(userAgent)) {
    os = "Windows";
  } else if (/linux/i.test(userAgent)) {
    os = "Linux";
  }

  return os;
};
