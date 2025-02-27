import { Routes, Route, useNavigate } from "react-router-dom";
import useItems from "./hooks/useItems";
import useSettings from "./hooks/useSettings";
import Header from "./components/header/Header";
import Home from "./pages/Home";
import Items from "./pages/items/Items";
import ItemDetail from "./pages/items/item/ItemDetail";
import EditDetail from "./pages/items/item/ItemEdit";
import Add from "./pages/items/Add";
import Account from "./pages/account/Account";
import Data from "./pages/account/Data";
import FilterSizes from "./pages/account/filterSizes/FilterSizes";

import "./App.css";

function App() {
  const navigate = useNavigate();
  const [items, addItem, deleteItem, updateItem, activeItem, handleImport] =
    useItems({});
  const [settings, handleSizeUpdate] = useSettings({});

  return (
    <div className="app">
      <Header />
      <Routes>
        <Route
          path="/"
          element={<Home items={items} activeItem={activeItem} />}
        />
        <Route
          path="items"
          element={
            <Items
              items={items}
              deleteItem={deleteItem}
              activeItem={activeItem}
            />
          }
        />
        <Route
          path="items/add"
          element={
            <Add
              activeItem={activeItem}
              addItem={addItem}
              settings={settings}
              navigate={navigate}
            />
          }
        />
        <Route
          path="items/:id"
          element={
            <ItemDetail
              items={items}
              activeItem={activeItem}
              deleteItem={deleteItem}
              navigate={navigate}
            />
          }
        />
        <Route
          path="items:id/edit"
          element={
            <EditDetail
              items={items}
              settings={settings}
              updateItem={updateItem}
              navigate={navigate}
            />
          }
        />
        <Route path="account" element={<Account navigate={navigate} />} />
        <Route
          path="account/data"
          element={
            <Data
              items={items}
              handleImport={handleImport}
              navigate={navigate}
            />
          }
        />
        <Route
          path="account/filterSizes"
          element={
            <FilterSizes
              settings={settings}
              handleSizeUpdate={handleSizeUpdate}
              navigate={navigate}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
