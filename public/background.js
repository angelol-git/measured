chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getItem') {
        chrome.storage.local.get("items", (result) => {


            const items = result;
            const validItems = returnValidItems(items, request.category);

            sendResponse({ items: validItems });
        });
        return true;
    }
});

function returnValidItems(items, category) {
    const activeItems = Object.entries(items.items).reduce((result, [key, item]) => {
        if (item.active && item.category === category) {
            result[key] = item;
        }
        return result;
    }, {});

    return activeItems;

}
