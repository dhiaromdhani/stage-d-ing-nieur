import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./HeroSlider.css";

import cimentBizerte from "../../assets/images/17-ciment-bizerte.jpg";

const SLIDES = [
  {
    title: "Société Tunisienne des Industries de Raffinage",
    text: "Leader du raffinage pétrolier en Tunisie",
    cta: "Découvrir",
  },
  {
    title: "Excellence Industrielle",
    text: "Une raffinerie moderne au service de l'énergie.",
    cta: "En savoir plus",
  },
  {
    title: "Sécurité · Qualité · Performance",
    text: "Une expertise reconnue depuis plusieurs décennies.",
    cta: "Nos activités",
  },
];

export default function HeroSlider() {
  return (
    <section className="hero">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
      >
        {SLIDES.map((s) => (
          <SwiperSlide key={s.title}>
            <div className="slide">
              <div className="slide-frame">
                <img src={cimentBizerte} alt="" className="slide-img" />
              </div>
              <div className="slide-tint" />
              <div className="overlay-band">
                <h1>{s.title}</h1>
                <p>{s.text}</p>
                <button>{s.cta}</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}