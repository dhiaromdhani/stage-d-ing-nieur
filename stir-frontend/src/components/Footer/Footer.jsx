import "./Footer.css";
import logo from "../../assets/logo.png";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-brand">
                    <img src={logo} alt="STIR" className="footer-logo" />
                    <p>
                        Société Tunisienne des Industries de Raffinage — leader
                        du raffinage pétrolier en Tunisie depuis plusieurs décennies.
                    </p>
                    <div className="footer-social">
                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaLinkedinIn /></a>
                        <a href="#"><FaYoutube /></a>
                    </div>
                </div>

                <div className="footer-col">
                    <h4>Navigation</h4>
                    <ul>
                        <li><Link to="/">Accueil</Link></li>
                        <li><Link to="/presentation">Présentation</Link></li>
                        <li><Link to="/activites">Activités & Produits</Link></li>
                        <li><Link to="/formation">Centre de Formation</Link></li>
                        <li><Link to="/ecole-feu">École du Feu</Link></li>
                        <li><Link to="/laboratoire">Laboratoire</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Espace RH</h4>
                    <ul>
                        <li><Link to="/carriere">Carrière</Link></li>
                        <li><Link to="/partenaires">Partenaires</Link></li>
                        <li><Link to="/login">Espace collaborateurs</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>Contact</h4>
                    <ul className="footer-contact">
                        <li><FaMapMarkerAlt /> Route de la Corniche, Bizerte, Tunisie</li>
                        <li><FaPhone /> +216 72 000 000</li>
                        <li><FaEnvelope /> contact@stir.tn</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <span>© {new Date().getFullYear()} STIR — Tous droits réservés</span>
                <span>Conçu avec soin pour les collaborateurs STIR</span>
            </div>
        </footer>
    );
}