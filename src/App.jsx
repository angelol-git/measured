import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/header/Header";
import Home from "./pages/Home";
import Items from "./pages/Items";
import Add from "./pages/Add";
import "./App.css";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [titleError, setTittleError] = useState(false);
  const [items, setItems] = useState({});
  // const [items, setItems] = useState(() => {
  //   const savedItems = localStorage.getItem("items");
  //   return savedItems ? JSON.parse(savedItems) : {};
  // });

  function handleAdd(newItem) {
    setItems((prevItems) => {
      return { ...prevItems, [newItem.title.toUpperCase()]: newItem };
    });
  }

  function handleDelete(title) {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      delete updatedItems[title];
      return updatedItems;
    });
  }

  function handleActive(title, category, newItem = false) {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };

      if (updatedItems[title] && newItem === false) {
        updatedItems[title].active = !updatedItems[title].active;
      }

      Object.entries(updatedItems).forEach(([key, value]) => {
        if (key !== title && value.category === category) {
          updatedItems[key].active = false;
        }
      });

      return updatedItems;
    });
  }

  function handleUpdate(updatedItem, prevTitle) {
    const updatedTitle = updatedItem.title.toUpperCase();

    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      if (prevTitle === updatedTitle.toUpperCase()) {
        // Replace the value for the existing key
        updatedItems[prevTitle] = updatedItem;
      } else {
        updatedItems[updatedTitle] = updatedItems[prevTitle];
        delete updatedItems[prevTitle];
        updatedItems[updatedTitle] = updatedItem;
      }
      return updatedItems;
    });
  }

  function handleTitle(title, prevTitle = "") {
    if (title === prevTitle) {
      setTittleError(false);
      return;
    }
    if (items[title.toUpperCase()]) {
      setTittleError(true);
      return;
    }

    setTittleError(false);
  }

  useEffect(() => {
    chrome.storage.local.get("items", (result) => {
      const savedItems = result.items;
      setItems(savedItems || {});
    });
  }, []);

  useEffect(() => {
    //localStorage.setItem("items", JSON.stringify(items));
    chrome.storage.local.set({ items }, () => {});
  }, [items]);

  useEffect(() => {
    if (isInitialLoad) {
      navigate("/");
      setIsInitialLoad(false);
    }
  }, [navigate, isInitialLoad]);

  const handleFunctions = {
    handleActive: handleActive,
    handleUpdate: handleUpdate,
    handleDelete: handleDelete,
    handleTitle: handleTitle,
    titleError: titleError,
  };
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
              <Items itemData={items} handleFunctions={handleFunctions} />
            }
          />
          <Route
            path="/add"
            element={
              <Add
                handleActive={handleActive}
                handleAddItem={handleAdd}
                handleTitle={handleTitle}
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
