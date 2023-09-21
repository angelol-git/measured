import { Routes, Route, useNavigate } from "react-router-dom";
import useItems from "./hooks/useItems";
import useSettings from "./hooks/useSettings";
import Header from "./components/header/Header";
import Home from "./pages/Home";
import Items from "./pages/items/Items";
import ItemDetail from "./pages/items/ItemDetail";
import Add from "./pages/items/Add";
import Account from "./pages/account/Account";
import Data from "./pages/account/Data";
import FilterSizes from "./pages/account/filterSizes/FilterSizes";

import "./App.css";

function App() {
  const navigate = useNavigate();
  const [
    items,
    titleError,
    addItem,
    deleteItem,
    updateItem,
    activeItem,
    handleImport,
    handleTitleError,
  ] = useItems({});
  const [settings, handleSizeUpdate] = useSettings({});
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/">
          <Route
            index
            element={<Home items={items} activeItem={activeItem} />}
          />
          <Route path="items">
            <Route
              index
              element={
                <Items
                  items={items}
                  deleteItem={deleteItem}
                  activeItem={activeItem}
                  navigate={navigate}
                />
              }
            />
            <Route
              path="add"
              element={
                <Add
                  activeItem={activeItem}
                  addItem={addItem}
                  handleTitleError={handleTitleError}
                  titleError={titleError}
                  settings={settings}
                  navigate={navigate}
                />
              }
            />
            <Route
              path="detail/:title"
              element={
                <ItemDetail
                  items={items}
                  activeItem={activeItem}
                  deleteItem={deleteItem}
                  navigate={navigate}
                />
              }
            />
          </Route>
          <Route path="/account">
            <Route index element={<Account navigate={navigate} />} />
            <Route
              path="data"
              element={
                <Data
                  items={items}
                  handleImport={handleImport}
                  navigate={navigate}
                />
              }
            />
            <Route
              path="filterSizes"
              element={
                <FilterSizes
                  settings={settings}
                  handleSizeUpdate={handleSizeUpdate}
                  navigate={navigate}
                />
              }
            />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
