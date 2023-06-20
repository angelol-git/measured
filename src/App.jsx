import { Route, Routes } from "react-router-dom";
import data from "./assets/data.json";
import Header from "./components/Header";
import Home from "./pages/Home";
import Items from "./pages/Items";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/items" element={<Items />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
