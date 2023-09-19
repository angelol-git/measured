function PopupButton({}) {
  const isPopupOpen = isPopupWindow();
  function isPopupWindow() {
    const popUpViews = chrome.extension.getViews({ type: "popup" });
    if (popUpViews.length > 0) {
      return true;
    }
    return false;
  }

  function handlePopOutOpen() {
    //Close current popup and open new popup
    window.close();
    const popupURL = chrome.runtime.getURL("index.html");
    const windowFeatures = "width=375,height=500";
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
          <svg
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 11.293l10.293-10.293.707.707-10.293 10.293 10.293 10.293-.707.707-10.293-10.293-10.293 10.293-.707-.707 10.293-10.293-10.293-10.293.707-.707 10.293 10.293z" />
          </svg>
        </button>
      ) : (
        <button
          onClick={handlePopOutOpen}
          className="header-icon"
          aria-label="Open Pop Up in a new window"
        >
          <svg
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default PopupButton;
