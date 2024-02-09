import { useContext, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Navigation from "./Navigation.jsx";
import { ThemeContext } from "./context/themeContext.jsx";
function App() {
  const { darkmode } = useContext(ThemeContext);

  useEffect(() => {
    if (darkmode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkmode]);

  return (
    <div className={"app"}>
      <Navigation />
      <ToastContainer
        position="bottom-center"
        autoClose={1000}
        theme={darkmode ? "light" : "dark"}
      />
    </div>
  );
}

export default App;
