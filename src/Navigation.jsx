import { Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ListScreen from "./screens/ListScreen";
import ReaderScreen from "./screens/ReaderScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Navigation = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/list" element={<ListScreen />} />
      <Route path="/reader" element={<ReaderScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
    </Routes>
  );
};

export default Navigation;
