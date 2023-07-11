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
  const [titleError, setTittleError] = useState("");
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("items");
    return savedItems ? JSON.parse(savedItems) : {};
  });

  function handleAddItem(newItem) {
    setItems((prevItems) => {
      return { ...prevItems, [newItem.title.toUpperCase()]: newItem };
    });
  }

  function handleDeleteItem(title) {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      delete updatedItems[title];
      return updatedItems;
    });
  }

  function handleActive(title) {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      if (updatedItems[title]) {
        if (updatedItems[title].active === true) {
          updatedItems[title] = {
            ...updatedItems[title],
            active: false,
          };
        } else {
          updatedItems[title] = {
            ...updatedItems[title],
            active: true,
          };
        }
      }
      return updatedItems;
    });
  }

  function updateItem(updatedItem) {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      return updatedItems;
    });
  }

  function verifyTitle(title) {
    if (items[title.toUpperCase()]) {
      setTittleError(true);
      return;
    }
    setTittleError(false);
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
          <Route
            path="/"
            element={<Home itemData={items} handleActive={handleActive} />}
          />
          <Route
            path="/items"
            element={
              <Items
                itemData={items}
                handleActive={handleActive}
                handleDeleteItem={handleDeleteItem}
                titleError={titleError}
              />
            }
          />
          <Route
            path="/add"
            element={
              <Add
                handleAddItem={handleAddItem}
                verifyTitle={verifyTitle}
                titleError={titleError}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
