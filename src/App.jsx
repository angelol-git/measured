import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
//import itemData from "../public/data/items.json";
import Header from "./components/Header";
import Home from "./pages/Home";
import Items from "./pages/Items";
import Add from "./pages/Add";
import "./App.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("items")) {
      localStorage.setItem("items", JSON.stringify([]));
    } else {
      const savedItems = JSON.parse(localStorage.getItem("items"));
      setItems(savedItems);
    }
  }, []);

  useEffect(() => {
    if (isInitialLoad) {
      navigate("/");
      setIsInitialLoad(false);
    }
  }, [navigate, isInitialLoad]);

  return (
    <div className="app">
      {location.pathname !== "/add" ? <Header /> : null}
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Home itemData={items} />} />
          <Route path="/items" element={<Items itemData={items} />} />
          <Route path="/add" element={<Add itemData={items} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
