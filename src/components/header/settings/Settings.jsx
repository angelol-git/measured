import { useState } from "react";
import Data from "./Data";

import "./Settings.css";

function Settings(props) {
  const [slideOut, setSlideOut] = useState(false);
  const [settingsMode, setSettingsMode] = useState("menu");

  function handleClickClose() {
    setSlideOut(true);
    setTimeout(() => {
      props.handleClickSettings();
      setSlideOut(false);
    }, 200);
  }

  return (
    <section
      className={`settings-container text-normal ${
        slideOut ? "slide-out" : "slide-in"
      }`}
    >
      <div className="inner-container">
        <div className="sub-row">
          {settingsMode === "menu" ? (
            <div>
              <button
                className="back-button secondary-link-color position-left"
                onClick={handleClickClose}
              >
                ←
              </button>
              <h3 className="bold-text header-medium">Settings</h3>
            </div>
          ) : (
            ""
          )}
          {settingsMode === "data" ? (
            <div>
              <button
                className="back-button secondary-link-color position-left"
                onClick={() => setSettingsMode("menu")}
              >
                ←
              </button>
              <h3 className="bold-text header-medium">Data</h3>
            </div>
          ) : (
            ""
          )}
        </div>

        {settingsMode === "menu" ? (
          <ul className="settings-list">
            <a href="#" className="settings-list-link">
              <li className="settings-list-item">Filter Sizes</li>
              <div>&gt;</div>
            </a>
            <a
              href="#"
              className="settings-list-link"
              onClick={() => setSettingsMode("data")}
            >
              <li className="settings-list-item">Data</li>
              <div>&gt;</div>
            </a>
          </ul>
        ) : (
          ""
        )}
        {settingsMode === "data" ? <Data itemData={props.itemData} /> : ""}
      </div>
    </section>
  );
}

export default Settings;
