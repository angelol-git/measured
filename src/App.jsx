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
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("items");
    return savedItems ? JSON.parse(savedItems) : {};
  });

  function handleAddItem(newItem) {
    setItems((prevItems) => {
      return { ...prevItems, [newItem.title]: newItem };
    });
  }

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

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
          <Route path="/add" element={<Add handleAddItem={handleAddItem} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
