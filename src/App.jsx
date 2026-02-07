import { Routes, Route } from "react-router-dom";
import { ItemsProvider } from "./context/ItemsContext";
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
  const [settings, handleSizeUpdate] = useSettings({});

  return (
    <ItemsProvider>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="items" element={<Items />} />
          <Route path="items/add" element={<ItemAdd settings={settings} />} />
          <Route path="items/:id" element={<ItemDetail />} />
          <Route
            path="items/:id/edit"
            element={<ItemEdit settings={settings} />}
          />
          <Route path="account" element={<Account />} />
          <Route path="account/data" element={<Data />} />
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
    </ItemsProvider>
  );
}

export default App;
