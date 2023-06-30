import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import itemData from "./assets/items.json";
import Header from "./components/Header";
import Home from "./pages/Home";
import Items from "./pages/Items";
import Add from "./pages/Add";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      navigate("/");
      setIsInitialLoad(false);
    }
  }, [navigate, isInitialLoad]);

  return (
    <div className="app">
      <Header />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Home itemData={itemData} />} />
          <Route path="/items" element={<Items itemData={itemData} />} />
          <Route path="/add" element={<Add itemData={itemData} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
