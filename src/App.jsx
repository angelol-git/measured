import { Routes, Route } from "react-router-dom";
import { ItemsProvider } from "./context/ItemsContext";
import { SettingsProvider } from "./context/SettingsContext";
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
  return (
    <ItemsProvider>
      <SettingsProvider>
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="items" element={<Items />} />
            <Route path="items/add" element={<ItemAdd />} />
            <Route path="items/:id" element={<ItemDetail />} />
            <Route path="items/:id/edit" element={<ItemEdit />} />
            <Route path="account" element={<Account />} />
            <Route path="account/data" element={<Data />} />
            <Route path="account/filterSizes" element={<FilterSizes />} />
          </Routes>
        </div>
      </SettingsProvider>
    </ItemsProvider>
  );
}

export default App;
