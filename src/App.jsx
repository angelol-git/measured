import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import useItems from "./hooks/useItems";
import useSettings from "./hooks/useSettings";
import Header from "./components/header/Header";
import Home from "./pages/Home";
import Items from "./pages/Items";
import Add from "./pages/Add";
import Account from "./pages/account/Account";
import Data from "./pages/account/Data";
import FilterSizes from "./pages/account/filterSizes/FilterSizes";

import "./App.css";

function App() {
  const [
    items,
    addItem,
    deleteItem,
    updateItem,
    activeItem,
    handleImport,
    handleTitleError,
    titleError,
  ] = useItems({});

  const [settings, handleSizeUpdate] = useSettings({});

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<Home itemData={items} />} />
        <Route
          path="/items"
          element={
            <Items
              items={items}
              deleteItem={deleteItem}
              activeItem={activeItem}
            />
          }
        />

        <Route
          path="/add"
          element={
            <Add
              activeItem={activeItem}
              addItem={addItem}
              handleTitleError={handleTitleError}
              titleError={titleError}
              settings={settings}
            />
          }
        />

        <Route path="/account" element={<Account />} />
        <Route
          path="/data"
          element={<Data items={items} handleImport={handleImport} />}
        />
        <Route
          path="/filterSizes"
          element={
            <FilterSizes
              settings={settings}
              handleSizeUpdate={handleSizeUpdate}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
