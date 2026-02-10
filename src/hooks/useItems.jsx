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

      // When isNewItem is true, itemId is actually the full item object
      const id = isNewItem ? itemId.id : itemId;

      if (!isNewItem) {
        updatedItems[id].active = !updatedItems[id].active;
      }

      Object.entries(updatedItems).forEach(([otherId, values]) => {
        if (otherId !== id && values.category === updatedItems[id].category) {
          updatedItems[otherId].active = false;
        }
      });

      return updatedItems;
    });
  };

  return [items, setItems, addItem, deleteItem, updateItem, activeItem];
}

export default useItems;
