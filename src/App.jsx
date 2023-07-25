import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
  const [items, setItems] = useState({});
  // const [items, setItems] = useState(() => {
  //   const savedItems = localStorage.getItem("items");
  //   return savedItems ? JSON.parse(savedItems) : {};
  // });

  function handleAddItem(newItem) {
    const checkedItem = checkEmptyImage(newItem);
    setItems((prevItems) => {
      return { ...prevItems, [checkedItem.title.toUpperCase()]: checkedItem };
    });
  }

  function handleDeleteItem(title) {
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
    const checkedItem = checkEmptyImage(updatedItem);
    const updatedTitle = checkedItem.title.toUpperCase();

    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      if (prevTitle === checkedItem.title.toUpperCase()) {
        // Replace the value for the existing key
        updatedItems[prevTitle] = checkedItem;
      } else {
        updatedItems[updatedTitle] = updatedItems[prevTitle];
        delete updatedItems[prevTitle];
        updatedItems[updatedTitle] = checkedItem;
      }
      return updatedItems;
    });
  }

  function verifyTitle(title, prevTitle = "") {
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

  function checkEmptyImage(newItem) {
    if (newItem.imageSrc === "") {
      if (newItem.category === "Tops") {
        newItem.imageSrc =
          "https://timvandevall.com/wp-content/uploads/2014/06/blank-tshirt-template.jpg";
      }
    }
    return newItem;
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
                handleUpdate={handleUpdate}
                handleDeleteItem={handleDeleteItem}
                verifyTitle={verifyTitle}
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
                handleActive={handleActive}
              />
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
