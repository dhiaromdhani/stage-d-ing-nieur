import { useState } from "react";
import { Link } from "react-router-dom";
import { IconChevronDown } from "../Icons/Icons";

function MobileItem({ item, depth = 0 }) {
  const [open, setOpen] = useState(false);

  if (!item.items) {
    return item.to ? (
      <Link to={item.to} className="mobile-nav-link" style={{ paddingLeft: 16 + depth * 14 }}>
        {item.label}
      </Link>
    ) : (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className="mobile-nav-link"
        style={{ paddingLeft: 16 + depth * 14 }}
      >
        {item.label}
      </a>
    );
  }

  return (
    <div className="mobile-nav-group">
      <button
        className="mobile-nav-toggle"
        style={{ paddingLeft: 16 + depth * 14 }}
        onClick={() => setOpen((o) => !o)}
      >
        {item.label}
        <IconChevronDown size={13} className={`mobile-chevron ${open ? "open" : ""}`} />
      </button>
      {open && (
        <div className="mobile-nav-sublist">
          {item.items.map((sub) => (
            <MobileItem key={sub.label} item={sub} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MobileNavAccordion({ structure, onLinkClick }) {
  return (
    <div
      className="mobile-nav-accordion"
      onClick={(e) => {
        if (e.target.tagName === "A") onLinkClick?.();
      }}
    >
      {structure.map((item) => (
        <MobileItem key={item.label} item={item} />
      ))}
    </div>
  );
}