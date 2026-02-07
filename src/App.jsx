import { Routes, Route } from "react-router-dom";
import useItems from "./hooks/useItems";
import useSettings from "./hooks/useSettings";
import Header from "./components/header/Header";
import Home from "./pages/Home";
import Items from "./pages/items/Items";
import ItemDetail from "./pages/items/item/itemDetail/ItemDetail";
import ItemEdit from "./pages/items/item/itemEdit/ItemEdit";
import ItemAdd from "./pages/items/item/itemAdd/ItemAdd";
import Account from "./pages/account/Account";
import Data from "./pages/account/data/Data";
import FilterSizes from "./pages/account/filter/FilterSizes";

import "./App.css";

function App() {
  const [items, setItems, addItem, deleteItem, updateItem, activeItem] =
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
            <ItemAdd
              activeItem={activeItem}
              addItem={addItem}
              settings={settings}
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
            />
          }
        />
        <Route
          path="items/:id/edit"
          element={
            <ItemEdit
              items={items}
              settings={settings}
              updateItem={updateItem}
            />
          }
        />
        <Route path="account" element={<Account />} />
        <Route
          path="account/data"
          element={<Data items={items} setItems={setItems} />}
        />
        <Route
          path="account/filterSizes"
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
