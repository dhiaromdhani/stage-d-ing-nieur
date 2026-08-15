import { useEffect, useRef, useState } from "react";
import { STATS, ACCES_INFO_URL } from "../../data/statsData";
import { IconFolder, IconArrowRight } from "../Icons/Icons";
import statsBg from "../../assets/images/stats-bg.jpg";
import "./StatsSection.css";

function useCountUp(target, start) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let frame;
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target]);

  return value;
}

function StatCard({ stat, start }) {
  const displayValue = useCountUp(stat.value, start);
  return (
    <div className="stat-band-card">
      <span className="stat-band-value">{displayValue.toLocaleString("fr-FR")}</span>
      <span className="stat-band-unit">{stat.unit}</span>
      <span className="stat-band-divider" />
      <span className="stat-band-label">{stat.label}</span>
    </div>
  );
}

export default function StatsSection() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        className="stats-band"
        ref={sectionRef}
        style={{ backgroundImage: `url(${statsBg})` }}
      >
        <div className="stats-band-tint" />
        <div className="stats-band-container">
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} start={visible} />
          ))}
        </div>
      </section>

      <a href={ACCES_INFO_URL} target="_blank" rel="noreferrer" className="acces-info-band">
        <div className="acces-info-container">
          <div className="acces-info-icon">
            <IconFolder size={36} />
          </div>
          <div className="acces-info-text">
            <span className="acces-info-title">Accès à l'information</span>
            <span className="acces-info-sub">Consulter les documents et informations publiques de la STIR</span>
          </div>
          <span className="acces-info-cta">
            Consulter <IconArrowRight size={16} />
          </span>
        </div>
      </a>
    </>
  );
}