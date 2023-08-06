import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useState } from "react";
import Settings from "./settings/Settings";
import "./header.css";

function Header(props) {
  const [displayMenu, setDisplayMenu] = useState(false);

  function handleClickSettings() {
    setDisplayMenu(!displayMenu);
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
      {displayMenu ? (
        <Settings
          handleClickSettings={handleClickSettings}
          handleImport={props.handleImport}
          itemData={props.itemData}
          settingsData={props.settingsData}
          handleSizeUpdate={props.handleSizeUpdate}
        />
      ) : (
        ""
      )}
      <header>
        <div className="header-row">
          <div className="menu-icon text-normal" onClick={handleClickSettings}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path d="M24 13.616v-3.232l-2.869-1.02c-.198-.687-.472-1.342-.811-1.955l1.308-2.751-2.285-2.285-2.751 1.307c-.613-.339-1.269-.613-1.955-.811l-1.021-2.869h-3.232l-1.021 2.869c-.686.198-1.342.471-1.955.811l-2.751-1.308-2.285 2.285 1.308 2.752c-.339.613-.614 1.268-.811 1.955l-2.869 1.02v3.232l2.869 1.02c.197.687.472 1.342.811 1.955l-1.308 2.751 2.285 2.286 2.751-1.308c.613.339 1.269.613 1.955.811l1.021 2.869h3.232l1.021-2.869c.687-.198 1.342-.472 1.955-.811l2.751 1.308 2.285-2.286-1.308-2.751c.339-.613.613-1.268.811-1.955l2.869-1.02zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
            </svg>
          </div>
          <h1 className="header-medium header-title">Size Compare</h1>
          <div></div>
        </div>
        <nav className="nav-bar">
          <ul className="flex">
            <CustomLink to="/">Home</CustomLink>
            <CustomLink to="/items">Items</CustomLink>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default Header;
