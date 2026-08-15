import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import Footer from "../Footer/Footer";
import "./Layout.css";

const PAGES_PUBLIQUES = ["/", "/login"];

export default function Layout({ children }) {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));

  useEffect(() => {
    const updateAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", updateAuth);
    window.addEventListener("authChanged", updateAuth);
    return () => {
      window.removeEventListener("storage", updateAuth);
      window.removeEventListener("authChanged", updateAuth);
    };
  }, []);

  const estPagePublique = PAGES_PUBLIQUES.includes(location.pathname);
  const afficherSidebar = isLoggedIn && !estPagePublique;

  if (afficherSidebar) {
    return (
      <div className="layout-with-sidebar">
        <Sidebar />
        <div className="layout-content-wrapper">
          <Topbar />
          <main className="layout-content">{children}</main>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}