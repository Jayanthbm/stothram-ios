import React, { useContext, useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import {
  FiChevronLeft,
  FiGrid,
  FiList,
  FiMoon,
  FiSettings,
  FiSun,
} from "react-icons/fi";
import {
  CACHED_DATA_KEYS,
  GPAY_LOGO,
  PAYTM_LOGO,
  PHONEPE_LOGO,
  UPI_LOGO,
} from "../constants.jsx";
import { ThemeContext } from "../context/themeContext.jsx";
import { getItem, getJSON, getOSInfo, isInternetConnected } from "../utils/dataUtils.jsx";

const AppHeader = ({ title, backAction, settingsAction, toggleView }) => {
  const { darkmode, viewType, toggleViewType, darkSwitch, toggleDarkMode } =
    useContext(ThemeContext);
  const [showDailog, setShowDialog] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [upidata, setUpiData] = useState(null);
  useEffect(() => {
    async function init() {
      setUpiId(getItem(CACHED_DATA_KEYS.UPI_ID));
      setUpiData(getJSON(CACHED_DATA_KEYS.UPI_DATA));
    }
    init();
  }, []);

  const handleShowDialog = () => {
    const os = getOSInfo();
    if(os === "iOS" || os === "Android") {
      if (!isInternetConnected()) {
        alert("Please connect to the internet");
        return;
      }
      if (upiId === "") {
        alert("Coming soon!");
        return;
      }
      setShowDialog(true);
    } else {
      alert("Not supported on " + os);
      return;
    }

  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };


  const Modal = ({upiId, upidata}) => {
    const [amount, setAmount] = useState(1);
    const [money, setMoney] = useState(1);

    //generate 10 letter transaction id include letter and numbers
    function genearteTransactionId() {
      var text = "";
      var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
    }

    const openPaymentApp = async (payApp, amnt) => {
      if (isNaN(amnt)) {
        alert("Please enter valid amount");
        return;
      }
      if (amnt < 1) {
        alert("Please enter amount greater than 0");
        return;
      }
      let url = "";
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

      url =
        url +
        `pay?pa=${upiId}&pn=${upidata?.payee_name}&tn=${
          upidata?.transaction_note
        }&am=${amnt}&cu=INR&mc=0000&tr=${genearteTransactionId()}`;

      handleCloseDialog();
      setAmount(1);
      setMoney(1);
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
          <div className="amounts-container">
            <div className="amount" key={"amount"}>
              {upidata?.upi_amounts?.map((amnt) => {
                return (
                  <>
                    <input
                      type="radio"
                      name="money"
                      value={amnt}
                      id={amnt}
                      key={amnt}
                      checked={amnt.toString() === amount.toString()}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setMoney(e.target.value);
                      }}
                    />
                    <label htmlFor={amnt} key={`label-${amnt}`}>
                      ₹{amnt}
                    </label>
                  </>
                );
              })}
              <input
                type="radio"
                name="money"
                value={"custom"}
                id={"custom"}
                key={"custom"}
                checked={amount === "custom"}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setMoney(null);
                }}
              />
              <label htmlFor={"custom"}>Custom ₹</label>
            </div>
          </div>
          {amount === "custom" && (
            <div className="money-input-container">
              <input
                type="text"
                placeholder="Enter amount"
                value={money ? money.toString() : ""}
                onChange={(e) => {
                  setMoney(e.target.value);
                }}
                className="money-input"
              />
            </div>
          )}
          <div className="settings-item-subtitle">Choose App to pay</div>
          <div className="payment-app-container">
            <img
              src={PHONEPE_LOGO}
              className="payment-img"
              onClick={() => openPaymentApp("PHONEPE", money)}
              key={"PHONEPE"}
            />
            <img
              src={GPAY_LOGO}
              className="payment-img"
              onClick={() => openPaymentApp("GPAY", money)}
              key={"GPAY"}
            />
            <img
              src={PAYTM_LOGO}
              className="payment-img"
              onClick={() => openPaymentApp("PAYTM", money)}
              key={"PAYTM"}
            />
            <img
              src={UPI_LOGO}
              className="payment-img"
              onClick={() => openPaymentApp("BHIM", money)}
              key={"BHIM"}
            />
          </div>
          <button onClick={handleCloseDialog}>Close</button>
        </div>
      </div>
    );
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
