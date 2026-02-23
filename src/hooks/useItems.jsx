/* global chrome */
import { useState, useEffect } from "react";

function useItems() {
  const [items, setItems] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("items", (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Failed to load items from storage: ",
          chrome.runtime.lastError,
        );
        setItems({});
        setIsLoaded(true);
        return;
      }
      setItems(result.items || {});
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isLoaded && typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ items }, () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Storage save failed: ",
            chrome.runtime.lastError.message,
          );
        }
      });
    }
  }, [items, isLoaded]);

  const addItem = (newItem) => {
    setItems((prevItems) => {
      return { ...prevItems, [newItem.id]: newItem };
    });
  };

  const deleteItem = (id) => {
    setItems((prevItems) => {
      // eslint-disable-next-line no-unused-vars
      const { [id]: _, ...rest } = prevItems;
      return rest;
    });
  };

  const updateItem = (item) => {
    setItems((prevItems) => ({
      ...prevItems,
      [item.id]: item,
    }));
  };

  const toggleActiveItem = (id, shouldActivate) => {
    setItems((prevItems) => {
      const item = prevItems[id];
      const targetCategory = item.category;
      const newActiveState = shouldActivate ?? !item.active;
      return Object.fromEntries(
        Object.entries(prevItems).map(([key, value]) => {
          if (key === id) {
            return [key, { ...value, active: newActiveState }];
          }
          if (value.category === targetCategory && newActiveState) {
            return [key, { ...value, active: false }];
          }
          return [key, value];
        }),
      );
    });
  };

  return [
    items,
    setItems,
    addItem,
    deleteItem,
    updateItem,
    toggleActiveItem,
    isLoaded,
  ];
}

export default useItems;
