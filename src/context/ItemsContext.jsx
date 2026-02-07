import { createContext, useContext } from "react";
import useItems from "../hooks/useItems";

const ItemsContext = createContext(null);

export function ItemsProvider({ children }) {
  const [items, setItems, addItem, deleteItem, updateItem, activeItem] =
    useItems();

  const value = {
    items,
    setItems,
    addItem,
    deleteItem,
    updateItem,
    activeItem,
  };

  return (
    <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>
  );
}

export function useItemsContext() {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error("useItemsContext must be used within an ItemsProvider");
  }
  return context;
}

export default ItemsContext;
