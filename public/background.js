/* global chrome */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getItem") {
    chrome.storage.local.get("items", (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Failed to load items from storage: ",
          chrome.runtime.lastError,
        );
        return;
      }
      const items = result;
      const validItems = returnValidItems(items, request.category);
      sendResponse({ items: validItems });
    });
    return true;
  }
});

function returnValidItems(items, category) {
  if (!items || !items.items) {
    console.warn("No items found in storage");
    return {};
  }

  const activeItems = Object.entries(items.items).reduce(
    (result, [key, item]) => {
      if (item.active && item.category === category) {
        result[key] = item;
      }
      return result;
    },
    {},
  );
  return activeItems;
}
