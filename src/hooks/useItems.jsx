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

  const activeItem = (item, isNewItem = false) => {
    console.log("Item: ", item);
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      console.log(updatedItems);
      if (!isNewItem) {
        updatedItems[item.id].active = !updatedItems[item.id].active;
      }

      Object.entries(updatedItems).forEach(([id, values]) => {
        if (
          id !== item.id &&
          values.category === updatedItems[item.id].category
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
