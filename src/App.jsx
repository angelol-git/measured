import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import data from "./assets/data.json";
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
      <div className="container">
        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/items" element={<Items data={data} />} />
          <Route path="/add" element={<Add data={data} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
