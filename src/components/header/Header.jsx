import { Link, useLocation } from "react-router-dom";
import PopupButton from "./PopupButton";
import { User } from "lucide-react";
import "./Header.css";

function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  let showMenu = true;
  if (currentPath.includes("/account") || currentPath.includes("/items/")) {
    showMenu = false;
  }
  return (
    <header>
      <div className="header-row">
        <Link to="account" className="header-icon header-position-left">
          <User size={24} strokeWidth={1} color={"black"} />
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
            to="items"
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
