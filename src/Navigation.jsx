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
  useEffect(() => {
    const os = getOSInfo();
    if (os === "iOS") {
      navigate("/home");
    } else {
      navigate("/invalid",{ state: { os } });
    }
  }, []);


  return (
    <Routes>
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/list" element={<ListScreen />} />
      <Route path="/reader" element={<ReaderScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="/invalid" element={<NotSupported />} />
    </Routes>
  );
};

export default Navigation;
