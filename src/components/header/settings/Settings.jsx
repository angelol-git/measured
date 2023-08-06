import { useState } from "react";
import Data from "./Data";
import FilterSizes from "./FilterSizes";
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
          {settingsMode === "filterSizes" ? (
            <div>
              <button
                className="back-button secondary-link-color position-left"
                onClick={() => setSettingsMode("menu")}
              >
                ←
              </button>
              <h3 className="bold-text header-medium">Filter Sizes</h3>
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
            <a
              href="#"
              className="settings-list-link"
              onClick={() => setSettingsMode("filterSizes")}
            >
              <li className="settings-list-item">Filter Sizes</li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
              >
                <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
              </svg>
            </a>
            <a
              href="#"
              className="settings-list-link"
              onClick={() => setSettingsMode("data")}
            >
              <li className="settings-list-item">Data</li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
              >
                <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
              </svg>
            </a>
          </ul>
        ) : (
          ""
        )}
        {settingsMode === "filterSizes" ? (
          <FilterSizes
            settingsData={props.settingsData}
            handleSizeUpdate={props.handleSizeUpdate}
          />
        ) : (
          ""
        )}
        {settingsMode === "data" ? (
          <Data handleImport={props.handleImport} itemData={props.itemData} />
        ) : (
          ""
        )}
      </div>
    </section>
  );
}

export default Settings;
