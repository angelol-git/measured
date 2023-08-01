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
        />
      ) : (
        ""
      )}
      <header>
        <div className="header-row">
          <div className="menu-icon text-normal" onClick={handleClickSettings}>
            <img
              className="small-icon"
              src="./data/images/gear.png"
              alt="menu"
            ></img>
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
