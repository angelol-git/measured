chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getItem') {

        chrome.storage.local.get("items", (result) => {

            const value = result;
            sendResponse({ value: value });
        });
        return true;
    }
});