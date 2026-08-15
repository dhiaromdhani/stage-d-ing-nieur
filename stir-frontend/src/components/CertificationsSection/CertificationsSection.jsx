import { CERTIFICATIONS, APPELS_OFFRES } from "../../data/certificationsData";
import HorizontalCardScroller from "./HorizontalCardScroller";
import { IconFilePdf } from "../Icons/Icons";
import "./CertificationsSection.css";

export default function CertificationsSection() {
  return (
    <section className="certifications-section">
      <div className="certifications-container">

        <div className="cert-block">
          <h2 className="cert-block-title">Certifications</h2>
          <HorizontalCardScroller>
            {CERTIFICATIONS.map((cert) => (
              <a
                key={cert.id}
                href={cert.link}
                target="_blank"
                rel="noreferrer"
                className="cert-card"
              >
                <div className="cert-card-image">
                  <img src={cert.image} alt={cert.title} />
                  <span className="cert-date-badge">{cert.date}</span>
                </div>
                <div className="cert-card-body">
                  <h3>{cert.title}</h3>
                  <p>{cert.description}</p>
                </div>
              </a>
            ))}
          </HorizontalCardScroller>
        </div>

        <div className="cert-block">
          <h2 className="cert-block-title">Appels d'offres</h2>
          <HorizontalCardScroller>
            {APPELS_OFFRES.map((offre) => (
              <a
                key={offre.id}
                href={offre.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="cert-card offre-card"
              >
                <div className="cert-card-image pdf-thumb">
                  <IconFilePdf size={48} />
                  <span className="cert-date-badge">{offre.date}</span>
                </div>
                <div className="cert-card-body">
                  <h3>{offre.title}</h3>
                  <p>{offre.description}</p>
                </div>
              </a>
            ))}
          </HorizontalCardScroller>
        </div>

      </div>
    </section>
  );
}