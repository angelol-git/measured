import { useState, useEffect } from "react";

function useItems() {
  const [items, setItems] = useState({});

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
    //console.log("item: ", item);
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };

      updatedItems[item.id] = item;
      //console.log("updateditems: ", updatedItems);
      return updatedItems;
    });
  };

  const activeItem = (itemId, isNewItem = false) => {
    setItems((prevItems) => {
      const updatedItems = { ...prevItems };

      //console.log(updatedItems[itemId.id]);
      if (!isNewItem) {
        updatedItems[itemId].active = !updatedItems[itemId].active;
      }

      //Make sure the other itemIds in the category is set to inactive
      Object.entries(updatedItems).forEach(([id, values]) => {
        if (id !== itemId && values.category === itemId.category) {
          updatedItems[id].active = false;
        }
      });

      return updatedItems;
    });
  };

  // function handleImport(importedItems) {
  //   setItems(importedItems);
  // }

  //Load data from local storage
  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get("items", (result) => {
      const savedItems = result.items;
      setItems(savedItems || {});
    });
  }, []);

  //Save data to local storage
  useEffect(() => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.set({ items });
  }, [items]);

  return [items, setItems, addItem, deleteItem, updateItem, activeItem];
}

export default useItems;
