// NotSupported.jsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppHeader from "../components/appHeader";


const NotSupported = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { os } = state;
  const androidAppLink =
    "https://play.google.com/store/apps/details?id=com.jayanth.shotram";

  const [redirectTimer, setRedirectTimer] = useState(5);

  useEffect(() => {
    if (os === "Android") {
      const timerId = setInterval(() => {
        setRedirectTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      // Redirect after 5 seconds
      setTimeout(() => {
        window.location.href = androidAppLink;
        clearInterval(timerId);
      }, 5000);

      return () => clearInterval(timerId);
    }
  }, [navigate, os]);

  return (
    <div className={"notSupported"}>
      <AppHeader title={"Stothram"} />
      {os === "Android" ? (
        <div className={"message"}>
          <p>
            Please download the Stothram app from the Play Store. Redirecting in{" "}
            {redirectTimer} seconds...
          </p>
          <a href={androidAppLink} rel="noopener noreferrer">
            Download from Play Store
          </a>
        </div>
      ) : (
        <div>
          <p>
            Stothram is not supported on {os}. For Android, download the app{" "}
            <a href={androidAppLink} target="_blank" rel="noopener noreferrer">
              Stothram
            </a>{" "}
            from the Play Store. Alternatively, visit this page from an iOS or
            iPad device.
          </p>
        </div>
      )}
    </div>
  );
};

export default NotSupported;
