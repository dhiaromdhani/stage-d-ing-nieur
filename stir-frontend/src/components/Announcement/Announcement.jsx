import "./Announcement.css";

export default function Announcement() {
  return (
    <section className="announcement-section">
      <div className="announcement-container">

        <h2> Annonces</h2>

        <p>
          <strong>
            Résultats du concours interne 2025 - Première phase
          </strong>
        </p>

        <p>
          Les candidats sont invités à consulter la liste officielle
          et à envoyer leurs dossiers avant la date limite.
        </p>

        <a
          href="https://recrutement-stir.com"
          target="_blank"
          rel="noreferrer"
        >
          Consulter le concours →
        </a>

      </div>
    </section>
  );
}