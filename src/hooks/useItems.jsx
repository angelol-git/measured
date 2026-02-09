/* global chrome */
import { useState, useEffect } from "react";

function useItems() {
  const [items, setItems] = useState({});

  useEffect(() => {
    chrome.storage.local.get("items", (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Failed to load items from storage: ",
          chrome.runtime.lastError,
        );
        setItems({});
        return;
      }
      const savedItems = result.items;
      setItems(savedItems || {});
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ items }, () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Storage save failed: ",
          chrome.runtime.lastError.message,
        );
      }
    });
  }, [items]);

  const addItem = (newItem) => {
    setItems((prevItems) => {
      return { ...prevItems, [newItem.id]: newItem };
    });
  };

  const deleteItem = (id) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      delete updatedItems[id];
      return updatedItems;
    });
  };

  const updateItem = (item) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      updatedItems[item.id] = item;
      return updatedItems;
    });
  };

  const activeItem = (itemId, isNewItem = false) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };

      if (!isNewItem) {
        updatedItems[itemId].active = !updatedItems[itemId].active;
      }

      Object.entries(updatedItems).forEach(([id, values]) => {
        if (
          id !== itemId &&
          values.category === updatedItems[itemId].category
        ) {
          updatedItems[id].active = false;
        }
      });

      return updatedItems;
    });
  };

  // function handleImport(importedItems) {
  //   setItems(importedItems);
  // }

  return [items, setItems, addItem, deleteItem, updateItem, activeItem];
}

export default useItems;
