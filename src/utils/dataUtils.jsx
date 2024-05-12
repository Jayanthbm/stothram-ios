export const DATA_THRESHOLDS = {
  HOME: 1 * 60 * 60 * 1000, // 1 hours in milliseconds
  LIST: 2 * 60 * 60 * 1000, // 3 hours in milliseconds
  READER: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
  SETTING: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
};

/**
 * Store a key-value pair in local storage.
 * @param {string} key - The key to store.
 * @param {string} value - The value to store.
 */
export const storeItem = async (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retrieve the value associated with the given key from local storage.
 * @param {string} key - The key to retrieve.
 * @returns {string|null} - The retrieved value or null on error.
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
 * @param {string} key - The key to store.
 * @param {object} value - The value to store as JSON.
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
 * @param {string} key - The key to retrieve.
 * @returns {object|null} - The retrieved JSON value or null on error.
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
 * @returns {boolean} - True if connected, false otherwise.
 */
export const isInternetConnected = () => {
  try {
    return navigator.onLine;
  } catch (error) {
    console.error("Error checking internet connection:", error);
    return false; // Handle the error appropriately based on your application's needs
  }
};

/**
 * Helper function to compare the time difference between the current time and the last fetch time.
 * @param {number} currentTime - The current time in milliseconds.
 * @param {string} lastFetchTime - The timestamp of the last fetch.
 * @param {number} threshold - The threshold for time difference in milliseconds.
 * @returns {boolean} - True if the time difference is greater than the threshold, false otherwise.
 */
export const compareTimeDifference = (
  currentTime,
  lastFetchTime,
  threshold,
) => {
  const timeDifference = lastFetchTime
    ? currentTime - parseInt(lastFetchTime)
    : threshold;

  return timeDifference > threshold;
};

/**
 * Helper function to handle data fetching and caching.
 * @param {string} KEYNAME - The key under which data is stored.
 * @param {string} URL - The URL to fetch the data from.
 * @param {string} SCREEN_TYPE - The type of the screen.
 * @returns {object|null} - The fetched data or null on error.
 */
export const dataHelper = async (KEYNAME, URL, SCREEN_TYPE) => {
  try {
    const cachedData = getJSON(KEYNAME);
    const lastFetchTime = getItem(`${KEYNAME}_lastFetchTime`);

    if (cachedData) {
      // Check if it's time to fetch from online
      const currentTime = new Date().getTime();
      const shouldFetchFromOnline = compareTimeDifference(
        currentTime,
        lastFetchTime,
        DATA_THRESHOLDS[SCREEN_TYPE],
      );
      if (!lastFetchTime || shouldFetchFromOnline) {
        fetchAndStoreData(KEYNAME, URL);
      }

      return cachedData;
    } else {
      // If no cached version, fetch from online
      console.log(`Fetching ${SCREEN_TYPE} data from online`);
      const data = await fetchAndStoreData(KEYNAME, URL);
      return data;
    }
  } catch (error) {
    console.error(`Error fetching ${SCREEN_TYPE} data:`, error);
    return null;
  }
};

/**
 * Helper function to fetch and store data in AsyncStorage
 * @param {string} KEYNAME - The key under which data is stored.
 * @param {string} URL - The URL to fetch the data from.
 * @returns {object|null} - The fetched data or null on error.
 */
export const fetchAndStoreData = async (KEYNAME, URL) => {
  try {
    // Check if the device is connected to the internet
    const isConnected = isInternetConnected();

    if (isConnected) {
      const response = await fetch(URL);
      const data = await response.json();

      // Update local storage with the new data and timestamp
      storeJSON(KEYNAME, data);
      storeItem(`${KEYNAME}_lastFetchTime`, new Date().getTime().toString());
      return data;
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
 * Prefetch data for multiple data objects asynchronously.
 * @param {Array} dataArray - Array of data objects.
 * @param {string} SCREEN_TYPE - The type of the screen.
 * @returns {boolean} - True if prefetching is successful, false otherwise.
 */
export const preFetcher = async (dataArray, SCREEN_TYPE) => {
  try {
    const fetchPromises = dataArray.map((dataObject) =>
      dataObject.dataUrl
        ? dataHelper(dataObject.title, dataObject.dataUrl, SCREEN_TYPE)
        : Promise.resolve(null),
    );

    await Promise.all(fetchPromises);
    return true;
  } catch (error) {
    console.error("Error in preFetcher:", error);
    return false;
  }
};

/**
 * used to get device info
 * @returns {object} - device info
 */

export const getOSInfo = () => {
  const userAgent = navigator.userAgent;
  let os = "Unknown";

  // Detect OS
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
