import "./Navbar.css";
import logo from "../../assets/logo.png";
import {
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaYoutube,
    FaEnvelope
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavDropdown from "./NavDropdown";
import MobileNavAccordion from "./MobileNavAccordion";
import { NAV_STRUCTURE, SITE_OFFICIEL_URL } from "./navLinks";
import { IconMenu, IconX } from "../Icons/Icons";

const ROLES = [
    { label: "Employé", role: "ROLE_EMPLOYEE" },
    { label: "Chef de service", role: "ROLE_CHEF" },
    { label: "Sous-directeur", role: "ROLE_SOUS_DIRECTEUR" },
    { label: "Directeur", role: "ROLE_DIRECTEUR" },
    { label: "RH", role: "ROLE_RH" },
    { label: "Admin", role: "ROLE_ADMIN" },
];

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
    const [role, setRole] = useState(() => localStorage.getItem("role"));
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const updateAuth = () => {
            setIsLoggedIn(!!localStorage.getItem("token"));
            setRole(localStorage.getItem("role"));
        };
        window.addEventListener("storage", updateAuth);
        window.addEventListener("authChanged", updateAuth);
        return () => {
            window.removeEventListener("storage", updateAuth);
            window.removeEventListener("authChanged", updateAuth);
        };
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.dispatchEvent(new Event("authChanged"));
        navigate("/login");
    };

    return (
        <>
            <div className="top-header">
                <div className="navbar-container">
                    <Link to="/" className="logo">
                        <img src={logo} alt="STIR" />
                    </Link>

                    <div className="social">
                        <a href={SITE_OFFICIEL_URL} target="_blank" rel="noreferrer" className="site-officiel-btn">
                            Site officiel
                        </a>

                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaLinkedinIn /></a>
                        <a href="#"><FaYoutube /></a>
                        <a href="#" className="lang">EN</a>
                        <a href="#" className="lang">AR</a>
                        <a href="#"><FaEnvelope /></a>

                        {isLoggedIn ? (
                            <button className="logout-btn" onClick={handleLogout}>
                                Déconnecter
                            </button>
                        ) : (
                            <Link to="/login" className="login-btn">
                                Connexion
                            </Link>
                        )}
                    </div>

                    <button
                        className="mobile-toggle-btn"
                        onClick={() => setMobileOpen((o) => !o)}
                        aria-label="Menu"
                    >
                        {mobileOpen ? <IconX size={22} /> : <IconMenu size={22} />}
                    </button>
                </div>
            </div>

            <nav className="navbar">
                <div className="navbar-container">
                    <ul className="nav-menu">
                        {NAV_STRUCTURE.map((item) => (
                            <li key={item.label}>
                                <NavDropdown
                                    item={item}
                                    isActive={item.to && location.pathname === item.to}
                                />
                            </li>
                        ))}
                    </ul>

                    <div className="navbar-actions">
                        {/* {isLoggedIn && role && (
                            <Link
                                to="/leave/statistics"
                                className={`conges-btn ${location.pathname === "/leave/statistics" ? "active" : ""}`}
                            >
                                Congés
                            </Link>
                        )} */}

                        {isLoggedIn && role === "ROLE_RH" && location.pathname.startsWith("/activites") && (
                            <Link to="/rh/dashboard" className="conges-btn">
                                Dashboard RH
                            </Link>
                        )}

                        <div className="stir-roles">
                            <span className="employee-btn">Utilisateur</span>
                            <div className="stir-roles-menu">
                                {ROLES.map((r) => (
                                    <button
                                        key={r.role}
                                        className="stir-roles-item"
                                        onClick={() => navigate(`/login?role=${r.role}`)}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <input type="text" placeholder="Recherche" />
                </div>
            </nav>

            {mobileOpen && (
                <div className="mobile-nav-drawer">
                    <MobileNavAccordion structure={NAV_STRUCTURE} onLinkClick={() => setMobileOpen(false)} />
                    <div className="mobile-nav-footer">
                        {/* {isLoggedIn && role && (
                            <Link to="/leave/statistics" className="conges-btn" onClick={() => setMobileOpen(false)}>
                                Congés
                            </Link>
                        )} */}
                        {isLoggedIn ? (
                            <button className="logout-btn" onClick={handleLogout}>Déconnecter</button>
                        ) : (
                            <Link to="/login" className="login-btn" onClick={() => setMobileOpen(false)}>
                                Connexion
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}