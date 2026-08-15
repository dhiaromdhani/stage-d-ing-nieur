import { Link } from "react-router-dom";
import { IconChevronDown, IconChevronRight } from "../Icons/Icons";

function NavItemLink({ item }) {
  if (item.to) {
    return <Link to={item.to}>{item.label}</Link>;
  }
  return (
    <a href={item.href} target="_blank" rel="noreferrer">
      {item.label}
    </a>
  );
}

function DropdownList({ items, level }) {
  return (
    <div className={`nav-dropdown-panel level-${level}`}>
      {items.map((item) => (
        <div key={item.label} className="nav-dropdown-item">
          {item.items ? (
            <>
              <span className="nav-dropdown-link has-children">
                {item.label}
                <IconChevronRight size={11} className="chevron-right" />
              </span>
              <DropdownList items={item.items} level={level + 1} />
            </>
          ) : (
            <span className="nav-dropdown-link">
              <NavItemLink item={item} />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function NavDropdown({ item, isActive }) {
  if (!item.items) {
    return item.to ? (
      <Link to={item.to} className={`nav-link ${isActive ? "active" : ""}`}>
        {item.label}
      </Link>
    ) : (
      <a href={item.href} target="_blank" rel="noreferrer" className="nav-link">
        {item.label}
      </a>
    );
  }

  return (
    <div className="nav-item-dropdown">
      <span className="nav-link nav-link--dropdown">
        {item.label}
        <IconChevronDown size={11} className="chevron-down" />
      </span>
      <DropdownList items={item.items} level={1} />
    </div>
  );
}