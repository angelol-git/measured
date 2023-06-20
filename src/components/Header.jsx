import { Link, useMatch, useResolvedPath } from "react-router-dom";

import "./header.css";

function Header() {
  return (
    <header className="header">
      <nav className="nav-bar">
        <ul>
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
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Header;
