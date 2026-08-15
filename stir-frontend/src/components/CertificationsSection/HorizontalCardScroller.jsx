import { useEffect, useRef, useState } from "react";
import { IconChevronLeft, IconChevronRight } from "../Icons/Icons";
import "./CertificationsSection.css";

export default function HorizontalCardScroller({ children }) {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [children]);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 270, behavior: "smooth" });
  };

  return (
    <div className="hcs-wrapper">
      {canScrollLeft && (
        <button className="hcs-arrow hcs-arrow-left" onClick={() => scrollBy(-1)} aria-label="Précédent">
          <IconChevronLeft size={18} />
        </button>
      )}
      <div className="hcs-track" ref={trackRef}>
        {children}
      </div>
      {canScrollRight && (
        <button className="hcs-arrow hcs-arrow-right" onClick={() => scrollBy(1)} aria-label="Suivant">
          <IconChevronRight size={18} />
        </button>
      )}
    </div>
  );
}