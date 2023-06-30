import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "./header.css";

function Header() {
  return (
    <header>
      <div className="header-row">
        <h1 className="text-large">Size Compare</h1>
      </div>
      <nav className="nav-bar">
        <ul className="flex">
          <CustomLink to="/">Home</CustomLink>
          <CustomLink to="/items">Items</CustomLink>
        </ul>
      </nav>
    </header>
  );
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

export default Header;
