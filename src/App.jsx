import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/header/Header";
import Home from "./pages/Home";
import Items from "./pages/Items";
import Add from "./pages/Add";
import "./App.css";

//To do
//- change name to measured ?
//- sort sizes
//- add support to ssense
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [titleError, setTittleError] = useState(false);
  const [items, setItems] = useState({});
  const [settings, setSettings] = useState({
    sizes: {
      Tops: ["S/44-46", "M/48-50", "L/52-54"],
      Bottoms: ["30", "32", "34"],
      Outerwear: ["S/44-46", "M/48-50", "L/52-54"],
    },
  });

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

  function handleImport(importedItems) {
    setItems(importedItems);
  }

  useEffect(() => {
    chrome.storage.local.get("items", (result) => {
      const savedItems = result.items;
      setItems(savedItems || {});
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ items }, () => {});
  }, [items]);

  useEffect(() => {
    chrome.storage.local.get("settings", (result) => {
      if (result.settings) {
        setSettings(result.settings);
      } else {
        chrome.storage.local.set({ settings });
      }
    });
  }, []);

  function handleSizeUpdate(newSizes) {
    setSettings((prevSettings) => {
      return { ...prevSettings, sizes: newSizes };
    });
  }
  useEffect(() => {
    chrome.storage.local.set({ settings }, () => {});
  }, [settings]);

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
      {location.pathname !== "/add" ? (
        <Header
          itemData={items}
          settingsData={settings}
          handleImport={handleImport}
          handleSizeUpdate={handleSizeUpdate}
        />
      ) : null}

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
              settingsData={settings}
              handleFunctions={handleFunctions}
            />
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
              settingsData={settings}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
