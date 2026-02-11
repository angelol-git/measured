import { ExternalLink, X } from "lucide-react";
function PopupButton() {
  const isPopupOpen = isPopupWindow();
  function isPopupWindow() {
    // eslint-disable-next-line no-undef
    const popUpViews = chrome.extension.getViews({ type: "popup" });
    if (popUpViews.length > 0) {
      return true;
    }
    return false;
  }

  function handlePopOutOpen() {
    //Close current popup and open new popup
    window.close();
    // eslint-disable-next-line no-undef
    const popupURL = chrome.runtime.getURL("index.html");
    const windowFeatures = "width=375,height=550";
    window.open(popupURL, "popup", windowFeatures);
  }

  function handlePopOutClose() {
    window.close();
  }

  return (
    <div className="header-position-right">
      {!isPopupOpen ? (
        <button
          onClick={handlePopOutClose}
          className="header-icon"
          aria-label="Close Pop up"
        >
          <X size={24} strokeWidth={1} />
        </button>
      ) : (
        <button
          onClick={handlePopOutOpen}
          className="header-icon"
          aria-label="Open Pop Up in a new window"
        >
          <ExternalLink size={24} strokeWidth={1} />
        </button>
      )}
    </div>
  );
}

export default PopupButton;
