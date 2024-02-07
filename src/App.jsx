import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Navigation from "./Navigation.jsx";
import { ThemeContext } from "./context/themeContext.jsx";
function App() {
  const { darkmode } = useContext(ThemeContext);
  return (
    <div className={darkmode ? "app dark" : "app light"}>
      <Navigation />
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        theme={darkmode ? "dark" : "light"}
      />
    </div>
  );
}

export default App;
