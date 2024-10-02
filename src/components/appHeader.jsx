import React, { useContext, useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import {
  FiChevronLeft,
  FiGrid,
  FiList,
  FiMoon,
  FiSettings,
  FiSun,
  FiCopy,
} from "react-icons/fi";
import {
  CACHED_DATA_KEYS,
  GPAY_LOGO,
  PAYTM_LOGO,
  PHONEPE_LOGO,
  UPI_LOGO,
} from "../constants.jsx";
import { ThemeContext } from "../context/themeContext.jsx";
import {
  compareTimeDifference,
  getItem,
  getJSON,
  getOSInfo,
  storeItem,
} from "../utils/dataUtils.jsx";
import QRIMAGE from "../assets/qr.png";
const AppHeader = ({
  title,
  backAction,
  settingsAction,
  toggleView,
  selectedLanguage,
  languages,
  transalateAction,
}) => {
  const {
    darkmode,
    viewType,
    toggleViewType,
    darkSwitch,
    toggleDarkMode,
    showAlert,
  } = useContext(ThemeContext);
  const [showDailog, setShowDialog] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [upidata, setUpiData] = useState(null);
  useEffect(() => {
    async function init() {
      setUpiId(getItem(CACHED_DATA_KEYS.UPI_ID));
      setUpiData(getJSON(CACHED_DATA_KEYS.UPI_DATA));
    }
    init();
  }, [selectedLanguage]);
  const handleShowDialog = () => {
    if (upiId === "") {
      alert("Coming soon!");
      return;
    } else {
      setShowDialog(true);
      storeItem(CACHED_DATA_KEYS.MONEY_POPUP, "true");
      storeItem(
        `${CACHED_DATA_KEYS.MONEY_POPUP}_lastFetchTime`,
        new Date().getTime().toString()
      );
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  useEffect(() => {
    function init() {
      const lastFetchTime = getItem(
        `${CACHED_DATA_KEYS.MONEY_POPUP}_lastFetchTime`
      );
      if (!lastFetchTime) {
        handleShowDialog();
      }
      console.log("lastFetchTime", lastFetchTime);
      const currentTime = new Date().getTime();
      const shouldShouldPopUp = compareTimeDifference(
        currentTime,
        lastFetchTime,
        30 * 24 * 60 * 60 * 1000 // 30 days
      );
      if (shouldShouldPopUp) {
        handleShowDialog();
      }
    }
    if (upiId && upiId !== "") {
      init();
    }
  }, [upiId]);

  // Fallback function for copying text
  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Styling to make sure the textarea isn't visible or disrupts layout
    textArea.style.position = "fixed";
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = 0;
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      showAlert(successful ? "Copied to clipboard" : "Failed to copy");
    } catch (err) {
      showAlert("Failed to copy");
    }

    document.body.removeChild(textArea);
  }
  const Modal = ({ upiId, upidata }) => {
    const os = getOSInfo();

    const openPaymentApp = async (payApp, amnt) => {
      let url = "";
      try {
        // Attempt to use the clipboard API
        await navigator.clipboard.writeText(upiId);
      } catch (err) {
        fallbackCopyTextToClipboard(upiId);
      }
      switch (payApp) {
        case "PAYTM":
          url = "paytmmp://";
          break;
        case "GPAY":
          url = "tez://upi/";
          break;
        case "PHONEPE":
          url = "phonepe://";
          break;
        case "BHIM":
          url = "upi://";
      }
      handleCloseDialog();
      try {
        window.open(url);
      } catch (err) {
        console.error("ERROR : ", err);
      }
    };
    return (
      <div className="modal active">
        <div className="modal-content">
          <div className="modal-title">Contribute to Stothram</div>
          <div style={{ fontSize: "1rem", marginBottom: "1rem" }}>
            Use the below to contribute
          </div>
          {upiId && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: "1rem",
                  marginBottom: "1rem",
                  color: "green",
                }}
              >
                {upiId}
              </div>
              <div>
                <FiCopy
                  style={{ marginLeft: "1rem", cursor: "pointer" }}
                  onClick={async () => {
                    try {
                      // Attempt to use the clipboard API
                      await navigator.clipboard.writeText(upiId);
                      showAlert("Copied to clipboard");
                    } catch (err) {
                      console.log("Error:", err);
                      // Fallback for unsupported browsers or failed clipboard writes
                      fallbackCopyTextToClipboard(upiId);
                    }
                  }}
                />
              </div>
            </div>
          )}
          {os === "iOS" || os === "Android" ? (
            <>
              <div className="settings-item-subtitle">Choose App to pay</div>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "10px",
                  display: "block",
                }}
              >
                Click on the app icon to copy the UPI ID, then use it to make a
                payment.
              </span>

              <div className="payment-app-container">
                <img
                  src={PHONEPE_LOGO}
                  className="payment-img"
                  onClick={() => openPaymentApp("PHONEPE")}
                  key={"PHONEPE"}
                />
                <img
                  src={GPAY_LOGO}
                  className="payment-img"
                  onClick={() => openPaymentApp("GPAY")}
                  key={"GPAY"}
                />
                <img
                  src={PAYTM_LOGO}
                  className="payment-img"
                  onClick={() => openPaymentApp("PAYTM")}
                  key={"PAYTM"}
                />
                <img
                  src={UPI_LOGO}
                  className="payment-img"
                  onClick={() => openPaymentApp("BHIM")}
                  key={"BHIM"}
                />
              </div>
            </>
          ) : (
            <div>
              <img src={QRIMAGE} />
            </div>
          )}
          <button onClick={handleCloseDialog}>Close</button>
        </div>
      </div>
    );
  };
  const handleLanguageChange = (e) => {
    return transalateAction(e.target.value);
  };

  return (
    <div className="app-header">
      {backAction && (
        <span className="back-button" onClick={backAction}>
          <FiChevronLeft className="icon-style" />
        </span>
      )}

      <span className="app-header-title">{title}</span>
      <div className="right-content">
        {languages && languages.length > 0 && (
          <select
            onChange={handleLanguageChange}
            value={selectedLanguage}
            className="language-select"
          >
            {languages.map((language, index) => (
              <option key={index} value={language} className="language-option">
                {language}
              </option>
            ))}
          </select>
        )}
        <span onClick={handleShowDialog}>
          <FaRupeeSign className="icon-style" />
        </span>
        {toggleView && (
          <span onClick={toggleViewType}>
            {viewType === "card" ? (
              <FiList className="icon-style" />
            ) : (
              <FiGrid className="icon-style" />
            )}
          </span>
        )}
        {darkSwitch && (
          <span onClick={toggleDarkMode}>
            {darkmode ? (
              <FiSun color="#f1e408" className="icon-style" />
            ) : (
              <FiMoon className="icon-style" />
            )}
          </span>
        )}
        {settingsAction && (
          <span onClick={settingsAction}>
            <FiSettings className="icon-style" />
          </span>
        )}
      </div>

      {showDailog && (
        <Modal
          handleCloseDialog={handleCloseDialog}
          upiId={upiId}
          upidata={upidata}
        />
      )}
    </div>
  );
};

export default AppHeader;
