import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useItems from "./hooks/useItems";
import Header from "./components/header/Header";
import Home from "./pages/Home";

import Items from "./pages/Items";
import Add from "./pages/Add";
import "./App.css";

function App() {
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [titleError, setTittleError] = useState(false);
  const [items, addItem, deleteItem, updateItem, activeItem] = useItems({});
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

  function handleImport(importedItems) {
    setItems(importedItems);
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

  function handleSizeUpdate(newSizes) {
    setSettings((prevSettings) => {
      return { ...prevSettings, sizes: newSizes };
    });
  }

  useEffect(() => {
    chrome.storage.local.get("settings", (result) => {
      if (result.settings) {
        setSettings(result.settings);
      } else {
        chrome.storage.local.set({ settings });
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ settings }, () => {});
  }, [settings]);
  return (
    <div className="app">
      {location.pathname !== "/add" ? (
        <Header
          itemData={items}
          settingsData={settings}
          handleImport={handleImport}
        />
      ) : null}

      <Routes>
        <Route path="/" element={<Home itemData={items} />} />
        <Route
          path="/items"
          element={<Items items={items} settingsData={settings} />}
        />

        <Route
          path="/add"
          element={
            <Add
              activeItem={activeItem}
              addItem={addItem}
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
