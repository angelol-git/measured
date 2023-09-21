import { Link, useLocation } from "react-router-dom";
import PopupButton from "./PopupButton";
import "./header.css";

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  let showMenu = true;
  if (
    currentPath === "/data" ||
    currentPath === "/filterSizes" ||
    currentPath === "/account" ||
    currentPath === "/add" ||
    currentPath.includes("/detail")
  ) {
    showMenu = false;
  }
  return (
    <header>
      <div className="header-row">
        <Link to="/account" className="header-icon header-position-left">
          <svg
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill-rule="evenodd"
            clip-rule="evenodd"
          >
            <path
              d="M24 18v1h-24v-1h24zm0-6v1h-24v-1h24zm0-6v1h-24v-1h24z"
              fill="#1040e2"
            />
            <path d="M24 19h-24v-1h24v1zm0-6h-24v-1h24v1zm0-6h-24v-1h24v1z" />
          </svg>
        </Link>

        <Link to="/" className="text-xl header-title">
          <h1>Measured</h1>
        </Link>

        <PopupButton />
      </div>
      {showMenu ? (
        <nav className="nav-bar">
          <Link
            to="/"
            className={`nav-bar-links black-text text-base ${
              currentPath === "/" ? "active" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/items"
            className={`nav-bar-links black-text text-base ${
              currentPath === "/items" ? "active" : ""
            }`}
          >
            Items
          </Link>
        </nav>
      ) : null}
    </header>
  );
}

export default Header;
