import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useState } from "react";
import Settings from "./settings/Settings";
import "./header.css";

function Header(props) {
  const [displaySettings, setDisplaySettings] = useState(false);

  function handleClickSettings() {
    props.setFullModalOpen(!displaySettings ? -1 : 0);
    setDisplaySettings(!displaySettings);
  }

  function isPopupWindow() {
    const popUpViews = chrome.extension.getViews({ type: "popup" });
    if (popUpViews.length > 0) {
      return true;
    }
    return false;
  }

  const isPopupOpen = isPopupWindow();
  function handlePopOutOpen() {
    //Close current popup
    window.close();
    const popupURL = chrome.runtime.getURL("index.html");
    const windowFeatures = "width=375,height=500";
    window.open(popupURL, "popup", windowFeatures);
  }
  function handlePopOutClose() {
    window.close();
  }

  function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
      <li className={isActive ? "active" : ""}>
        <Link
          to={to}
          {...props}
          className="nav-bar-links black-text text-normal "
        >
          {children}
        </Link>
      </li>
    );
  }

  return (
    <div>
      {displaySettings ? (
        <Settings
          handleClickSettings={handleClickSettings}
          handleImport={props.handleImport}
          itemData={props.itemData}
          settingsData={props.settingsData}
          handleSizeUpdate={props.handleSizeUpdate}
          fullModalOpen={props.fullModalOpen}
          setFullModalOpen={props.setFullModalOpen}
        />
      ) : (
        ""
      )}
      <header>
        <div className="header-row">
          <button
            className="menu-icon position-left"
            onClick={handleClickSettings}
            tabIndex={props.fullModalOpen}
            aria-label="Settings"
          >
            <svg
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M24 18v1h-24v-1h24zm0-6v1h-24v-1h24zm0-6v1h-24v-1h24z"
                fill="#1040e2"
              />
              <path d="M24 19h-24v-1h24v1zm0-6h-24v-1h24v1zm0-6h-24v-1h24v1z" />
            </svg>
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              title="Settings icon"
            >
              <path d="M24 13.616v-3.232l-2.869-1.02c-.198-.687-.472-1.342-.811-1.955l1.308-2.751-2.285-2.285-2.751 1.307c-.613-.339-1.269-.613-1.955-.811l-1.021-2.869h-3.232l-1.021 2.869c-.686.198-1.342.471-1.955.811l-2.751-1.308-2.285 2.285 1.308 2.752c-.339.613-.614 1.268-.811 1.955l-2.869 1.02v3.232l2.869 1.02c.197.687.472 1.342.811 1.955l-1.308 2.751 2.285 2.286 2.751-1.308c.613.339 1.269.613 1.955.811l1.021 2.869h3.232l1.021-2.869c.687-.198 1.342-.472 1.955-.811l2.751 1.308 2.285-2.286-1.308-2.751c.339-.613.613-1.268.811-1.955l2.869-1.02zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
            </svg> */}
          </button>
          <h1 className="header-medium header-title">Measured</h1>
          {!isPopupOpen ? (
            <button
              className="menu-icon position-right"
              tabIndex={props.fullModalOpen}
              onClick={handlePopOutClose}
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
              className="menu-icon position-right"
              tabIndex={props.fullModalOpen}
              onClick={handlePopOutOpen}
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

        <nav className="nav-bar">
          <ul className="flex">
            <CustomLink to="/" tabIndex={props.fullModalOpen}>
              Home
            </CustomLink>
            <CustomLink to="/items" tabIndex={props.fullModalOpen}>
              Items
            </CustomLink>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Header;
