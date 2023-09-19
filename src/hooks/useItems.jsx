import { useState, useEffect } from "react";

function useItems(initialItems) {
  const [items, setItems] = useState({});

  const addItem = (newItem) => {
    setItems((prevItems) => {
      return { ...prevItems, [newItem.title.toUpperCase()]: newItem };
    });
  };

  const deleteItem = (title) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      delete updatedItems[title];
      return updatedItems;
    });
  };

  const updateItem = (updatedItem, prevTitle) => {
    const updatedTitle = updatedItem.title.toUpperCase();

    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      if (prevTitle === updatedTitle.toUpperCase()) {
        // Replace the value for the existing key
        updatedItems[prevTitle] = updatedItem;
      } else {
        updatedItems[updatedTitle] = updatedItems[prevTitle];
        delete updatedItems[prevTitle];
        updatedItems[updatedTitle] = updatedItem;
      }
      return updatedItems;
    });
  };

  const activeItem = (title, category, newItem = false) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };

      if (updatedItems[title] && newItem === false) {
        updatedItems[title].active = !updatedItems[title].active;
      }

      Object.entries(updatedItems).forEach(([key, value]) => {
        if (key !== title && value.category === category) {
          updatedItems[key].active = false;
        }
      });

      return updatedItems;
    });
  };

  //Load data from local storage
  useEffect(() => {
    chrome.storage.local.get("items", (result) => {
      const savedItems = result.items;
      setItems(savedItems || {});
    });
  }, []);

  //Save data to local storage
  useEffect(() => {
    chrome.storage.local.set({ items }, () => {});
  }, [items]);

  return [items, addItem, deleteItem, updateItem, activeItem];
}

export default useItems;
