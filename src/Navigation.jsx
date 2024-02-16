import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ListScreen from "./screens/ListScreen";
import NotSupported from "./screens/NotSupoorted";
import ReaderScreen from "./screens/ReaderScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { getOSInfo } from "./utils/dataUtils.jsx";

const Navigation = () => {
  const navigate = useNavigate();
  const [promptShown, setPromptShown] = useState(true);
  useEffect(() => {
    const os = getOSInfo();
    if (os === "iOS" || os === "macOS" || os === "Windows") {
      navigate("/");
    } else {
      navigate("/invalid",{ state: { os } });
    }
  }, []);

  useEffect(() => {
    if (promptShown === false && "standalone" in window.navigator && !window.navigator.standalone) {
      alert(
        "For the best experience, tap the 'Share' button and select 'Add to Home Screen.'"
      );
      localStorage.setItem("promptShown", "true");
      localStorage.setItem("lastShownTime", Date.now().toString());
      setPromptShown(true);
    }
    const storedPromptShown = localStorage.getItem("promptShown");
    const lastShownTime =
      parseInt(localStorage.getItem("lastShownTime"), 10) || 0;
    if (
      storedPromptShown === null ||
      (storedPromptShown && Date.now() - lastShownTime > 24 * 60 * 60 * 1000)
    ) {
      setPromptShown(false);
    }
  },[promptShown])

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/list" element={<ListScreen />} />
      <Route path="/reader" element={<ReaderScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/invalid" element={<NotSupported />} />
    </Routes>
  );
};

export default Navigation;
