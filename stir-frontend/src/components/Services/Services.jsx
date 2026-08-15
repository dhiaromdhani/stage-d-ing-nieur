import "./Services.css";

import centre from "../../assets/images/centre.jpg";
import feu from "../../assets/images/feu.webp";
import labo from "../../assets/images/laboratoir.webp";

export default function Services() {

  const services = [
    {
      title: "Centre de Formation",
      image: centre,
      text: "Formation professionnelle dans le secteur pétrolier.",
      link: "https://www.stir.com.tn/centre/index.php",
    },
    {
      title: "École du Feu",
      image: feu,
      text: "Formation spécialisée en sécurité incendie.",
      link: "https://www.stir.com.tn/fr/inscritecoles.php",
    },
    {
      title: "Laboratoire",
      image: labo,
      text: "Analyses et contrôle qualité des produits.",
      link: "https://www.stir.com.tn/fr/laboratoire.php?idL=2",
    },
  ];

  return (
    <section className="services">
      <div className="services-container">
        {services.map((service, index) => (
          <div className="card" key={index}>
            <img src={service.image} alt={service.title} />
            <h3>{service.title}</h3>
            <p>{service.text}</p>
            <a
              href={service.link}
              target="_blank"
              rel="noreferrer"
              className="card-btn"
            >
              Découvrir
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}