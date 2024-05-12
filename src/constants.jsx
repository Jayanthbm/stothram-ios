export const SCREEN_NAMES = {
  HOME_SCREEN: "HOME",
  LIST_SCREEN: "LIST",
  READER_SCREEN: "READER",
  SETTINGS_SCREEN: "SETTING",
};

export const DATA_URLS = {
  HOME_SCREEN:
    "https://jayanthbm.github.io/stothram-data/home-screen-data.json",
  SETTINGS_SCREEN:
    "https://jayanthbm.github.io/stothram-data/setting-screen-data.json",
};

export const CACHED_DATA_KEYS = {
  HOME_SCREEN: "CACHED_HOME_SCREEN",
  SETTINGS_SCREEN: "CACHED_SETTINGS_SCREEN",
  UPI_ID: "CACHED_UPI_ID",
  UPI_DATA: "CACHED_UPI_DATA",
  MONEY_POPUP: "CACHED_MONEY_POPUP",
};

const BASE_IMAGE_URL = "https://jayanthbm.github.io/stothram-data/images";

export const PAYTM_LOGO = `${BASE_IMAGE_URL}/paytm.png`;

export const GPAY_LOGO = `${BASE_IMAGE_URL}/gpay.webp`;

export const PHONEPE_LOGO = `${BASE_IMAGE_URL}/phonepe.webp`;

export const UPI_LOGO = `${BASE_IMAGE_URL}/upi.webp`;

export const PUB_ID = "ca-pub-0714649342045057";
export const AD_UNITS = [
  "6674078733",
  "9554574702",
  "2324356915",
  "8241493031",
];

export function AD_ID() {
  try {
    let rN = Math.floor(Math.random() * AD_UNITS.length);
    return AD_UNITS[rN];
  } catch (error) {
    return AD_UNITS[0];
  }
}
